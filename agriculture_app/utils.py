# utils.py

import logging
from typing import Dict, Any
from fastapi import HTTPException
from pydantic import BaseModel
from db import SessionLocal

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def validate_crop_data(data: Dict[str, Any]) -> CropSchema:
    try:
        return CropSchema(**data)
    except Exception as e:
        logger.error(f"Invalid crop data: {e}")
        raise HTTPException(status_code=400, detail="Invalid crop data")

def validate_crop_id(id: int) -> None:
    if id <= 0:
        raise HTTPException(status_code=400, detail="Invalid crop ID")
