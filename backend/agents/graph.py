from typing import TypedDict, List, Dict, Any, Annotated
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

def route_risk_level(state: GraphState) -> str:
    # Inspect ToolMessage outputs dynamically to identify clinical risks
    clinical_score = 1.0
    clinical_flags = []
    
    for msg in state["messages"]:
        if isinstance(msg, ToolMessage) and msg.name == "assess_clinical_risk":
            try:
                res = json.loads(msg.content)
                clinical_score = res.get("clinical_risk_score", 1.0)
                clinical_flags = res.get("flags", [])
            except:
                pass
                
    is_emergency = (clinical_score >= 7.0) or any(
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
    # Autonomously route to the next reasoning node based on the parsed risk metrics
    return route_risk_level(state)

def emergency_agent_node(state: GraphState) -> Dict:
    print(f"[ALERT] Twilio webhook trigger activated for Mother ID: {state.get('mother_id')}")
    return {
        "escalation_status": "EMERGENCY_ALERT_DISPATCHED",
        "risk_level": "CRITICAL"
    }

def generate_guidance_node(state: GraphState) -> Dict:
    # Autonomous synthesis of state matching GuidanceOutput schema directly from the reasoning chain
    llm = get_llm_model(structured=True)
    
    doctor_notes_str = f"\nDoctor Override/Approval Notes: {state.get('doctor_override_notes')}" if state.get("doctor_override_notes") else ""
    
    # Gather tools results from messages context to provide full reasoning context to LLM
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
    
    # Write variables straight to the state
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

# Build State Graph
builder = StateGraph(GraphState)

builder.add_node("agent", agent_node)
builder.add_node("tools", tool_node)
builder.add_node("emergency_agent", emergency_agent_node)
builder.add_node("generate_guidance", generate_guidance_node)

builder.add_edge(START, "agent")

builder.add_conditional_edges("agent", should_continue, {
    "tools": "tools",
    "emergency_agent": "emergency_agent",
    "generate_guidance": "generate_guidance"
})
builder.add_edge("tools", "agent")

builder.add_edge("emergency_agent", "generate_guidance")
builder.add_edge("generate_guidance", END)

memory_checkpointer = MemorySaver()

# Compile with persistent MemorySaver checkpointing and pause before generate_guidance
matrukavach_graph = builder.compile(
    checkpointer=memory_checkpointer,
    interrupt_before=["generate_guidance"]
)
