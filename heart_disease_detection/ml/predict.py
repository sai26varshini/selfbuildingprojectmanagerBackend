# ml/predict.py

import logging
from typing import Dict
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from joblib import dump, load
from db import SessionLocal
from models import Patient
from schemas import Patient as PatientSchema

logging.basicConfig(
    format="%(asctime)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)

def load_model(model_path: str) -> Pipeline:
    """Load saved model from file."""
    return load(model_path)

def predict(patient: PatientSchema, model: Pipeline) -> Dict[str, float]:
    """Make prediction using the loaded model."""
    # Assuming the model is a pipeline with a ColumnTransformer and a RandomForestClassifier
    # We need to transform the input data first
    transformed_data = model['preprocessor'].transform([[patient.age, patient.sex]])
    prediction = model['classifier'].predict(transformed_data)
    return {'prediction': prediction[0]}

def main():
    # Load the saved model
    model_path = 'ml/model.joblib'
    model = load_model(model_path)

    # Create a new database session
    session = SessionLocal()

    # Get the patient data from the database
    patient = session.query(Patient).first()

    # Make a prediction using the loaded model
    prediction = predict(patient, model)

    # Print the prediction
    logging.info(f"Prediction: {prediction}")

if __name__ == "__main__":
    main()
