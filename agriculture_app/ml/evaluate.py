# ml/evaluate.py

import logging
from typing import Dict, Any
from pydantic import BaseModel
from db import SessionLocal
from ml.model import Pipeline
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

logging.basicConfig(level=logging.INFO)

class EvaluationMetrics(BaseModel):
    accuracy: float
    classification_report: Dict[str, Any]
    confusion_matrix: Dict[str, Any]

def evaluate_model(model: Pipeline, X_test: Any, y_test: Any, session: SessionLocal) -> EvaluationMetrics:
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred)
    matrix = confusion_matrix(y_test, y_pred).dict()
    return EvaluationMetrics(accuracy=accuracy, classification_report=report, confusion_matrix=matrix)

def load_trained_model(session: SessionLocal) -> Pipeline:
    # Assuming the trained model is saved in the database
    # This is a placeholder, you should replace it with your actual logic
    # For example, you can load the model from a file or database
    model = Pipeline()
    # Load the model from the database
    # model = session.query(Pipeline).first()
    return model

def main() -> None:
    session = SessionLocal()
    model = load_trained_model(session)
    # Assuming you have the test data loaded
    X_test, y_test = load_data()
    metrics = evaluate_model(model, X_test, y_test, session)
    logging.info(metrics.json())

if __name__ == "__main__":
    main()
