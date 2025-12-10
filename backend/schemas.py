from pydantic import BaseModel
from typing import List, Optional

# --- USER SCHEMAS ---
class UserBase(BaseModel):
    username: str
    role: str  # "teacher" or "student"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        orm_mode = True

# --- QUESTION SCHEMAS ---
class QuestionBase(BaseModel):
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    id: int
    quiz_id: int
    class Config:
        orm_mode = True

# --- QUIZ SCHEMAS ---
class QuizBase(BaseModel):
    title: str
    description: str

class QuizCreate(QuizBase):
    pass

class Quiz(QuizBase):
    id: int
    teacher_id: int
    questions: List[Question] = []
    class Config:
        orm_mode = True