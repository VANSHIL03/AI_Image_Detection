import os
import json
import numpy as np
from pathlib import Path
from sklearn.metrics import classification_report, confusion_matrix, roc_curve, precision_recall_curve, auc

def generate_evaluation_report(y_true: list[int], y_scores: list[float], model_name: str = "AuraLens Core"):
    """
    Computes comprehensive evaluation metrics including ROC, PR, and Confusion Matrix.
    """
    y_true = np.array(y_true)
    y_scores = np.array(y_scores)
    y_pred = (y_scores >= 0.5).astype(int)
    
    cm = confusion_matrix(y_true, y_pred).tolist()
    report = classification_report(y_true, y_pred, target_names=["Likely Human", "AI-Generated"], output_dict=True)
    
    fpr, tpr, _ = roc_curve(y_true, y_scores)
    roc_auc = float(auc(fpr, tpr))
    
    precision, recall, _ = precision_recall_curve(y_true, y_scores)
    
    roc_data = [{"fpr": round(float(f), 4), "tpr": round(float(t), 4)} for f, t in zip(fpr[::max(1, len(fpr)//50)], tpr[::max(1, len(tpr)//50)])]
    pr_data = [{"precision": round(float(p), 4), "recall": round(float(r), 4)} for p, r in zip(precision[::max(1, len(precision)//50)], recall[::max(1, len(recall)//50)])]
    
    eval_result = {
        "model_name": model_name,
        "total_samples": len(y_true),
        "accuracy": round(report["accuracy"], 4),
        "precision": round(report["AI-Generated"]["precision"], 4),
        "recall": round(report["AI-Generated"]["recall"], 4),
        "f1_score": round(report["AI-Generated"]["f1-score"], 4),
        "roc_auc": round(roc_auc, 4),
        "confusion_matrix": cm,
        "roc_curve": roc_data,
        "pr_curve": pr_data
    }
    return eval_result
