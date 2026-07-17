from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Depends, HTTPException, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select, SQLModel
from typing import List, Annotated, Optional
import json
import requests

from database import create_db_and_tables, get_session
from models import MotherProfile, AssessmentData, RiskAssessment, VitalsInput, ChatMessage, Consultation, Document, Doctor, AshaWorker
from agents.orchestrator import MatruKavachOrchestrator
import socketio
import os
import shutil
from fastapi import File, UploadFile, Form
from datetime import datetime, timedelta

from socket_instance import sio
from routers import telegram_bot, auth as auth_router, voice as voice_router

create_db_and_tables()

app = FastAPI(title="MatruKavach AI API", version="1.0.0")

socket_app = socketio.ASGIApp(sio, app)

app.include_router(telegram_bot.router)
app.include_router(auth_router.router)
app.include_router(voice_router.router)

# Read CORS origins from environment variable, fallback to localhost:3000
origins_env = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
allow_origins = [origin.strip() for origin in origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = MatruKavachOrchestrator()
SessionDep = Annotated[Session, Depends(get_session)]

import os
os.makedirs("data/uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="data/uploads"), name="uploads")

@app.get("/")
def read_root():
    return {"status": "MatruKavach AI Backend is Running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/env_data")
def get_env_data(lat: float, lon: float):
    try:
        weather_res = requests.get(f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,apparent_temperature,weather_code")
        weather_data = weather_res.json()
        temp = weather_data.get("current", {}).get("temperature_2m", 30)
        heat_index = weather_data.get("current", {}).get("apparent_temperature", temp)
        
        aqi_res = requests.get(f"https://air-quality-api.open-meteo.com/v1/air-quality?latitude={lat}&longitude={lon}&current=us_aqi,pm2_5")
        aqi_data = aqi_res.json()
        aqi = aqi_data.get("current", {}).get("pm2_5", 50)

        toxin = min(round(aqi * 0.05, 1), 10.0) 
        
        return {
            "temperature_c": temp,
            "heat_index": heat_index,
            "aqi_pm25": aqi,
            "chemical_exposure": toxin,
            "weather_condition": "Clear or fetched"
        }
    except Exception as e:
        print(f"Error fetching open-meteo: {e}")
        return {
            "temperature_c": 32.0, "heat_index": 34.0, "aqi_pm25": 120, "chemical_exposure": 4.5, "weather_condition": "Unknown"
        }

@app.post("/assess", response_model=RiskAssessment)
async def assess_risk(vitals: VitalsInput, session: SessionDep):
    
    mother = session.get(MotherProfile, vitals.mother_id)
    if not mother:
        raise HTTPException(status_code=404, detail="Mother not found")

    result = await orchestrator.assess_mother(
        mother_id=mother.id,
        name=mother.name,
        lat=mother.latitude,
        lon=mother.longitude,
        bp_sys=vitals.systolic_bp,
        bp_dia=vitals.diastolic_bp,
        weight=vitals.weight_kg,
        hb=vitals.hemoglobin,
        glucose=vitals.glucose,
        gest_weeks=mother.gestational_age_weeks,
        extra_symptoms=vitals.extra_symptoms,
        temperature_c=vitals.temperature_c,
        heat_index=vitals.heat_index,
        aqi=vitals.aqi,
        toxins=vitals.chemical_exposure
    )

    assessment_data = AssessmentData(
        mother_id=mother.id,
        systolic_bp=vitals.systolic_bp,
        diastolic_bp=vitals.diastolic_bp,
        weight_kg=vitals.weight_kg,
        hemoglobin=vitals.hemoglobin,
        glucose=vitals.glucose,
        heart_rate=vitals.heart_rate,
        timestamp=result.timestamp
    )
    session.add(assessment_data)
    session.commit()
    session.refresh(assessment_data)

    result_db = RiskAssessment(
        assessment_data_id=assessment_data.id,
        mother_id=mother.id,
        overall_risk_score=result.overall_risk_score,
        risk_level=result.risk_level,
        clinical_flags=json.dumps(result.clinical_flags),
        environmental_flags=json.dumps(result.environmental_flags),
        nutrition_advice=json.dumps(result.nutrition_advice),
        medication_reminders=json.dumps(result.medication_reminders),
        timestamp=result.timestamp
    )
    session.add(result_db)
    session.commit()
    session.refresh(result_db)

    return result_db

@app.get("/mothers", response_model=List[MotherProfile])
def get_mothers(session: SessionDep):
    return session.exec(select(MotherProfile)).all()

@app.get("/mother/{mother_id}", response_model=MotherProfile)
def get_mother(mother_id: str, session: SessionDep):
    mother = session.get(MotherProfile, mother_id)
    if not mother:
        raise HTTPException(status_code=404, detail="Mother not found")
    return mother

@app.get("/mother/{mother_id}/history")
def get_mother_history(mother_id: str, session: SessionDep):
    assessments = session.exec(select(RiskAssessment).where(RiskAssessment.mother_id == mother_id).order_by(RiskAssessment.timestamp.desc())).all()
    
    history = []
    for r in assessments:
        data = session.get(AssessmentData, r.assessment_data_id)
        history.append({
            "risk": r,
            "vitals": data
        })
    return history

@app.delete("/assessment/{assessment_data_id}")
def delete_assessment(assessment_data_id: int, session: SessionDep):
    ass_data = session.get(AssessmentData, assessment_data_id)
    if not ass_data:
        raise HTTPException(status_code=404, detail="Assessment data not found")
        
    risk_data = session.exec(select(RiskAssessment).where(RiskAssessment.assessment_data_id == assessment_data_id)).first()
    if risk_data:
        session.delete(risk_data)
        
    session.delete(ass_data)
    session.commit()
    return {"status": "deleted"}

class ConsultationNoteInput(SQLModel):
    note: str

@app.put("/assessment/{risk_id}/consultation")
def save_consultation_note(risk_id: int, input_data: ConsultationNoteInput, session: SessionDep):
    risk = session.get(RiskAssessment, risk_id)
    if not risk:
        raise HTTPException(status_code=404, detail="Risk Assessment not found")
    risk.asha_consultation_note = input_data.note
    session.add(risk)
    session.commit()
    return {"status": "success", "note": input_data.note}

@app.get("/mother/{mother_id}/chat", response_model=List[ChatMessage])
def get_chat_history(mother_id: str, session: SessionDep):
    return session.exec(select(ChatMessage).where(ChatMessage.mother_id == mother_id).order_by(ChatMessage.timestamp)).all()

@app.post("/chat")
def send_chat_message(message: ChatMessage, session: SessionDep):
    message.timestamp = datetime.now()
    session.add(message)
    session.commit()
    return message

@app.get("/mother/{mother_id}/consultations", response_model=List[Consultation])
def get_consultations(mother_id: str, session: SessionDep):
    return session.exec(select(Consultation).where(Consultation.mother_id == mother_id).order_by(Consultation.created_at.desc())).all()

@app.post("/mother/{mother_id}/consultations", response_model=Consultation)
def create_consultation(mother_id: str, consultation: Consultation, session: SessionDep):
    mother = session.get(MotherProfile, mother_id)
    if not mother:
        raise HTTPException(status_code=404, detail="Mother not found")
        
    consultation.mother_id = mother_id
    consultation.created_at = datetime.now()
    if isinstance(consultation.next_consultation_date, str):
        try:
            
            date_str = consultation.next_consultation_date.replace("Z", "+00:00")
            consultation.next_consultation_date = datetime.fromisoformat(date_str)
        except Exception:
            pass

    session.add(consultation)
    session.commit()
    session.refresh(consultation)

    if mother.telegram_id:
        try:
            telegram_bot.send_consultation_prescription_to_telegram(mother, consultation)
        except Exception as e:
            print(f"Failed to send Telegram notification: {e}")
            
    return consultation

UPLOAD_DIR = "data/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/mother/{mother_id}/documents", response_model=Document)
async def upload_document(mother_id: str, session: SessionDep, file: UploadFile = File(...), document_type: str = Form("Report")):
    mother = session.get(MotherProfile, mother_id)
    if not mother:
        raise HTTPException(status_code=404, detail="Mother not found")
        
    file_path = os.path.join(UPLOAD_DIR, f"{mother_id}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    doc = Document(
        mother_id=mother_id,
        file_name=file.filename,
        file_path=file_path,
        document_type=document_type
    )
    session.add(doc)
    session.commit()
    session.refresh(doc)
    return doc

@app.get("/mother/{mother_id}/documents", response_model=List[Document])
def get_documents(mother_id: str, session: SessionDep):
    return session.exec(select(Document).where(Document.mother_id == mother_id).order_by(Document.uploaded_at.desc())).all()

@app.get("/mother/{mother_id}/documents", response_model=List[Document])
def get_documents(mother_id: str, session: SessionDep):
    return session.exec(select(Document).where(Document.mother_id == mother_id).order_by(Document.uploaded_at.desc())).all()

@app.post("/mother/{mother_id}/upload")
async def upload_document(mother_id: str, session: SessionDep, file: UploadFile = File(...)):
    
    mother = session.get(MotherProfile, mother_id)
    if not mother:
        raise HTTPException(status_code=404, detail="Mother not found")
        
    file_path = f"data/uploads/{mother_id}_{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())
        
    doc = Document(
        mother_id=mother_id,
        file_name=file.filename,
        file_path=file_path,
        document_type="Report"
    )
    session.add(doc)
    session.commit()
    session.refresh(doc)
    return doc

@app.get("/mother/{mother_id}/chat/summary")
async def get_chat_summary(mother_id: str, session: SessionDep):
    
    two_weeks_ago = datetime.now() - timedelta(days=14)
    messages = session.exec(
        select(ChatMessage)
        .where(ChatMessage.mother_id == mother_id)
        .where(ChatMessage.timestamp >= two_weeks_ago)
        .order_by(ChatMessage.timestamp.asc())
    ).all()
    
    summary_text = await orchestrator.generate_chat_summary(mother_id, messages)
    return {"summary": summary_text}

@app.get("/admin/stats")
def get_admin_stats(session: SessionDep):
    total_mothers = session.exec(select(MotherProfile)).all()
    doctors = session.exec(select(Doctor)).all()
    ashas = session.exec(select(AshaWorker)).all()
    
    fully_assigned = sum(1 for m in total_mothers if m.assigned_doctor_id and m.assigned_asha_id)
    needs_assignment = len(total_mothers) - fully_assigned

    doctor_workloads = [{"id": d.id, "name": d.name, "count": len(d.assigned_mothers)} for d in doctors]
    asha_workloads = [{"id": a.id, "name": a.name, "count": len(a.assigned_mothers)} for a in ashas]
    
    return {
        "total_mothers": len(total_mothers),
        "total_doctors": len(doctors),
        "total_ashas": len(ashas),
        "fully_assigned": fully_assigned,
        "needs_assignment": needs_assignment,
        "doctor_workloads": sorted(doctor_workloads, key=lambda x: x["count"], reverse=True),
        "asha_workloads": sorted(asha_workloads, key=lambda x: x["count"], reverse=True)
    }

@app.get("/mothers", response_model=List[MotherProfile])
def get_all_mothers(session: SessionDep):
    return session.exec(select(MotherProfile)).all()

@app.get("/doctors", response_model=List[Doctor])
def get_all_doctors(session: SessionDep):
    return session.exec(select(Doctor)).all()

@app.get("/asha_workers", response_model=List[AshaWorker])
def get_all_ashas(session: SessionDep):
    return session.exec(select(AshaWorker)).all()

class AssignHRInput(SQLModel):
    doctor_id: Optional[str] = None
    asha_id: Optional[str] = None

@app.put("/mother/{mother_id}/assign_hr")
def assign_hr(mother_id: str, payload: AssignHRInput, session: SessionDep):
    mother = session.get(MotherProfile, mother_id)
    if not mother:
        raise HTTPException(status_code=404, detail="Mother not found")
        
    if payload.doctor_id:
        mother.assigned_doctor_id = payload.doctor_id
    if payload.asha_id:
        mother.assigned_asha_id = payload.asha_id
        
    session.add(mother)
    session.commit()
    session.refresh(mother)
    return {"status": "success", "mother_id": mother.id, "assigned_doctor_id": mother.assigned_doctor_id, "assigned_asha_id": mother.assigned_asha_id}
