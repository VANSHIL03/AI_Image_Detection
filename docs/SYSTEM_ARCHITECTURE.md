# AuraLens AI: System Architecture Specification

## 1. High-Level Architectural Overview

AuraLens AI implements a decoupled client-server architecture designed for high throughput, modular extensibility, and explainable forensic decision-making.

```mermaid
sequenceDiagram
    autonumber
    actor User as Investigator / User
    participant UI as React 18 + Vite (Port 5173)
    participant API as FastAPI Backend (Port 8000)
    participant Sec as Security & Validator
    participant Forensics as Forensic Feature Extractor
    participant DL as PyTorch CNN Backbone (CUDA)
    participant XAI as Grad-CAM Engine
    participant DB as SQLite (forensics.db)

    User->>UI: Uploads Media (Image / Video)
    UI->>API: POST /api/detect/image or /video
    API->>Sec: Validate magic bytes & file size
    Sec-->>API: File validated
    
    par Multi-Signal Processing
        API->>Forensics: Compute ELA, 2D-FFT, Noise Variance, GLCM
        Forensics-->>API: Forensic feature vector + Base64 overlays
    and Deep Learning Forward Pass
        API->>DL: Preprocessed Tensor [1, 3, 224, 224]
        DL-->>API: Raw logits & feature activations
    end

    API->>XAI: Backpropagate gradients to conv_head
    XAI-->>API: Normalized Grad-CAM heatmap overlay

    API->>API: Compute calibrated probability & uncertainty verdict
    API->>DB: Persist AnalysisRecord
    API-->>UI: Return JSON Response + Heatmaps + Timeline
    UI-->>User: Render Interactive Visualizations & Audit Report
```

## 2. Directory & Component Mapping

| Directory / File | Layer | Primary Responsibility |
| :--- | :--- | :--- |
| `backend/app/main.py` | Controller | FastAPI lifecycle, CORS, background worker registration. |
| `backend/app/api/endpoints.py` | Controller | REST route handlers, request validation, database transactions. |
| `backend/app/services/image_detector.py` | Service / ML | EfficientNet-B0 inference, temperature scaling, probability fusion. |
| `backend/app/services/video_detector.py` | Service / ML | OpenCV frame sampling, batch GPU tensor scoring, temporal variance. |
| `backend/app/services/feature_extractor.py` | Service / Forensics | 2D-FFT power spectrum, Error Level Analysis (ELA), Laplacian noise. |
| `backend/app/services/gradcam.py` | Service / XAI | PyTorch hook management, gradient backprop, colormap blending. |
| `backend/app/database.py` | Persistence | Async SQLite engine with SQLAlchemy 2.0. |
| `frontend/src/pages/` | View / UI | Home, Image Forensics, Video Analyzer, Dashboard, History, Evaluation, About. |
| `frontend/src/components/` | View / UI | FileUpload, ResultCard, GradCamViewer, VideoTimeline, ReportModal. |
| `models/metadata.json` | Metadata | Model specifications, threshold configurations, evaluation benchmarks. |
