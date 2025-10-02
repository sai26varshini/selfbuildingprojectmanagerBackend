# services/service_layer.py
from typing import List, Dict, Any
from db import SessionLocal
from models import User
from schemas import UserSchema, UserCreateSchema

def get_user(db: SessionLocal, user_id: int) -> User:
    return db.query(User).filter(User.id == user_id).first()

def get_users(db: SessionLocal) -> List[User]:
    return db.query(User).all()

def create_user(db: SessionLocal, user: UserCreateSchema) -> User:
    db_user = User(username=user.username)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: SessionLocal, user_id: int, user: UserCreateSchema) -> User:
    db_user = get_user(db, user_id)
    if db_user:
        db_user.username = user.username
        db.commit()
        db.refresh(db_user)
    return db_user

def delete_user(db: SessionLocal, user_id: int) -> None:
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
