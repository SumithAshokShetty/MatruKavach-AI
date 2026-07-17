import asyncio
import os
from dotenv import load_dotenv
load_dotenv()
from agents.orchestrator import MatruKavachOrchestrator

async def main():
    print("Initializing MatruKavach Agent Executor...")
    orchestrator = MatruKavachOrchestrator()
    
    print("\n--- TEST CASE: High Risk Mother (Should trigger Environmental checks) ---")
    print("Simulating query for a mother with BP 150/100 (High Risk)...")
    try:
        result = await orchestrator.assess_mother(
            mother_id="TEST-001",
            name="Test Mother A",
            lat=19.0, lon=72.0,
            bp_sys=150, bp_dia=100, 
            weight=65.0, hb=10.5, glucose=110, gest_weeks=28,
            extra_symptoms="Headache",
            temperature_c=35.0, heat_index=42.0, aqi=160.0, toxins=7.5
        )
        print(f"\n[FINAL Result]\nRisk Level: {result.risk_level}\nScore: {result.overall_risk_score}")
        print(f"Clinical Flags: {result.clinical_flags}")
        print(f"Env Flags: {result.environmental_flags}")
        print(f"Advice: {result.nutrition_advice}")
    except Exception as e:
        print(f"Agent failed: {e}")

    print("\n" + "="*50 + "\n")

    print("--- TEST CASE: Low Risk Mother (Might skip Environmental Check) ---")
    print("Simulating query for a mother with BP 110/70 (Low Risk)...")
    try:
        result = await orchestrator.assess_mother(
            mother_id="TEST-002",
            name="Test Mother B",
            lat=19.0, lon=72.0,
            bp_sys=110, bp_dia=70,  
            weight=60.0, hb=12.5, glucose=100, gest_weeks=20,
            extra_symptoms="",
            temperature_c=25.0, heat_index=26.0, aqi=40.0, toxins=1.0
        )
        print(f"\n[FINAL Result]\nRisk Level: {result.risk_level}\nScore: {result.overall_risk_score}")
        print(f"Clinical Flags: {result.clinical_flags}")
        print(f"Env Flags: {result.environmental_flags}")
        print(f"Advice: {result.nutrition_advice}")
    except Exception as e:
        print(f"Agent failed: {e}")

if __name__ == "__main__":
    if "GOOGLE_API_KEY" not in os.environ:
        print("ERROR: GOOGLE_API_KEY environment variable is not set.")
    else:
        asyncio.run(main())
