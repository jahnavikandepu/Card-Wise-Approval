# CardWise – Backend API & Microservice Architecture

Backend REST API for **CardWise: AI Credit Card Eligibility Prediction System**, built with Node.js, Express, MongoDB (Mongoose), and express-validator.

---

## 🛠️ Technology Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Validation**: express-validator
- **Cross-Origin**: CORS
- **Environment**: dotenv

---

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection logic
├── controllers/
│   └── applicationController.js # CRUD & statistics controllers
├── models/
│   └── Application.js        # Mongoose schema for credit card applications
├── routes/
│   └── applicationRoutes.js  # Express REST routes mounted at /api/applications
├── services/
│   └── predictionService.js  # Prediction logic (ready for Python FastAPI ML microservice)
├── middleware/
│   ├── validatorMiddleware.js# express-validator request validation
│   └── errorMiddleware.js    # 404 & Centralized Error handling
├── utils/
│   └── applicationId.js      # Generator for sequential CW-XXXX IDs
├── scripts/
│   └── seed.js               # Database seeding script for sample records
├── server.js                 # Express app initialization
├── package.json              # Backend dependencies & scripts
├── .env.example              # Environment variables template
└── README.md                 # Backend documentation
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file from `.env.example`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/cardwise
CLIENT_URL=http://localhost:5173
```

### 3. Seed Sample Applications (Optional)
To populate MongoDB with sample application records (`CW-1001` to `CW-1005`):
```bash
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```
Or for production start:
```bash
npm start
```

---

## 📚 REST API Reference

### Base URL: `http://localhost:5000/api`

---

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Description**: Verify backend server status.
- **Response**:
```json
{
  "success": true,
  "message": "CardWise backend is running",
  "timestamp": "2026-08-22T14:45:00.000Z"
}
```

---

### 2. Submit Application & Predict
- **Endpoint**: `POST /api/applications`
- **Description**: Validate and submit user's financial profile, generate sequential ID (`CW-XXXX`), evaluate mock prediction, and persist to MongoDB.
- **Request Body (JSON)**:
```json
{
  "fullName": "Alex Morgan",
  "email": "alex.morgan@cardwise.io",
  "age": 26,
  "gender": "Female",
  "educationLevel": "Master's Degree",
  "maritalStatus": "Single",
  "dependents": 0,
  "employmentStatus": "Employed Full-Time",
  "employmentYears": 3.5,
  "annualIncome": 650000,
  "monthlyIncome": 54166,
  "monthlyExpenses": 20000,
  "existingLoans": 1,
  "creditScore": 742,
  "creditUtilization": 28,
  "previousDefaults": "no",
  "creditHistory": 4
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "applicationId": "CW-1006",
  "prediction": "LIKELY ELIGIBLE",
  "eligibilityScore": 82,
  "riskLevel": "Low Risk",
  "predictionFactors": [
    "Strong credit score above 720+",
    "Healthy income-to-expense ratio",
    "Favorable credit utilization below 30%"
  ],
  "data": {
    "id": "CW-1006",
    "applicantName": "Alex Morgan",
    "score": 82,
    "prediction": "LIKELY ELIGIBLE",
    "risk": "Low Risk",
    "status": "Completed"
  }
}
```

---

### 3. Get All Applications
- **Endpoint**: `GET /api/applications`
- **Query Parameters**:
  - `status` (optional): `ALL`, `ELIGIBLE` (score >= 70), `PENDING` (score 50–69), `NOT_ELIGIBLE` (score < 50)
  - `search` (optional): Filter by Application ID or applicant name (e.g. `?search=CW-1001`)
- **Response (200 OK)**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "CW-1001",
      "applicantName": "Alex Morgan",
      "applicantEmail": "alex.morgan@cardwise.io",
      "date": "2026-08-22",
      "score": 82,
      "prediction": "LIKELY ELIGIBLE",
      "risk": "Low Risk",
      "status": "Completed",
      "income": 650000,
      "creditScore": 742,
      "loans": 1,
      "utilization": 28
    }
  ]
}
```

---

### 4. Get Application Portfolio Statistics
- **Endpoint**: `GET /api/applications/statistics`
- **Description**: Returns aggregated metrics supporting the status filter pills.
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "total": 5,
    "eligible": 3,
    "moderate": 1,
    "notEligible": 1
  }
}
```

---

### 5. Get Application Details by ID
- **Endpoint**: `GET /api/applications/:applicationId`
- **Description**: Retrieve complete profile, timeline, and prediction score breakdown for a specific application.
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "CW-1001",
    "applicantName": "Alex Morgan",
    "applicantEmail": "alex.morgan@cardwise.io",
    "date": "2026-08-22",
    "score": 82,
    "prediction": "LIKELY ELIGIBLE",
    "risk": "Low Risk",
    "status": "Completed",
    "income": 650000,
    "creditScore": 742,
    "loans": 1,
    "utilization": 28,
    "timeline": [
      { "step": "Application Submitted", "date": "22 Aug 2026, 10:14 AM", "completed": true },
      { "step": "Profile Analyzed", "date": "22 Aug 2026, 10:14 AM", "completed": true },
      { "step": "Prediction Generated", "date": "22 Aug 2026, 10:15 AM", "completed": true },
      { "step": "Result Available", "date": "22 Aug 2026, 10:15 AM", "completed": true }
    ],
    "details": {
      "fullName": "Alex Morgan",
      "age": 26,
      "gender": "Female",
      "education": "Master's Degree",
      "maritalStatus": "Single",
      "dependents": 0,
      "employmentStatus": "Employed Full-Time",
      "employmentYears": 3.5,
      "annualIncome": 650000,
      "monthlyIncome": 54166,
      "monthlyExpenses": 20000,
      "existingLoans": 1,
      "creditScore": 742,
      "creditUtilization": 28,
      "previousDefaults": "no"
    },
    "predictionResult": {
      "score": 82,
      "prediction": "LIKELY ELIGIBLE",
      "risk": "Low Risk",
      "breakdown": {
        "creditScoreRating": 85,
        "incomeStability": 78,
        "debtLevelRating": 72,
        "creditUtilizationRating": 81
      },
      "positiveFactors": [
        "Strong credit score above 720+",
        "Healthy income-to-expense ratio"
      ],
      "recommendations": [
        "Maintain timely on-time payments across all active accounts."
      ]
    }
  }
}
```

---

### 6. Delete Application
- **Endpoint**: `DELETE /api/applications/:applicationId`
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Application CW-1001 deleted successfully"
}
```

---

## 🔮 Future Python ML FastAPI Integration

When the Python FastAPI ML microservice is ready, update `backend/services/predictionService.js`:

```javascript
// Replace mock logic with FastAPI endpoint call:
const response = await axios.post('http://localhost:8000/predict', {
  creditScore: applicationData.creditScore,
  annualIncome: applicationData.annualIncome,
  monthlyExpenses: applicationData.monthlyExpenses,
  existingLoans: applicationData.existingLoans,
  employmentYears: applicationData.employmentYears,
  creditUtilization: applicationData.creditUtilization,
  previousDefaults: applicationData.previousDefaults
});

return response.data;
```
