from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

class Doctor(SQLModel, table=True):
    id: str = Field(primary_key=True)
    name: str
    phone: str
    specialization: Optional[str] = "General Physician"
    assigned_mothers: List["MotherProfile"] = Relationship(back_populates="assigned_doctor")

class AshaWorker(SQLModel, table=True):
    id: str = Field(primary_key=True)
    name: str
    phone: str
    location: str
    assigned_mothers: List["MotherProfile"] = Relationship(back_populates="assigned_asha")

class MotherProfile(SQLModel, table=True):
    id: str = Field(primary_key=True)
    telegram_id: Optional[str] = Field(default=None)
    name: str
    location: Optional[str] = None
    preferred_lang: str = Field(default='en')
    age: int
    gestational_age_weeks: int
    phone: str
    latitude: float
    longitude: float

    assigned_doctor_id: Optional[str] = Field(default=None, foreign_key="doctor.id")
    assigned_asha_id: Optional[str] = Field(default=None, foreign_key="ashaworker.id")

    assigned_doctor: Optional[Doctor] = Relationship(back_populates="assigned_mothers")
    assigned_asha: Optional[AshaWorker] = Relationship(back_populates="assigned_mothers")
    assessments: List["RiskAssessment"] = Relationship(back_populates="mother")
    chat_messages: List["ChatMessage"] = Relationship(back_populates="mother")
    consultations: List["Consultation"] = Relationship(back_populates="mother")
    documents: List["Document"] = Relationship(back_populates="mother")

class AssessmentData(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    mother_id: str = Field(foreign_key="motherprofile.id")
    systolic_bp: int
    diastolic_bp: int
    weight_kg: float
    hemoglobin: float
    glucose: int
    heart_rate: int
    timestamp: datetime = Field(default_factory=datetime.now)

    risk_result: Optional["RiskAssessment"] = Relationship(back_populates="assessment_data")

class RiskAssessment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    assessment_data_id: int = Field(foreign_key="assessmentdata.id")
    mother_id: str = Field(foreign_key="motherprofile.id")
    
    overall_risk_score: float
    risk_level: str
    clinical_flags: str 
    environmental_flags: str 
    nutrition_advice: str 
    medication_reminders: str 
    
    environmental_impact: Optional[str] = None
    clinical_justification: Optional[str] = None
    asha_consultation_note: Optional[str] = None
    
    timestamp: datetime = Field(default_factory=datetime.now)

    mother: Optional[MotherProfile] = Relationship(back_populates="assessments")
    assessment_data: Optional[AssessmentData] = Relationship(back_populates="risk_result")

class ChatMessage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    mother_id: str = Field(foreign_key="motherprofile.id")
    sender: str = Field(default="Patient") 
    raw_text: str
    translated_text: Optional[str] = None
    is_voice: bool = Field(default=False)
    priority: str = Field(default="GREEN") 
    timestamp: datetime = Field(default_factory=datetime.now)
    
    mother: Optional[MotherProfile] = Relationship(back_populates="chat_messages")

class Consultation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    mother_id: str = Field(foreign_key="motherprofile.id")

    systolic_bp: Optional[int] = None
    diastolic_bp: Optional[int] = None
    weight_kg: Optional[float] = None
    heart_rate: Optional[int] = None

    health_status: Optional[str] = None
    observations: Optional[str] = None
    nutrition_plan: Optional[str] = None
    medication_plan: Optional[str] = None

    next_consultation_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.now)

    mother: Optional[MotherProfile] = Relationship(back_populates="consultations")

class Document(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    mother_id: str = Field(foreign_key="motherprofile.id")
    
    file_name: str
    file_path: str
    document_type: str = Field(default="Report") 
    uploaded_at: datetime = Field(default_factory=datetime.now)

    mother: Optional[MotherProfile] = Relationship(back_populates="documents")

class VitalsInput(SQLModel):
    mother_id: str
    systolic_bp: int
    diastolic_bp: int
    weight_kg: float
    hemoglobin: float
    glucose: int
    heart_rate: int
    extra_symptoms: Optional[str] = None
    temperature_c: float = 30.0
    heat_index: float = 30.0
    aqi: float = 50.0
    chemical_exposure: float = 2.0
