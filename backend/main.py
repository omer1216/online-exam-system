from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from typing import List

import models, schemas, crud
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Online Exam System API! Visit /docs for the API documentation."}


# Allow Frontend to talk to Backend (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- AUTHENTICATION ---
@app.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(db=db, user=user)

@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, form_data.username)
    if not user or not crud.verify_password(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    return {"access_token": user.username, "token_type": "bearer", "role": user.role, "user_id": user.id}

# --- QUIZ ENDPOINTS ---
@app.post("/quizzes", response_model=schemas.Quiz)
def create_quiz(quiz: schemas.QuizCreate, user_id: int, db: Session = Depends(get_db)):
    return crud.create_quiz(db=db, quiz=quiz, user_id=user_id)

@app.get("/quizzes", response_model=List[schemas.Quiz])
def read_quizzes(db: Session = Depends(get_db)):
    return crud.get_quizzes(db)

@app.get("/quizzes/{quiz_id}", response_model=schemas.Quiz)
def read_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz = crud.get_quiz(db, quiz_id=quiz_id)
    if quiz is None:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz

@app.post("/quizzes/{quiz_id}/questions", response_model=schemas.Question)
def create_question(quiz_id: int, question: schemas.QuestionCreate, db: Session = Depends(get_db)):
    return crud.create_question(db=db, question=question, quiz_id=quiz_id)

# --- SCORING & RESULTS LOGIC ---
@app.post("/quizzes/{quiz_id}/submit")
def submit_quiz(quiz_id: int, answers: dict, user_id: int, db: Session = Depends(get_db)):
    quiz = crud.get_quiz(db, quiz_id=quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # Check for existing submission
    existing_result = db.query(models.QuizResult).filter(
        models.QuizResult.quiz_id == quiz_id,
        models.QuizResult.student_id == user_id
    ).first()
    
    if existing_result:
        raise HTTPException(status_code=400, detail="You have already taken this quiz.")
    
    score = 0
    total = len(quiz.questions)
    
    for question in quiz.questions:
        str_q_id = str(question.id)
        if str_q_id in answers:
            if answers[str_q_id] == question.correct_option:
                score += 1
                
    # SAVE TO DATABASE
    result = models.QuizResult(
        quiz_id=quiz_id,
        student_id=user_id,
        score=score,
        total_marks=total
    )
    db.add(result)
    db.commit()
    
    return {"score": score, "total": total, "percentage": (score/total)*100}

@app.get("/quizzes/{quiz_id}/results")
def get_quiz_results(quiz_id: int, db: Session = Depends(get_db)):
    results = db.query(models.QuizResult).filter(models.QuizResult.quiz_id == quiz_id).all()
    return [
        {
            "student_name": r.student.username,
            "score": r.score,
            "total": r.total_marks
        }
        for r in results
    ]

@app.get("/student/{student_id}/results")
def get_student_results(student_id: int, db: Session = Depends(get_db)):
    # Get all results for this student
    results = db.query(models.QuizResult).filter(models.QuizResult.student_id == student_id).all()
    # Return list of quiz_ids they have taken
    return [r.quiz_id for r in results]
    # --- ADMIN ENDPOINTS ---
@app.get("/users", response_model=List[schemas.User])
def read_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Optional: Delete their results first to avoid foreign key errors
    db.query(models.QuizResult).filter(models.QuizResult.student_id == user_id).delete()
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}