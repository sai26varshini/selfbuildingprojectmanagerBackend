# utils.py

import logging
from typing import Dict, List
import os

# Set up logging
logging.basicConfig(
    format="%(asctime)s - %(levelname)s - %(message)s",
    level=logging.INFO,
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)

def get_env_var(var_name: str, default: str) -> str:
    """Get environment variable or default value."""
    return os.getenv(var_name, default)

def load_config() -> Dict:
    """Load configuration from environment variables."""
    config = {
        "database_url": get_env_var("DATABASE_URL", "sqlite:///heart_disease.db")
    }
    return config

def get_db() -> object:
    """Get database session."""
    from db import SessionLocal
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_patient_schema() -> object:
    """Get patient schema."""
    from schemas import Patient
    return Patient
