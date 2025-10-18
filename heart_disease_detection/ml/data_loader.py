# ml/data_loader.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from typing import Tuple
from db import SessionLocal

def load_data(session: SessionLocal) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Loads the patient data from the database and returns the features and target."""
    patients = session.query("SELECT * FROM patients").all()
    df = pd.DataFrame(patients)
    X = df.drop(["target", "id"], axis=1)
    y = df["target"]
    return X, y

def preprocess_data(X: pd.DataFrame, y: pd.Series) -> Tuple[pd.DataFrame, pd.Series]:
    """Preprocesses the data by scaling the features and splitting the data into training and testing sets."""
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
    return X_train, X_test, y_train, y_test

def load_and_preprocess_data(session: SessionLocal) -> Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    """Loads the patient data from the database, preprocesses the data, and returns the training and testing sets."""
    X, y = load_data(session)
    X_train, X_test, y_train, y_test = preprocess_data(X, y)
    return X_train, X_test, y_train, y_test
