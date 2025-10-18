from fastapi import APIRouter, Depends, HTTPException
from db import get_db
from models import Flavor
from schemas import FlavorSchema, FlavorCreateSchema

router = APIRouter()

@router.get("/flavors/", response_model=list[FlavorSchema])
async def read_flavors(db: Session = Depends(get_db)):
    return db.query(Flavor).all()

@router.get("/flavors/{id}", response_model=FlavorSchema)
async def read_flavor(id: int, db: Session = Depends(get_db)):
    flavor = db.query(Flavor).filter(Flavor.id == id).first()
    if flavor is None:
        raise HTTPException(status_code=404, detail="Flavor not found")
    return flavor

@router.post("/flavors/", response_model=FlavorSchema)
async def create_flavor(flavor: FlavorCreateSchema, db: Session = Depends(get_db)):
    db_flavor = Flavor(name=flavor.name)
    db.add(db_flavor)
    db.commit()
    db.refresh(db_flavor)
    return db_flavor

@router.put("/flavors/{id}", response_model=FlavorSchema)
async def update_flavor(id: int, flavor: FlavorCreateSchema, db: Session = Depends(get_db)):
    db_flavor = db.query(Flavor).filter(Flavor.id == id).first()
    if db_flavor is None:
        raise HTTPException(status_code=404, detail="Flavor not found")
    db_flavor.name = flavor.name
    db.commit()
    db.refresh(db_flavor)
    return db_flavor

@router.delete("/flavors/{id}")
async def delete_flavor(id: int, db: Session = Depends(get_db)):
    db_flavor = db.query(Flavor).filter(Flavor.id == id).first()
    if db_flavor is None:
        raise HTTPException(status_code=404, detail="Flavor not found")
    db.delete(db_flavor)
    db.commit()
    return {"message": "Flavor deleted"}
