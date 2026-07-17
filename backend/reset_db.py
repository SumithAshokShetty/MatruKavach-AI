from database import create_db_and_tables, engine
from sqlmodel import SQLModel
import models
import os

print("Deleting DB...")
if os.path.exists("data/matrukavach.db"):
    os.remove("data/matrukavach.db")

print("Recreating tables...")
create_db_and_tables()
print("Done!")
