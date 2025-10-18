# ml/evaluate.py
import logging
from typing import Dict
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from ml.model import pipeline

logging.basicConfig(
    format="%(asctime)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)

def evaluate_model(model: str, X_test: Dict, y_test: Dict) -> None:
    """
    Evaluate the performance of the trained model on the test data.

    Args:
    - model (str): The name of the model to evaluate.
    - X_test (Dict): The test features.
    - y_test (Dict): The test labels.
    """
    # Make predictions on the test data
    y_pred = pipeline.predict(X_test)

    # Compute accuracy
    accuracy = accuracy_score(y_test, y_pred)
    logging.info(f"Accuracy: {accuracy:.3f}")

    # Compute classification report
    report = classification_report(y_test, y_pred)
    logging.info(f"Classification Report:\n{report}")

    # Compute confusion matrix
    matrix = confusion_matrix(y_test, y_pred)
    logging.info(f"Confusion Matrix:\n{matrix}")

def main() -> None:
    # Load the trained model
    # Assuming the model is saved in a file called 'model.pkl'
    from joblib import load
    pipeline = load('model.pkl')

    # Load the test data
    from sklearn.datasets import load_heart_disease
    heart_disease = load_heart_disease()
    X_test = heart_disease.data
    y_test = heart_disease.target

    # Evaluate the model
    evaluate_model("Random Forest", X_test, y_test)

if __name__ == "__main__":
    main()
