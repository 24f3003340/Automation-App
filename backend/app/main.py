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

import os
import google.generativeai as genai
from pydantic import BaseModel
from typing import List

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Temporary In-Memory DB
posts_db = []

class PostRequest(BaseModel):
    topic: str
    platform: str
    tone: str

@app.post("/generate-post")
def generate_post(request: PostRequest):
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = f"Write a {request.tone} social media post for {request.platform} about {request.topic}. Keep it engaging and under 280 characters if for Twitter."
    
    response = model.generate_content(prompt)
    generated_content = response.text.strip()
    
    # Save to temporary DB
    new_post = {
        "id": len(posts_db) + 1,
        "title": request.topic,
        "content": generated_content,
        "platform": request.platform,
        "status": "draft",
        "scheduled_time": None
    }
    posts_db.append(new_post)
    
    return {"content": generated_content}

@app.get("/posts")
def get_posts():
    return posts_db

# Include Routers (We will create these later)
app.include_router(auth.router)
app.include_router(business.router)
app.include_router(marketing.router)
app.include_router(scheduler.router)
app.include_router(chatbot.router)
