from fastapi import APIRouter, Depends, HTTPException, Body
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
import math
import os
import requests
from database import get_session
from models import AshaWorker, MotherProfile, RiskAssessment, ShiftSchedule

router = APIRouter(prefix="/dispatch", tags=["dispatch"])

# Haversine distance calculator
def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c
    # Apply Terrain Correction Factor to estimate real road winding curves
    return distance * 1.3

@router.post("/optimize-schedule")
async def optimize_schedule(
    payload: dict = Body(..., example={"asha_worker_id": "asha1", "mother_ids": ["MK-2024-001"]}),
    session: Session = Depends(get_session)
):
    asha_id = payload.get("asha_worker_id")
    mother_ids = payload.get("mother_ids")
    
    if not asha_id or not mother_ids:
        raise HTTPException(status_code=400, detail="ASHA worker ID and Mother IDs are required")
        
    asha = session.get(AshaWorker, asha_id)
    if not asha:
        raise HTTPException(status_code=404, detail="ASHA worker not found")
        
    # Get mothers and their latest clinical risk scores
    mothers = []
    for m_id in mother_ids:
        m = session.get(MotherProfile, m_id)
        if m:
            # Retrieve latest risk score
            latest_risk = session.exec(
                select(RiskAssessment)
                .where(RiskAssessment.mother_id == m.id)
                .order_by(RiskAssessment.timestamp.desc())
            ).first()
            risk_score = latest_risk.overall_risk_score if latest_risk else 1.0
            mothers.append({
                "profile": m,
                "risk_score": risk_score
            })
            
    if not mothers:
        raise HTTPException(status_code=400, detail="No valid patients assigned")
        
    # Node 0 represents the Depot (ASHA Worker starting base coordinates)
    stops = [{
        "id": "depot",
        "name": "ASHA Base Depot",
        "latitude": asha.latitude,
        "longitude": asha.longitude,
        "risk_score": 0.0
    }]
    
    for item in mothers:
        stops.append({
            "id": item["profile"].id,
            "name": item["profile"].name,
            "latitude": item["profile"].latitude,
            "longitude": item["profile"].longitude,
            "risk_score": item["risk_score"]
        })
        
    num_locations = len(stops)
    
    # 1. Construct the Distance Matrix (using local haversine + wind factor)
    distance_matrix = []
    for i in range(num_locations):
        row = []
        for j in range(num_locations):
            if i == j:
                row.append(0.0)
            else:
                row.append(
                    calculate_haversine_distance(
                        stops[i]["latitude"], stops[i]["longitude"],
                        stops[j]["latitude"], stops[j]["longitude"]
                    )
                )
        distance_matrix.append(row)
        
    # 2. Build the Google OR-Tools Routing Solver
    from ortools.constraint_solver import routing_enums_pb2
    from ortools.constraint_solver import pywrapcp
    
    manager = pywrapcp.RoutingIndexManager(num_locations, 1, 0)
    routing = pywrapcp.RoutingModel(manager)
    
    # Custom Cost Callback: balances spatial distance against clinical urgency dynamically
    # Cost = Distance_Meters + (10 - Target_Risk) * Risk_Multiplier
    # This prevents extreme 15km opposite detours while prioritising critical patients nearby
    def transit_cost_callback(from_index, to_index):
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        
        distance_meters = int(distance_matrix[from_node][to_node] * 1000)
        
        # Penalize visiting low risk patients first (Soft Priority constraints)
        target_risk = stops[to_node]["risk_score"]
        # Max risk is 10. Multiplier 2000 equates to a 2km detour penalty
        risk_penalty = int((10.0 - target_risk) * 2000)
        
        return distance_meters + risk_penalty
        
    transit_callback_index = routing.RegisterTransitCallback(transit_cost_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)
    
    # Set search parameters
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    )
    
    # Solve routing VRP
    solution = routing.SolveWithParameters(search_parameters)
    
    if not solution:
        raise HTTPException(status_code=500, detail="Could not solve optimized routing schedule")
        
    # 3. Extract the optimized sequence path
    index = routing.Start(0)
    route_sequence = []
    
    while not routing.IsEnd(index):
        node = manager.IndexToNode(index)
        if node != 0: # Skip depot in stored visit sequence
            route_sequence.append(stops[node])
        index = solution.Value(routing.NextVar(index))
        
    # 4. Save/Overwrite schedule sequence to database and apply dynamic travel modes
    # Clear existing pending routes for this ASHA worker
    existing_schedules = session.exec(
        select(ShiftSchedule)
        .where(ShiftSchedule.asha_worker_id == asha_id)
        .where(ShiftSchedule.status == "PENDING")
    ).all()
    for sch in existing_schedules:
        session.delete(sch)
    session.commit()
    
    prev_lat = asha.latitude
    prev_lon = asha.longitude
    
    saved_entries = []
    for seq_idx, item in enumerate(route_sequence):
        # Calculate dynamic travel mode based on distance from previous stop
        dist = calculate_haversine_distance(prev_lat, prev_lon, item["latitude"], item["longitude"])
        mode = "walking" if dist <= 1.5 else "two-wheeler"
        
        # Determine service duration (10 mins for low risk, 90 mins for critical)
        service_time = 15 if item["risk_score"] < 7.0 else 90
        
        gmaps_link = f"https://www.google.com/maps/dir/?api=1&destination={item['latitude']},{item['longitude']}&travelmode={mode}"
        
        schedule_entry = ShiftSchedule(
            asha_worker_id=asha_id,
            mother_id=item["id"],
            visit_sequence=seq_idx + 1,
            status="PENDING",
            google_maps_link=gmaps_link,
            travel_mode=mode,
            distance_km=round(dist, 2),
            estimated_service_time_mins=service_time
        )
        session.add(schedule_entry)
        saved_entries.append(schedule_entry)
        
        prev_lat = item["latitude"]
        prev_lon = item["longitude"]
        
    session.commit()
    
    # Return formatted results
    return {
        "status": "success",
        "asha_worker": asha.name,
        "optimized_route": [
            {
                "sequence": idx + 1,
                "mother_id": item.mother_id,
                "mother_name": session.get(MotherProfile, item.mother_id).name,
                "travel_mode": item.travel_mode,
                "distance_km": item.distance_km,
                "estimated_service_time_mins": item.estimated_service_time_mins,
                "google_maps_link": item.google_maps_link
            } for idx, item in enumerate(saved_entries)
        ]
    }

