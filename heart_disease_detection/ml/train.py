# ml/train.py
import logging
from typing import Dict
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from data_loader import load_data
from models import RandomForestModel

logging.basicConfig(
    format="%(asctime)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)

def train_model() -> None:
    X, y = load_data()
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    numeric_features = ['age', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal']
    categorical_features = ['sex', 'cp', 'restecg', 'exang', 'ca', 'thal']

    numeric_transformer = StandardScaler()
    categorical_transformer = Pipeline(steps=[
        ('imputer', 'MissingIndicator'),
        ('onehot', 'OneHotEncoder')
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ]
    )

    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=100))
    ])

    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred)
    matrix = confusion_matrix(y_test, y_pred)

    logging.info(f"Model Accuracy: {accuracy:.3f}")
    logging.info(f"Classification Report:\n{report}")
    logging.info(f"Confusion Matrix:\n{matrix}")

    model.save("model.pkl")

if __name__ == "__main__":
    train_model()
