from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from database import get_session
from models import MotherProfile
from services.ehr_client import MockFHIRProvider
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/ehr", tags=["EHR Sync"])

@router.post("/sync/{mother_id}")
def sync_ehr_data(mother_id: str, session: Session = Depends(get_session)):
    """
    POST endpoint to sync a mother's clinical parameters from an external EHR.
    Fetches HL7 FHIR Observation bundles, parses blood pressure (LOINC 85354-9) and 
    hemoglobin (LOINC 718-7) values dynamically, and saves them to the database.
    """
    mother = session.get(MotherProfile, mother_id)
    if not mother:
        raise HTTPException(status_code=404, detail="Mother profile not found")

    # Instantiate the EHR FHIR provider (Mock for Hackathon Demo)
    provider = MockFHIRProvider()
    try:
        fhir_bundle = provider.get_patient_data(mother_id)
    except Exception as e:
        logger.error(f"Failed to fetch FHIR data: {e}")
        raise HTTPException(status_code=502, detail="Error communicating with external EHR system")

    # Parse FHIR Bundle dynamically
    entries = fhir_bundle.get("entry", [])
    historical_hb = None
    historical_bp = None

    for entry in entries:
        resource = entry.get("resource", {})
        if resource.get("resourceType") != "Observation":
            continue

        codings = resource.get("code", {}).get("coding", [])
        code_values = {c.get("code") for c in codings}

        # 1. Parse Blood Pressure Panel (LOINC 85354-9)
        if "85354-9" in code_values:
            systolic = None
            diastolic = None
            components = resource.get("component", [])
            for comp in components:
                comp_codings = comp.get("code", {}).get("coding", [])
                comp_codes = {cc.get("code") for cc in comp_codings}
                
                if "8480-6" in comp_codes:  # Systolic BP
                    systolic = comp.get("valueQuantity", {}).get("value")
                elif "8462-4" in comp_codes:  # Diastolic BP
                    diastolic = comp.get("valueQuantity", {}).get("value")
            
            if systolic is not None and diastolic is not None:
                historical_bp = f"{int(systolic)}/{int(diastolic)}"

        # 2. Parse Hemoglobin (LOINC 718-7)
        elif "718-7" in code_values:
            value_qty = resource.get("valueQuantity", {})
            if "value" in value_qty:
                historical_hb = float(value_qty["value"])

    # Update patient's profile in the database
    if historical_hb is not None:
        mother.historical_hb = historical_hb
    if historical_bp is not None:
        mother.historical_bp = historical_bp

    session.add(mother)
    session.commit()
    session.refresh(mother)

    return {
        "status": "success",
        "message": "EHR Clinical Vitals sync completed successfully",
        "mother_id": mother_id,
        "synced_data": {
            "historical_hb": mother.historical_hb,
            "historical_bp": mother.historical_bp
        }
    }
