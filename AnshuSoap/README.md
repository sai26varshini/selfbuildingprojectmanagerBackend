pip install fastapi sqlalchemy pydantic uvicorn
touch anshu_soap.db
uvicorn main:app --host 0.0.0.0 --port 8000
npm install
npm start
from fastapi import FastAPI
from routes import router

# (Removed duplicate FastAPI app)
app.include_router(router)
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///anshu_soap.db"
engine = create_engine(...)  # defined in db.py
# SessionLocal in db.py
from db import Base
from sqlalchemy import Column, Integer, String

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
from pydantic import BaseModel
from models import User

class UserSchema(BaseModel):
    id: int
    username: str

class UserCreateSchema(BaseModel):
    username: str
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import get_db
from models import User
from schemas import UserSchema, UserCreateSchema

router = APIRouter()

@router.get("/users")
async def read_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.post("/users")
async def create_user(user: UserCreateSchema, db: Session = Depends(get_db)):
    db_user = User(username=user.username)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
import logging
from typing import Dict, Any
from fastapi import HTTPException
from sqlalchemy.orm import Session
from db import SessionLocal

logging.basicConfig(level=logging.INFO)
from typing import List, Dict, Any
from db import SessionLocal
from models import User
from schemas import UserSchema, UserCreateSchema

def get_user(db: SessionLocal, user_id: int) -> User:
    return db.query(User).filter(User.id == user_id).first()
{
  "name": "anshu-soap",
  "version": "1.0.0",
  "description": "Anshu Soap Web Application",
  "main": "index.js",
  "scripts": {
    "start": "react-scripts start"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.4.2",
    "axios": "^0.27.2"
  }
}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anshu Soap</title>
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        setError(error.message);
      });
  }, []);

  return (
    <div>
      <h1>Anshu Soap</h1>
      {loading ? <p>Loading...</p> : (
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App;
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/users">Users</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="
