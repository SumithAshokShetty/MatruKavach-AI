from typing import TypedDict, List, Dict, Any, Annotated
from langgraph.graph import StateGraph, START, END
from .clinical import assess_clinical_risk, ClinicalVitals
from .nutrition import generate_nutrition_advice
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from pydantic import BaseModel, Field
import os

class PlanetaryIntelligence(BaseModel):
    temperature_c: float
    heat_index: float
    aqi: float
    toxins: float

class GraphState(TypedDict):
    mother_id: str
    name: str
    clinical_vitals: ClinicalVitals
    planetary_intelligence: PlanetaryIntelligence
    
    clinical_score: float
    clinical_flags: List[str]
    environmental_flags: List[str]
    final_risk_score: float
    risk_level: str

    environmental_impact: str
    clinical_justification: str
    nutrition_advice: Dict[str, List[str]]

class GuidanceOutput(BaseModel):
    clinical_justification: str = Field(description="A detailed clinical justification explicitly citing the local temperature and AQI. If environmental factors are safe, explicitly state that they were analyzed and are safe (e.g., 'The 4.5/10 score is driven by anemia; the local 27°C temperature and 102 AQI were analyzed and are currently within safe limits, adding no additional risk').")
    clinical_dietary_plan: List[str] = Field(description="List of specific dietary recommendations, e.g., 'Salt reduction (<5g) to manage BP'")
    environmental_safety_protocols: List[str] = Field(description="List of specific environmental safety recommendations, e.g., 'Avoid outdoors between 11 AM - 4 PM due to 41C heat index'")
    medication_monitoring: List[str] = Field(description="List of specific medication or monitoring actions, e.g., 'Check BP daily; notify Doctor if systolic exceeds 140'")

def assess_clinical_node(state: GraphState) -> Dict:
    vitals = state["clinical_vitals"]

    result = assess_clinical_risk.invoke({
        "systolic_bp": vitals.systolic_bp,
        "diastolic_bp": vitals.diastolic_bp,
        "weight_kg": vitals.weight_kg,
        "hemoglobin": vitals.hemoglobin,
        "glucose": vitals.glucose,
        "gestational_age_weeks": vitals.gestational_age_weeks,
        "extra_symptoms": vitals.extra_symptoms or ""
    })
    
    return {
        "clinical_score": result["clinical_risk_score"],
        "clinical_flags": result["flags"]
    }

def fetch_environment_node(state: GraphState) -> Dict:
    env = state["planetary_intelligence"]
    env_flags = []
    
    if env.heat_index > 40:
        env_flags.append(f"Extreme Heat Index ({env.heat_index:.1f}°C)")
    if env.aqi > 150:
        env_flags.append(f"High PM2.5 Levels ({env.aqi:.1f})")
    if env.toxins > 6.0:
        env_flags.append(f"High Chemical/Toxin Exposure ({env.toxins:.1f}/10)")
        
    return {
        "environmental_flags": env_flags
    }

