import os
import time
import tempfile
import numpy as np
from PIL import Image
import torch

from ..config import settings
from ..utils.video_processing import extract_video_metadata, sample_frames_from_video
from ..utils.image_processing import pil_to_base64, preprocess_image_for_model
from .image_detector import image_detector_service

class VideoDetectionService:
    """
    Production-grade Video Detection & Temporal Consistency Analyzer.
    - Samples frames at configurable intervals.
    - Performs batch deep learning inference.
    - Analyzes frame-by-frame temporal jitter and localized anomalies.
    - Computes Top-K Peak Anomaly score and aggregates video-level verdict.
    """
    def __init__(self):
        self.image_detector = image_detector_service

    def analyze_video(
        self, 
        video_bytes: bytes, 
        filename: str = "video.mp4",
        sample_rate_fps: float = settings.DEFAULT_FRAME_SAMPLE_RATE_FPS
    ) -> dict:
        start_time = time.perf_counter()
        
        # Save bytes to temporary file for OpenCV reading
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(filename)[1])
        try:
            temp_file.write(video_bytes)
            temp_file.flush()
            temp_file_path = temp_file.name
            temp_file.close()
            
            # 1. Video Metadata
            metadata = extract_video_metadata(temp_file_path)
            
            # 2. Sample Frames
            sampled_frames = sample_frames_from_video(
                temp_file_path,
                sample_rate_fps=sample_rate_fps,
                max_frames=settings.MAX_FRAMES_PER_VIDEO
            )
            
            if not sampled_frames:
                raise ValueError("Could not extract any valid frames from the video.")
                
            # 3. Multi-Signal Frame-by-Frame Forensic Inference
            timeline = []
            frame_probs = []
            frame_results = []
            
            for idx, (frame_num, timestamp, frame_img) in enumerate(sampled_frames):
                # Run full multi-signal forensic & CNN pipeline on sampled frame
                frame_res = self.image_detector.detect_image(frame_img, filename=filename)
                ai_prob = frame_res["ai_probability"]
                human_prob = frame_res["human_probability"]
                frame_probs.append(ai_prob)
                frame_results.append(frame_res)
                
                is_suspicious = ai_prob >= 0.60
                
                # Create lightweight thumbnail for timeline inspection
                thumb_img = frame_img.copy()
                thumb_img.thumbnail((200, 200))
                thumb_base64 = pil_to_base64(thumb_img, format="JPEG")
                
                timeline.append({
                    "frame_index": frame_num,
                    "timestamp_seconds": round(timestamp, 2),
                    "ai_probability": round(ai_prob, 4),
                    "human_probability": round(human_prob, 4),
                    "is_suspicious": is_suspicious,
                    "frame_thumbnail_base64": thumb_base64,
                    "gradcam_thumbnail_base64": frame_res.get("gradcam_overlay_base64")
                })
                
            # 4. Temporal Consistency & Multi-Frame Aggregation
            frame_probs_np = np.array(frame_probs)
            median_prob = float(np.median(frame_probs_np))
            mean_prob = float(np.mean(frame_probs_np))
            
            # Top-K Peak Anomaly Score (catches targeted deepfake manipulation)
            k = min(len(frame_probs), settings.VIDEO_TOP_K_ANOMALY_FRAMES)
            top_k_indices = np.argsort(frame_probs_np)[-k:]
            top_k_mean = float(np.mean(frame_probs_np[top_k_indices]))
            
            # Temporal Jitter / Variance
            if len(frame_probs) > 1:
                frame_diffs = np.abs(np.diff(frame_probs_np))
                temporal_jitter = float(np.mean(frame_diffs))
                temporal_consistency = float(np.clip(1.0 - (temporal_jitter * 2.0), 0.0, 1.0))
            else:
                temporal_consistency = 1.0
                
            # Video-level Aggregated Probability Formula
            aggregated_ai_prob = float(np.clip(
                0.50 * median_prob + 0.40 * top_k_mean + 0.10 * mean_prob,
                0.02, 
                0.98
            ))
            aggregated_human_prob = float(1.0 - aggregated_ai_prob)
            
            # 5. Extract Top Suspicious Frames with Grad-CAM overlays
            suspicious_timeline_items = [t for t in timeline if t["is_suspicious"]]
            sorted_by_prob = sorted(timeline, key=lambda x: x["ai_probability"], reverse=True)
            top_suspicious_frames = sorted_by_prob[:min(4, len(sorted_by_prob))]
            
            # 6. Verdict and Confidence Determination
            if aggregated_ai_prob >= 0.60:
                prediction = "AI-Generated / Manipulated Video"
                confidence_score = float((aggregated_ai_prob - 0.5) * 2.0)
                verdict_summary = (
                    f"Video exhibits synthetic generation markers across keyframes (Calibrated AI Probability: {aggregated_ai_prob:.1%}). "
                    f"Identified {len(suspicious_timeline_items)} high-probability anomaly keyframes with temporal stability rating of {temporal_consistency:.1%}."
                )
            elif aggregated_ai_prob <= 0.40:
                prediction = "Likely Human-Recorded Video"
                confidence_score = float((0.5 - aggregated_ai_prob) * 2.0)
                verdict_summary = (
                    f"Video demonstrates authentic optical camera characteristics, natural temporal transitions, and organic sensor noise "
                    f"(Authenticity Probability: {aggregated_human_prob:.1%}, Consistency: {temporal_consistency:.1%})."
                )
            else:
                prediction = "Uncertain / Inconclusive"
                confidence_score = float(abs(aggregated_ai_prob - 0.5) * 2.0)
                verdict_summary = (
                    f"Temporal signals are inconclusive. Frame-level probabilities fall within the borderline ambiguity zone "
                    f"({aggregated_ai_prob:.1%} AI vs {aggregated_human_prob:.1%} Human). Video compression may be present."
                )


                
            elapsed_ms = (time.perf_counter() - start_time) * 1000.0
            
            limitations = [
                "Frame sampling rate affects detection granularity; very brief 1-frame deepfakes may be missed at low FPS.",
                "Video compression (H.264/HEVC macroblocking) can introduce synthetic-like edge artifacts.",
                "Fast camera panning or strobe lighting can cause temporary temporal variance spikes.",
                "Predictions represent estimated statistical confidence and require context verification."
            ]
            
            return {
                "prediction": prediction,
                "ai_probability": round(aggregated_ai_prob, 4),
                "human_probability": round(aggregated_human_prob, 4),
                "confidence_score": round(confidence_score, 4),
                "verdict_summary": verdict_summary,
                "model_name": settings.MODEL_NAME,
                "model_version": settings.PROJECT_VERSION,
                "processing_time_ms": round(elapsed_ms, 2),
                "total_frames_extracted": metadata["total_frames"],
                "analyzed_frames_count": len(sampled_frames),
                "suspicious_frames_count": len(suspicious_timeline_items),
                "temporal_consistency_score": round(temporal_consistency, 4),
                "timeline": timeline,
                "top_suspicious_frames": top_suspicious_frames,
                "limitations": limitations
            }
            
        finally:
            # Clean up temporary video file
            if os.path.exists(temp_file_path):
                try:
                    os.remove(temp_file_path)
                except Exception:
                    pass

video_detector_service = VideoDetectionService()
