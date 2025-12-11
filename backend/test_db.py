import sys
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError

# Use the config from database.py
DATABASE_URL = "postgresql://postgres:admin@localhost/exam_db"

def test_connection():
    try:
        engine = create_engine(DATABASE_URL)
        connection = engine.connect()
        print("✅ Connection successful!")
        connection.close()
    except OperationalError as e:
        print(f"❌ Connection failed: {e}")
        print("\nPossible reasons:")
        print("1. PostgreSQL is not running.")
        print("2. Password for user 'postgres' is not 'admin'.")
        print("3. Database 'exam_db' does not exist.")
    except Exception as e:
        print(f"❌ An error occurred: {e}")

if __name__ == "__main__":
    test_connection()
