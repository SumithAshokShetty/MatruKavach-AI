from sqlmodel import Session
from database import engine, create_db_and_tables
from models import Doctor, AshaWorker, MotherProfile

def seed_db():
    create_db_and_tables()
    with Session(engine) as session:
        
        if session.query(Doctor).first():
            print("Already seeded.")
            return

        doctors = [
            Doctor(id="doc-1", name="Dr. Arjun Rao", phone="9876543210", specialization="Obstetrician"),
            Doctor(id="doc-2", name="Dr. Meera Shah", phone="9876543211", specialization="Gynecologist"),
            Doctor(id="doc-3", name="Dr. Praful Dave", phone="9876543212", specialization="General Physician"),
            Doctor(id="doc-4", name="Dr. Test", phone="9876543213", specialization="General Physician"),
        ]
        
        ashas = [
            AshaWorker(id="asha-1", name="Anita Joshi", phone="9876543220", location="Dombivli"),
            AshaWorker(id="asha-2", name="Parth Rana", phone="9876543221", location="Mumbai"),
            AshaWorker(id="asha-3", name="Axorra", phone="9876543222", location="Thane"),
            AshaWorker(id="asha-4", name="QWERTY", phone="9876543223", location="Pune"),
        ]

        session.add_all(doctors)
        session.add_all(ashas)
        session.commit()
        print("Database seeded with Doctors and ASHA Workers.")

if __name__ == "__main__":
    seed_db()
