import io
import cv2
import numpy as np
from PIL import Image, ImageChops, ImageEnhance
from ..utils.image_processing import pil_to_base64, numpy_to_base64

class ForensicFeatureExtractor:
    """
    Extracts computer vision and digital forensic features:
    - Error Level Analysis (ELA)
    - 2D-FFT Frequency Magnitude Spectrum
    - Residual Noise Variance
    - Chrominance Cross-Channel Discrepancies
    - Texture Homogeneity & Contrast
    """
    
    @staticmethod
    def compute_ela(img: Image.Image, quality: int = 90, scale: int = 15) -> tuple[dict, str]:
        """
        Compute Error Level Analysis (ELA).
        Re-saves image at fixed JPEG quality and measures absolute compression discrepancy.
        """
        # Save temporary JPEG in memory
        buffer = io.BytesIO()
        img.save(buffer, 'JPEG', quality=quality)
        buffer.seek(0)
        resaved = Image.open(buffer).convert('RGB')
        
        # Calculate pixel difference
        diff = ImageChops.difference(img, resaved)
        
        # Calculate statistics on diff
        diff_np = np.array(diff, dtype=np.float32)
        mean_error = float(np.mean(diff_np))
        max_error = float(np.max(diff_np))
        
        # Amplify difference for visual inspection
        extrema = diff.getextrema()
        max_diff = max([ex[1] for ex in extrema]) if extrema else 1
        scale_factor = 255.0 / max_diff if max_diff > 0 else 1.0
        
        enhanced_diff = ImageEnhance.Brightness(diff).enhance(scale_factor * 0.8)
        ela_base64 = pil_to_base64(enhanced_diff, format="JPEG")
        
        return {
            "ela_mean_error": round(mean_error, 4),
            "ela_max_error": round(max_error, 4)
        }, ela_base64

    @staticmethod
    def compute_fft_spectrum(img: Image.Image) -> tuple[dict, str]:
        """
        Compute 2D Fast Fourier Transform (FFT) Magnitude Spectrum.
        Analyzes high-frequency vs low-frequency energy distribution.
        """
        gray = np.array(img.convert('L'), dtype=np.float32)
        h, w = gray.shape
        
        # Compute 2D FFT and shift DC component to center
        f = np.fft.fft2(gray)
        fshift = np.fft.fftshift(f)
        magnitude_spectrum = 20 * np.log(np.abs(fshift) + 1e-6)
        
        # Mask center (low frequency) to measure high-frequency energy ratio
        cy, cx = h // 2, w // 2
        radius = min(h, w) // 4
        y, x = np.ogrid[:h, :w]
        mask = (x - cx)**2 + (y - cy)**2 <= radius**2
        
        low_freq_energy = np.sum(np.abs(fshift)[mask])
        total_energy = np.sum(np.abs(fshift)) + 1e-6
        high_freq_ratio = float(1.0 - (low_freq_energy / total_energy))
        
        # Spectral skewness / symmetry metric
        mag_norm = (magnitude_spectrum - np.min(magnitude_spectrum)) / (np.ptp(magnitude_spectrum) + 1e-6)
        spectral_skew = float(np.std(mag_norm))
        
        # Render colormapped magnitude spectrum for frontend
        mag_uint8 = np.clip(mag_norm * 255, 0, 255).astype(np.uint8)
        colored_spectrum = cv2.applyColorMap(mag_uint8, cv2.COLORMAP_INFERNO)
        colored_spectrum_rgb = cv2.cvtColor(colored_spectrum, cv2.COLOR_BGR2RGB)
        fft_base64 = numpy_to_base64(colored_spectrum_rgb, format="PNG")
        
        return {
            "fft_high_freq_ratio": round(high_freq_ratio, 4),
            "fft_spectral_skew": round(spectral_skew, 4)
        }, fft_base64

    @staticmethod
    def compute_noise_and_texture_stats(img: Image.Image) -> dict:
        """
        Compute true sensor noise on flat patches (excluding edge gradients),
        HSV color saturation, and GLCM texture features.
        """
        img_np = np.array(img)
        gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
        
        # 1. True Sensor Noise Estimation on Flat (Non-Edge) Regions
        denoised = cv2.medianBlur(gray, 3)
        residual = gray.astype(float) - denoised.astype(float)
        
        # Sobel gradient magnitude to find smooth non-edge patches
        grad_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
        grad_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
        grad_mag = np.sqrt(grad_x**2 + grad_y**2)
        
        # Select bottom 35% lowest gradient areas (flat surfaces like sky, walls, water)
        flat_threshold = np.percentile(grad_mag, 35)
        flat_mask = grad_mag <= flat_threshold
        
        if np.sum(flat_mask) > 100:
            sensor_noise_var = float(np.var(residual[flat_mask]))
        else:
            sensor_noise_var = float(np.var(residual))
            
        # 2. Color Saturation & Chrominance Dispersion (HSV space)
        hsv = cv2.cvtColor(img_np, cv2.COLOR_RGB2HSV)
        sat_channel = hsv[:, :, 1].astype(float) / 255.0
        color_saturation_mean = float(np.mean(sat_channel))
        
        r, g, b = img_np[:, :, 0], img_np[:, :, 1], img_np[:, :, 2]
        rg_diff = np.mean(np.abs(r.astype(float) - g.astype(float)))
        rb_diff = np.mean(np.abs(r.astype(float) - b.astype(float)))
        gb_diff = np.mean(np.abs(r.astype(float) - b.astype(float)))
        color_discrepancy = float((rg_diff + rb_diff + gb_diff) / 3.0)
        
        # 3. GLCM-inspired local variance / contrast and homogeneity
        kernel_size = 5
        mean_local = cv2.blur(gray.astype(float), (kernel_size, kernel_size))
        sq_local = cv2.blur((gray.astype(float))**2, (kernel_size, kernel_size))
        var_local = np.maximum(0, sq_local - mean_local**2)
        
        glcm_contrast = float(np.mean(var_local) / 100.0)
        glcm_homogeneity = float(1.0 / (1.0 + glcm_contrast))
        
        return {
            "noise_variance": round(sensor_noise_var, 3),
            "color_saturation": round(color_saturation_mean, 3),
            "color_channel_discrepancy": round(color_discrepancy, 3),
            "glcm_contrast": round(glcm_contrast, 4),
            "glcm_homogeneity": round(glcm_homogeneity, 4)
        }


    @classmethod
    def extract_all_features(cls, img: Image.Image) -> tuple[dict, str, str]:
        """
        Runs complete digital forensics pipeline and returns combined features dictionary,
        ELA overlay base64, and FFT spectrum base64.
        """
        ela_stats, ela_base64 = cls.compute_ela(img)
        fft_stats, fft_base64 = cls.compute_fft_spectrum(img)
        noise_stats = cls.compute_noise_and_texture_stats(img)
        
        combined_features = {
            **ela_stats,
            **fft_stats,
            **noise_stats
        }
        return combined_features, ela_base64, fft_base64
