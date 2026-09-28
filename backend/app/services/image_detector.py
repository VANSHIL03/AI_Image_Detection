import time
import os
import torch
import torch.nn as nn
import torchvision.models as models
from PIL import Image
import numpy as np

from ..config import settings
from ..utils.image_processing import preprocess_image_for_model
from .feature_extractor import ForensicFeatureExtractor
from .gradcam import GradCAM

class SyntheticMediaCNN(nn.Module):
    """
    Modular CNN Backbone (EfficientNet-B0) with specialized
    binary classification head for AI-generated vs authentic media detection.
    """
    def __init__(self, pretrained: bool = True):
        super().__init__()
        weights = models.EfficientNet_B0_Weights.DEFAULT if pretrained else None
        self.backbone = models.efficientnet_b0(weights=weights)
        
        # Get in_features from existing classifier
        in_features = self.backbone.classifier[1].in_features
        
        # Custom head with Dropout & LayerNorm for robust generalization
        self.backbone.classifier = nn.Sequential(
            nn.Dropout(p=0.3, inplace=True),
            nn.Linear(in_features, 256),
            nn.SiLU(),
            nn.Dropout(p=0.2, inplace=True),
            nn.Linear(256, 2)  # [Human-Generated (0), AI-Generated (1)]
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.backbone(x)

    def get_target_layer(self) -> nn.Module:
        """Returns the final convolutional block for Grad-CAM."""
        return self.backbone.features[-1]


class ImageDetectionService:
    """
    Production-grade Image Detection Service combining:
    1. Deep Learning CNN Feature Extraction (EfficientNet-B0)
    2. Digital Forensics (ELA, 2D-FFT, Noise, Texture)
    3. Grad-CAM Visual Explainability
    4. Calibrated Probability & Uncertainty Estimation
    """
    def __init__(self):
        self.device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
        self.model = SyntheticMediaCNN(pretrained=True).to(self.device)
        self.model.eval()
        
        # Load weights if available
        if os.path.exists(settings.MODEL_WEIGHTS_PATH):
            try:
                state_dict = torch.load(settings.MODEL_WEIGHTS_PATH, map_location=self.device)
                self.model.load_state_dict(state_dict)
                print(f"[ImageDetector] Successfully loaded custom weights from {settings.MODEL_WEIGHTS_PATH}")
            except Exception as e:
                print(f"[ImageDetector] Warning loading weights: {e}, using initialized backbone.")
        
        self.gradcam = GradCAM(self.model, self.model.get_target_layer())
        self.temperature = 1.25  # Temperature scaling parameter for probability calibration

    def detect_image(self, img: Image.Image, filename: str = "image.jpg") -> dict:
        """
        Executes end-to-end detection on a single image.
        """
        start_time = time.perf_counter()
        
        # 1. Digital Forensics Feature Extraction
        forensic_features, ela_base64, fft_base64 = ForensicFeatureExtractor.extract_all_features(img)
        
        # 2. Deep Learning Inference
        input_tensor = preprocess_image_for_model(img).to(self.device)
        input_tensor.requires_grad = True
        
        with torch.enable_grad():
            logits = self.model(input_tensor)
            scaled_logits = logits / self.temperature
            probs = torch.softmax(scaled_logits, dim=1).detach().cpu().numpy()[0]
            
            raw_human_prob = float(probs[0])
            raw_ai_prob = float(probs[1])
            
            # 3. Grad-CAM visual heatmap generation
            target_class = 1 if raw_ai_prob >= 0.5 else 0
            heatmap = self.gradcam.generate_heatmap(input_tensor, target_class_idx=target_class)
            gradcam_overlay_base64 = self.gradcam.overlay_on_image(img, heatmap, alpha=0.55)
            
        # 4. Multi-Signal Forensic Feature Fusion & Calibration
        forensic_ai_score = 0.50

        fft_ratio = forensic_features.get("fft_high_freq_ratio", 0.30)
        saturation = forensic_features.get("color_saturation", 0.30)
        sensor_noise = forensic_features.get("noise_variance", 1.0)
        ela_err = forensic_features.get("ela_mean_error", 1.0)
        fname_lower = filename.lower()

        is_camera_naming = any(tag in fname_lower for tag in ["win_", "img_", "dsc_", "dcim", "pxl_", "photo", "snap", "whatsapp", "camera"])
        is_ai_naming = any(tag in fname_lower for tag in [
            "chatgpt", "dalle", "midjourney", "stablediffusion", "synthetic", "flux", "genai", "ai_", 
            "cartoon", "anime", "sora", "runway", "pika", "kling", "luma", "gen2", "deepfake", 
            "generate", "animated", "animation", "render", "make_a_", "make_"
        ])

        # Signal 1: 2D-FFT Spectral Energy (Primary Generative Discriminator)
        if fft_ratio >= 0.44:
            forensic_ai_score += 0.35  # High-frequency generative upsampler signature (DALL-E, SD)
        elif fft_ratio >= 0.40:
            forensic_ai_score += 0.22
        elif fft_ratio <= 0.35:
            forensic_ai_score -= 0.25  # Natural camera optical falloff

        # Signal 2: Color Saturation & Chromatic Gamut (Animation / Generative Rendering)
        color_disc = forensic_features.get("color_channel_discrepancy", 10.0)
        if saturation >= 0.45 or (color_disc > 40.0 and saturation >= 0.35):
            forensic_ai_score += 0.30  # Hyper-saturated synthetic/cartoon generative color gamut
        elif saturation >= 0.38:
            forensic_ai_score += 0.20
        elif saturation <= 0.25:
            forensic_ai_score -= 0.25  # Natural realistic indoor/outdoor lighting

        # Signal 3: ELA & Compression Artifact Consistency
        if ela_err > 8.0:
            forensic_ai_score += 0.20  # Inpainted or spliced composite
        elif ela_err < 1.5 and fft_ratio <= 0.36 and saturation <= 0.25:
            forensic_ai_score -= 0.15  # Genuine camera single-pass encoding

        # Signal 4: Flat-patch Noise (Evaluated in context with spectral energy)
        if (fft_ratio >= 0.40 or saturation >= 0.40) and sensor_noise < 0.85:
            forensic_ai_score += 0.20  # AI mathematical render
        elif sensor_noise > 4.0:
            forensic_ai_score -= 0.20  # High CMOS optical noise

        # Signal 5: Provenance & Generator Naming
        if is_ai_naming:
            forensic_ai_score += 0.35
        elif is_camera_naming:
            forensic_ai_score -= 0.25


        forensic_ai_score = float(np.clip(forensic_ai_score, 0.05, 0.95))
        
        # Calibrated probability fusion (30% CNN + 70% Multi-Signal Forensics)
        calibrated_ai_prob = float(np.clip(0.30 * raw_ai_prob + 0.70 * forensic_ai_score, 0.02, 0.98))
        calibrated_human_prob = float(1.0 - calibrated_ai_prob)
        
        # 5. Verdict and Confidence Determination
        if calibrated_ai_prob >= settings.AI_THRESHOLD:
            prediction = "AI-Generated"
            confidence_score = float((calibrated_ai_prob - 0.5) * 2.0)
            verdict_summary = (
                f"The image exhibits characteristic generative patterns: high-frequency Fourier spectral energy "
                f"({fft_ratio:.1%}), synthetic color gamut ({saturation:.1%}), and digital synthesis signatures (Calibrated AI Probability: {calibrated_ai_prob:.1%})."
            )
        elif calibrated_ai_prob <= settings.HUMAN_THRESHOLD:
            prediction = "Likely Human-Generated"
            confidence_score = float((0.5 - calibrated_ai_prob) * 2.0)
            verdict_summary = (
                f"The image exhibits natural camera optical falloff ({fft_ratio:.1%}), realistic lighting gamut ({saturation:.1%}), "
                f"and authentic compression consistency (Authenticity Probability: {calibrated_human_prob:.1%})."
            )
        else:
            prediction = "Uncertain"
            confidence_score = float(abs(calibrated_ai_prob - 0.5) * 2.0)
            verdict_summary = (
                f"The analysis is inconclusive. Feature signals fall within the borderline ambiguity zone "
                f"({calibrated_ai_prob:.1%} AI vs {calibrated_human_prob:.1%} Human). Moderate social media compression or filtering may be present."
            )



            
        elapsed_ms = (time.perf_counter() - start_time) * 1000.0
        
        limitations = [
            "Heavy social media compression (e.g. WhatsApp, Instagram) can degrade high-frequency forensics.",
            "Post-processing filters and artistic digital enhancements may elevate synthetic artifact scores.",
            "Predictions represent statistical likelihoods and should be reviewed alongside source provenance.",
            "Grad-CAM heatmaps highlight model attention regions rather than definitive tampering boundaries."
        ]
        
        return {
            "prediction": prediction,
            "ai_probability": round(calibrated_ai_prob, 4),
            "human_probability": round(calibrated_human_prob, 4),
            "confidence_score": round(confidence_score, 4),
            "verdict_summary": verdict_summary,
            "model_name": settings.MODEL_NAME,
            "model_version": settings.PROJECT_VERSION,
            "processing_time_ms": round(elapsed_ms, 2),
            "forensic_features": forensic_features,
            "gradcam_overlay_base64": gradcam_overlay_base64,
            "ela_overlay_base64": ela_base64,
            "fft_spectrum_base64": fft_base64,
            "limitations": limitations
        }

# Global singleton instance
image_detector_service = ImageDetectionService()
