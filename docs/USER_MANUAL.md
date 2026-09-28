# AuraLens AI: User Manual & Execution Guide

## 1. Prerequisites
- **Python**: Version 3.10+ (Tested on Python 3.14 with PyTorch CUDA)
- **Node.js**: Version 18+ (Tested on Node v24 with npm 11)
- **GPU (Optional)**: NVIDIA GPU with CUDA support for hardware acceleration (CPU fallback is automatic).

---

## 2. Quick Start (One-Click Launch)

To start both the FastAPI Backend and the React Vite Frontend concurrently, execute:

```bash
python run.py
```

### Access Points:
- **Frontend Web Application**: [http://localhost:5173](http://localhost:5173)
- **Backend REST API**: [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Alternative ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 3. Manual Step-by-Step Start

### Starting Backend:
```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Starting Frontend:
```bash
cd frontend
npm run dev
```

---

## 4. Running the Test Suite

To run all backend unit and integration tests:

```bash
python -m pytest backend/tests/ -v
```

---

## 5. Using the Detection Platform

### 1. Image Forensics:
1. Navigate to the **Image Forensics** tab.
2. Drag and drop any image (`.jpg`, `.png`, `.webp`, `.bmp`) or click "Synthetic AI Sample" / "Authentic Sample" for instant evaluation.
3. Click **Run Detection Pipeline**.
4. View the **Verdict Banner**, probability dials, and forensic metrics.
5. In the **Visualizer**, toggle between **Grad-CAM**, **ELA Matrix**, **2D-FFT Power Spectrum**, and **Side-by-Side** views.
6. Click **Export Audit** to download the JSON forensic audit report or print a copy.

### 2. Video Analysis:
1. Navigate to the **Video Analyzer** tab.
2. Upload a video file (`.mp4`, `.mov`, `.avi`, `.webm`).
3. Adjust the **Frame Sampling Rate** slider (0.5 to 3.0 FPS).
4. Click **Run Video Temporal Pipeline**.
5. Inspect the interactive **Temporal Probability Timeline** and click any extracted keyframe to view its anomaly Grad-CAM overlay.

### 3. Model Evaluation:
1. Navigate to the **Model Metrics** tab to review the 2x2 Confusion Matrix, ROC-AUC curve, and ablation study comparisons for viva presentation.
