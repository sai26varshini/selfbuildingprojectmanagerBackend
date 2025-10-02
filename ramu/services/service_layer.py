# services/service_layer.py

from typing import List
from db import SessionLocal
from models import User
from schemas import UserSchema

class UserService:
    def __init__(self, db: SessionLocal):
        self.db = db

    def get_users(self) -> List[UserSchema]:
        return self.db.query(User).all()

    def get_user(self, user_id: int) -> UserSchema:
        user = self.db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return UserSchema(id=user.id, name=user.name)

    def create_user(self, user: UserCreateSchema) -> UserSchema:
        db_user = User(name=user.name)
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return UserSchema(id=db_user.id, name=db_user.name)

    def update_user(self, user_id: int, user: UserCreateSchema) -> UserSchema:
        db_user = self.db.query(User).filter(User.id == user_id).first()
        if db_user is None:
            raise HTTPException(status_code=404, detail="User not found")
        db_user.name = user.name
        self.db.commit()
        self.db.refresh(db_user)
        return UserSchema(id=db_user.id, name=db_user.name)

    def delete_user(self, user_id: int) -> None:
        db_user = self.db.query(User).filter(User.id == user_id).first()
        if db_user is None:
            raise HTTPException(status_code=404, detail="User not found")
        self.db.delete(db_user)
        self.db.commit()
