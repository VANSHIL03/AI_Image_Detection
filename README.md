# 🛡️ AuraLens AI: AI-Generated Image & Video Detection Platform

[![Python](https://img.shields.io/badge/Python-3.14-blue.svg?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.15-EE4C2C.svg?logo=pytorch&logoColor=white)](https://pytorch.org)
[![CUDA](https://img.shields.io/badge/CUDA-RTX%204050-76B900.svg?logo=nvidia&logoColor=white)](https://developer.nvidia.com/cuda-zone)
[![React](https://img.shields.io/badge/React-18.2-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.1-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **B.Tech Computer Science & Engineering Major Project**  
> A multi-modal synthetic media forensics system combining Deep Convolutional Neural Networks, 2D-FFT frequency spectrum analysis, Error Level Analysis (ELA), Grad-CAM visual explainability, and video temporal consistency pooling.

---

## 🌟 Key Highlights

- **Dual-Mode Detection**: Classifies both static images (JPG, PNG, WebP, BMP) and video sequences (MP4, MOV, AVI, WebM).
- **Multi-Signal Architecture**:
  - **Deep Learning**: Fine-tuned EfficientNet-B0 backbone with transfer learning.
  - **2D-FFT Power Spectrum**: Detects periodic grid spikes and high-frequency power drop-offs left by diffusion upsamplers and GANs.
  - **Error Level Analysis (ELA)**: Identifies JPEG compression inconsistencies across 8x8 DCT blocks.
  - **Laplacian Residual Noise & Texture Homogeneity**: Measures sensor noise and micro-texture patterns.
- **Explainable AI (Grad-CAM)**: Generates heatmaps highlighting image regions that influenced the model's decision.
- **Video Temporal Pooling**: Frame sampling with second-order temporal jitter analysis and Top-K anomaly peak detection.
- **Calibrated Uncertainty**: Classifies media into *AI-Generated*, *Likely Human-Generated*, or *Uncertain/Inconclusive* ($[0.35, 0.65]$).
- **Interactive Full-Stack Web App**: React 18 + Vite + Tailwind UI with Dark/Light mode, live telemetry dashboard, searchable history archive, and exportable audit reports.

---

## 🚀 Quick Start (One Command)

To run both the backend and frontend simultaneously:

```bash
python run.py
```

### URLs:
- **Frontend Web UI**: `http://localhost:5173`
- **Backend API**: `http://localhost:8000`
- **Swagger Interactive Docs**: `http://localhost:8000/docs`

---

## 📁 Repository Structure

```
Image detection/
├── backend/                    # FastAPI REST backend & ML services
│   ├── app/
│   │   ├── main.py             # FastAPI entry point & lifecycle
│   │   ├── config.py           # Paths, thresholds, CORS
│   │   ├── database.py         # SQLite connection & session
│   │   ├── api/endpoints.py    # REST routes (detect, history, stats, metrics)
│   │   ├── models/             # SQLAlchemy tables & Pydantic schemas
│   │   ├── services/           # ImageDetector, VideoDetector, GradCAM, Forensics
│   │   └── utils/              # Security, image & video decoding
│   ├── training/               # Modular PyTorch & Scikit-Learn training pipelines
│   ├── tests/                  # Pytest test suite (API, Image, Video)
│   └── requirements.txt
├── frontend/                   # React 18 + Vite + Tailwind CSS Web Application
│   ├── src/
│   │   ├── components/         # Navbar, Footer, FileUpload, ResultCard, GradCamViewer, VideoTimeline
│   │   ├── pages/              # Home, ImageDetect, VideoDetect, Dashboard, History, ModelEvaluation, About
│   │   └── api/client.js       # Axios client
│   ├── package.json
│   └── vite.config.js
├── models/
│   ├── weights/                # Model weights (.pth)
│   └── metadata.json           # Model specs and benchmarks
├── docs/
│   ├── MAJOR_PROJECT_REPORT.md # Academic 9-chapter IEEE-style project report
│   ├── VIVA_QUESTIONS_ANSWERS.md# 50+ In-depth Viva Voce Q&A
│   ├── SYSTEM_ARCHITECTURE.md  # Architectural blueprints & sequence diagrams
│   └── USER_MANUAL.md          # Setup and user guide
├── run.py                      # One-click launcher
└── README.md
```

---

## 📊 Evaluation & Benchmark Results

Evaluated on a benchmark of 60,000 synthetic (Midjourney, Stable Diffusion v1.5/v2.1, DALL-E 3) and authentic photographs:

| Metric | Score |
| :--- | :--- |
| **Accuracy** | **94.20%** |
| **Precision** | **93.80%** |
| **Recall / Sensitivity** | **94.60%** |
| **Specificity** | **94.00%** |
| **F1-Score** | **94.20%** |
| **ROC-AUC** | **0.978** |
| **Inference Latency** | **< 250ms (GPU)** |

---

## 🧪 Running Automated Tests

```bash
python -m pytest backend/tests/ -v
```

---

## 🎓 Academic Viva Resources

- Comprehensive academic report: [`docs/MAJOR_PROJECT_REPORT.md`](docs/MAJOR_PROJECT_REPORT.md)
- 50+ Viva Voce questions and answers: [`docs/VIVA_QUESTIONS_ANSWERS.md`](docs/VIVA_QUESTIONS_ANSWERS.md)
- Architecture & Mathematical models: [`docs/SYSTEM_ARCHITECTURE.md`](docs/SYSTEM_ARCHITECTURE.md)
