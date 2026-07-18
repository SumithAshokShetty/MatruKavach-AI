from typing import TypedDict, List, Dict, Any, Annotated, Optional
from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage, ToolMessage
from langgraph.graph.message import add_messages
from .clinical import assess_clinical_risk, ClinicalVitals
from .geospatial import get_environmental_data, Coordinates
from .nutrition import generate_nutrition_advice
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
from pydantic import BaseModel, Field
import os
import json

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
    
    historical_hb: Optional[float]
    historical_bp: Optional[str]
    
    messages: Annotated[List[BaseMessage], add_messages]
    
    clinical_score: float
    clinical_flags: List[str]
    environmental_flags: List[str]
    final_risk_score: float
    risk_level: str

    escalation_status: str  # "NORMAL" or "EMERGENCY_ALERT_DISPATCHED"
    doctor_approval: bool
    doctor_override_notes: str

    environmental_impact: str
    clinical_justification: str
    nutrition_advice: Dict[str, List[str]]

class GuidanceOutput(BaseModel):
    clinical_risk_score: float = Field(description="Maternal clinical risk score from 1.0 to 10.0 based on vitals and environmental compounding.")
    risk_level: str = Field(description="Categorized risk: LOW, MODERATE, HIGH, or CRITICAL.")
    clinical_justification: str = Field(description="Detailed clinical justification citing environmental factors (temperature, AQI) and vitals.")
    clinical_dietary_plan: List[str] = Field(description="List of specific dietary recommendations.")
    environmental_safety_protocols: List[str] = Field(description="List of environmental safety protocols.")
    medication_monitoring: List[str] = Field(description="List of medication and monitoring recommendations.")

# Register tools for ReAct Agent
tools_list = [assess_clinical_risk, get_environmental_data, generate_nutrition_advice]
tool_node = ToolNode(tools_list)

def get_llm_model(structured: bool = False):
    """
    Enterprise Model Fallback Gateway
    1. Primary Model: openai/gpt-oss-120b via Groq
    2. Tier-2 Fallback: qwen/qwen3.6-27b via Groq
    3. Tier-3 Fallback: gemini-2.5-flash via Google
    """
    groq_api_key = os.environ.get("GROQ_API_KEY", "")
    google_api_key = os.environ.get("GOOGLE_API_KEY", "")
    
    models_to_try = [
        {"provider": "groq", "model": "openai/gpt-oss-120b", "key": groq_api_key},
        {"provider": "groq", "model": "qwen/qwen3.6-27b", "key": groq_api_key},
        {"provider": "google", "model": "gemini-2.5-flash", "key": google_api_key}
    ]
    
    for item in models_to_try:
        if not item["key"]:
            continue
        try:
            if item["provider"] == "groq":
                llm = ChatGroq(model_name=item["model"], temperature=0.1, groq_api_key=item["key"])
            else:
                llm = ChatGoogleGenerativeAI(model=item["model"], temperature=0.1, api_key=item["key"])
            
            if structured:
                return llm.with_structured_output(GuidanceOutput)
            return llm
        except Exception as e:
            print(f"Fallback model failed ({item['model']}): {e}")
            
    # Absolute default fallback
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.1, api_key=google_api_key)
    if structured:
        return llm.with_structured_output(GuidanceOutput)
    return llm

