import os
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from .config import settings, BASE_DIR
from .database import init_db
from .api.endpoints import router as api_router
from .services.cleanup import cleanup_old_temp_files
from .services.image_detector import image_detector_service

# Background task for periodic temp file cleanup
async def periodic_cleanup():
    while True:
        try:
            await asyncio.sleep(1800)  # Every 30 minutes
            cleanup_old_temp_files()
        except asyncio.CancelledError:
            break
        except Exception as e:
            print(f"[PeriodicCleanup] Error: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Database tables & Warm up model
    print(f"[{settings.PROJECT_NAME}] Initializing database...")
    await init_db()
    print(f"[{settings.PROJECT_NAME}] Active Device: {image_detector_service.device}")
    
    # Start background cleanup task
    cleanup_task = asyncio.create_task(periodic_cleanup())
    
    yield
    
    # Shutdown: cancel cleanup task
    cleanup_task.cancel()
    try:
        await cleanup_task
    except asyncio.CancelledError:
        pass
    print(f"[{settings.PROJECT_NAME}] Shutdown complete.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Deep Learning, Digital Forensics, and Machine Learning Platform for AI-Generated Image & Video Detection",
    lifespan=lifespan
)

# Configure CORS for Vite React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"[Error] Unhandled exception on {request.url.path}: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "detail": str(exc),
            "path": request.url.path
        }
    )

# Register API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "status": "active",
        "docs_url": "/docs",
        "api_prefix": settings.API_V1_STR
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
