from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import get_db
from models import Crop
from schemas import CropSchema

router = APIRouter()

@router.get("/crops/", response_model=list[CropSchema])
async def read_crops(db: Session = Depends(get_db)):
    return db.query(Crop).all()

@router.get("/crops/{crop_id}", response_model=CropSchema)
async def read_crop(crop_id: int, db: Session = Depends(get_db)):
    crop = db.query(Crop).filter(Crop.id == crop_id).first()
    if crop is None:
        raise HTTPException(status_code=404, detail="Crop not found")
    return crop

@router.post("/crops/", response_model=CropSchema)
async def create_crop(crop: CropSchema, db: Session = Depends(get_db)):
    db_crop = Crop(**crop.dict())
    db.add(db_crop)
    db.commit()
    db.refresh(db_crop)
    return db_crop

@router.put("/crops/{crop_id}", response_model=CropSchema)
async def update_crop(crop_id: int, crop: CropSchema, db: Session = Depends(get_db)):
    db_crop = db.query(Crop).filter(Crop.id == crop_id).first()
    if db_crop is None:
        raise HTTPException(status_code=404, detail="Crop not found")
    for attr, value in crop.dict().items():
        setattr(db_crop, attr, value)
    db.commit()
    db.refresh(db_crop)
    return db_crop

@router.delete("/crops/{crop_id}")
async def delete_crop(crop_id: int, db: Session = Depends(get_db)):
    db_crop = db.query(Crop).filter(Crop.id == crop_id).first()
    if db_crop is None:
        raise HTTPException(status_code=404, detail="Crop not found")
    db.delete(db_crop)
    db.commit()
    return {"message": "Crop deleted successfully"}
