# ml/predict.py
import logging
from typing import Dict, Any
from pydantic import BaseModel
from db import SessionLocal
from ml.model import Pipeline
from sklearn.metrics import accuracy_score, classification_report
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse

logging.basicConfig(level=logging.INFO)

class PredictionRequest(BaseModel):
    id: int

class PredictionResponse(BaseModel):
    id: int
    prediction: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# (Removed duplicate FastAPI app)

@app.get("/predict/{id}")
async def predict(id: int, db: SessionLocal = Depends(get_db)):
    try:
        # Load saved model
        from ml.model import pipeline
        prediction = pipeline.predict([[id]])
        logging.info(f"Prediction for id {id}: {prediction}")
        return JSONResponse(content={"id": id, "prediction": str(prediction[0])}, media_type="application/json")
    except Exception as e:
        logging.error(f"Error making prediction: {e}")
        raise HTTPException(status_code=500, detail="Error making prediction")
