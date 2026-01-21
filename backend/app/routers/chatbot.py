from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from .. import models, database, auth
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    available_models = []
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                available_models.append(m.name)
    except Exception as e:
        print(f"Error listing models: {e}")
    
    if available_models:
        print(f"Available models: {available_models}")
        model = genai.GenerativeModel(available_models[0])
        print(f"Selected Model: {available_models[0]}")
    else:
        model = None
        print("WARNING: No suitable Gemini models found or API key invalid.")

else:
    model = None
    print("WARNING: GEMINI_API_KEY not found in environment variables.")

router = APIRouter(
    prefix="/chatbot",
    tags=["chatbot"],
)

class MessageBase(BaseModel):
    content: str
    platform: str = "Web"

class ChatResponse(BaseModel):
    reply: str
    author: str = "BizMate Bot"

@router.post("/send", response_model=ChatResponse)
async def send_message(
    message: MessageBase,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    # Retrieve business profile to customize response
    profile = db.query(models.BusinessProfile).filter(models.BusinessProfile.user_id == current_user.id).first()
    
    business_name = profile.business_name if profile else "our business"
    business_type = profile.niche if profile else "service"
    products = profile.products if profile else "various services"
    tone = profile.tone_of_voice if profile else "professional"
    
    if not model:
         return ChatResponse(reply="AI is currently unavailable. Please check backend configuration.")

    try:
        # Construct Prompt
        prompt = f"""
        You are an AI Sales Agent for a business called '{business_name}'.
        Industry: {business_type}
        Products/Services: {products}
        Tone of Voice: {tone}
        
        Your goal is to be helpful, friendly, and convert inquiries into sales or leads.
        
        User Message: "{message.content}"
        
        Reply as the agent:
        """
        
        print(f"Using Gemini Model: {model.model_name if hasattr(model, 'model_name') else 'Unknown'}")
        response = model.generate_content(prompt)
        reply_text = response.text
        
        return ChatResponse(reply=reply_text)
        
    except Exception as e:
        import traceback
        with open("debug_error.log", "w") as f:
            f.write(str(e) + "\n")
            f.write(traceback.format_exc())
            f.write(f"\nModel Name: {model.model_name if hasattr(model, 'model_name') else 'Unknown'}\n")
        
        print(f"Gemini API Error: {e}")
        return ChatResponse(reply="I'm having trouble thinking right now. Please try again later.")

