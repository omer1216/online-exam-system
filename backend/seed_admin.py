from database import SessionLocal
import crud, schemas, models

def seed_admin():
    db = SessionLocal()
    try:
        admin_username = "admin"
        admin_password = "admin"
        
        user = crud.get_user_by_username(db, admin_username)
        if user:
            print(f"✅ Admin user '{admin_username}' already exists.")
        else:
            print(f"Creating Admin user '{admin_username}'...")
            new_user = schemas.UserCreate(
                username=admin_username,
                password=admin_password,
                role="admin"
            )
            crud.create_user(db, new_user)
            print(f"✅ Admin user created successfully!")
            
    except Exception as e:
        print(f"❌ Error creating admin: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_admin()
