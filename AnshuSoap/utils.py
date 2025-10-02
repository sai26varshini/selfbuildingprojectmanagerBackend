# utils.py
import logging
from typing import Dict, Any
from fastapi import HTTPException
from sqlalchemy.orm import Session
from db import SessionLocal

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_db() -> SessionLocal:
    """Get a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def validate_user_input(data: Dict[str, Any]) -> None:
    """Validate user input."""
    if not data.get("username"):
        raise HTTPException(status_code=400, detail="Username is required")

def get_user(db: Session, user_id: int) -> Dict[str, Any]:
    """Get a user by ID."""
    return db.query(db.models.User).filter(db.models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str) -> Dict[str, Any]:
    """Get a user by username."""
    return db.query(db.models.User).filter(db.models.User.username == username).first()
