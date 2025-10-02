pip install fastapi uvicorn sqlalchemy pydantic
python db.py
npm install
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
npm start
from fastapi import FastAPI
from routes import router

# (Removed duplicate FastAPI app)
app.include_router(router)
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///ramu.db"
engine = create_engine(...)  # defined in db.py
# SessionLocal in db.py
from db import Base
from sqlalchemy import Column, Integer, String

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
from pydantic import BaseModel
from models import User

class UserSchema(BaseModel):
    id: int
    name: str

class UserCreateSchema(BaseModel):
    name: str
from fastapi import APIRouter, Depends, HTTPException
from db import get_db
from models import User
from schemas import UserSchema, UserCreateSchema

router = APIRouter()

@router.get("/users/", response_model=list[UserSchema])
async def read_users(db: SessionLocal = Depends(get_db)):
    return db.query(User).all()
import logging
from typing import Dict, List, Optional
from fastapi import HTTPException
from sqlalchemy.orm import Session
from db import SessionLocal
from models import User

def get_user(db: SessionLocal, user_id: int):
    return db.query(User).filter(User.id == user_id).first()
from typing import List
from db import SessionLocal
from models import User
from schemas import UserSchema

class UserService:
    def __init__(self, db: SessionLocal):
        self.db = db

    def get_users(self):
        return self.db.query(User).all()
{
  "name": "ramu",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@types/jest": "^28.1.10",
    "@types/node": "^16.11.38",
    "@types/react": "^18.0.24",
    "@types/react-dom": "^18.0.8",
    "axios": "^0.25.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.7.4",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ramu</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () =>
