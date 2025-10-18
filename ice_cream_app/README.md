pip install fastapi sqlalchemy uvicorn
sqlite3 ice_cream_app.db
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
SQLALCHEMY_DATABASE_URL = "sqlite:///ice_cream_app.db"
engine = create_engine(...)  # defined in db.py
# SessionLocal in db.py
from db import Base
from sqlalchemy import Column, Integer, String
class Flavor(Base):
    __tablename__ = "flavors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
from pydantic import BaseModel
from models import Flavor
class FlavorSchema(BaseModel):
    id: int
    name: str
class FlavorCreateSchema(FlavorSchema):
    pass
from fastapi import APIRouter, Depends, HTTPException
from db import get_db
from models import Flavor
from schemas import FlavorSchema, FlavorCreateSchema
router = APIRouter()
@router.get("/flavors/", response_model=list[FlavorSchema])
def read_flavors(db: SessionLocal = Depends(get_db)):
    return db.query(Flavor).all()
import logging
from typing import List, Dict
from db import SessionLocal
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
from typing import List
from db import SessionLocal
from models import Flavor
from schemas import FlavorSchema
class FlavorService:
    def get_flavors(self, db: SessionLocal) -> List[FlavorSchema]:
        return db.query(Flavor).all()
{
  "name": "ice_cream_app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "axios": "^0.24.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.7.4"
  },
  "devDependencies": {
    "@types/node": "^18.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@types/react-scripts": "5.0.13",
    "typescript": "^4.7.4"
  }
}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ice Cream App</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
import React, { useState, useEffect } from 'react';
import axios from 'axios';
function App() {
  const [flavors, setFlavors] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:8000/flavors/')
      .then(response => {
        setFlavors(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  return (
    <div>
      <h1>Ice Cream App</h1>
      <ul>
        {flavors.map(flavor => (
          <li key={flavor.id}>{flavor.name}</li>
        ))}
      </ul>
    </div>
  );
}
export default App;
import React from 'react';
const Header = () => {
  return (
    <header>
      <h1>Ice Cream App</h1>
    </header>
  );
};
export default Header;
import React from '
