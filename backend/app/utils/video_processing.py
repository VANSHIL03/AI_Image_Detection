import os
import cv2
import tempfile
import numpy as np
from PIL import Image
from typing import Generator
from ..config import settings

def extract_video_metadata(video_path: str) -> dict:
    """Extract FPS, frame count, duration, and resolution using OpenCV."""
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError("Could not open video file.")
    
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) or 0
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)) or 0
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)) or 0
    duration_seconds = total_frames / fps if fps > 0 else 0.0
    
    cap.release()
    return {
        "fps": fps,
        "total_frames": total_frames,
        "width": width,
        "height": height,
        "duration_seconds": duration_seconds
    }

def sample_frames_from_video(
    video_path: str, 
    sample_rate_fps: float = 1.0,
    max_frames: int = settings.MAX_FRAMES_PER_VIDEO
) -> list[tuple[int, float, Image.Image]]:
    """
    Extract sampled frames from video file.
    Returns list of (frame_index, timestamp_seconds, pil_image).
    """
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError("Unable to read video file.")
    
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0 or np.isnan(fps):
        fps = 30.0
        
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frame_step = max(1, int(fps / sample_rate_fps))
    
    frames_data = []
    current_frame_idx = 0
    
    while cap.isOpened() and len(frames_data) < max_frames:
        ret, frame = cap.read()
        if not ret:
            break
            
        if current_frame_idx % frame_step == 0:
            timestamp = current_frame_idx / fps
            # Convert BGR (OpenCV) to RGB (PIL)
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            pil_img = Image.fromarray(rgb_frame)
            frames_data.append((current_frame_idx, timestamp, pil_img))
            
        current_frame_idx += 1
        
    cap.release()
    return frames_data
