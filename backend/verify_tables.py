from sqlalchemy import create_engine, inspect
DATABASE_URL = "postgresql://postgres:admin@localhost/exam_db"

def list_tables():
    try:
        engine = create_engine(DATABASE_URL)
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"Tables found: {tables}")
        if "users" in tables:
            print("✅ 'users' table exists.")
        else:
            print("❌ 'users' table MISSING!")
    except Exception as e:
        print(f"❌ Error inspecting tables: {e}")

if __name__ == "__main__":
    list_tables()
