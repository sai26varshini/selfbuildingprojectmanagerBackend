from db import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class Crop(Base):
    __tablename__ = "crops"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)

class Farm(Base):
    __tablename__ = "farms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)
    crops = relationship("Crop", back_populates="farm")

class Soil(Base):
    __tablename__ = "soils"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)

class Weather(Base):
    __tablename__ = "weathers"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, unique=True, index=True)
    temperature = Column(Integer)
    precipitation = Column(Integer)
