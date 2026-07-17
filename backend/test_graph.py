import asyncio
from agents.graph import matrukavach_graph, ClinicalVitals, PlanetaryIntelligence

async def main():
    initial_state = {
        "mother_id": "MK-2024-001",
        "name": "Patient",
        "clinical_vitals": ClinicalVitals(
            systolic_bp=120,
            diastolic_bp=70,
            weight_kg=77,
            hemoglobin=11,
            glucose=100,
            gestational_age_weeks=30,
            extra_symptoms=""
        ),
        "planetary_intelligence": PlanetaryIntelligence(
            temperature_c=26.3,
            heat_index=30.3,
            aqi=79,
            toxins=4.0
        )
    }
    
    print("Invoking graph...")
    try:
        final_state = matrukavach_graph.invoke(initial_state)
        print("Final State:", final_state)
    except Exception as e:
        print(f"Exception out: {e}")

if __name__ == "__main__":
    asyncio.run(main())
