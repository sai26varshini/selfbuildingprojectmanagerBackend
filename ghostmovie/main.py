from fastapi import FastAPI
from fastapi.responses import JSONResponse
from routes import router

app = FastAPI()

app.include_router(router)
