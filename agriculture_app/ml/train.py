# ml/train.py

import logging
from typing import Dict, Any
from pydantic import BaseModel
from db import SessionLocal
from ml.model import Pipeline, StandardScaler, ColumnTransformer
from data_loader import load_data
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sqlalchemy.orm import sessionmaker

logging.basicConfig(level=logging.INFO)

class TrainConfig(BaseModel):
    test_size: float
    random_state: int

def train_model(config: TrainConfig, db_session: SessionLocal) -> None:
    X, y = load_data(db_session)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=config.test_size, random_state=config.random_state)
    scaler = StandardScaler()
    preprocessor = ColumnTransformer([("scaler", scaler, ["feature1", "feature2"])]
                                     )
    pipeline = Pipeline([("preprocessor", preprocessor), ("classifier", RandomForestClassifier())])
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    logging.info("Accuracy: %f", accuracy_score(y_test, y_pred))
    logging.info("Classification Report:\n %s", classification_report(y_test, y_pred))

def main() -> None:
    config = TrainConfig(test_size=0.2, random_state=42)
    with SessionLocal() as db_session:
        train_model(config, db_session)
        # Save the trained model
        # pipeline = Pipeline([("preprocessor", preprocessor), ("classifier", RandomForestClassifier())])
        # pipeline.fit(X_train, y_train)
        # joblib.dump(pipeline, "model.joblib")

if __name__ == "__main__":
    main()
