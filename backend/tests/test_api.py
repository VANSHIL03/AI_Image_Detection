import io
import pytest
from fastapi.testclient import TestClient
from PIL import Image
from backend.app.main import app

client = TestClient(app)

def create_test_image_bytes():
    img = Image.new("RGB", (224, 224), color=(200, 100, 50))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "active_device" in data
    assert "gpu_available" in data

def test_model_metrics_endpoint():
    response = client.get("/api/model/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "accuracy" in data
    assert "confusion_matrix" in data
    assert "roc_curve" in data
    assert len(data["confusion_matrix"]) == 2

def test_dashboard_stats_endpoint():
    response = client.get("/api/dashboard/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_analyses" in data
    assert "daily_volume" in data

def test_detect_image_endpoint():
    img_bytes = create_test_image_bytes()
    files = {"file": ("test.jpg", img_bytes, "image/jpeg")}
    response = client.post("/api/detect/image", files=files)
    assert response.status_code == 200
    data = response.json()
    assert "analysis_id" in data
    assert "prediction" in data
    assert "confidence_score" in data
    assert "gradcam_overlay_base64" in data
    assert "forensic_features" in data
