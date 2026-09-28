import hashlib
import json
from datetime import datetime

class ReportGenerator:
    """
    Generates structured, exportable Forensic Audit Reports for
    both Image and Video detection results.
    """
    @staticmethod
    def generate_report(analysis_data: dict, raw_bytes: bytes = None) -> dict:
        sha256_hash = hashlib.sha256(raw_bytes).hexdigest() if raw_bytes else "N/A"
        
        report = {
            "audit_header": {
                "report_title": "AuraLens AI - Media Authenticity & Forensic Audit Report",
                "report_id": analysis_data.get("analysis_id", "N/A"),
                "generated_at": datetime.utcnow().isoformat() + "Z",
                "system_version": analysis_data.get("model_version", "2.0.0"),
                "evaluator_engine": analysis_data.get("model_name", "AuraLens Core")
            },
            "file_provenance": {
                "filename": analysis_data.get("filename", "unknown"),
                "sha256_checksum": sha256_hash,
                "media_type": "Video" if "timeline" in analysis_data else "Image",
                "processing_time_ms": analysis_data.get("processing_time_ms", 0)
            },
            "detection_verdict": {
                "final_prediction": analysis_data.get("prediction"),
                "calibrated_ai_probability": f"{analysis_data.get('ai_probability', 0):.2%}",
                "calibrated_human_probability": f"{analysis_data.get('human_probability', 0):.2%}",
                "confidence_score": f"{analysis_data.get('confidence_score', 0):.2%}",
                "verdict_summary": analysis_data.get("verdict_summary")
            },
            "forensic_breakdown": analysis_data.get("forensic_features", {}),
            "video_temporal_metrics": {
                "analyzed_frames": analysis_data.get("analyzed_frames_count"),
                "suspicious_frames": analysis_data.get("suspicious_frames_count"),
                "temporal_consistency": f"{analysis_data.get('temporal_consistency_score', 1.0):.2%}"
            } if "timeline" in analysis_data else None,
            "disclaimers_and_limitations": analysis_data.get("limitations", [])
        }
        return report
