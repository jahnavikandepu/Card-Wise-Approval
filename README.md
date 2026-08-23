# CardWise – AI Credit Card Eligibility Prediction System

> **"Know your credit eligibility before you apply."**

CardWise is an AI-powered credit card approval intelligence platform that evaluates applicant financial stability and risk likelihood using supervised machine learning classification models before initiating hard inquiries with financial institutions.

---

## 🏛️ System Architecture

```
CardWise/
│
├── frontend/                 # React 18 + Vite Frontend (Port 5173)
│   ├── src/
│   │   ├── components/       # Reusable UI & Fintech Components
│   │   ├── pages/            # Home, Apply, Result, Simulator, Applications, Dashboard
│   │   ├── services/         # Axios API Client (http://localhost:5000/api)
│   │   └── hooks/            # Custom React Hooks (usePrediction, useAuth)
│
├── backend/                  # Node.js + Express + Mongoose Backend (Port 5000)
│   ├── config/               # MongoDB Atlas Connection
│   ├── controllers/          # Application Controller Handlers
│   ├── models/               # Mongoose Application Schema
│   ├── routes/               # REST API Routes (/api/applications)
│   ├── services/             # ML Integration Service (calls Python ML on :8000)
│   └── middleware/           # express-validator & Centralized Error Handlers
│
└── ml-service/               # Python FastAPI ML Microservice (Port 8000)
    ├── dataset/              # Dataset directory (.csv placeholder)
    ├── models/               # Saved model artifacts (.pkl, .json)
    ├── app.py                # FastAPI endpoints (/health, /predict, /model-info)
    ├── train_model.py        # Random Forest & Logistic Regression Training Pipeline
    ├── preprocess.py         # ColumnTransformer Preprocessing Pipeline
    ├── requirements.txt      # Python dependencies
    └── README.md             # ML Service setup & training documentation
```

### Complete End-to-End Flow
```
React Frontend (http://localhost:5173)
  ↓ HTTP POST http://localhost:5000/api/applications
Node.js Express Backend (http://localhost:5000)
  ↓ HTTP POST http://localhost:8000/predict
Python FastAPI ML Service (http://localhost:8000)
  ↓ Random Forest Inference Engine
Returns { prediction, probability, eligibilityScore, riskLevel, ... }
  ↓
Node.js persists full application dossier into MongoDB Atlas
  ↓
React Frontend renders Score Gauge, Risk Category & Decision Factors
```

---

## 🚀 Running CardWise Locally

### 1. Python ML Microservice (Port 8000)
```powershell
cd ml-service

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install requirements
pip install -r requirements.txt

# (Optional) Train model after placing your CSV in dataset/
python train_model.py

# Start FastAPI server
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Node.js Backend (Port 5000)
```powershell
cd backend
npm install
npm run dev
```

### 3. React Frontend (Port 5173)
```powershell
cd frontend
npm install
npm run dev
```

Open your browser at `http://localhost:5173`.
