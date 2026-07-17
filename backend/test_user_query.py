from sqlmodel import Session, select
from database import engine
from models import User

with Session(engine) as session:
    users = session.exec(select(User)).all()
    print("Total users in database:", len(users))
    for u in users:
        print(f"Username: {u.username}, Role: {u.role}, Associated ID: {u.associated_id}")