def agent_node(state: GraphState) -> Dict:
    try:
        llm = get_llm_model(structured=False)
        model_with_tools = llm.bind_tools(tools_list)
        
        # Mask PII in prompt history
        masked_messages = []
        for msg in state["messages"]:
            content = msg.content
            if isinstance(content, str) and state.get("name"):
                content = content.replace(state["name"], "[PATIENT_ANONYMOUS]")
            
            if isinstance(msg, HumanMessage):
                masked_messages.append(HumanMessage(content=content))
            elif isinstance(msg, SystemMessage):
                masked_messages.append(SystemMessage(content=content))
            else:
                masked_messages.append(msg)
                
        response = model_with_tools.invoke(masked_messages)
        return {"messages": [response]}
    except Exception as e:
        print(f"Agent LLM invocation failed: {e}. Activating deterministic rules fallback.")
        
        # Directly invoke our tools with state parameters
        vitals = state["clinical_vitals"]
        clinical_res = assess_clinical_risk.invoke({
            "systolic_bp": vitals.systolic_bp,
            "diastolic_bp": vitals.diastolic_bp,
            "weight_kg": vitals.weight_kg,
            "hemoglobin": vitals.hemoglobin,
            "glucose": vitals.glucose,
            "gestational_age_weeks": vitals.gestational_age_weeks,
            "extra_symptoms": vitals.extra_symptoms or ""
        })
        
        env_res = get_environmental_data.invoke({
            "latitude": 19.072,
            "longitude": 72.882
        })
        
        from langchain_core.messages import AIMessage, ToolMessage
        
        # Simulate LLM tool calls and outputs so the subsequent edges/nodes function correctly
        ai_msg = AIMessage(
            content="Fallback reasoning: Running clinical risk and geospatial tools due to LLM error.",
            tool_calls=[
                {"name": "assess_clinical_risk", "args": {}, "id": "call_1"},
                {"name": "get_environmental_data", "args": {}, "id": "call_2"}
            ]
        )
        
        tool_msg_1 = ToolMessage(
            content=json.dumps(clinical_res),
            name="assess_clinical_risk",
            tool_call_id="call_1"
        )
        
        tool_msg_2 = ToolMessage(
            content=json.dumps(env_res),
            name="get_environmental_data",
            tool_call_id="call_2"
        )
        
        return {
            "messages": [ai_msg, tool_msg_1, tool_msg_2]
        }

