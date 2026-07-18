from sqlmodel import Session, select
from database import engine
from models import User
from routers.auth import verify_password

with Session(engine) as session:
    users = session.exec(select(User)).all()
    print("Database users:")
    for u in users:
        is_asha_pass_valid = verify_password("ashapassword", u.password_hash)
        is_doc_pass_valid = verify_password("doctorpassword", u.password_hash)
        is_admin_pass_valid = verify_password("adminpassword", u.password_hash)
        
        print(f"Username: {u.username}, Role: {u.role}, Associated ID: {u.associated_id}")
        print(f"  Hash: {u.password_hash}")
        print(f"  Verifies with 'ashapassword': {is_asha_pass_valid}")
        print(f"  Verifies with 'doctorpassword': {is_doc_pass_valid}")
        print(f"  Verifies with 'adminpassword': {is_admin_pass_valid}")
