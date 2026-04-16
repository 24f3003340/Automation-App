from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import random
import os
import google.generativeai as genai
from .. import models, database, auth
from sqlalchemy.orm import Session
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    
router = APIRouter(
    prefix="/marketing",
    tags=["marketing"],
)

class ContentRequest(BaseModel):
    topic: str
    tone: Optional[str] = "Professional"

class GeneratedContent(BaseModel):
    title: str
    content: str
    hashtags: List[str]
    image_prompt: str

@router.post("/generate", response_model=GeneratedContent)
def generate_content(
    request: ContentRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    profile = db.query(models.BusinessProfile).filter(models.BusinessProfile.user_id == current_user.id).first()
    business_context = ""
    if profile:
        business_context = f"for {profile.business_name} ({profile.niche})"

    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"""
        You are an expert social media marketer {business_context}.
        Write a highly empathetic and engaging post with a '{request.tone}' tone about '{request.topic}'.
        Make the post compelling, properly formatted with spacing.
        
        Also provide a short catchy title, appropriate hashtags, and a detailed image generation prompt.
        
        Respond ONLY with a JSON object in this exact structure:
        {{
            "title": "A catchy title",
            "content": "The generated post content text here",
            "hashtags": ["#tag1", "#tag2", "#tag3"],
            "image_prompt": "A detailed midjourney-style image prompt related to the topic"
        }}
        """
        
        response = model.generate_content(prompt)
        import json
        text_response = response.text
        # Strip out codeblocks if generated
        text_response = text_response.replace("```json", "").replace("```", "").strip()
        data = json.loads(text_response)
        
        return GeneratedContent(
            title=data.get("title", f"Amazing {request.topic} Update"),
            content=data.get("content", "Error parsing generated content."),
            hashtags=data.get("hashtags", ["#bizmate", "#business"]),
            image_prompt=data.get("image_prompt", f"A high-quality image representing {request.topic}")
        )
    except Exception as e:
        print(f"Error in Gemini: {e}")
        # Fallback snippet
        return GeneratedContent(
            title=f"New: {request.topic}",
            content=f"We have exciting news about {request.topic} {business_context}. Stay tuned!",
            hashtags=["#update", "#" + request.topic.replace(" ", "")],
            image_prompt=f"A professional photo for {request.topic}"
        )

