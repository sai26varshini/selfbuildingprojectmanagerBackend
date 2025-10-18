from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from routes import router

# (Removed duplicate FastAPI app)
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///heart_disease.db"
engine = create_engine(...)  # defined in db.py

# SessionLocal in db.py
from db import Base
from sqlalchemy import Column, Integer, String

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
from pydantic import BaseModel
from typing import Optional

class Patient(BaseModel):
    id: int
    age: int
    sex: str
from fastapi import APIRouter, Depends, HTTPException
from db import SessionLocal
from models import Patient
from schemas import Patient as PatientSchema
from typing import List

router = APIRouter()

@router.get("/patients")
async def read_patients(db: SessionLocal = Depends()):
    patients = db.query(Patient).all()
    return patients

@router.get("/patients/{id}")
async def read_patient(id: int, db: SessionLocal = Depends()):
    patient = db.query(Patient).filter(Patient.id == id).first()
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.post("/patients")
async def create_patient(patient: PatientSchema, db: SessionLocal = Depends()):
    db_patient = Patient(**patient.dict())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@router.put("/patients/{id}")
async def update_patient(id: int, patient: PatientSchema, db: SessionLocal = Depends()):
    db_patient = db.query(Patient).filter(Patient.id == id).first()
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    for key, value in patient.dict().items():
        setattr(db_patient, key, value)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@router.delete("/patients/{id}")
async def delete_patient(id: int, db: SessionLocal = Depends()):
    db_patient = db.query(Patient).filter(Patient.id == id).first()
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    db.delete(db_patient)
    db.commit()
    return {"message": "Patient deleted"}
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer

def create_pipeline():
    numeric_features = ["age"]
    categorical_features = ["sex"]

    numeric_transformer = StandardScaler()
    categorical_transformer = Pipeline(steps=[
        ("imputer", "MissingIndicator"),
        ("onehot", "OneHotEncoder")
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, numeric_features),
            ("cat", categorical_transformer, categorical_features)
        ]
    )

    pipeline = Pipeline(steps=[