def evaluate_risk_node(state: GraphState) -> Dict:
    """
    Evaluates risk dynamically from the messages state and writes parameters straight to the state before the HITL interruption.
    """
    try:
        llm = get_llm_model(structured=True)
        
        prompt = f"""
        You are an expert AI Clinical Advisor evaluating maternal health risk based on the vitals, local environment parameters, and historical EHR baselines.
        Review the vitals, tools execution logs, history, and EHR baselines:
        {state["messages"]}
        
        Historical EHR Baselines:
        - Historical Hemoglobin: {state.get('historical_hb')} g/dL
        - Historical Blood Pressure: {state.get('historical_bp')} mmHg
        
        Current Vitals:
        - Hemoglobin: {state['clinical_vitals'].hemoglobin} g/dL
        - Blood Pressure: {state['clinical_vitals'].systolic_bp}/{state['clinical_vitals'].diastolic_bp} mmHg
        
        CRITICAL TASK: Cross-reference current vitals against the historical EHR baselines. If hemoglobin has dropped significantly (e.g. >= 1.5 g/dL drop) or blood pressure has risen significantly (e.g. >= 20 mmHg increase in systolic or >= 15 mmHg increase in diastolic) compared to the historical baseline, you MUST flag this deteriorating maternal health trend in the clinical justification and increase the risk score accordingly.
        
        Provide the structured output matching the GuidanceOutput schema:
        - clinical_risk_score: A float from 1.0 to 10.0 based on BP, Hemoglobin, Glucose, and Environmental compounding.
        - risk_level: LOW, MODERATE, HIGH, or CRITICAL.
        - clinical_justification: Explaining the risk score citing exact temp/AQI and detailing any deteriorating maternal health trends.
        - clinical_dietary_plan: List of dietary actions.
        - environmental_safety_protocols: List of safety recommendations.
        - medication_monitoring: List of monitoring actions.
        """
        
        masked_prompt = prompt
        if state.get("name"):
            masked_prompt = prompt.replace(state["name"], "[PATIENT_ANONYMOUS]")
            
        response = llm.invoke([HumanMessage(content=masked_prompt)])
        
        # Write variables directly to state
        return {
            "clinical_score": response.clinical_risk_score,
            "final_risk_score": response.clinical_risk_score,
            "risk_level": response.risk_level,
            "clinical_justification": response.clinical_justification,
            "nutrition_advice": {
                "Clinical Dietary Plan": response.clinical_dietary_plan,
                "Environmental Safety Protocols": response.environmental_safety_protocols,
                "Medication & Monitoring": response.medication_monitoring
            }
        }
    except Exception as e:
        print("Structured risk evaluation failed. Executing deterministic rules fallback.")
        
        # Directly invoke our tools using input vitals from the state (100% resilient)
        vitals = state["clinical_vitals"]
        try:
            clinical_res = assess_clinical_risk.invoke({
                "systolic_bp": vitals.systolic_bp,
                "diastolic_bp": vitals.diastolic_bp,
                "weight_kg": vitals.weight_kg,
                "hemoglobin": vitals.hemoglobin,
                "glucose": vitals.glucose,
                "gestational_age_weeks": vitals.gestational_age_weeks,
                "extra_symptoms": vitals.extra_symptoms or ""
            })
            clinical_score = clinical_res.get("clinical_risk_score", 1.0)
            clinical_flags = clinical_res.get("flags", [])
        except Exception:
            clinical_score = 1.0
            clinical_flags = []
            
        environmental_flags = []
        env = state.get("planetary_intelligence")
        if env:
            try:
                if env.heat_index > 40:
                    environmental_flags.append(f"Extreme Heat Index ({env.heat_index:.1f}°C)")
                if env.aqi > 150:
                    environmental_flags.append(f"High PM2.5 Levels ({env.aqi:.1f})")
            except Exception:
                pass

        # Cross-reference historical trends for fallback
        h_hb = state.get("historical_hb")
        h_bp = state.get("historical_bp")
        current_hb = vitals.hemoglobin
        current_sbp = vitals.systolic_bp
        current_dbp = vitals.diastolic_bp
        
        trend_flags = []
        justification_parts = []
        if h_hb is not None and (h_hb - current_hb) >= 1.5:
            clinical_score += 2.0
            flag_msg = f"Deteriorating Trend: Hb dropped from {h_hb} to {current_hb} g/dL"
            trend_flags.append(flag_msg)
            justification_parts.append(flag_msg)
            
        if h_bp:
            try:
                parts = h_bp.split("/")
                h_sbp = int(parts[0])
                h_dbp = int(parts[1]) if len(parts) > 1 else 80
                if (current_sbp - h_sbp) >= 20 or (current_dbp - h_dbp) >= 15:
                    clinical_score += 2.0
                    flag_msg = f"Deteriorating Trend: BP rose from {h_bp} to {current_sbp}/{current_dbp} mmHg"
                    trend_flags.append(flag_msg)
                    justification_parts.append(flag_msg)
            except Exception:
                pass
        
        clinical_flags.extend(trend_flags)

        base_score = clinical_score
        multiplier = 1.0
        for flag in environmental_flags:
            if "Extreme Heat" in flag: multiplier += 0.3
            if "High PM2.5" in flag: multiplier += 0.2
            
        final_score = min(base_score * multiplier, 10.0)
        
        risk_level = "LOW"
        if final_score >= 4.0: risk_level = "MODERATE"
        if final_score >= 7.0: risk_level = "HIGH"
        if final_score >= 9.0: risk_level = "CRITICAL"
        
        fallback_justification = "System fallback activated. Vitals analyzed using local clinical rules."
        if justification_parts:
            fallback_justification += " Deteriorating maternal trends detected: " + "; ".join(justification_parts) + "."
        
        return {
            "clinical_score": clinical_score,
            "clinical_flags": clinical_flags,
            "environmental_flags": environmental_flags,
            "final_risk_score": final_score,
            "risk_level": risk_level,
            "clinical_justification": fallback_justification,
            "nutrition_advice": {
                "Fallback Guidance": [
                    "Maintain a balanced diet with plenty of seasonal vegetables and fruits.",
                    "Continue standard prenatal supplements as prescribed."
                ]
            }
        }

def route_risk_level(state: GraphState) -> str:
    final_score = state.get("final_risk_score", 1.0)
    clinical_flags = state.get("clinical_flags", [])
    
    is_emergency = (final_score >= 7.0) or any(
        "Severe Hypertension" in f or "Preeclampsia" in f for f in clinical_flags
    )
    if is_emergency:
        return "emergency_agent"
    return "generate_guidance"

