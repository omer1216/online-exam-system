from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# ⚠️ CHANGE 'password' HERE TO YOUR ACTUAL POSTGRES PASSWORD
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:admin@localhost/exam_db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()