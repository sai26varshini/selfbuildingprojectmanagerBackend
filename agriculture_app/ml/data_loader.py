# ml/data_loader.py

import logging
from typing import Dict, List
from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import Crop
from schemas import CropSchema
from db import SessionLocal
import pandas as pd
import numpy as np

logging.basicConfig(level=logging.INFO)

def load_data(session: Session) -> pd.DataFrame:
    """Load data from database."""
    crops = session.query(Crop).all()
    data = [(crop.id, crop.name, crop.description) for crop in crops]
    df = pd.DataFrame(data, columns=['id', 'name', 'description'])
    return df

def preprocess_data(df: pd.DataFrame) -> pd.DataFrame:
    """Preprocess data by converting description to lowercase."""
    df['description'] = df['description'].str.lower()
    return df

def split_data(df: pd.DataFrame) -> tuple:
    """Split data into training and testing sets."""
    X = df[['name', 'description']]
    y = df['id']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    return X_train, X_test, y_train, y_test

def create_dataset(session: Session) -> Dict:
    """Create dataset by loading, preprocessing, and splitting data."""
    df = load_data(session)
    df = preprocess_data(df)
    X_train, X_test, y_train, y_test = split_data(df)
    return {
        'X_train': X_train,
        'X_test': X_test,
        'y_train': y_train,
        'y_test': y_test
    }
