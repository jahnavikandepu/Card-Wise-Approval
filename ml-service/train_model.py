import os
import sys
import glob
import json
import argparse
from datetime import datetime
import pandas as pd
# pyrefly: ignore [missing-import]
import numpy as np
# pyrefly: ignore [missing-import]
import joblib
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)

# Reconfigure stdout for UTF-8 compatibility on Windows
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from preprocess import (
    build_cardwise_preprocessor,
    NUMERICAL_FEATURES,
    BINARY_FEATURES,
    CATEGORICAL_FEATURES,
    FEATURE_COLUMNS,
    EXCLUDED_COLUMNS
)

def parse_args():
    parser = argparse.ArgumentParser(description="CardWise ML Model Training Pipeline")
    parser.add_argument("--dataset-dir", type=str, default="dataset", help="Directory containing dataset CSV")
    parser.add_argument("--output-model", type=str, default="models/cardwise_model.pkl", help="Model artifact path")
    parser.add_argument("--output-metadata", type=str, default="models/model_metadata.json", help="Metadata path")
    return parser.parse_args()

def main():
    args = parse_args()
    print("=" * 70)
    print("CardWise Credit Card Approval - ML Model Training Pipeline")
    print("=" * 70)

    # 1. Locate Dataset
    candidates = [
        os.path.join(args.dataset_dir, "clean_dataset.csv"),
        os.path.join(args.dataset_dir, "clean_dataset.csv.csv"),
        os.path.join(args.dataset_dir, "crx.csv"),
        os.path.join(args.dataset_dir, "crx.csv.csv")
    ]
    dataset_path = None
    for candidate in candidates:
        if os.path.exists(candidate):
            dataset_path = candidate
            break
    
    if not dataset_path:
        csv_files = glob.glob(os.path.join(args.dataset_dir, "*.csv*"))
        if not csv_files:
            print(f"Error: No dataset found in {args.dataset_dir}/")
            return
        dataset_path = csv_files[0]

    print(f"\nLoading dataset from: {dataset_path}")
    df = pd.read_csv(dataset_path)

    # 2. Dataset Inspection & Summary
    print("\n--- STEP 1: DATASET INSPECTION ---")
    print(f"Total Rows: {len(df):,}")
    print(f"Total Columns: {len(df.columns)}")
    print(f"Column Names: {list(df.columns)}")
    print(f"Data Types:\n{df.dtypes.to_string()}")
    print(f"Total Missing Values: {df.isnull().sum().sum()}")
    print(f"Duplicate Rows: {df.duplicated().sum()}")

    # 3. Target Identification & Mapping
    target_col = "Approved" if "Approved" in df.columns else df.columns[-1]
    print("\n--- STEP 2: TARGET IDENTIFICATION & MAPPING ---")
    print(f"Target Column: '{target_col}'")
    
    # Target value mapping:
    # 1 -> APPROVED (Positive Class)
    # 0 -> REJECTED (Negative Class)
    y = df[target_col].copy()
    if not pd.api.types.is_numeric_dtype(y):
        positive_labels = ["+", "1", 1, "Y", "yes", "YES", "Approved", "approved"]
        y = y.apply(lambda x: 1 if x in positive_labels else 0)

    class_counts = y.value_counts().to_dict()
    print("Target Distribution:")
    print(f"  Class 1 (APPROVED): {class_counts.get(1, 0):,} ({class_counts.get(1, 0)/len(y)*100:.1f}%)")
    print(f"  Class 0 (REJECTED): {class_counts.get(0, 0):,} ({class_counts.get(0, 0)/len(y)*100:.1f}%)")

    # 4. Feature Selection
    print("\n--- STEP 3: FEATURE SELECTION ---")
    available_features = [c for c in FEATURE_COLUMNS if c in df.columns]
    excluded = [c for c in df.columns if c not in available_features and c != target_col]
    print(f"Selected Numerical Features ({len(NUMERICAL_FEATURES)}): {NUMERICAL_FEATURES}")
    print(f"Selected Binary Features ({len(BINARY_FEATURES)}): {BINARY_FEATURES}")
    print(f"Selected Categorical Features ({len(CATEGORICAL_FEATURES)}): {CATEGORICAL_FEATURES}")
    print(f"Excluded Features ({len(excluded)}): {excluded} (Excluded: high cardinality/postal identifiers to prevent geographic overfitting)")

    X = df[available_features]

    # 5. Train / Test Split (Stratified 80/20)
    print("\n--- STEP 4: STRATIFIED TRAIN/TEST SPLIT ---")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"Training Set: {len(X_train)} samples | Test Set: {len(X_test)} samples")

    # 6. Preprocessing Pipeline Construction
    preprocessor = build_cardwise_preprocessor()

    # 7. Model Training & Comparison
    print("\n--- STEP 5: MODEL TRAINING & COMPARISON ---")

    # A. Baseline: Logistic Regression
    print("1. Training Logistic Regression Baseline (class_weight='balanced')...")
    lr_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', LogisticRegression(class_weight='balanced', max_iter=1000, random_state=42))
    ])
    lr_pipeline.fit(X_train, y_train)
    lr_pred = lr_pipeline.predict(X_test)
    lr_prob = lr_pipeline.predict_proba(X_test)[:, 1]

    # B. Primary: Random Forest Classifier
    print("2. Training Random Forest Classifier (150 estimators, class_weight='balanced')...")
    rf_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(
            n_estimators=150,
            max_depth=10,
            min_samples_split=4,
            min_samples_leaf=2,
            class_weight='balanced',
            random_state=42,
            n_jobs=-1
        ))
    ])
    rf_pipeline.fit(X_train, y_train)
    rf_pred = rf_pipeline.predict(X_test)
    rf_prob = rf_pipeline.predict_proba(X_test)[:, 1]

    def compute_metrics(y_true, y_pred, y_prob):
        return {
            "accuracy": accuracy_score(y_true, y_pred),
            "precision": precision_score(y_true, y_pred, zero_division=0),
            "recall": recall_score(y_true, y_pred, zero_division=0),
            "f1": f1_score(y_true, y_pred, zero_division=0),
            "roc_auc": roc_auc_score(y_true, y_prob),
            "confusion_matrix": confusion_matrix(y_true, y_pred).tolist()
        }

    lr_res = compute_metrics(y_test, lr_pred, lr_prob)
    rf_res = compute_metrics(y_test, rf_pred, rf_prob)

    print("\n--- EVALUATION METRICS TABLE ---")
    print(f"{'Metric':<16} | {'Logistic Regression':<20} | {'Random Forest':<20}")
    print("-" * 62)
    for m in ["accuracy", "precision", "recall", "f1", "roc_auc"]:
        print(f"{m.upper():<16} | {lr_res[m]:<20.4f} | {rf_res[m]:<20.4f}")

    print("\n--- RANDOM FOREST CLASSIFICATION REPORT ---")
    print(classification_report(y_test, rf_pred, target_names=["REJECTED (0)", "APPROVED (1)"]))

    # 8. Model Selection
    if rf_res["f1"] >= lr_res["f1"] or rf_res["roc_auc"] >= lr_res["roc_auc"]:
        selected_name = "Random Forest Classifier"
        selected_pipeline = rf_pipeline
        selected_metrics = rf_res
    else:
        selected_name = "Logistic Regression"
        selected_pipeline = lr_pipeline
        selected_metrics = lr_res

    print(f"Selected Best Model: {selected_name}")

    # 9. Extract Feature Importance
    feature_importances = {}
    if isinstance(selected_pipeline.named_steps['classifier'], RandomForestClassifier):
        try:
            cat_encoder = selected_pipeline.named_steps['preprocessor'].named_transformers_['cat'].named_steps['onehot']
            cat_feature_names = list(cat_encoder.get_feature_names_out(CATEGORICAL_FEATURES))
            all_feature_names = NUMERICAL_FEATURES + BINARY_FEATURES + cat_feature_names

            clf = selected_pipeline.named_steps['classifier']
            importances = clf.feature_importances_
            sorted_indices = np.argsort(importances)[::-1]

            print("\n--- TOP 10 MOST INFLUENTIAL FEATURES ---")
            for rank, idx in enumerate(sorted_indices[:10], 1):
                fname = all_feature_names[idx] if idx < len(all_feature_names) else f"feature_{idx}"
                imp = round(float(importances[idx]), 4)
                feature_importances[fname] = imp
                print(f"  {rank:2d}. {fname:<30}: {imp*100:.2f}%")
        except Exception as e:
            print(f"Note: Error resolving feature names: {e}")

    # 10. Save Artifacts
    os.makedirs(os.path.dirname(args.output_model), exist_ok=True)
    joblib.dump(selected_pipeline, args.output_model)
    print(f"\nSaved trained pipeline to: {args.output_model}")

    metadata = {
        "model_name": selected_name,
        "algorithm": "Random Forest (n_estimators=150, max_depth=10, balanced)",
        "dataset_filename": os.path.basename(dataset_path),
        "training_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "samples_total": len(df),
        "samples_train": len(X_train),
        "samples_test": len(X_test),
        "features": {
            "numerical": NUMERICAL_FEATURES,
            "binary": BINARY_FEATURES,
            "categorical": CATEGORICAL_FEATURES,
            "selected_count": len(available_features),
            "all_selected": available_features
        },
        "target_column": target_col,
        "target_mapping": {
            "1": "APPROVED",
            "0": "REJECTED"
        },
        "class_distribution": {
            "approved_count": int(class_counts.get(1, 0)),
            "rejected_count": int(class_counts.get(0, 0))
        },
        "metrics": {
            "accuracy": round(selected_metrics["accuracy"] * 100, 2),
            "precision": round(selected_metrics["precision"] * 100, 2),
            "recall": round(selected_metrics["recall"] * 100, 2),
            "f1_score": round(selected_metrics["f1"] * 100, 2),
            "roc_auc": round(selected_metrics["roc_auc"] * 100, 2),
            "confusion_matrix": selected_metrics["confusion_matrix"]
        },
        "feature_importances": feature_importances
    }

    os.makedirs(os.path.dirname(args.output_metadata), exist_ok=True)
    with open(args.output_metadata, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"Saved training metadata to: {args.output_metadata}")

    print("\nTraining Complete Successfully!")

if __name__ == "__main__":
    main()