@router.get("/route/{asha_id}")
def get_asha_route(asha_id: str, session: Session = Depends(get_session)):
    """
    Returns the ASHA worker's active visit timeline.
    """
    schedules = session.exec(
        select(ShiftSchedule)
        .where(ShiftSchedule.asha_worker_id == asha_id)
        .order_by(ShiftSchedule.visit_sequence)
    ).all()
    
    results = []
    for s in schedules:
        m = session.get(MotherProfile, s.mother_id)
        latest_risk = session.exec(
            select(RiskAssessment)
            .where(RiskAssessment.mother_id == s.mother_id)
            .order_by(RiskAssessment.timestamp.desc())
        ).first()
        results.append({
            "id": s.id,
            "mother_id": s.mother_id,
            "mother_name": m.name if m else "Unknown",
            "visit_sequence": s.visit_sequence,
            "status": s.status,
            "google_maps_link": s.google_maps_link,
            "travel_mode": s.travel_mode,
            "distance_km": s.distance_km,
            "risk_score": latest_risk.overall_risk_score if latest_risk else 1.0,
            "risk_level": latest_risk.risk_level if latest_risk else "Low",
            "estimated_service_time_mins": s.estimated_service_time_mins
        })
        
    return results

@router.put("/route/{schedule_id}/status")
def update_route_status(schedule_id: int, payload: dict = Body(...), session: Session = Depends(get_session)):
    """
    Updates status of a visit in the route timeline.
    """
    sch = session.get(ShiftSchedule, schedule_id)
    if not sch:
        raise HTTPException(status_code=404, detail="Schedule record not found")
        
    new_status = payload.get("status")
    if new_status not in ["PENDING", "IN_PROGRESS", "COMPLETED"]:
        raise HTTPException(status_code=400, detail="Invalid status value")
        
    sch.status = new_status
    session.add(sch)
    session.commit()
    session.refresh(sch)
    return {"status": "success", "id": sch.id, "new_status": sch.status}

@router.post("/sync")
async def sync_offline_routes(
    actions: List[dict] = Body(..., example=[{"schedule_id": 1, "status": "COMPLETED"}]),
    session: Session = Depends(get_session)
):
    """
    Syncs offline task edits collected during low connectivity.
    """
    synced_ids = []
    for act in actions:
        sch_id = act.get("schedule_id")
        status = act.get("status")
        sch = session.get(ShiftSchedule, sch_id)
        if sch and status in ["PENDING", "IN_PROGRESS", "COMPLETED"]:
            sch.status = status
            session.add(sch)
            synced_ids.append(sch_id)
    session.commit()
    return {"status": "synced", "count": len(synced_ids), "synced_ids": synced_ids}
