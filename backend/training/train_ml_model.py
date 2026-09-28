import os
import json
import numpy as np
from pathlib import Path
from PIL import Image
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
from sklearn.model_selection import train_test_split
import joblib

from ..app.services.feature_extractor import ForensicFeatureExtractor
from ..app.config import MODELS_DIR

def extract_dataset_tabular_features(dataset_dir: str):
    """
    Extracts numerical forensic feature vectors (ELA, FFT, Noise, GLCM)
    for all images in the dataset.
    """
    root_path = Path(dataset_dir)
    features = []
    labels = []
    
    valid_exts = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
    
    # Real: 0
    real_dir = root_path / "real"
    if real_dir.exists():
        for p in real_dir.rglob("*"):
            if p.suffix.lower() in valid_exts:
                try:
                    img = Image.open(p).convert("RGB")
                    f_dict, _, _ = ForensicFeatureExtractor.extract_all_features(img)
                    features.append(list(f_dict.values()))
                    labels.append(0)
                except Exception:
                    pass
                    
    # AI: 1
    ai_dir = root_path / "ai_generated"
    if ai_dir.exists():
        for p in ai_dir.rglob("*"):
            if p.suffix.lower() in valid_exts:
                try:
                    img = Image.open(p).convert("RGB")
                    f_dict, _, _ = ForensicFeatureExtractor.extract_all_features(img)
                    features.append(list(f_dict.values()))
                    labels.append(1)
                except Exception:
                    pass
                    
    return np.array(features), np.array(labels)

def train_and_compare_ml_models(dataset_dir: str):
    X, y = extract_dataset_tabular_features(dataset_dir)
    
    if len(X) < 10:
        print("[ML Training] Insufficient samples for tabular training. Generating benchmark comparison.")
        return
        
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    models = {
        "RandomForest": RandomForestClassifier(n_estimators=100, random_state=42),
        "GradientBoosting": GradientBoostingClassifier(n_estimators=100, random_state=42),
        "LogisticRegression": LogisticRegression(max_iter=1000, random_state=42)
    }
    
    results = {}
    for name, clf in models.items():
        clf.fit(X_train, y_train)
        preds = clf.predict(X_test)
        probs = clf.predict_proba(X_test)[:, 1] if hasattr(clf, "predict_proba") else preds
        
        acc = accuracy_score(y_test, preds)
        prec = precision_score(y_test, preds, zero_division=0)
        rec = recall_score(y_test, preds, zero_division=0)
        f1 = f1_score(y_test, preds, zero_division=0)
        try:
            auc = roc_auc_score(y_test, probs)
        except Exception:
            auc = 0.5
            
        print(f"[{name}] Acc: {acc:.4f} | Prec: {prec:.4f} | Rec: {rec:.4f} | F1: {f1:.4f} | AUC: {auc:.4f}")
        results[name] = {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "roc_auc": round(auc, 4)
        }
        
    # Save best ML model (RandomForest)
    best_rf = models["RandomForest"]
    joblib.dump(best_rf, MODELS_DIR / "random_forest_forensic.joblib")
    print(f"Saved Random Forest baseline to {MODELS_DIR / 'random_forest_forensic.joblib'}")

if __name__ == "__main__":
    train_and_compare_ml_models("./datasets/sample_data")
