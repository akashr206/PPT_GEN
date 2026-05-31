from importlib import reload
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv


from middleware.auth_middleware import AuthMiddleware
from routes.ppt import router as ppt_router
from routes.user import router as user_router

load_dotenv()

app = FastAPI(
    title="PPT Gen Engine API",
    description="Backend service for generating PowerPoints and logging execution in Neon DB",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(AuthMiddleware)
app.include_router(ppt_router)
app.include_router(user_router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "PPT Gen Engine API",
        "database": "Neon DB Integrated"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8080)
