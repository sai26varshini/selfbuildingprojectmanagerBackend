from pydantic import BaseModel
from typing import Optional

class Patient(BaseModel):
    id: int
    age: int
    sex: str
    cp: int
    trestbps: int
    chol: int
    fbs: int
    restecg: int
    thalach: int
    exang: int
    oldpeak: float
    slope: int
    ca: int
   thal: int
    target: int

class PredictionRequest(BaseModel):
    patient: Patient

class PredictionResponse(BaseModel):
    prediction: bool
    confidence: float
    explanation: str
