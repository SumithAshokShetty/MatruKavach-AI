from datetime import datetime
from .geospatial import get_environmental_data, Coordinates
from .clinical import assess_clinical_risk, ClinicalVitals
from .nutrition import generate_nutrition_advice
from models import RiskAssessment
import google.generativeai as genai
import os

GEMINI_API_KEY_STR = os.environ.get("GOOGLE_API_KEY", "")
api_keys = [k.strip() for k in GEMINI_API_KEY_STR.split(",") if k.strip()]
if api_keys:
    genai.configure(api_key=api_keys[0])
    model = genai.GenerativeModel('gemini-2.5-flash')
else:
    model = None

class MatruKavachOrchestrator:
    def __init__(self):
        pass

    async def assess_mother(self, mother_id: str, name: str, lat: float, lon: float, 
                            bp_sys: int, bp_dia: int, weight: float, 
                            hb: float, glucose: int, gest_weeks: int,
                            extra_symptoms: str = None, temperature_c: float = 30.0,
                            heat_index: float = 30.0, aqi: float = 50.0, toxins: float = 2.0):
        
        from .graph import matrukavach_graph, ClinicalVitals, PlanetaryIntelligence
        from langchain_core.messages import HumanMessage

        config = {"configurable": {"thread_id": mother_id}}

        initial_state = {
            "mother_id": mother_id,
            "name": name,
            "clinical_vitals": ClinicalVitals(
                systolic_bp=bp_sys,
                diastolic_bp=bp_dia,
                weight_kg=weight,
                hemoglobin=hb,
                glucose=glucose,
                gestational_age_weeks=gest_weeks,
                extra_symptoms=extra_symptoms or ""
            ),
            "planetary_intelligence": PlanetaryIntelligence(
                temperature_c=temperature_c,
                heat_index=heat_index,
                aqi=aqi,
                toxins=toxins
            ),
            "messages": [
                HumanMessage(content=f"Assess patient risk levels. Patient anonymized ID: {mother_id}")
            ],
            "escalation_status": "NORMAL",
            "doctor_approval": False,
            "doctor_override_notes": ""
        }

        # Clear existing state on this thread to allow clean rerun of the ReAct sequence
        matrukavach_graph.update_state(config, {
            "messages": [],
            "clinical_score": 0.0,
            "clinical_flags": [],
            "environmental_flags": [],
            "final_risk_score": 0.0,
            "risk_level": "LOW",
            "escalation_status": "NORMAL",
            "doctor_approval": False,
            "doctor_override_notes": ""
        })

        print(f"Executing autonomous ReAct loop for {name} with thread_id: {mother_id}...")
        matrukavach_graph.invoke(initial_state, config)
        
        # At this point, the LangGraph flow is paused right before generating guidance
        state_info = matrukavach_graph.get_state(config)
        current_values = state_info.values

        return RiskAssessment(
            mother_id=mother_id,
            overall_risk_score=round(current_values.get("final_risk_score", 1.0), 1),
            risk_level=current_values.get("risk_level", "LOW"),
            clinical_flags=current_values.get("clinical_flags", []),
            environmental_flags=current_values.get("environmental_flags", []),
            nutrition_advice={},  # Left empty until doctor reviews and confirms guidance
            medication_reminders=[], 
            environmental_impact=current_values.get("environmental_impact", ""),
            clinical_justification="AWAITING_APPROVAL: Graph execution paused. Awaiting medical practitioner confirmation.",
            timestamp=datetime.now()
        )

    async def handle_doctor_action(self, mother_id: str, approved: bool, override_notes: str = ""):
        """
        Injects the doctor's override notes/decisions and resumes the LangGraph execution.
        """
        from .graph import matrukavach_graph
        config = {"configurable": {"thread_id": mother_id}}

        state_info = matrukavach_graph.get_state(config)
        if not state_info.next:
            # Process is already completed, read current state values
            current_values = state_info.values
        else:
            # Update state with clinician review details
            matrukavach_graph.update_state(config, {
                "doctor_approval": approved,
                "doctor_override_notes": override_notes
            }, as_node="generate_guidance")

            # Resume thread execution
            resumed_state = matrukavach_graph.invoke(None, config)
            current_values = resumed_state

        return {
            "overall_risk_score": round(current_values.get("final_risk_score", 1.0), 1),
            "risk_level": current_values.get("risk_level", "LOW"),
            "clinical_flags": current_values.get("clinical_flags", []),
            "environmental_flags": current_values.get("environmental_flags", []),
            "nutrition_advice": current_values.get("nutrition_advice", {}),
            "environmental_impact": current_values.get("environmental_impact", ""),
            "clinical_justification": current_values.get("clinical_justification", ""),
            "escalation_status": current_values.get("escalation_status", "NORMAL")
        }

    async def generate_chat_summary(self, mother_id: str, messages: list):
        if not messages:
            return "No recent chat history found."
            
        formatted_messages = []
        for msg in messages:
            date_str = msg.timestamp.strftime("%Y-%m-%d %H:%M")
            sender = "Mother" if msg.sender == "Patient" else msg.sender
            text = msg.translated_text if msg.translated_text else msg.raw_text
            formatted_messages.append(f"[{date_str}] {sender}: {text}")
            
        chat_log = "\n".join(formatted_messages)
        
        prompt = f"""
        You are an AI assisting a doctor. Please provide a brief, clinical summary of the chat history from the past two weeks between a pregnant mother and an ASHA worker/bot.
        Focus on symptoms reported, emergencies, overall tone, and concerns raised. Keep it to 1-2 paragraphs. Do not leak names or PII.
        
        Chat History:
        {chat_log}
        """
        
        api_key_str = os.environ.get("GOOGLE_API_KEY", "")
        api_keys = [k.strip() for k in api_key_str.split(",") if k.strip()]
        if not api_keys:
            return "AI model not configured for summary generation (no keys found)."
            
        last_error = None
        for api_key in api_keys:
            try:
                genai.configure(api_key=api_key)
                current_model = genai.GenerativeModel('gemini-2.5-flash')
                response = current_model.generate_content(prompt)
                return response.text.strip()
            except Exception as e:
                print(f"Summary generation failed: {e}")
                last_error = e
                
        return f"Failed to generate summary: {last_error}"
