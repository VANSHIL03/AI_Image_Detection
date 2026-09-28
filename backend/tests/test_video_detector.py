import os
import tempfile
import cv2
import numpy as np
import pytest
from backend.app.services.video_detector import video_detector_service
from backend.app.utils.video_processing import extract_video_metadata, sample_frames_from_video

def create_synthetic_test_video(num_frames=30, fps=10, width=128, height=128):
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
    temp_path = temp_file.name
    temp_file.close()
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(temp_path, fourcc, fps, (width, height))
    
    for i in range(num_frames):
        # Create shifting gradient frame
        frame = np.zeros((height, width, 3), dtype=np.uint8)
        frame[:, :, 0] = (i * 8) % 255
        frame[:, :, 1] = 120
        frame[:, :, 2] = 200
        out.write(frame)
        
    out.release()
    
    with open(temp_path, "rb") as f:
        video_bytes = f.read()
        
    os.remove(temp_path)
    return video_bytes

def test_video_detection_analysis():
    video_bytes = create_synthetic_test_video(num_frames=20, fps=10)
    result = video_detector_service.analyze_video(video_bytes, filename="test_video.mp4", sample_rate_fps=2.0)
    
    assert "prediction" in result
    assert result["prediction"] in ["AI-Generated / Manipulated Video", "Likely Human-Recorded Video", "Uncertain / Inconclusive"]
    assert "timeline" in result
    assert len(result["timeline"]) > 0
    assert "temporal_consistency_score" in result
    assert 0.0 <= result["temporal_consistency_score"] <= 1.0
    assert 0.0 <= result["ai_probability"] <= 1.0
    assert "top_suspicious_frames" in result
