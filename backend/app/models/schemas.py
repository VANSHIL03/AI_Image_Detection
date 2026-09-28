from pydantic import BaseModel, Field
from typing import Optional, Any
from datetime import datetime

# --- Forensics & Explainability Sub-schemas ---
class ForensicFeatures(BaseModel):
    ela_mean_error: float = Field(..., description="Error Level Analysis mean compression discrepancy")
    ela_max_error: float = Field(..., description="Maximum localized compression error")
    fft_high_freq_ratio: float = Field(..., description="High-frequency spectral energy ratio")
    fft_spectral_skew: float = Field(..., description="Spectral symmetry/skewness")
    noise_variance: float = Field(..., description="Flat patch sensor noise variance")
    color_saturation: Optional[float] = Field(0.0, description="Mean HSV color saturation")
    color_channel_discrepancy: float = Field(..., description="Inter-channel correlation mismatch")
    glcm_contrast: float = Field(..., description="Gray-Level Co-occurrence contrast")
    glcm_homogeneity: float = Field(..., description="Gray-Level Co-occurrence homogeneity")


class VideoFrameAnalysis(BaseModel):
    frame_index: int
    timestamp_seconds: float
    ai_probability: float
    human_probability: float
    is_suspicious: bool
    frame_thumbnail_base64: Optional[str] = None
    gradcam_thumbnail_base64: Optional[str] = None

# --- Detection Response Schemas ---
class ImageDetectionResponse(BaseModel):
    analysis_id: str
    filename: str
    prediction: str  # "AI-Generated", "Likely Human-Generated", "Uncertain"
    ai_probability: float
    human_probability: float
    confidence_score: float
    verdict_summary: str
    model_name: str
    model_version: str
    processing_time_ms: float
    forensic_features: ForensicFeatures
    gradcam_overlay_base64: Optional[str] = None
    ela_overlay_base64: Optional[str] = None
    fft_spectrum_base64: Optional[str] = None
    limitations: list[str]
    created_at: datetime

class VideoDetectionResponse(BaseModel):
    analysis_id: str
    filename: str
    prediction: str
    ai_probability: float
    human_probability: float
    confidence_score: float
    verdict_summary: str
    model_name: str
    model_version: str
    processing_time_ms: float
    total_frames_extracted: int
    analyzed_frames_count: int
    suspicious_frames_count: int
    temporal_consistency_score: float
    timeline: list[VideoFrameAnalysis]
    top_suspicious_frames: list[VideoFrameAnalysis]
    limitations: list[str]
    created_at: datetime

# --- History & Dashboard Schemas ---
class AnalysisHistoryItem(BaseModel):
    id: str
    media_type: str
    filename: str
    prediction: str
    ai_probability: float
    confidence: float
    processing_time_ms: float
    created_at: datetime

class DashboardStatsResponse(BaseModel):
    total_analyses: int
    total_images: int
    total_videos: int
    ai_generated_count: int
    human_generated_count: int
    uncertain_count: int
    avg_processing_time_ms: float
    recent_activity: list[AnalysisHistoryItem]
    verdict_distribution: dict[str, int]
    daily_volume: list[dict[str, Any]]

# --- Model Info & Benchmark Schemas ---
class ModelEvaluationResponse(BaseModel):
    model_name: str
    model_version: str
    dataset_name: str
    total_samples: int
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: float
    confusion_matrix: list[list[int]]
    roc_curve: list[dict[str, float]]
    pr_curve: list[dict[str, float]]
    training_history: list[dict[str, Any]]
    hardware_accelerator: str

class HealthResponse(BaseModel):
    status: str
    version: str
    gpu_available: bool
    gpu_name: Optional[str] = None
    cuda_version: Optional[str] = None
    active_device: str
    database_status: str
