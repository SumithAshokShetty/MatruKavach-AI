from sqlmodel import Session, select, SQLModel
from database import engine, create_db_and_tables
from models import Doctor, AshaWorker, MotherProfile, User, AssessmentData, RiskAssessment, ChatMessage, Consultation, Document
from routers.auth import get_password_hash
from datetime import datetime, timedelta
import json

def seed_all():
    print("Dropping all tables on Neon/SQLite to refresh schema...")
    SQLModel.metadata.drop_all(engine)
    
    print("Recreating tables...")
    create_db_and_tables()
    
    with Session(engine) as session:
        # 1. Seed Doctors
        doctors = [
            Doctor(id="doc-1", name="Dr. Arjun Rao", phone="9876543210", specialization="Obstetrician"),
            Doctor(id="doc-2", name="Dr. Meera Shah", phone="9876543211", specialization="Gynecologist"),
            Doctor(id="doc-3", name="Dr. Praful Dave", phone="9876543212", specialization="General Physician"),
            Doctor(id="doc-4", name="Dr. Rajesh Kumar", phone="9876543213", specialization="General Physician"),
            Doctor(id="doc-5", name="Dr. Sneha Gupta", phone="9876543214", specialization="Obstetrician"),
            Doctor(id="doc-6", name="Dr. Amit Patel", phone="9876543215", specialization="Obstetrician"),
            Doctor(id="doc-7", name="Dr. Sunita Krishnan", phone="9876543216", specialization="Gynecologist"),
            Doctor(id="doc-8", name="Dr. Vivek Sharma", phone="9876543217", specialization="General Physician"),
            Doctor(id="doc-9", name="Dr. Priya Nair", phone="9876543218", specialization="Gynecologist"),
            Doctor(id="doc-10", name="Dr. Vikram Joshi", phone="9876543219", specialization="General Physician"),
        ]
        session.add_all(doctors)
        print("Seeded 10 Doctors.")
        
        # 2. Seed ASHA Workers
        ashas = [
            AshaWorker(id="asha-1", name="Anita Joshi", phone="9876543220", location="Dombivli"),
            AshaWorker(id="asha-2", name="Kavita Desai", phone="9876543221", location="Mumbai"),
            AshaWorker(id="asha-3", name="Sunita Patel", phone="9876543222", location="Thane"),
            AshaWorker(id="asha-4", name="Priya Sharma", phone="9876543223", location="Pune"),
            AshaWorker(id="asha-5", name="Lata Singh", phone="9876543224", location="Kalyan"),
            AshaWorker(id="asha-6", name="Meenakshi Iyer", phone="9876543225", location="Borivali"),
            AshaWorker(id="asha-7", name="Deepa Pawar", phone="9876543226", location="Ghatkopar"),
            AshaWorker(id="asha-8", name="Pooja Jadhav", phone="9876543227", location="Dharavi"),
            AshaWorker(id="asha-9", name="Aarti Kadam", phone="9876543228", location="Andheri"),
            AshaWorker(id="asha-10", name="Roshni Patil", phone="9876543229", location="Kurla"),
        ]
        session.add_all(ashas)
        print("Seeded 10 ASHA Workers.")
        
        # 3. Seed Mothers
        mothers = [
            MotherProfile(id="MK-2024-001", name="Jiya Sharma", age=28, location="Ghatkopar", gestational_age_weeks=30, phone="9321857874", latitude=19.088, longitude=72.908),
            MotherProfile(id="MK-2024-002", name="Priya Patel", age=25, location="Dharavi", gestational_age_weeks=20, phone="9876543210", latitude=19.038, longitude=72.854),
            MotherProfile(id="MK-2024-003", name="Anjali Desai", age=30, location="Andheri", gestational_age_weeks=34, phone="9123456780", latitude=19.113, longitude=72.869),
            MotherProfile(id="MK-2024-004", name="Kavita Singh", age=22, location="Kurla", gestational_age_weeks=12, phone="9001122334", latitude=19.072, longitude=72.882),
            MotherProfile(id="MK-2024-005", name="Roshni Patil", age=24, location="Dombivli", gestational_age_weeks=16, phone="9988776005", latitude=19.218, longitude=73.087),
            MotherProfile(id="MK-2024-006", name="Pooja Jadhav", age=26, location="Thane", gestational_age_weeks=22, phone="9988776006", latitude=19.200, longitude=72.975),
            MotherProfile(id="MK-2024-007", name="Aarti Kadam", age=29, location="Kalyan", gestational_age_weeks=28, phone="9988776007", latitude=19.240, longitude=73.130),
            MotherProfile(id="MK-2024-008", name="Bhavna Shinde", age=27, location="Pune", gestational_age_weeks=32, phone="9988776008", latitude=18.520, longitude=73.856),
            MotherProfile(id="MK-2024-009", name="Kajal More", age=23, location="Navi Mumbai", gestational_age_weeks=18, phone="9988776009", latitude=19.033, longitude=73.029),
            MotherProfile(id="MK-2024-010", name="Deepa Pawar", age=31, location="Borivali", gestational_age_weeks=36, phone="9988776010", latitude=19.230, longitude=72.857),
        ]
        for m in mothers:
            session.add(m)
        print("Seeded 10 Mothers.")

        # 4. Seed Auth Users
        hashed_doc_pass = get_password_hash("doctorpassword")
        hashed_asha_pass = get_password_hash("ashapassword")
        hashed_admin_pass = get_password_hash("adminpassword")

        users = [
            User(username="admin", password_hash=hashed_admin_pass, role="admin"),
        ]
        
        for d in doctors:
            username = d.name.lower().replace("dr. ", "").replace(" ", "")
            users.append(User(username=username, password_hash=hashed_doc_pass, role="doctor", associated_id=d.id))
            
        for a in ashas:
            username = a.name.lower().replace(" ", "")
            users.append(User(username=username, password_hash=hashed_asha_pass, role="asha", associated_id=a.id))
            
        session.add_all(users)
        print("Seeded Auth Users.")
        
        # Commit parent objects first before inserting records referencing them (ForeignKey constraint)
        session.commit()
        print("Committed all core models.")

        # 5. Seed Assessments and history for Jiya
        a1_data = AssessmentData(
            mother_id="MK-2024-001",
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
            mother_id="MK-2024-001",
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
            mother_id="MK-2024-001",
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
            mother_id="MK-2024-001",
            overall_risk_score=1.5,
            risk_level="LOW",
            clinical_flags=json.dumps([]),
            environmental_flags=json.dumps([]),
            nutrition_advice=json.dumps(["Continue balanced diet"]),
            medication_reminders=json.dumps([]),
            timestamp=a2_data.timestamp
        )
        session.add(r2)

        # 6. Seed Chats
        chats = [
            ChatMessage(mother_id="MK-2024-001", sender="bot", raw_text="bot: Hello Jiya, time for your weekly check-in. How are you feeling today?", timestamp=datetime.now() - timedelta(days=2, hours=10)),
            ChatMessage(mother_id="MK-2024-001", sender="Patient", raw_text="I am feeling a bit dizzy since morning.", timestamp=datetime.now() - timedelta(days=2, hours=9, minutes=50)),
            ChatMessage(mother_id="MK-2024-001", sender="bot", raw_text="bot: Please sit down and drink some water. Have you taken your iron tablet?", timestamp=datetime.now() - timedelta(days=2, hours=9, minutes=49)),
            ChatMessage(mother_id="MK-2024-001", sender="Patient", raw_text="Yes, I took it after breakfast.", timestamp=datetime.now() - timedelta(days=2, hours=9, minutes=40)),
            ChatMessage(mother_id="MK-2024-001", sender="bot", raw_text="bot: Good. If dizziness continues, please visit the ASHA center.", timestamp=datetime.now() - timedelta(days=2, hours=9, minutes=39)),
        ]
        for chat in chats:
            session.add(chat)
            
        session.commit()
        print("All database tables seeded successfully in one unified transaction!")

if __name__ == "__main__":
    seed_all()
