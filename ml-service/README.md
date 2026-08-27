# CardWise — Machine Learning Prediction Microservice

A standalone Python FastAPI service designed to train and serve supervised machine-learning models (Random Forest Classifier & Logistic Regression baseline) for credit card approval eligibility prediction.

---

## 🏗️ Directory Structure

```
ml-service/
├── dataset/
│   └── .gitkeep              # Place your CSV dataset here
├── models/
│   └── .gitkeep              # Trained model pipeline (.pkl) and metadata (.json)
├── preprocess.py             # Feature identification & ColumnTransformer pipeline
├── train_model.py            # Supervised training & model selection script
├── app.py                    # FastAPI server exposing prediction endpoints
├── requirements.txt          # Python dependencies
├── .env.example              # Configuration variables
└── README.md                 # Documentation
```

---

## 🚀 Quick Setup Guide (Windows)

### 1. Create and Activate Virtual Environment
Open a terminal in the `ml-service` folder:

```powershell
cd ml-service

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Or in Command Prompt:
# .\venv\Scripts\activate.bat
```

### 2. Install Dependencies
```powershell
pip install -r requirements.txt
```

---

## 📊 Training the Machine Learning Model

### 1. Place Your Dataset
Copy your credit card approval dataset (CSV format) into the `dataset/` folder:
```
ml-service/dataset/your_dataset.csv
```

### 2. Run the Training Pipeline
```powershell
python train_model.py
```

Optional arguments:
```powershell
# Specify a custom target column name (e.g. Approved, Status, Class)
python train_model.py --target-col Approved
```

### What `train_model.py` Does:
1. Validates that a CSV dataset exists in `dataset/`.
2. Displays exploratory statistics: row/column count, missing values per column, duplicates, and class distribution.
3. Automatically identifies numerical and categorical features.
4. Builds a scikit-learn preprocessing pipeline (`SimpleImputer`, `OneHotEncoder`, `StandardScaler`).
5. Performs a stratified 80/20 train-test split.
6. Trains both a **Logistic Regression** baseline and a **Random Forest Classifier**.
7. Compares models across **Accuracy, Precision, Recall, F1-Score, and ROC-AUC**.
8. Selects the superior model and exports:
   - `models/cardwise_model.pkl` (Complete end-to-end pipeline)
   - `models/model_metadata.json` (Evaluation metrics, feature importances, training timestamp)

---

## ⚡ Running the FastAPI Prediction Service

### Start the Service
```powershell
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

The service will be live at:
- **API URL**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`

---

## 🧪 Testing the Endpoints

### 1. Health Check
```powershell
curl http://localhost:8000/health
```

**Response:**
```json
{
  "status": "ok",
  "service": "CardWise ML Service",
  "model_loaded": true,
  "model_name": "Random Forest Classifier",
  "training_date": "2026-08-22 22:00:00"
}
```

### 2. Predict Eligibility
```powershell
curl -X POST http://localhost:8000/predict `
  -H "Content-Type: application/json" `
  -d '{
    "fullName": "Alex Morgan",
    "age": 27,
    "gender": "Female",
    "education": "Master'\''s Degree",
    "maritalStatus": "Single",
    "dependents": 0,
    "employmentStatus": "Employed Full-Time",
    "employmentYears": 4,
    "annualIncome": 850000,
    "monthlyIncome": 70833,
    "monthlyExpenses": 22000,
    "existingLoans": 0,
    "creditScore": 765,
    "creditUtilization": 20,
    "previousDefaults": "no",
    "creditHistoryLength": 5
  }'
```

**Response:**
```json
{
  "success": true,
  "prediction": "LIKELY ELIGIBLE",
  "probability": 0.885,
  "eligibilityScore": 89,
  "riskLevel": "Low Risk",
  "predictionFactors": [
    "Strong credit rating (765) above benchmark",
    "Healthy income-to-expense obligation ratio",
    "Optimal revolving credit utilization (20%)"
  ],
  "breakdown": {
    "creditScoreRating": 85,
    "incomeStability": 95,
    "debtLevelRating": 90,
    "creditUtilizationRating": 80
  },
  "recommendations": [
    "Continue maintaining low credit card utilization and pristine repayment records."
  ],
  "modelUsed": "Random Forest Classifier"
}
```

### 3. Model Information & Feature Importances
```powershell
curl http://localhost:8000/model-info
```

---

## 🔄 Node.js Backend Integration Flow

```
React Frontend (http://localhost:5173)
  ↓ HTTP POST /api/applications
Node.js Express Backend (http://localhost:5000)
  ↓ HTTP POST http://localhost:8000/predict
Python FastAPI ML Service (http://localhost:8000)
  ↓ Random Forest Pipeline Inference (.pkl)
Python returns { prediction, probability, eligibilityScore, riskLevel, ... }
  ↓
Node.js persists full dossier into MongoDB Atlas
  ↓
React Frontend renders Result & Application Dossier
```

---

## 🔁 Retraining with a New Dataset

When you update or replace your CSV dataset:
1. Replace the file inside `dataset/`.
2. Run `python train_model.py`.
3. The new model pipeline and metadata are automatically updated in `models/`.
4. FastAPI hot-reloads the new model artifact on the next request.
