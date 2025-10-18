from pydantic import BaseModel
from models import Flavor

class FlavorSchema(BaseModel):
    id: int
    name: str

class FlavorCreateSchema(FlavorSchema):
    pass

class FlavorUpdateSchema(FlavorSchema):
    pass
