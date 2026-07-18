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
    print("\n==================================================")
    print("DATABASE STATUS: Connecting to PostgreSQL (Neon/Supabase)...")
    print("==================================================\n")
    engine = create_engine(database_url, echo=True)
else:
    sqlite_file_name = "data/matrukavach.db"
    # Ensure data directory exists
    os.makedirs(os.path.dirname(sqlite_file_name), exist_ok=True)
    
    sqlcipher_key = os.getenv("SQLCIPHER_KEY")
    if sqlcipher_key:
        try:
            sqlite_url = f"sqlite+pysqlcipher:///:{sqlcipher_key}@/{sqlite_file_name}"
            # Test connection parameters
            engine = create_engine(sqlite_url, echo=True)
            print("\n==================================================")
            print("DATABASE STATUS: Using AES-256 Encrypted SQLCipher database...")
            print("==================================================\n")
        except Exception as e:
            print("\n==================================================")
            print("DATABASE WARNING: SQLCipher drivers are missing on this system.")
            print(f"Error detail: {e}")
            print("Falling back to standard unencrypted local SQLite database...")
            print("==================================================\n")
            sqlite_url = f"sqlite:///{sqlite_file_name}"
            connect_args = {"check_same_thread": False}
            engine = create_engine(sqlite_url, echo=True, connect_args=connect_args)
    else:
        sqlite_url = f"sqlite:///{sqlite_file_name}"
        connect_args = {"check_same_thread": False}
        print("\n==================================================")
        print("DATABASE STATUS: Using local SQLite database...")
        print("==================================================\n")
        engine = create_engine(sqlite_url, echo=True, connect_args=connect_args)

def create_db_and_tables():
    import models 
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
