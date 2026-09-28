import os
from pathlib import Path
from PIL import Image
import torch
from torch.utils.data import Dataset, DataLoader
import torchvision.transforms as transforms

class SyntheticMediaDataset(Dataset):
    """
    Dataset class for Authentic (Human-Generated) and AI-Generated media.
    Expects directory structure:
    root_dir/
       ├── real/
       │   ├── img1.jpg
       │   └── ...
       └── ai_generated/
           ├── midjourney/
           ├── stable_diffusion/
           └── dalle/
    """
    def __init__(self, root_dir: str, transform=None):
        self.root_dir = Path(root_dir)
        self.transform = transform
        self.samples = []  # (image_path, label: 0 for real, 1 for AI)
        self._load_samples()

    def _load_samples(self):
        real_dir = self.root_dir / "real"
        ai_dir = self.root_dir / "ai_generated"
        
        valid_exts = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
        
        if real_dir.exists():
            for p in real_dir.rglob("*"):
                if p.suffix.lower() in valid_exts:
                    self.samples.append((str(p), 0))
                    
        if ai_dir.exists():
            for p in ai_dir.rglob("*"):
                if p.suffix.lower() in valid_exts:
                    self.samples.append((str(p), 1))

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        path, label = self.samples[idx]
        try:
            image = Image.open(path).convert("RGB")
        except Exception:
            # Fallback black image if corrupt
            image = Image.new("RGB", (224, 224), (0, 0, 0))
            
        if self.transform:
            image = self.transform(image)
            
        return image, torch.tensor(label, dtype=torch.long)

def get_data_transforms():
    train_transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.ColorJitter(brightness=0.1, contrast=0.1, saturation=0.1),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    val_transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    return train_transform, val_transform
