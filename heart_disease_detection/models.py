from db import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    age = Column(Integer)
    sex = Column(String)
    cp = Column(Integer)
    trestbps = Column(Integer)
    chol = Column(Integer)
    fbs = Column(Integer)
    restecg = Column(Integer)
    thalach = Column(Integer)
    exang = Column(Integer)
    oldpeak = Column(Integer)
    slope = Column(Integer)
    ca = Column(Integer)
    thal = Column(Integer)
    target = Column(Integer)

class HeartDisease(Base):
    __tablename__ = "heart_disease"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    patient = relationship("Patient", backref="heart_disease")
