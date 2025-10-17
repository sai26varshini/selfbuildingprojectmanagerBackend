from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import get_db
from models import Crop
from schemas import CropSchema

router = APIRouter()

@router.get("/crops/")
def read_crops(db: Session = Depends(get_db)):
    return db.query(Crop).all()

@router.get("/crops/{crop_id}")
def read_crop(crop_id: int, db: Session = Depends(get_db)):
    crop = db.query(Crop).filter(Crop.id == crop_id).first()
    if crop is None:
        raise HTTPException(status_code=404, detail="Crop not found")
    return crop

@router.post("/crops/")
def create_crop(crop: CropSchema, db: Session = Depends(get_db)):
    db_crop = Crop(name=crop.name, description=crop.description)
    db.add(db_crop)
    db.commit()
    db.refresh(db_crop)
    return db_crop

@router.put("/crops/{crop_id}")
def update_crop(crop_id: int, crop: CropSchema, db: Session = Depends(get_db)):
    db_crop = db.query(Crop).filter(Crop.id == crop_id).first()
    if db_crop is None:
        raise HTTPException(status_code=404, detail="Crop not found")
    db_crop.name = crop.name
    db_crop.description = crop.description
    db.commit()
    db.refresh(db_crop)
    return db_crop

@router.delete("/crops/{crop_id}")
def delete_crop(crop_id: int, db: Session = Depends(get_db)):
    db_crop = db.query(Crop).filter(Crop.id == crop_id).first()
    if db_crop is None:
        raise HTTPException(status_code=404, detail="Crop not found")
    db.delete(db_crop)
    db.commit()
    return {"message": "Crop deleted"}
