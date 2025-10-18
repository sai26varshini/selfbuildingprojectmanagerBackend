# utils.py
import logging
from typing import List, Dict
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

def get_flavors(db: SessionLocal) -> List[Dict]:
    return db.query(Flavor).all()

def get_flavor(db: SessionLocal, flavor_id: int) -> Dict:
    return db.query(Flavor).filter(Flavor.id == flavor_id).first()

def create_flavor(db: SessionLocal, flavor: Dict) -> Dict:
    db_flavor = Flavor(**flavor)
    db.add(db_flavor)
    db.commit()
    db.refresh(db_flavor)
    return db_flavor

def update_flavor(db: SessionLocal, flavor_id: int, flavor: Dict) -> Dict:
    db_flavor = get_flavor(db, flavor_id)
    if db_flavor:
        for key, value in flavor.items():
            setattr(db_flavor, key, value)
        db.commit()
        db.refresh(db_flavor)
        return db_flavor
    return None

def delete_flavor(db: SessionLocal, flavor_id: int) -> None:
    db_flavor = get_flavor(db, flavor_id)
    if db_flavor:
        db.delete(db_flavor)
        db.commit()
