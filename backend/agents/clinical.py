from langchain.tools import tool
from pydantic import BaseModel, Field
from datetime import datetime

class ClinicalVitals(BaseModel):
    systolic_bp: int
    diastolic_bp: int
    weight_kg: float
    hemoglobin: float
    glucose: int
    gestational_age_weeks: int
    extra_symptoms: str = ""

@tool("assess_clinical_risk", args_schema=ClinicalVitals)
def assess_clinical_risk(systolic_bp: int, diastolic_bp: int, weight_kg: float, hemoglobin: float, glucose: int, gestational_age_weeks: int, extra_symptoms: str = ""):
    """
    Analyzes maternal vitals to identify clinical risks like Preeclampsia, Anemia, or Gestational Diabetes.
    Returns a risk score (1-10) and a list of flags.
    """
    flags = []
    score = 1.0

    if systolic_bp >= 140 or diastolic_bp >= 90:
        score += 3.0
        flags.append("Hypertension Level 1")
    if systolic_bp >= 160 or diastolic_bp >= 110:
        score += 5.0
        flags.append("Severe Hypertension (Preeclampsia Risk)")

    if hemoglobin < 11.0:
        score += 2.0
        flags.append("Anemia Detected")
    if hemoglobin < 7.0:
        score += 4.0
        flags.append("Severe Anemia")

    if glucose > 140:
        score += 2.0
        flags.append("Elevated Blood Glucose")
    if glucose > 200:
        score += 4.0
        flags.append("Possible Gestational Diabetes")

    if extra_symptoms and len(extra_symptoms.strip()) > 0:
        score += 1.5
        flags.append(f"Reported Symptoms: {extra_symptoms}")
        
    normalized_score = min(score, 10.0)
    
    return {
        "clinical_risk_score": normalized_score,
        "flags": flags,
        "is_high_risk": normalized_score >= 5.0
    }
