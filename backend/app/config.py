import os
from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent.parent
BACKEND_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"
WEIGHTS_DIR = MODELS_DIR / "weights"
UPLOADS_DIR = BACKEND_DIR / "temp_uploads"
REPORTS_DIR = BASE_DIR / "reports"

# Ensure required directories exist
WEIGHTS_DIR.mkdir(parents=True, exist_ok=True)
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

class Settings(BaseSettings):
    PROJECT_NAME: str = "AuraLens AI - Image & Video Forensics"
    PROJECT_VERSION: str = "2.0.0"
    API_V1_STR: str = "/api"
    
    # Database
    DATABASE_URL: str = f"sqlite+aiosqlite:///{BACKEND_DIR / 'forensics.db'}"
    SYNC_DATABASE_URL: str = f"sqlite:///{BACKEND_DIR / 'forensics.db'}"
    
    # Model settings
    MODEL_NAME: str = "EfficientNet-B0 + ResNet50 Ensemble & Forensic Feature Fusion"
    MODEL_WEIGHTS_PATH: str = str(WEIGHTS_DIR / "detector_weights.pth")
    MODEL_METADATA_PATH: str = str(MODELS_DIR / "metadata.json")
    
    # Thresholds for classification & uncertainty calibration
    # Probabilities: < 0.35 -> Likely Human, 0.35 - 0.65 -> Uncertain, >= 0.65 -> AI-Generated
    AI_THRESHOLD: float = 0.65
    HUMAN_THRESHOLD: float = 0.35
    
    # Video detection settings
    MAX_VIDEO_DURATION_SECONDS: int = 180
    DEFAULT_FRAME_SAMPLE_RATE_FPS: float = 1.0  # 1 frame per second
    MAX_FRAMES_PER_VIDEO: int = 60
    VIDEO_TOP_K_ANOMALY_FRAMES: int = 5
    
    # File limits
    MAX_IMAGE_SIZE_BYTES: int = 15 * 1024 * 1024  # 15 MB
    MAX_VIDEO_SIZE_BYTES: int = 100 * 1024 * 1024  # 100 MB
    ALLOWED_IMAGE_TYPES: list[str] = ["image/jpeg", "image/png", "image/webp", "image/bmp"]
    ALLOWED_VIDEO_TYPES: list[str] = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/webm", "video/x-matroska"]
    
    # Cleanup settings
    TEMP_FILE_MAX_AGE_MINUTES: int = 30
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = Settings()
