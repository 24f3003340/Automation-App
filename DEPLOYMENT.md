# Deployment Guide for BizMate

This guide will help you deploy the **BizMate** application to the internet using free tiers of popular hosting providers.

## 1. Prerequisites

- **GitHub Account** (to host your code)
- **Vercel Account** (for Frontend)
- **Render Account** (for Backend)
- **Supabase or Neon Account** (for Database)

## 2. Push Code to GitHub

1.  Create a new repository on GitHub (e.g., `bizmate-saas`).
2.  Push your local code to this repository:
    ```bash
    git init
    git add .
    git commit -m "Initial commit for deployment"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/bizmate-saas.git
    git push -u origin main
    ```

## 3. Database Setup (Supabase / Neon)

1.  Create a new project on **Supabase** or **Neon**.
2.  Get the **Connection String** (PostgreSQL URL). It will look like:
    `postgresql://user:password@host:port/database`
3.  Save this URL, you will need it for the Backend deployment.

## 4. Backend Deployment (Render)

1.  Log in to **Render**.
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  Select the `backend` folder as the **Root Directory** (Important!).
5.  **Build Command:** `pip install -r requirements.txt`
6.  **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port 10000`
7.  **Environment Variables:**
    - `DATABASE_URL`: (Paste your Supabase/Neon connection string here)
    - `GEMINI_API_KEY`: (Paste your Google Gemini API Key here)
    - `PYTHON_VERSION`: `3.10.0` (Optional, good practice)
8.  Click **Create Web Service**.
9.  Wait for deployment. Render will give you a public URL (e.g., `https://bizmate-backend.onrender.com`). **Copy this URL.**

## 5. Frontend Deployment (Vercel)

1.  Log in to **Vercel**.
2.  Click **Add New** -> **Project**.
3.  Import your GitHub repository.
4.  **Framework Preset:** Next.js (should detect automatically).
5.  **Root Directory:** Edit checking to select `frontend`.
6.  **Environment Variables:**
    - `NEXT_PUBLIC_API_URL`: (Paste your Backend URL from Step 4, e.g., `https://bizmate-backend.onrender.com`)
    - **Do NOT add a trailing slash** `/` at the end.
7.  Click **Deploy**.

## 6. Final Test

1.  Open your Vercel URL (e.g., `https://bizmate-frontend.vercel.app`).
2.  Try Signing Up.
3.  Check if Dashboard loads.
4.  Try generating content.

**Congratulations! Your SaaS is now live. 🚀**
