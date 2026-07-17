from sqlmodel import Session, select
from database import engine, create_db_and_tables
from models import MotherProfile, AssessmentData, RiskAssessment, ChatMessage
from datetime import datetime, timedelta
import json

def seed_data():
    create_db_and_tables()
    
    with Session(engine) as session:
        
        existing_mother = session.exec(select(MotherProfile).where(MotherProfile.id == "MK-2024-001")).first()
        if existing_mother:
            print("Data already seeded.")
            return

        jiya = MotherProfile(
            id="MK-2024-001",
            name="Jiya",
            age=28,
            location="Ghatkopar",
            gestational_age_weeks=30,
            phone="9321857874",
            latitude=19.088,
            longitude=72.908
        )
        session.add(jiya)

        priya = MotherProfile(
            id="MK-2024-002",
            name="Priya",
            age=25,
            location="Dharavi",
            gestational_age_weeks=20,
            phone="9876543210",
            latitude=19.038,
            longitude=72.854
        )
        session.add(priya)

        anjali = MotherProfile(
            id="MK-2024-003",
            name="Anjali",
            age=30,
            location="Andheri",
            gestational_age_weeks=34,
            phone="9123456780",
            latitude=19.113,
            longitude=72.869
        )
        session.add(anjali)

        kavita = MotherProfile(
            id="MK-2024-004",
            name="Kavita",
            age=22,
            location="Kurla",
            gestational_age_weeks=12,
            phone="9001122334",
            latitude=19.072,
            longitude=72.882
        )
        session.add(kavita)
        session.commit() # Commit mothers first to ensure foreign keys exist in PostgreSQL

        a1_data = AssessmentData(
            mother_id=jiya.id,
            systolic_bp=114,
            diastolic_bp=85,
            weight_kg=56.0,
            hemoglobin=11.0,
            glucose=105,
            heart_rate=90,
            timestamp=datetime.now() - timedelta(days=60) 
        )
        session.add(a1_data)
        session.commit() 
        session.refresh(a1_data)
        
        r1 = RiskAssessment(
            assessment_data_id=a1_data.id,
            mother_id=jiya.id,
            overall_risk_score=2.0,
            risk_level="LOW",
            clinical_flags=json.dumps([]),
            environmental_flags=json.dumps([]),
            nutrition_advice=json.dumps(["Maintain hydration", "Regular walking"]),
            medication_reminders=json.dumps(["Iron supplements"]),
            timestamp=a1_data.timestamp
        )
        session.add(r1)

        a2_data = AssessmentData(
            mother_id=jiya.id,
            systolic_bp=110,
            diastolic_bp=70,
            weight_kg=58.0,
            hemoglobin=11.2,
            glucose=98,
            heart_rate=88,
            timestamp=datetime.now() - timedelta(days=30) 
        )
        session.add(a2_data)
        session.commit()
        session.refresh(a2_data)

        r2 = RiskAssessment(
            assessment_data_id=a2_data.id,
            mother_id=jiya.id,
            overall_risk_score=1.5,
            risk_level="LOW",
            clinical_flags=json.dumps([]),
            environmental_flags=json.dumps([]),
            nutrition_advice=json.dumps(["Continue balanced diet"]),
            medication_reminders=json.dumps([]),
            timestamp=a2_data.timestamp
        )
        session.add(r2)

        chats = [
            ChatMessage(mother_id=jiya.id, sender="bot", raw_text="bot: Hello Jiya, time for your weekly check-in. How are you feeling today?", timestamp=datetime.now() - timedelta(days=2, hours=10)),
            ChatMessage(mother_id=jiya.id, sender="Patient", raw_text="I am feeling a bit dizzy since morning.", timestamp=datetime.now() - timedelta(days=2, hours=9, minutes=50)),
            ChatMessage(mother_id=jiya.id, sender="bot", raw_text="bot: Please sit down and drink some water. Have you taken your iron tablet?", timestamp=datetime.now() - timedelta(days=2, hours=9, minutes=49)),
            ChatMessage(mother_id=jiya.id, sender="Patient", raw_text="Yes, I took it after breakfast.", timestamp=datetime.now() - timedelta(days=2, hours=9, minutes=40)),
            ChatMessage(mother_id=jiya.id, sender="bot", raw_text="bot: Good. If dizziness continues, please visit the ASHA center.", timestamp=datetime.now() - timedelta(days=2, hours=9, minutes=39)),
        ]
        for chat in chats:
            session.add(chat)
            
        session.commit()
        print("Database seeded successfully with Jiya's data.")

if __name__ == "__main__":
    seed_data()
