import os
import json
import logging
from typing import Any, Dict, List, Optional
import pandas as pd
# pyrefly: ignore [missing-import]
import numpy as np
# pyrefly: ignore [missing-import]
import joblib
# pyrefly: ignore [missing-import]
from fastapi import FastAPI, HTTPException, Request
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from pydantic import BaseModel, Field
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

from preprocess import map_frontend_payload_to_ml_features

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("cardwise-ml")

app = FastAPI(
    title="CardWise ML Prediction Service",
    description="Credit Card Approval Machine Learning Inference API powered by Scikit-Learn Random Forest",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.getenv("MODEL_PATH", "models/cardwise_model.pkl")
MODEL_METADATA_PATH = os.getenv("MODEL_METADATA_PATH", "models/model_metadata.json")

# Global in-memory cache for model & metadata
ml_model = None
ml_metadata = None

def load_artifacts():
    global ml_model, ml_metadata
    if os.path.exists(MODEL_PATH):
        try:
            ml_model = joblib.load(MODEL_PATH)
            logger.info(f"Loaded ML model pipeline from: {MODEL_PATH}")
        except Exception as e:
            logger.error(f"Failed to load model from {MODEL_PATH}: {e}")
            ml_model = None
    else:
        logger.warning(f"Model file not found at {MODEL_PATH}")
        ml_model = None

    if os.path.exists(MODEL_METADATA_PATH):
        try:
            with open(MODEL_METADATA_PATH, "r") as f:
                ml_metadata = json.load(f)
            logger.info(f"Loaded model metadata from: {MODEL_METADATA_PATH}")
        except Exception as e:
            logger.error(f"Failed to load metadata from {MODEL_METADATA_PATH}: {e}")
            ml_metadata = None

# Load on startup
load_artifacts()

# Configurable Risk Thresholds
# 70 - 100 -> Low Risk, LIKELY ELIGIBLE
# 50 - 69  -> Medium Risk, MODERATELY ELIGIBLE
# 0  - 49  -> High Risk, UNLIKELY ELIGIBLE
RISK_THRESHOLDS = {
    "low_risk_min": 70,
    "medium_risk_min": 50
}

class PredictRequest(BaseModel):
    fullName: Optional[str] = None
    email: Optional[str] = None
    age: Optional[float] = 28.0
    gender: Optional[str] = "Female"
    education: Optional[str] = "Bachelor Degree"
    educationLevel: Optional[str] = None
    maritalStatus: Optional[str] = "Single"
    dependents: Optional[float] = 0
    employmentStatus: Optional[str] = "Employed Full-Time"
    employmentYears: Optional[float] = 3.0
    annualIncome: Optional[float] = 650000.0
    monthlyIncome: Optional[float] = 54000.0
    monthlyExpenses: Optional[float] = 22000.0
    existingLoans: Optional[float] = 0.0
    creditScore: Optional[float] = 720.0
    creditUtilization: Optional[float] = 25.0
    previousDefaults: Optional[Any] = "no"
    creditHistoryLength: Optional[float] = 4.0
    creditHistory: Optional[float] = None
    industry: Optional[str] = "Financials"
    ethnicity: Optional[str] = "White"
    citizen: Optional[str] = "ByBirth"

    model_config = {
        "extra": "allow"
    }

class PredictResponse(BaseModel):
    success: bool
    prediction: str
    probability: float
    eligibilityScore: int
    riskLevel: str
    predictionFactors: List[str]
    breakdown: Dict[str, int]
    recommendations: List[str]
    modelUsed: str

@app.get("/")
def read_root():
    return {
        "service": "CardWise ML Prediction Service",
        "version": "1.0.0",
        "status": "online",
        "endpoints": {
            "health": "/health",
            "predict": "/predict",
            "model_info": "/model-info",
            "docs": "/docs"
        }
    }

@app.get("/health")
def health_check():
    if ml_model is None and os.path.exists(MODEL_PATH):
        load_artifacts()

    return {
        "status": "ok",
        "service": "CardWise ML Service",
        "model_loaded": ml_model is not None,
        "model_name": ml_metadata.get("model_name") if ml_metadata else None,
        "training_date": ml_metadata.get("training_date") if ml_metadata else None,
        "model_accuracy": ml_metadata.get("metrics", {}).get("accuracy") if ml_metadata else None
    }

@app.get("/model-info")
def get_model_info():
    if os.path.exists(MODEL_METADATA_PATH):
        try:
            with open(MODEL_METADATA_PATH, "r") as f:
                return json.load(f)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to read model metadata: {e}")

    if ml_metadata:
        return ml_metadata

    raise HTTPException(status_code=404, detail="Model metadata not found. Train the model first via train_model.py")

@app.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest):
    if ml_model is None and os.path.exists(MODEL_PATH):
        load_artifacts()

    if ml_model is None:
        raise HTTPException(
            status_code=503,
            detail="ML Model artifact not found. Please run train_model.py to train and save the model."
        )

    # 1. Transform raw payload to ML features
    data_dict = payload.model_dump()
    input_df = map_frontend_payload_to_ml_features(data_dict)

    # 2. Model Inference
    try:
        if hasattr(ml_model, "predict_proba"):
            probs = ml_model.predict_proba(input_df)[0]
            # Probability of Class 1 (APPROVED)
            probability = float(probs[1]) if len(probs) > 1 else float(probs[0])
        else:
            pred = ml_model.predict(input_df)[0]
            probability = 0.90 if pred == 1 else 0.15
    except Exception as e:
        logger.error(f"Inference error: {e}")
        raise HTTPException(status_code=500, detail=f"ML Model inference error: {str(e)}")

    # 3. Convert Probability to Eligibility Score (0 - 100)
    # Note: eligibilityScore is CardWise's ML-based approval likelihood (0-100), not an official CIBIL score.
    eligibility_score = int(np.clip(round(probability * 100), 5, 98))

    # 4. Determine Prediction Label & Risk Tier
    if eligibility_score >= RISK_THRESHOLDS["low_risk_min"]:
        prediction_label = "LIKELY ELIGIBLE"
        risk_label = "Low Risk"
    elif eligibility_score >= RISK_THRESHOLDS["medium_risk_min"]:
        prediction_label = "MODERATELY ELIGIBLE"
        risk_label = "Medium Risk"
    else:
        prediction_label = "UNLIKELY ELIGIBLE"
        risk_label = "High Risk"

    # 5. Extract Contextual Factors based on model features & input
    cs_raw = float(data_dict.get("creditScore") or 700)
    years_emp = float(data_dict.get("employmentYears") or 3)
    defaults = str(data_dict.get("previousDefaults") or "no").lower() in ["yes", "true", "1"]
    income = float(data_dict.get("annualIncome") or 600000)
    expenses = float(data_dict.get("monthlyExpenses") or 20000)
    loans = float(data_dict.get("existingLoans") or 0)
    utilization = float(data_dict.get("creditUtilization") or 25)

    factors = []
    if defaults:
        factors.append("Prior default flag significantly reduces approval odds")
    else:
        factors.append("Clean repayment record with zero prior defaults")

    if cs_raw >= 740:
        factors.append(f"Strong credit score baseline ({int(cs_raw)})")
    elif cs_raw >= 650:
        factors.append(f"Moderate credit score ({int(cs_raw)})")
    else:
        factors.append(f"Credit score ({int(cs_raw)}) below standard prime tier")

    if years_emp >= 3:
        factors.append(f"High employment tenure ({years_emp:.1f} yrs) demonstrates stability")
    else:
        factors.append(f"Recent employment duration ({years_emp:.1f} yrs)")

    # 6. Ratings Breakdown
    breakdown = {
        "creditScoreRating": int(np.clip(round(((cs_raw - 300) / 550) * 100), 10, 100)),
        "incomeStability": int(np.clip(round((income / 600000) * 70 + (years_emp * 6)), 15, 100)),
        "debtLevelRating": int(np.clip(round(100 - (loans * 20) - (expenses / (income / 12) * 30 if income > 0 else 40)), 10, 100)),
        "creditUtilizationRating": int(np.clip(round(100 - utilization), 10, 100))
    }

    # 7. Actionable Recommendations
    recommendations = []
    if defaults:
        recommendations.append("Rebuild credit profile with 12+ months of consistent, on-time payments.")
    if utilization > 30:
        recommendations.append("Reduce revolving credit card balances below 30% utilization.")
    if cs_raw < 750:
        recommendations.append("Maintain low credit balance-to-limit ratios to lift credit rating.")
    if loans > 1:
        recommendations.append("Pay down existing active loan liabilities.")
    if not recommendations:
        recommendations.append("Maintain optimal credit utilization and continue on-time repayment habits.")

    model_name = ml_metadata.get("model_name", "Random Forest Classifier") if ml_metadata else "Random Forest Classifier"

    return PredictResponse(
        success=True,
        prediction=prediction_label,
        probability=round(float(probability), 4),
        eligibilityScore=eligibility_score,
        riskLevel=risk_label,
        predictionFactors=factors[:3],
        breakdown=breakdown,
        recommendations=recommendations,
        modelUsed=model_name
    )
