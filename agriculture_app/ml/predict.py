# ml/predict.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from ml.model import load_model
from db import SessionLocal
from sqlalchemy.orm import Session
from typing import Dict, List

# (Removed duplicate FastAPI app)

class CropSchema(BaseModel):
    id: int
    name: str
    description: str

@app.get("/predict")
async def predict_crop():
    model = load_model()
    # Simulating a request from the frontend with a JSON body
    data = {"id": 1, "name": "Crop1", "description": "This is crop 1"}
    crop_schema = CropSchema(**data)
    prediction = model.predict([crop_schema])
    return {"prediction": prediction[0]}

@app.get("/healthcheck")
async def healthcheck():
    return {"status": "healthy"}

def load_model():
    from ml.model import RandomForestClassifier
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import accuracy_score
    from sklearn.preprocessing import StandardScaler
    session = SessionLocal()
    # Load the model from the database
    # For simplicity, assume the model is stored in the database
    model = session.query("SELECT model FROM models").first()
    return model.model
