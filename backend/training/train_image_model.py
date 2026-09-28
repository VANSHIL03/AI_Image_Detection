import os
import time
import json
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, random_split
from pathlib import Path

from ..app.services.image_detector import SyntheticMediaCNN
from .dataset_loader import SyntheticMediaDataset, get_data_transforms
from ..app.config import settings, WEIGHTS_DIR, MODELS_DIR

def train_model(
    dataset_dir: str,
    epochs: int = 10,
    batch_size: int = 32,
    learning_rate: float = 1e-4,
    device_name: str = None
):
    if device_name:
        device = torch.device(device_name)
    else:
        device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
        
    print(f"Starting Training on Device: {device}")
    
    # Transforms
    train_tf, val_tf = get_data_transforms()
    
    # Dataset
    full_dataset = SyntheticMediaDataset(dataset_dir, transform=train_tf)
    total_len = len(full_dataset)
    print(f"Loaded {total_len} samples from {dataset_dir}")
    
    if total_len == 0:
        print("[Warning] No samples found in dataset directory. Creating placeholder checkpoint.")
        model = SyntheticMediaCNN(pretrained=True).to(device)
        WEIGHTS_DIR.mkdir(parents=True, exist_ok=True)
        torch.save(model.state_dict(), settings.MODEL_WEIGHTS_PATH)
        print(f"Saved initial weights to {settings.MODEL_WEIGHTS_PATH}")
        return
        
    val_len = int(0.2 * total_len)
    train_len = total_len - val_len
    
    train_ds, val_ds = random_split(full_dataset, [train_len, val_len])
    
    train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True, num_workers=2, pin_memory=True)
    val_loader = DataLoader(val_ds, batch_size=batch_size, shuffle=False, num_workers=2, pin_memory=True)
    
    model = SyntheticMediaCNN(pretrained=True).to(device)
    criterion = nn.CrossEntropyLoss(label_smoothing=0.1)
    optimizer = torch.optim.AdamW(model.parameters(), lr=learning_rate, weight_decay=1e-2)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)
    
    best_val_acc = 0.0
    history = []
    
    for epoch in range(1, epochs + 1):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        
        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item() * images.size(0)
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
            
        scheduler.step()
        train_loss = running_loss / total
        train_acc = correct / total
        
        # Validation
        model.eval()
        val_loss = 0.0
        val_correct = 0
        val_total = 0
        
        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                loss = criterion(outputs, labels)
                val_loss += loss.item() * images.size(0)
                _, predicted = torch.max(outputs.data, 1)
                val_total += labels.size(0)
                val_correct += (predicted == labels).sum().item()
                
        val_loss = val_loss / val_total if val_total > 0 else 0.0
        val_acc = val_correct / val_total if val_total > 0 else 0.0
        
        print(f"Epoch [{epoch}/{epochs}] - Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.4f} | Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.4f}")
        
        history.append({
            "epoch": epoch,
            "train_loss": round(train_loss, 4),
            "val_loss": round(val_loss, 4),
            "train_acc": round(train_acc, 4),
            "val_acc": round(val_acc, 4)
        })
        
        if val_acc >= best_val_acc:
            best_val_acc = val_acc
            WEIGHTS_DIR.mkdir(parents=True, exist_ok=True)
            torch.save(model.state_dict(), settings.MODEL_WEIGHTS_PATH)
            print(f"-> Saved Best Checkpoint with Val Acc: {val_acc:.4f}")
            
    # Save training metadata
    meta = {
        "model_name": settings.MODEL_NAME,
        "epochs": epochs,
        "batch_size": batch_size,
        "best_val_acc": best_val_acc,
        "history": history
    }
    with open(settings.MODEL_METADATA_PATH, "w") as f:
        json.dump(meta, f, indent=2)
        
    print(f"Training Complete. Metadata saved to {settings.MODEL_METADATA_PATH}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", type=str, default="./datasets/sample_data")
    parser.add_argument("--epochs", type=int, default=5)
    parser.add_argument("--batch_size", type=int, default=16)
    args = parser.parse_args()
    
    train_model(args.dataset, epochs=args.epochs, batch_size=args.batch_size)
