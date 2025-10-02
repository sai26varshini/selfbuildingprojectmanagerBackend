from pydantic import BaseModel
from models import User

class UserSchema(BaseModel):
    id: int
    name: str

class UserCreateSchema(BaseModel):
    name: str
