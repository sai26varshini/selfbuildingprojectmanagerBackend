from pydantic import BaseModel
from models import User

class UserSchema(BaseModel):
    id: int
    username: str

class UserCreateSchema(BaseModel):
    username: str

class UserUpdateSchema(BaseModel):
    username: str
