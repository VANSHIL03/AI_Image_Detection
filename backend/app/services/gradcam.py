import cv2
import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image
from ..utils.image_processing import numpy_to_base64

class GradCAM:
    """
    Computes Gradient-weighted Class Activation Mapping (Grad-CAM)
    for visual explainability on CNN convolutional feature maps.
    """
    def __init__(self, model: torch.nn.Module, target_layer: torch.nn.Module):
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None
        self.hooks = []
        self._register_hooks()

    def _register_hooks(self):
        def forward_hook(module, input, output):
            self.activations = output

        def backward_hook(module, grad_input, grad_output):
            self.gradients = grad_output[0]

        self.hooks.append(self.target_layer.register_forward_hook(forward_hook))
        self.hooks.append(self.target_layer.register_full_backward_hook(backward_hook))

    def generate_heatmap(
        self, 
        input_tensor: torch.Tensor, 
        target_class_idx: int = 1
    ) -> np.ndarray:
        """
        Generate raw Grad-CAM heatmap array normalized to [0, 1].
        """
        self.model.eval()
        self.model.zero_grad()
        
        # Forward pass
        logits = self.model(input_tensor)
        
        # Backward pass for target class
        one_hot = torch.zeros_like(logits)
        one_hot[0, target_class_idx] = 1.0
        logits.backward(gradient=one_hot, retain_graph=True)
        
        # Pool gradients across channels
        # gradients: [1, C, H, W] -> channel weights [1, C, 1, 1]
        pooled_gradients = torch.mean(self.gradients, dim=[2, 3], keepdim=True)
        
        # Weighted combination of forward activation maps
        cam = torch.sum(pooled_gradients * self.activations, dim=1, keepdim=True)
        cam = F.relu(cam)  # Apply ReLU to keep features that have positive influence
        
        cam = cam.squeeze().detach().cpu().numpy()
        
        # Normalize between 0 and 1
        cam_min, cam_max = np.min(cam), np.max(cam)
        if cam_max - cam_min > 1e-6:
            cam = (cam - cam_min) / (cam_max - cam_min)
        else:
            cam = np.zeros_like(cam)
            
        return cam

    def overlay_on_image(
        self, 
        original_img: Image.Image, 
        heatmap: np.ndarray, 
        alpha: float = 0.5,
        colormap: int = cv2.COLORMAP_JET
    ) -> str:
        """
        Resize heatmap to image size, apply colormap, blend with original image,
        and return base64 data URI.
        """
        img_np = np.array(original_img)
        h, w = img_np.shape[:2]
        
        # Resize heatmap to match image dimensions
        resized_cam = cv2.resize(heatmap, (w, h))
        cam_uint8 = np.uint8(255 * resized_cam)
        
        # Apply colormap
        colored_cam = cv2.applyColorMap(cam_uint8, colormap)
        colored_cam_rgb = cv2.cvtColor(colored_cam, cv2.COLOR_BGR2RGB)
        
        # Blend images: result = alpha * heatmap + (1 - alpha) * original
        blended = np.clip(
            alpha * colored_cam_rgb.astype(float) + (1.0 - alpha) * img_np.astype(float),
            0, 
            255
        ).astype(np.uint8)
        
        return numpy_to_base64(blended, format="JPEG")

    def remove_hooks(self):
        for hook in self.hooks:
            hook.remove()
        self.hooks.clear()
