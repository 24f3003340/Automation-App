from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, marketing, scheduler, chatbot, business

# Create Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BizMate API", description="Backend for BizMate SaaS", version="1.0.0")

# CORS Setup - Allow all for production
# origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to BizMate API"}

# Include Routers (We will create these later)
app.include_router(auth.router)
app.include_router(business.router)
app.include_router(marketing.router)
app.include_router(scheduler.router)
app.include_router(chatbot.router)
