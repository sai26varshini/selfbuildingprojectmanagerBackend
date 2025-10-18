from db import Base
from sqlalchemy import Column, Integer, String

class Flavor(Base):
    __tablename__ = "flavors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String, index=True)

class IceCream(Base):
    __tablename__ = "ice_creams"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    flavor_id = Column(Integer, ForeignKey("flavors.id"))
    flavor = Column(String, index=True)
    description = Column(String, index=True)
