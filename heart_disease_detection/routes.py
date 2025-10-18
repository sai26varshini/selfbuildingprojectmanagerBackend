from fastapi import APIRouter, Depends, HTTPException
from db import SessionLocal
from models import Patient
from schemas import Patient as PatientSchema
from typing import List

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/patients/", response_model=List[PatientSchema])
async def read_patients(db: SessionLocal = Depends(get_db)):
    return db.query(Patient).all()

@router.get("/patients/{patient_id}", response_model=PatientSchema)
async def read_patient(patient_id: int, db: SessionLocal = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.post("/patients/", response_model=PatientSchema)
async def create_patient(patient: PatientSchema, db: SessionLocal = Depends(get_db)):
    db_patient = Patient(**patient.dict())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@router.put("/patients/{patient_id}", response_model=PatientSchema)
async def update_patient(patient_id: int, patient: PatientSchema, db: SessionLocal = Depends(get_db)):
    db_patient = db.query(Patient).filter(Patient.id == patient_id)
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    db_patient.update(patient.dict())
    db.commit()
    return db_patient

@router.delete("/patients/{patient_id}")
async def delete_patient(patient_id: int, db: SessionLocal = Depends(get_db)):
    db_patient = db.query(Patient).filter(Patient.id == patient_id)
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    db.delete(db_patient)
    db.commit()
    return {"message": "Patient deleted successfully"}
