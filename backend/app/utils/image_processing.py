import io
import base64
import numpy as np
from PIL import Image
import torch
import torchvision.transforms as transforms

# Standard ImageNet normalization for CNN backbones
STANDARD_TRANSFORM = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

def load_image_from_bytes(image_bytes: bytes) -> Image.Image:
    """Safely decode byte buffer to RGB PIL Image."""
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img = img.convert("RGB")
        return img
    except Exception as e:
        raise ValueError(f"Failed to decode image: {str(e)}")

def preprocess_image_for_model(img: Image.Image) -> torch.Tensor:
    """Preprocess PIL image into 4D PyTorch tensor [1, 3, 224, 224]."""
    tensor = STANDARD_TRANSFORM(img)
    return tensor.unsqueeze(0)  # Add batch dimension

def pil_to_base64(img: Image.Image, format: str = "PNG") -> str:
    """Convert PIL image to base64 data URI."""
    buffer = io.BytesIO()
    img.save(buffer, format=format, optimize=True)
    b64_str = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return f"data:image/{format.lower()};base64,{b64_str}"

def numpy_to_base64(arr: np.ndarray, format: str = "PNG") -> str:
    """Convert numpy RGB/RGBA image array to base64 data URI."""
    if arr.dtype != np.uint8:
        arr = np.clip(arr, 0, 255).astype(np.uint8)
    img = Image.fromarray(arr)
    return pil_to_base64(img, format=format)
