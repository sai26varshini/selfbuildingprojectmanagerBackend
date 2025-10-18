# services/service_layer.py

from typing import List
from db import SessionLocal
from models import Flavor
from schemas import FlavorSchema

class FlavorService:
    def get_flavors(self, db: SessionLocal) -> List[FlavorSchema]:
        return db.query(Flavor).all()

    def get_flavor(self, db: SessionLocal, flavor_id: int) -> FlavorSchema:
        return db.query(Flavor).filter(Flavor.id == flavor_id).first()

    def create_flavor(self, db: SessionLocal, flavor: FlavorCreateSchema) -> FlavorSchema:
        db_flavor = Flavor(name=flavor.name)
        db.add(db_flavor)
        db.commit()
        db.refresh(db_flavor)
        return db_flavor

    def update_flavor(self, db: SessionLocal, flavor_id: int, flavor: FlavorCreateSchema) -> FlavorSchema:
        db_flavor = db.query(Flavor).filter(Flavor.id == flavor_id).first()
        if db_flavor:
            db_flavor.name = flavor.name
            db.commit()
            db.refresh(db_flavor)
        return db_flavor

    def delete_flavor(self, db: SessionLocal, flavor_id: int) -> None:
        db_flavor = db.query(Flavor).filter(Flavor.id == flavor_id).first()
        if db_flavor:
            db.delete(db_flavor)
            db.commit()
