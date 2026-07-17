from database import get_session
from sqlmodel import select
from models import MotherProfile

with next(get_session()) as session:
    try:
        mothers = session.exec(select(MotherProfile)).all()
        print(f"Mothers found: {len(mothers)}")
        for m in mothers:
            print(m)
    except Exception as e:
        import traceback
        traceback.print_exc()
