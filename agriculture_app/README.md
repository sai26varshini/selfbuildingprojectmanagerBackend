# README.md
## Project Overview

Agriculture App is a web application that utilizes machine learning to provide insights on crop growth and prediction. The application is built using FastAPI as the backend framework and React as the frontend framework.

## Setup

### Backend

1. Install the required packages by running `pip install -r requirements.txt`
2. Create a SQLite database by running `python db.py`
3. Run the backend server by running `python main.py`

### Frontend

1. Install the required packages by running `npm install`
2. Start the frontend development server by running `npm start`

## Run Instructions

1. Start the backend server by running `python main.py`
2. Start the frontend development server by running `npm start`
3. Open a web browser and navigate to `http://localhost:3000`

## API Endpoints

### Crop Endpoints

* `GET /crops`: Retrieves a list of all crops
* `POST /crops`: Creates a new crop
* `GET /crops/{id}`: Retrieves a crop by ID
* `PUT /crops/{id}`: Updates a crop
* `DELETE /crops/{id}`: Deletes a crop

### Prediction Endpoints

* `POST /predict`: Makes a prediction on a given crop

## Machine Learning Model

The machine learning model is trained using a random forest classifier. The model is trained on a dataset of crop growth patterns and can be used to make predictions on new, unseen data.

## Data Loader

The data loader is responsible for loading the crop growth data from the database and preparing it for use in the machine learning model.

## Requirements

* Python 3.8+
* FastAPI 0.70+
* React 17.0+
* SQLite 3.30+

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please see the contributing guide for more information.

## Authors

* [Your Name]

## Acknowledgments

* [Acknowledgments]

---

# package.json
{
  "name": "agriculture_app",
  "version": "0.1.0",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  },
  "dependencies": {
    "axios": "^0.21.1",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-router-dom": "^5.2.0",
    "react-scripts": "4.0.3"
  }
}

---

# main.py
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from routes import router

# (Removed duplicate FastAPI app)
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

---

# db.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///agriculture.db"
engine = create_engine(...)  # defined in db.py

# SessionLocal in db.py

# Base in db.py

---

# models.py
from db import Base
from sqlalchemy import Column, Integer, String

class Crop(Base):
    __tablename__ = "crops"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)

---

# schemas.py
from pydantic import BaseModel
from models import Crop

class CropSchema(BaseModel):
    id: int
    name: str
    description: str

---

# routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import get_db
from models import Crop
from schemas import CropSchema

router = APIRouter()

@router.get("/crops")
async def read_crops(db: Session = Depends(get_db)):
    return db.query(Crop).all()

@router.post("/crops")
async def create_crop(crop: CropSchema, db: Session = Depends(get_db)):
    db_crop = Crop(name=crop.name, description=crop.description)
    db.add(db_crop)
    db.commit()
    db.refresh(db_crop)
    return db_crop

---

# ml/model.py
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler
from sqlalchemy.orm import Session
from db import SessionLocal

def train_model(db: SessionLocal):
    # Load data from database
    crops = db.query(Crop).all()

    # Preprocess data
    X = []
    y = []
    for crop in crops:
        X.append([crop.name, crop.description])
        y.append(crop.id)

    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train model
    model = RandomForestClassifier()
    model.fit(X_train, y_train)

    # Evaluate model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Accuracy: {accuracy:.2f}")

    return model

---

# ml/train.py
import logging
from typing import Dict, List
from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import Crop
from schemas import CropSchema

def train_model(db: Session):
    # Load data from database
    crops = db.query(Crop).all()

    # Preprocess data
    X = []
    y = []
    for crop in crops:
        X.append([crop.name, crop.description])
        y.append(crop.id)

    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train model
    model = RandomForestClassifier()
    model.fit(X_train, y_train)

    # Evaluate model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Accuracy: {accuracy:.2f}")

    return model

---

# ml/predict.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from ml.model import train_model
from db import SessionLocal
from sqlalchemy.orm
