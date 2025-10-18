from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi import status
from fastapi import Depends
from fastapi import HTTPException
from fastapi import APIRouter
from routes import router

app = FastAPI()

app.include_router(router)
