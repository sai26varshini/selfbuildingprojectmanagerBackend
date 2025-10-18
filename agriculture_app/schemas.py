from pydantic import BaseModel
from models import Crop

class CropSchema(BaseModel):
    id: int
    name: str
    description: str

class CropCreateSchema(BaseModel):
    name: str
    description: str
