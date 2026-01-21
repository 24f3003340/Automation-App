from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import random
from .. import models, database, auth
from sqlalchemy.orm import Session

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
    # Retrieve business profile for context
    profile = db.query(models.BusinessProfile).filter(models.BusinessProfile.user_id == current_user.id).first()
    business_context = ""
    if profile:
        business_context = f"for {profile.business_name} ({profile.niche})"

    # Mock AI generation logic
    titles = [f"Amazing {request.topic} Offer!", f"Discover {request.topic}", f"Why {request.topic} Matters"]
    contents = [
        f"Get ready for the best {request.topic} {business_context}. Don't miss out!",
        f"We are excited to announce {request.topic}. Visit us today!",
        f"Have you tried {request.topic}? It's a game changer {business_context}."
    ]
    hashtags_list = [["#bizmate", "#growth", "#" + request.topic.replace(" ", "")], ["#offer", "#sale", "#" + profile.niche if profile else "#business"]]
    
    return GeneratedContent(
        title=random.choice(titles),
        content=random.choice(contents),
        hashtags=random.choice(hashtags_list),
        image_prompt=f"A professional photo representing {request.topic} {business_context}, high quality, realistic"
    )

