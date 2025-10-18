# ml/data_loader.py

import pandas as pd
from sqlalchemy import create_engine
from typing import Dict, Any

SQLALCHEMY_DATABASE_URL = "sqlite:///agriculture.db"
engine = create_engine(...)  # defined in db.py

def load_data() -> pd.DataFrame:
    """Loads data from the database into a pandas DataFrame."""
    with engine.connect() as conn:
        query = "SELECT * FROM crops"
        df = pd.read_sql_query(query, conn)
    return df

def preprocess_data(df: pd.DataFrame) -> pd.DataFrame:
    """Preprocesses the data by dropping any unnecessary columns."""
    # Assuming 'id' is the primary key and doesn't need to be dropped
    return df.drop(columns=['id'])

def split_data(df: pd.DataFrame) -> Dict[str, Any]:
    """Splits the data into training and testing sets."""
    X = df.drop(columns=['name', 'description'])
    y = df['name']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    return {
        'X_train': X_train,
        'X_test': X_test,
        'y_train': y_train,
        'y_test': y_test
    }
