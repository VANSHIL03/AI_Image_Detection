# 🚀 Deployment Guide: Deploying AuraLens AI

This guide explains how to deploy **AuraLens AI** with the Frontend on **Vercel** and the FastAPI/PyTorch Backend on a cloud provider (such as **Render**, **Railway**, or **Hugging Face Spaces**).

---

## 🏗️ Architecture Overview

| Component | Technology | Best Hosting Provider |
| :--- | :--- | :--- |
| **Frontend UI** | React 18 + Vite + Tailwind CSS | **Vercel** (Free, Global CDN, SSL) |
| **AI Backend API** | FastAPI + PyTorch + OpenCV + CUDA/CPU | **Render** / **Railway** / **Fly.io** |

> **Why split them?**
> Vercel is optimized for frontend static/SPA builds and lightweight serverless functions (under 50MB). The backend uses PyTorch and OpenCV (~800MB machine learning dependencies), which runs best on container/service hosts like Render, Railway, or Hugging Face.

---

## 📦 Part 1: Deploy Backend (FastAPI + PyTorch)

### Option A: Deploy on Render (Recommended & Free)

1. Create a free account at [render.com](https://render.com).
2. Push your project code to a **GitHub repository**.
3. On Render Dashboard:
   - Click **New +** → **Web Service**.
   - Connect your GitHub repository.
   - Configure settings:
     - **Name**: `auralens-backend`
     - **Language**: `Python 3`
     - **Root Directory**: `backend` (or leave blank if using Docker)
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
     - **Environment Variable**: `PYTHONPATH=.`
4. Click **Deploy Web Service**.
5. Once deployed, copy your backend URL (e.g., `https://auralens-backend.onrender.com`).

---

## ⚡ Part 2: Deploy Frontend on Vercel

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Configure Vercel deployment and clean enterprise UI"
git push origin main
```

### Step 2: Import Project on Vercel

1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your **GitHub repository**.

### Step 3: Configure Project Settings

- **Framework Preset**: `Vite`
- **Root Directory**: Click *Edit* and select `frontend` (or leave default if importing the whole repo with the included `vercel.json`).
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 4: Add Backend URL Environment Variable

Under **Environment Variables**, add:
- **Key**: `VITE_API_URL`
- **Value**: `https://auralens-backend.onrender.com` *(Replace with your deployed backend URL from Part 1)*

### Step 5: Deploy

Click **Deploy**!
In under 60 seconds, your site will be live at `https://your-project.vercel.app`.

---

## 💻 Part 3: Deploying Frontend directly via Vercel CLI (Optional)

If you prefer deploying directly from your terminal using Vercel CLI:

```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Navigate to frontend directory
cd frontend

# 3. Deploy
vercel
```

Follow the on-screen prompts to log in and select your Vercel team.

---

## ✅ Verification Checklist

- [x] `vercel.json` configured for SPA client-side routing.
- [x] Dynamic API Base URL configured via `VITE_API_URL`.
- [x] CORS enabled on FastAPI backend for cross-origin requests.
- [x] Production build passes with 0 errors (`npm run build`).
