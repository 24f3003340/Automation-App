# BizMate - AI Business Automation SaaS

BizMate is an all-in-one platform for small businesses to automate marketing, scheduling, and sales using AI.

## Project Structure

- **frontend/**: Next.js application (React)
- **backend/**: FastAPI application (Python)

## Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)

## How to Run the Project

You need to open **two separate terminal windows** (Command Prompt or PowerShell) to run the backend and frontend simultaneously.

### 1. Start the Backend Server

Open the first terminal and run:

```powershell
# Go to backend folder
cd backend

# Activate Virtual Environment (Windows)
.\venv\Scripts\Activate

# Start Server
python -m uvicorn app.main:app --reload
```

The backend will start at: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

### 2. Start the Frontend Application

Open the second terminal and run:

```powershell
# Go to frontend folder
cd frontend

# Start Development Server
npm run dev
```

The frontend will start at: `http://localhost:3000`

## Features

1.  **Marketing Studio**: Generate AI content for social media.
2.  **Smart Scheduler**: Schedule and manage posts.
3.  **Sales Agent**: AI Chatbot simulator to handle customer queries.
4.  **Settings**: Manage your business profile (Niche, Tone, Products).

## Environment Setup

Ensure you have a `.env` file in the `backend/` directory with your Google Gemini API Key:

```
GEMINI_API_KEY=your_api_key_here
```
