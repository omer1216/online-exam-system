from sqlalchemy.orm import Session
import models, schemas
import bcrypt

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def hash_password(password: str):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = hash_password(user.password)
    db_user = models.User(username=user.username, password=hashed_password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_quiz(db: Session, quiz: schemas.QuizCreate, user_id: int):
    db_quiz = models.Quiz(**quiz.dict(), teacher_id=user_id)
    db.add(db_quiz)
    db.commit()
    db.refresh(db_quiz)
    return db_quiz

def create_question(db: Session, question: schemas.QuestionCreate, quiz_id: int):
    db_question = models.Question(**question.dict(), quiz_id=quiz_id)
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

def get_quizzes(db: Session):
    return db.query(models.Quiz).all()

def get_quiz(db: Session, quiz_id: int):
    return db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()