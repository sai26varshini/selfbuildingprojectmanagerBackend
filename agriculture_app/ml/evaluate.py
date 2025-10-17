# ml/evaluate.py

from typing import Dict, List
from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import Crop
from ml.model import load_model
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

def evaluate_model(db: Session, model: object, test_data: List[Crop], labels: List[int]) -> Dict:
    """
    Evaluate the performance of the model on the test data.
    
    Args:
    - db: Database session.
    - model: Trained model.
    - test_data: Test data.
    - labels: True labels.
    
    Returns:
    - A dictionary containing the evaluation metrics.
    """
    predictions = model.predict(test_data)
    accuracy = accuracy_score(labels, predictions)
    report = classification_report(labels, predictions)
    matrix = confusion_matrix(labels, predictions)
    
    return {
        "accuracy": accuracy,
        "classification_report": report,
        "confusion_matrix": matrix
    }

def load_and_evaluate_model(db: Session) -> Dict:
    """
    Load the trained model and evaluate its performance on the test data.
    
    Args:
    - db: Database session.
    
    Returns:
    - A dictionary containing the evaluation metrics.
    """
    model = load_model()
    test_data = db.query(Crop).all()
    labels = [crop.id for crop in test_data]
    
    return evaluate_model(db, model, test_data, labels)

def main():
    db = SessionLocal()
    metrics = load_and_evaluate_model(db)
    db.close()
    
    print("Evaluation Metrics:")
    print("Accuracy:", metrics["accuracy"])
    print("Classification Report:")
    print(metrics["classification_report"])
    print("Confusion Matrix:")
    print(metrics["confusion_matrix"])

if __name__ == "__main__":
    main()
