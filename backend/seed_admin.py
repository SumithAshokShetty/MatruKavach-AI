from sqlmodel import Session, select
from database import engine, create_db_and_tables
from models import Doctor, AshaWorker, MotherProfile, User
from routers.auth import get_password_hash

def seed_db():
    create_db_and_tables()
    with Session(engine) as session:
        
        # Clear existing doctors & asha workers to avoid duplicate entries and count issues
        for d in session.exec(select(Doctor)).all():
            session.delete(d)
        for a in session.exec(select(AshaWorker)).all():
            session.delete(a)
        for u in session.exec(select(User)).all():
            session.delete(u)
        session.commit()

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
        print("Seeded Doctors.")
        
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
        print("Seeded ASHA Workers.")

        session.commit()

        # Seed Users
        hashed_doc_pass = get_password_hash("doctorpassword")
        hashed_asha_pass = get_password_hash("ashapassword")
        hashed_admin_pass = get_password_hash("adminpassword")

        users = [
            User(username="admin", password_hash=hashed_admin_pass, role="admin"),
        ]
        
        for i in range(1, 11):
            users.append(User(username=f"doctor{i}", password_hash=hashed_doc_pass, role="doctor", associated_id=f"doc-{i}"))
            users.append(User(username=f"asha{i}", password_hash=hashed_asha_pass, role="asha", associated_id=f"asha-{i}"))
            
        session.add_all(users)
        session.commit()
        print("Seeded Auth Users.")

if __name__ == "__main__":
    seed_db()
