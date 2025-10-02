from fastapi import APIRouter, Depends, HTTPException
from db import get_db
from models import User
from schemas import UserSchema, UserCreateSchema

router = APIRouter()

@router.get("/users/", response_model=list[UserSchema])
def read_users(db: SessionLocal = Depends(get_db)):
    return db.query(User).all()

@router.get("/users/{user_id}", response_model=UserSchema)
def read_user(user_id: int, db: SessionLocal = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/users/", response_model=UserSchema)
def create_user(user: UserCreateSchema, db: SessionLocal = Depends(get_db)):
    db_user = User(name=user.name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.put("/users/{user_id}", response_model=UserSchema)
def update_user(user_id: int, user: UserCreateSchema, db: SessionLocal = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.update(user.dict())
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: SessionLocal = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.delete()
    db.commit()
    return {"message": "User deleted successfully"}
