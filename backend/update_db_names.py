from sqlmodel import Session, select
from database import engine
from models import Doctor, AshaWorker, MotherProfile

def update_and_seed():
    with Session(engine) as session:
        
        ashas = session.exec(select(AshaWorker)).all()
        for asha in ashas:
            if asha.name.lower() == "qwerty":
                asha.name = "Priya Sharma"
            elif asha.name.lower() == "axorra":
                asha.name = "Sunita Patel"
        
        docs = session.exec(select(Doctor)).all()
        for doc in docs:
            if doc.name.lower() == "dr. test":
                doc.name = "Dr. Rajesh Kumar"

        new_doc = Doctor(id="doc-5", name="Dr. Sneha Gupta", phone="9876543214", specialization="Obstetrician")
        existing_doc_ids = [d.id for d in session.exec(select(Doctor)).all()]
        if new_doc.id not in existing_doc_ids:
            session.add(new_doc)

        new_ashas = [
            AshaWorker(id="asha-5", name="Kavita Desai", phone="9876543224", location="Navi Mumbai"),
            AshaWorker(id="asha-6", name="Lata Singh", phone="9876543225", location="Kalyan"),
            AshaWorker(id="asha-7", name="Meenakshi Iyer", phone="9876543226", location="Borivali"),
        ]
        existing_asha_ids = [a.id for a in session.exec(select(AshaWorker)).all()]
        for asha in new_ashas:
            if asha.id not in existing_asha_ids:
                session.add(asha)

        new_mothers = [
            MotherProfile(
                id=f"MK-2024-{i:03d}", 
                name=name, 
                age=24+i, 
                gestational_age_weeks=20+(i%10), 
                phone=f"99887760{i:02d}", 
                latitude=19.0 + (i*0.01), 
                longitude=72.8 + (i*0.01), 
                location="Mumbai"
            )
            for i, name in enumerate(["Roshni Patil", "Pooja Jadhav", "Aarti Kadam", "Bhavna Shinde", "Kajal More", "Deepa Pawar"], start=10)
        ]
        
        existing_mother_ids = [m.id for m in session.exec(select(MotherProfile)).all()]
        for mother in new_mothers:
            if mother.id not in existing_mother_ids:
                session.add(mother)
                
        session.commit()
        print("Database updated and seeded successfully with new Indian names.")

if __name__ == "__main__":
    update_and_seed()
