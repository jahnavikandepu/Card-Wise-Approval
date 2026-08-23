import axios from 'axios';

/**
 * CardWise Prediction Service
 * 
 * Integrates with Python FastAPI Machine Learning microservice.
 * ML API Endpoint: POST ${ML_SERVICE_URL}/predict
 */

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
const ML_TIMEOUT_MS = 60000;

export const generatePrediction = async (applicationData) => {
  const targetUrl = `${ML_SERVICE_URL.replace(/\/$/, '')}/predict`;

  try {
    const payload = {
      fullName: applicationData.fullName,
      email: applicationData.email,
      age: Number(applicationData.age),
      gender: applicationData.gender,
      education: applicationData.education || applicationData.educationLevel,
      educationLevel: applicationData.educationLevel || applicationData.education,
      maritalStatus: applicationData.maritalStatus,
      dependents: Number(applicationData.dependents ?? 0),
      employmentStatus: applicationData.employmentStatus,
      employmentYears: Number(applicationData.employmentYears ?? 0),
      annualIncome: Number(applicationData.annualIncome ?? 0),
      monthlyIncome: Number(applicationData.monthlyIncome ?? 0),
      monthlyExpenses: Number(applicationData.monthlyExpenses ?? 0),
      existingLoans: Number(applicationData.existingLoans ?? 0),
      creditScore: Number(applicationData.creditScore ?? 700),
      creditUtilization: Number(applicationData.creditUtilization ?? 30),
      previousDefaults: applicationData.previousDefaults,
      creditHistoryLength: Number(applicationData.creditHistoryLength || applicationData.creditHistory || 0),
      creditHistory: Number(applicationData.creditHistory || applicationData.creditHistoryLength || 0)
    };

    const response = await axios.post(targetUrl, payload, {
      timeout: ML_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.success) {
      return {
        eligibilityScore: response.data.eligibilityScore,
        prediction: response.data.prediction,
        riskLevel: response.data.riskLevel,
        probability: response.data.probability,
        predictionFactors: response.data.predictionFactors || [],
        breakdown: response.data.breakdown || {},
        recommendations: response.data.recommendations || [],
        modelUsed: response.data.modelUsed || 'Python FastAPI ML Service'
      };
    }

    throw new Error('ML Service returned an unsuccessful response structure');
  } catch (error) {
    console.error(`[CardWise ML Service Error] Connection failed to ${targetUrl}:`, error.message);

    // If ML service is unavailable, check whether we should throw or handle
    // Throw an informative error so the controller can report it cleanly
    const errorDetails = error.response?.data?.detail || error.message;
    const isConnectionRefused = error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED') || error.code === 'ETIMEDOUT';

    const err = new Error(
      isConnectionRefused
        ? `ML Service is currently unreachable at ${ML_SERVICE_URL}. Please ensure the Python FastAPI service is running (uvicorn app:app --port 8000).`
        : `ML Prediction failed: ${errorDetails}`
    );
    err.statusCode = 503;
    err.isMlError = true;
    throw err;
  }
};

export default { generatePrediction };
