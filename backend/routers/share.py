import jwt
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from database import get_session
from models import MotherProfile, AssessmentData, RiskAssessment, Consultation

router = APIRouter(prefix="/share", tags=["Secure Share"])

SECRET_KEY = "SUPER_SECRET_MATRUKAVACH_KEY_2026"
ALGORITHM = "HS256"

@router.get("/mother/{mother_id}/token")
def generate_share_token(mother_id: str, session: Session = Depends(get_session)):
    # Verify mother exists
    mother = session.get(MotherProfile, mother_id)
    if not mother:
        raise HTTPException(status_code=404, detail="Mother profile not found")
    
    # Token valid for 24 hours
    payload = {
        "mother_id": mother_id,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return {"token": token}

@router.get("/mother")
def get_shared_record(token: str, session: Session = Depends(get_session)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        mother_id = payload.get("mother_id")
        if not mother_id:
            raise HTTPException(status_code=400, detail="Invalid token payload")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Share link has expired (24h limit)")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid or tampered sharing token")
        
    mother = session.get(MotherProfile, mother_id)
    if not mother:
        raise HTTPException(status_code=404, detail="Mother profile not found")
        
    # Get vitals/assessments
    assessments_query = select(AssessmentData).where(AssessmentData.mother_id == mother_id)
    assessments = session.exec(assessments_query).all()
    
    # Map assessments to include their risk assessment details
    history = []
    for ass in assessments:
        risk = session.exec(select(RiskAssessment).where(RiskAssessment.assessment_data_id == ass.id)).first()
        history.append({
            "vitals": ass,
            "risk": risk
        })
        
    # Get consultations
    consultations = session.exec(select(Consultation).where(Consultation.mother_id == mother_id).order_by(Consultation.created_at.desc())).all()
    
    return {
        "mother": mother,
        "history": history,
        "consultations": consultations
    }