def generate_guidance_node(state: GraphState) -> Dict:
    clinical_flags = state.get("clinical_flags", [])
    env_flags = state.get("environmental_flags", [])
    combined_flags = clinical_flags + env_flags

    base_score = state.get("clinical_score", 1.0)
    multiplier = 1.0
    env = state["planetary_intelligence"]
    
    if env.heat_index > 40: multiplier += 0.3
    if env.aqi > 150: multiplier += 0.2
    if env.toxins > 6.0: multiplier += 0.2
        
    final_score = base_score * multiplier
    final_score = min(final_score, 10.0)

    impact_str = ""
    extra_score = final_score - base_score
    if extra_score > 0:
        impact_reasons = []
        if env.heat_index > 40: impact_reasons.append(f"{env.heat_index:.1f}°C Heatwave")
        if env.aqi > 150: impact_reasons.append(f"{env.aqi:.1f} AQI")
        if env.toxins > 6.0: impact_reasons.append(f"high chemical exposure")
        impact_str = f"Score increased by +{extra_score:.1f} due to {' and '.join(impact_reasons)}."
    
    risk_level = "LOW"
    if final_score >= 4.0: risk_level = "MODERATE"
    if final_score >= 7.0: risk_level = "HIGH"
    if final_score >= 9.0: risk_level = "CRITICAL"

    weather_cond = f"Temp: {env.temperature_c}, AQI: {env.aqi}, Toxins: {env.toxins}"
    fallback_advice = generate_nutrition_advice.invoke({
        "clinical_flags": combined_flags,
        "weather_condition": weather_cond
    })

    prompt = f"""
    You are an expert AI Clinical Dietician assisting a doctor for a pregnant mother named {state["name"]}.
    Clinical Flags: {clinical_flags}
    Environmental Flags: {env_flags} (Current Temp: {env.temperature_c}°C, AQI: {env.aqi}, Toxins: {env.toxins})
    Current Generated Score: {final_score:.1f} / 10 ({risk_level})
    Generated Base Advice: {fallback_advice}
    
    Provide a detailed "Reasoning Trace":
    1. A single-paragraph "Clinical Justification" that explicitly states the current exact temperature ({env.temperature_c}°C) and exact AQI ({env.aqi}). You MUST explain how these environmental factors compounded with the clinical vitals. If the environmental conditions are safe and did not increase the risk score, explicitly state that they were analyzed, are within safe limits, and pose no additional harm, to assure the user that planetary conditions are actively monitored.
    2. Categorize the practical advice into Clinical Dietary Plan, Environmental Safety Protocols, and Medication/Monitoring. Extract specific actionable items.
    """
    
    api_key_str = os.environ.get("GOOGLE_API_KEY", "")
    api_keys = [k.strip() for k in api_key_str.split(",") if k.strip()]
    if not api_keys:
        api_keys = [""]
        
    response = None
    last_error = None
    
    for api_key in api_keys:
        try:
            llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.1, api_key=api_key)
            structured_llm = llm.with_structured_output(GuidanceOutput)
            response = structured_llm.invoke([HumanMessage(content=prompt)])
            break # Success, break out of loop
        except Exception as e:
            last_error = e
            error_msg = str(e)
            print(f"API Key starting with '{api_key[:8]}' failed: {e}")
            # If it's a quota, rate limit or invalid key error, try the next key
            if any(term in error_msg for term in ["429", "Quota", "RESOURCE_EXHAUSTED", "API_KEY_INVALID", "invalid"]):
                continue
            else:
                break # Non-key error, don't continue rotating
                
    if response:
        justification = response.clinical_justification
        advice_dict = {
            "Clinical Dietary Plan": response.clinical_dietary_plan,
            "Environmental Safety Protocols": response.environmental_safety_protocols,
            "Medication & Monitoring": response.medication_monitoring
        }
    else:
        print(f"Failed to call LLM after trying all keys: {last_error}")
        error_msg = str(last_error) if last_error else ""
        if "429" in error_msg or "Quota" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
            justification = "System fallback activated: All provided Google Gemini API Keys have exceeded free-tier quota limits. Please upgrade or replace the GOOGLE_API_KEY."
        else:
            justification = "System fallback activated. Standard clinical rules applied without extended context."
            
        advice_dict = {
            "Fallback Guidance": [
                "Maintain a balanced diet with plenty of seasonal vegetables and fruits.", 
                "Continue standard prenatal supplements as prescribed."
            ]
        }
        
    return {
        "final_risk_score": final_score,
        "risk_level": risk_level,
        "environmental_impact": impact_str,
        "clinical_justification": justification,
        "nutrition_advice": advice_dict
    }

builder = StateGraph(GraphState)

builder.add_node("assess_clinical", assess_clinical_node)
builder.add_node("fetch_environment", fetch_environment_node)
builder.add_node("generate_guidance", generate_guidance_node)

builder.add_edge(START, "assess_clinical")
builder.add_edge(START, "fetch_environment")

builder.add_edge(["assess_clinical", "fetch_environment"], "generate_guidance")
builder.add_edge("generate_guidance", END)

matrukavach_graph = builder.compile()