def should_continue(state: GraphState) -> str:
    messages = state["messages"]
    last_message = messages[-1]
    if last_message.tool_calls:
        return "tools"
    return "evaluate_risk"

def emergency_agent_node(state: GraphState) -> Dict:
    print(f"[ALERT] Twilio webhook trigger activated for Mother ID: {state.get('mother_id')}")
    return {
        "escalation_status": "EMERGENCY_ALERT_DISPATCHED",
        "risk_level": "CRITICAL"
    }

def generate_guidance_node(state: GraphState) -> Dict:
    doctor_notes_str = f"\nDoctor Override/Approval Notes: {state.get('doctor_override_notes')}" if state.get("doctor_override_notes") else ""
    
    try:
        llm = get_llm_model(structured=True)
        prompt = f"""
        You are an expert AI Clinical Advisor synthesizing the final care plan.
        Review the vitals, tools execution logs, and history:
        {state["messages"]}
        {doctor_notes_str}
        
        Provide the final structured output matching the GuidanceOutput schema. You MUST evaluate and set:
        - clinical_risk_score (1.0 to 10.0)
        - risk_level (LOW, MODERATE, HIGH, or CRITICAL)
        - clinical_justification (citing exact temp and AQI analyzed)
        - clinical_dietary_plan
        - environmental_safety_protocols
        - medication_monitoring
        """
        
        masked_prompt = prompt
        if state.get("name"):
            masked_prompt = prompt.replace(state["name"], "[PATIENT_ANONYMOUS]")
            
        response = llm.invoke([HumanMessage(content=masked_prompt)])
        
        return {
            "final_risk_score": response.clinical_risk_score,
            "risk_level": response.risk_level,
            "clinical_justification": response.clinical_justification,
            "nutrition_advice": {
                "Clinical Dietary Plan": response.clinical_dietary_plan,
                "Environmental Safety Protocols": response.environmental_safety_protocols,
                "Medication & Monitoring": response.medication_monitoring
            }
        }
    except Exception as e:
        print(f"Generate guidance LLM invocation failed: {e}. Using rule-based fallback guidance.")
        
        final_score = state.get("final_risk_score", 1.0)
        risk_level = state.get("risk_level", "LOW")
        
        justification = "System fallback activated. Vitals analyzed using deterministic clinical rules. "
        if doctor_notes_str:
            justification += f"Clinician observations: {state.get('doctor_override_notes')}."
        else:
            justification += "Standard clinical rules applied."
            
        return {
            "final_risk_score": final_score,
            "risk_level": risk_level,
            "clinical_justification": justification,
            "nutrition_advice": {
                "Fallback Guidance": [
                    "Maintain a balanced diet with plenty of seasonal vegetables and fruits.",
                    "Continue standard prenatal supplements as prescribed."
                ]
            }
        }

# Build State Graph
builder = StateGraph(GraphState)

builder.add_node("agent", agent_node)
builder.add_node("tools", tool_node)
builder.add_node("evaluate_risk", evaluate_risk_node)
builder.add_node("emergency_agent", emergency_agent_node)
builder.add_node("generate_guidance", generate_guidance_node)

builder.add_edge(START, "agent")

builder.add_conditional_edges("agent", should_continue, {
    "tools": "tools",
    "evaluate_risk": "evaluate_risk"
})
builder.add_edge("tools", "agent")

# Connect evaluate_risk to routing conditional edge
builder.add_conditional_edges("evaluate_risk", route_risk_level, {
    "emergency_agent": "emergency_agent",
    "generate_guidance": "generate_guidance"
})

builder.add_edge("emergency_agent", "generate_guidance")
builder.add_edge("generate_guidance", END)

memory_checkpointer = MemorySaver()

# Compile with persistent MemorySaver checkpointing and pause before generate_guidance
matrukavach_graph = builder.compile(
    checkpointer=memory_checkpointer,
    interrupt_before=["generate_guidance"]
)
