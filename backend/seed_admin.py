from sqlmodel import Session, select
from database import engine, create_db_and_tables
from models import Doctor, AshaWorker, MotherProfile, User
from routers.auth import get_password_hash

def seed_db():
    create_db_and_tables()
    with Session(engine) as session:
        
        # Seed Doctors and ASHA Workers if they don't exist
        if not session.query(Doctor).first():
            doctors = [
                Doctor(id="doc-1", name="Dr. Arjun Rao", phone="9876543210", specialization="Obstetrician"),
                Doctor(id="doc-2", name="Dr. Meera Shah", phone="9876543211", specialization="Gynecologist"),
                Doctor(id="doc-3", name="Dr. Praful Dave", phone="9876543212", specialization="General Physician"),
                Doctor(id="doc-4", name="Dr. Test", phone="9876543213", specialization="General Physician"),
            ]
            session.add_all(doctors)
            print("Seeded Doctors.")
        
        if not session.query(AshaWorker).first():
            ashas = [
                AshaWorker(id="asha-1", name="Anita Joshi", phone="9876543220", location="Dombivli"),
                AshaWorker(id="asha-2", name="Parth Rana", phone="9876543221", location="Mumbai"),
                AshaWorker(id="asha-3", name="Axorra", phone="9876543222", location="Thane"),
                AshaWorker(id="asha-4", name="QWERTY", phone="9876543223", location="Pune"),
            ]
            session.add_all(ashas)
            print("Seeded ASHA Workers.")

        session.commit()

        # Seed Users
        if not session.query(User).first():
            hashed_doc_pass = get_password_hash("doctorpassword")
            hashed_asha_pass = get_password_hash("ashapassword")
            hashed_admin_pass = get_password_hash("adminpassword")

            users = [
                User(username="admin", password_hash=hashed_admin_pass, role="admin"),
                
                User(username="doctor1", password_hash=hashed_doc_pass, role="doctor", associated_id="doc-1"),
                User(username="doctor2", password_hash=hashed_doc_pass, role="doctor", associated_id="doc-2"),
                User(username="doctor3", password_hash=hashed_doc_pass, role="doctor", associated_id="doc-3"),
                User(username="doctor4", password_hash=hashed_doc_pass, role="doctor", associated_id="doc-4"),

                User(username="asha1", password_hash=hashed_asha_pass, role="asha", associated_id="asha-1"),
                User(username="asha2", password_hash=hashed_asha_pass, role="asha", associated_id="asha-2"),
                User(username="asha3", password_hash=hashed_asha_pass, role="asha", associated_id="asha-3"),
                User(username="asha4", password_hash=hashed_asha_pass, role="asha", associated_id="asha-4"),
            ]
            session.add_all(users)
            session.commit()
            print("Seeded Auth Users.")
        else:
            print("Auth Users already exist.")

if __name__ == "__main__":
    seed_db()

