# ml/model.py
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler
from sqlalchemy.orm import Session
from db import SessionLocal
from models import Crop
from schemas import CropSchema
from utils import logging

class AgricultureModel:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100)

    def train(self, db: SessionLocal, X: list, y: list):
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        scaler = StandardScaler()
        X_train = scaler.fit_transform(X_train)
        X_test = scaler.transform(X_test)
        self.model.fit(X_train, y_train)
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        logging.info(f"Model accuracy: {accuracy:.2f}")

    def predict(self, data: CropSchema):
        return self.model.predict(data.__dict__.values())
