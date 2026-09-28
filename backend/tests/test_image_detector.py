import io
import pytest
import numpy as np
from PIL import Image
from backend.app.services.image_detector import image_detector_service
from backend.app.services.feature_extractor import ForensicFeatureExtractor

def create_dummy_image(color=(128, 128, 128), size=(300, 300)):
    img = Image.new("RGB", size, color)
    return img

def test_forensic_feature_extraction():
    img = create_dummy_image()
    features, ela_base64, fft_base64 = ForensicFeatureExtractor.extract_all_features(img)
    
    assert "ela_mean_error" in features
    assert "fft_high_freq_ratio" in features
    assert "noise_variance" in features
    assert "glcm_contrast" in features
    assert ela_base64.startswith("data:image/jpeg;base64,")
    assert fft_base64.startswith("data:image/png;base64,")

def test_image_detection_inference():
    img = create_dummy_image()
    result = image_detector_service.detect_image(img, filename="test.jpg")
    
    assert "prediction" in result
    assert result["prediction"] in ["AI-Generated", "Likely Human-Generated", "Uncertain"]
    assert 0.0 <= result["ai_probability"] <= 1.0
    assert 0.0 <= result["human_probability"] <= 1.0
    assert 0.0 <= result["confidence_score"] <= 1.0
    assert result["gradcam_overlay_base64"].startswith("data:image/jpeg;base64,")
    assert len(result["limitations"]) > 0
