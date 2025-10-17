# ml/train.py

import logging
from typing import Dict, List
from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import Crop
from schemas import CropSchema
from ml.model import RandomForestClassifier
from data_loader import load_data

logging.basicConfig(level=logging.INFO)

def train_model():
    # Load data
    data = load_data()
    
    # Split data into features and labels
    features = data.drop(["label"], axis=1)
    labels = data["label"]
    
    # Scale features
    scaler = StandardScaler()
    features_scaled = scaler.fit_transform(features)
    
    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(features_scaled, labels, test_size=0.2, random_state=42)
    
    # Train model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    logging.info(f"Model accuracy: {accuracy:.2f}")
    
    # Save model
    model.save("model.pkl")
    
    # Save artifacts
    CropSchema.__fields__["id"].description = "Model ID"
    CropSchema.__fields__["name"].description = "Model name"
    CropSchema.__fields__["description"].description = "Model description"
    
    crop_schema = CropSchema(id=1, name="Random Forest Classifier", description="Trained on agriculture data")
    db = SessionLocal()
    db.add(crop_schema)
    db.commit()
    db.close()

if __name__ == "__main__":
    train_model()
