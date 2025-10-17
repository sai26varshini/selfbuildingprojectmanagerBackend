# utils.py

import logging
from typing import Dict, List
from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import Crop

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_crops(db: Session) -> List[Crop]:
    """Retrieve all crops from the database."""
    return db.query(Crop).all()

def get_crop(db: Session, crop_id: int) -> Crop:
    """Retrieve a crop by ID from the database."""
    return db.query(Crop).filter(Crop.id == crop_id).first()

def create_crop(db: Session, crop: Crop) -> Crop:
    """Create a new crop in the database."""
    db.add(crop)
    db.commit()
    db.refresh(crop)
    return crop

def update_crop(db: Session, crop_id: int, crop: Crop) -> Crop:
    """Update an existing crop in the database."""
    db.query(Crop).filter(Crop.id == crop_id).update(crop)
    db.commit()
    return db.query(Crop).filter(Crop.id == crop_id).first()

def delete_crop(db: Session, crop_id: int) -> None:
    """Delete a crop from the database."""
    db.query(Crop).filter(Crop.id == crop_id).delete()
    db.commit()

def validate_crop(crop: Dict) -> None:
    """Validate a crop dictionary."""
    required_fields = ["id", "name", "description"]
    if not all(field in crop for field in required_fields):
        raise HTTPException(status_code=400, detail="Invalid crop data")
