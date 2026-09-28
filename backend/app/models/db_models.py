import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, Text, DateTime, JSON, Boolean
from ..database import Base

def utc_now():
    return datetime.now(timezone.utc)


class AnalysisRecord(Base):
    __tablename__ = "analysis_records"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    media_type = Column(String(20), nullable=False)  # "image" or "video"
    filename = Column(String(255), nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    
    # Classification Results
    prediction = Column(String(50), nullable=False)  # "AI-Generated", "Likely Human-Generated", "Uncertain"
    ai_probability = Column(Float, nullable=False)   # 0.0 to 1.0
    human_probability = Column(Float, nullable=False)# 0.0 to 1.0
    confidence = Column(Float, nullable=False)       # 0.0 to 1.0 (calibrated)
    verdict_summary = Column(Text, nullable=True)
    
    # Model Metadata
    model_version = Column(String(100), nullable=False)
    processing_time_ms = Column(Float, nullable=False)
    
    # Explainability & Digital Forensics (JSON blobs)
    forensic_features = Column(JSON, nullable=True)  # ELA, FFT, GLCM, Noise stats
    gradcam_available = Column(Boolean, default=False)
    
    # Video Specific Stats (if video)
    total_frames_extracted = Column(Integer, nullable=True)
    analyzed_frames_count = Column(Integer, nullable=True)
    suspicious_frames_count = Column(Integer, nullable=True)
    temporal_consistency_score = Column(Float, nullable=True)
    timeline_data = Column(JSON, nullable=True)      # Array of {timestamp, frame_idx, ai_prob, is_suspicious}
    
    created_at = Column(DateTime, default=utc_now, nullable=False)

class ModelEvaluationMetric(Base):
    __tablename__ = "model_evaluation_metrics"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    model_name = Column(String(100), nullable=False)
    model_version = Column(String(50), nullable=False)
    dataset_name = Column(String(100), nullable=False)
    total_samples = Column(Integer, nullable=False)
    
    accuracy = Column(Float, nullable=False)
    precision = Column(Float, nullable=False)
    recall = Column(Float, nullable=False)
    f1_score = Column(Float, nullable=False)
    roc_auc = Column(Float, nullable=False)
    
    # Detailed matrix and curve coordinates (stored as JSON)
    confusion_matrix = Column(JSON, nullable=False)  # [[TN, FP], [FN, TP]]
    roc_curve_data = Column(JSON, nullable=True)     # [{fpr: ..., tpr: ...}]
    pr_curve_data = Column(JSON, nullable=True)      # [{precision: ..., recall: ...}]
    training_history = Column(JSON, nullable=True)   # [{epoch, train_loss, val_loss, train_acc, val_acc}]
    
    evaluated_at = Column(DateTime, default=utc_now, nullable=False)

# Ensure tables are registered and created in SQLite
from ..database import sync_engine
Base.metadata.create_all(bind=sync_engine)
