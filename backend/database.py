import os
from dotenv import load_dotenv
from sqlmodel import create_engine, SQLModel, Session

load_dotenv()

database_url = os.getenv("DATABASE_URL")

if database_url and "PLACEHOLDER" not in database_url:
    # Use PostgreSQL if DATABASE_URL is provided (e.g. Neon or Supabase)
    # If the URL starts with postgres://, replace it with postgresql:// for SQLAlchemy compatibility
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    engine = create_engine(database_url, echo=True)
else:
    # Fallback to local SQLite
    sqlite_file_name = "data/matrukavach.db"
    # Ensure data directory exists
    os.makedirs(os.path.dirname(sqlite_file_name), exist_ok=True)
    sqlite_url = f"sqlite:///{sqlite_file_name}"
    connect_args = {"check_same_thread": False}
    engine = create_engine(sqlite_url, echo=True, connect_args=connect_args)

def create_db_and_tables():
    import models 
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
