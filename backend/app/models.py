from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    business_profile = relationship("BusinessProfile", back_populates="owner", uselist=False)
    posts = relationship("Post", back_populates="owner")
    conversations = relationship("Conversation", back_populates="owner")

class BusinessProfile(Base):
    __tablename__ = "business_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    business_name = Column(String)
    niche = Column(String)
    products = Column(Text)
    tone_of_voice = Column(String)
    location = Column(String, nullable=True)

    owner = relationship("User", back_populates="business_profile")

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    content = Column(Text)
    image_prompt = Column(Text, nullable=True)
    platform = Column(String) # Instagram, Facebook, etc.
    status = Column(String, default="draft") # draft, scheduled, published
    scheduled_time = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="posts")

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    customer_name = Column(String, default="Guest")
    platform = Column(String) # Web, WhatsApp, Instagram
    last_message = Column(Text)
    updated_at = Column(DateTime, default=datetime.utcnow)

    messages = relationship("Message", back_populates="conversation")
    owner = relationship("User", back_populates="conversations")

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    sender = Column(String) # 'user', 'bot', 'customer'
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

    conversation = relationship("Conversation", back_populates="messages")
