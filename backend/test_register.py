from database import SessionLocal
import crud, schemas, models
import sys

def test_register():
    db = SessionLocal()
    try:
        username = "omershahzad"
        print(f"Checking if user '{username}' exists...")
        user = crud.get_user_by_username(db, username)
        if user:
            print(f"❌ User '{username}' ALREADY MATCHED in DB! (ID: {user.id}, Role: {user.role})")
            return

        print(f"Attempting to create user '{username}'...")
        new_user = schemas.UserCreate(
            username=username,
            password="password123",
            role="student"
        )
        created_user = crud.create_user(db, new_user)
        print(f"✅ User created successfully! ID: {created_user.id}")
    except Exception as e:
        print(f"❌ Error creating user: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_register()
