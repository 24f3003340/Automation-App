from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from .. import models, database, auth

router = APIRouter(
    prefix="/business",
    tags=["business"],
)

class BusinessProfileBase(BaseModel):
    business_name: str
    niche: str
    products: str
    tone_of_voice: str
    location: Optional[str] = None

class BusinessProfileCreate(BusinessProfileBase):
    pass

class BusinessProfileResponse(BusinessProfileBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True

@router.post("/profile", response_model=BusinessProfileResponse)
def create_or_update_profile(
    profile: BusinessProfileCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    db_profile = db.query(models.BusinessProfile).filter(models.BusinessProfile.user_id == current_user.id).first()
    
    if db_profile:
        # Update
        for key, value in profile.dict().items():
            setattr(db_profile, key, value)
    else:
        # Create
        db_profile = models.BusinessProfile(**profile.dict(), user_id=current_user.id)
        db.add(db_profile)
    
    db.commit()
    db.refresh(db_profile)
    return db_profile

@router.get("/profile", response_model=BusinessProfileResponse)
def get_profile(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    db_profile = db.query(models.BusinessProfile).filter(models.BusinessProfile.user_id == current_user.id).first()
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return db_profile
