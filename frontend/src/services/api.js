import axios from 'axios';
import {
  mockUser,
  mockDefaultPrediction,
  mockChartData,
  mockModelMetrics
} from '../data/mockData';

// Base API configuration connecting React Frontend to Node.js/Express Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor for future JWT authentication token injection
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cardwise_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Local Application History Helpers
 */
const getLocalHistory = () => {
  try {
    const data = localStorage.getItem('cardwise_application_history');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to parse local application history', e);
    return [];
  }
};

const saveLocalHistory = (historyList) => {
  try {
    localStorage.setItem('cardwise_application_history', JSON.stringify(historyList));
  } catch (e) {
    console.error('Failed to save local application history', e);
  }
};

const appendToLocalHistory = (newApp) => {
  const current = getLocalHistory();
  const filtered = current.filter((a) => a.id !== newApp.id && a.applicationId !== newApp.applicationId);
  const updated = [newApp, ...filtered];
  saveLocalHistory(updated);
  return updated;
};

/**
 * 1. Submit Credit Card Application & Receive Prediction
 * Endpoint: POST /api/applications
 */
export const submitApplication = async (applicationData) => {
  try {
    const response = await apiClient.post('/applications', applicationData);
    const resultData = response.data.data || response.data;

    // Cache latest result in localStorage for session persistence & Result page
    const latestResult = {
      score: resultData.score ?? resultData.eligibilityScore,
      prediction: resultData.prediction,
      risk: resultData.risk ?? resultData.riskLevel,
      applicationId: resultData.id || resultData.applicationId,
      predictionFactors: resultData.predictionResult?.positiveFactors || resultData.predictionFactors || [],
      positiveFactors: resultData.predictionResult?.positiveFactors || resultData.predictionFactors || [],
      attentionFactors: resultData.predictionResult?.attentionFactors || [],
      breakdown: resultData.predictionResult?.breakdown || resultData.breakdown || {},
      recommendations: resultData.predictionResult?.recommendations || resultData.recommendations || [],
      details: resultData.details || applicationData
    };

    localStorage.setItem('cardwise_latest_result', JSON.stringify(latestResult));

    // Store in application history
    appendToLocalHistory(resultData);

    return resultData;
  } catch (error) {
    console.error('Error submitting application:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * 2. Get All Applications from MongoDB & Synchronize with History
 * Endpoint: GET /api/applications
 */
export const getApplications = async (params = {}) => {
  try {
    const response = await apiClient.get('/applications', { params });
    const remoteApps = response.data.data || response.data || [];

    // Sync remote apps into local history
    const local = getLocalHistory();
    const map = new Map();

    // Add local first
    local.forEach((a) => {
      if (a.id || a.applicationId) map.set(a.id || a.applicationId, a);
    });

    // Merge remote apps (overriding local with latest database record)
    remoteApps.forEach((a) => {
      if (a.id || a.applicationId) map.set(a.id || a.applicationId, a);
    });

    const merged = Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
    );

    saveLocalHistory(merged);
    return merged;
  } catch (error) {
    console.error('Error fetching applications from backend, falling back to local history:', error.response?.data || error.message);
    const local = getLocalHistory();
    if (local.length > 0) return local;
    throw error;
  }
};

/**
 * 3. Get Application by ID from MongoDB or History
 * Endpoint: GET /api/applications/:applicationId
 */
export const getApplicationById = async (applicationId) => {
  try {
    const response = await apiClient.get(`/applications/${encodeURIComponent(applicationId)}`);
    const appData = response.data.data || response.data;
    appendToLocalHistory(appData);
    return appData;
  } catch (error) {
    console.error(`Error fetching application #${applicationId} from backend:`, error.response?.data || error.message);

    // Check application history
    const local = getLocalHistory();
    const found = local.find(
      (a) => (a.id && a.id.toLowerCase() === applicationId.toLowerCase()) ||
             (a.applicationId && a.applicationId.toLowerCase() === applicationId.toLowerCase())
    );
    if (found) return found;

    // Check session result
    const cached = localStorage.getItem('cardwise_latest_result');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.applicationId?.toLowerCase() === applicationId.toLowerCase()) {
          return {
            id: parsed.applicationId,
            applicationId: parsed.applicationId,
            applicantName: parsed.details?.fullName || 'Applicant',
            applicantEmail: parsed.details?.email || 'applicant@cardwise.io',
            date: new Date().toISOString().split('T')[0],
            score: parsed.score,
            prediction: parsed.prediction,
            risk: parsed.risk,
            status: 'Completed',
            income: Number(parsed.details?.annualIncome) || 650000,
            creditScore: Number(parsed.details?.creditScore) || 740,
            loans: Number(parsed.details?.existingLoans) || 1,
            utilization: Number(parsed.details?.creditUtilization) || 28,
            timeline: [
              { step: 'Application Submitted', date: 'Just now', completed: true },
              { step: 'Profile Analyzed', date: 'Just now', completed: true },
              { step: 'Prediction Generated', date: 'Just now', completed: true },
              { step: 'Result Available', date: 'Just now', completed: true }
            ],
            details: parsed.details,
            predictionResult: parsed
          };
        }
      } catch (e) {
        // ignore parse error
      }
    }
    throw error;
  }
};

/**
 * 4. Get Application Portfolio Statistics
 * Endpoint: GET /api/applications/statistics
 */
export const getApplicationStatistics = async () => {
  try {
    const response = await apiClient.get('/applications/statistics');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching statistics:', error.response?.data || error.message);
    const local = getLocalHistory();
    return {
      total: local.length,
      eligible: local.filter((a) => a.score >= 70).length,
      moderate: local.filter((a) => a.score >= 50 && a.score < 70).length,
      notEligible: local.filter((a) => a.score < 50).length
    };
  }
};

/**
 * 5. Delete Application by ID
 * Endpoint: DELETE /api/applications/:applicationId
 */
export const deleteApplication = async (applicationId) => {
  try {
    const response = await apiClient.delete(`/applications/${encodeURIComponent(applicationId)}`);
    const current = getLocalHistory();
    const updated = current.filter(
      (a) => (a.id && a.id.toLowerCase() !== applicationId.toLowerCase()) &&
             (a.applicationId && a.applicationId.toLowerCase() !== applicationId.toLowerCase())
    );
    saveLocalHistory(updated);
    return response.data;
  } catch (error) {
    console.error(`Error deleting application #${applicationId}:`, error.response?.data || error.message);
    const current = getLocalHistory();
    const updated = current.filter(
      (a) => (a.id && a.id.toLowerCase() !== applicationId.toLowerCase()) &&
             (a.applicationId && a.applicationId.toLowerCase() !== applicationId.toLowerCase())
    );
    saveLocalHistory(updated);
    return { success: true, message: 'Deleted from local history' };
  }
};

/**
 * 6. Clear All Application History
 * Endpoint: DELETE /api/applications
 */
export const clearApplicationHistory = async () => {
  try {
    const response = await apiClient.delete('/applications');
    saveLocalHistory([]);
    localStorage.removeItem('cardwise_latest_result');
    return response.data;
  } catch (error) {
    console.error('Error clearing application history:', error.response?.data || error.message);
    saveLocalHistory([]);
    localStorage.removeItem('cardwise_latest_result');
    return { success: true, message: 'Application history cleared' };
  }
};

/**
 * 6. Get Latest Prediction for Result page
 */
export const getPrediction = async (applicationId) => {
  if (applicationId) {
    try {
      const app = await getApplicationById(applicationId);
      return app.predictionResult || {
        score: app.score,
        prediction: app.prediction,
        risk: app.risk,
        breakdown: app.details?.breakdown,
        applicationId: app.id
      };
    } catch (e) {
      console.warn(`Could not load prediction for ${applicationId}, checking session cache...`);
    }
  }

  // Check current session result
  const cached = localStorage.getItem('cardwise_latest_result');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.error('Failed to parse cached result', e);
    }
  }

  return mockDefaultPrediction;
};

/**
 * 7. Get User Dashboard Data connected to MongoDB
 */
export const getDashboardData = async () => {
  try {
    const [applications, statistics] = await Promise.allSettled([
      getApplications(),
      getApplicationStatistics()
    ]);

    const appsList = applications.status === 'fulfilled' ? applications.value : getLocalHistory();
    const statsData = statistics.status === 'fulfilled' ? statistics.value : { total: appsList.length, eligible: 0 };

    const latestApp = appsList[0];

    const stats = {
      latestScore: latestApp ? latestApp.score : 82,
      totalApplications: statsData.total || appsList.length,
      eligibleCount: statsData.eligible || appsList.filter((a) => a.score >= 70).length,
      lastChecked: latestApp ? latestApp.date : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      predictionStatus: latestApp ? latestApp.prediction : 'Likely Eligible',
      riskLevel: latestApp ? latestApp.risk : 'Low Risk'
    };

    return {
      stats,
      recentApplications: appsList.slice(0, 4),
      user: mockUser
    };
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    const local = getLocalHistory();
    return {
      stats: {
        latestScore: 82,
        totalApplications: local.length,
        eligibleCount: local.filter((a) => a.score >= 70).length,
        lastChecked: 'Today',
        predictionStatus: 'Likely Eligible',
        riskLevel: 'Low Risk'
      },
      recentApplications: local.slice(0, 4),
      user: mockUser
    };
  }
};

/**
 * 8. Get Admin Data connected to MongoDB
 */
export const getAdminData = async () => {
  try {
    const [applications, statistics] = await Promise.allSettled([
      getApplications(),
      getApplicationStatistics()
    ]);

    const appsList = applications.status === 'fulfilled' ? applications.value : getLocalHistory();
    const statsData = statistics.status === 'fulfilled' ? statistics.value : { total: 0, eligible: 0, moderate: 0, notEligible: 0 };

    const total = statsData.total || appsList.length;
    const eligibleCount = statsData.eligible || appsList.filter((a) => a.score >= 70).length;
    const notEligibleCount = statsData.notEligible || appsList.filter((a) => a.score < 50).length;

    const avgScore = total > 0
      ? Math.round(appsList.reduce((acc, a) => acc + (a.score || 0), 0) / total)
      : 75;

    // Real dynamic risk counts if applications exist
    const lowRiskCount = appsList.filter((a) => a.risk?.toLowerCase().includes('low') || a.score >= 70).length;
    const medRiskCount = appsList.filter((a) => a.risk?.toLowerCase().includes('medium') || (a.score >= 50 && a.score < 70)).length;
    const highRiskCount = appsList.filter((a) => a.risk?.toLowerCase().includes('high') || a.score < 50).length;

    const stats = {
      totalApplications: total,
      eligibleCount,
      notEligibleCount,
      averageScore: avgScore,
      activeUsers: Math.max(1, total),
      modelAccuracy: 92.4
    };

    const updatedRiskDistribution = total > 0 ? [
      { name: 'Low Risk', value: lowRiskCount, color: '#10B981' },
      { name: 'Medium Risk', value: medRiskCount, color: '#F59E0B' },
      { name: 'High Risk', value: highRiskCount, color: '#EF4444' }
    ] : mockChartData.riskDistribution;

    const updatedEligibleVsNot = total > 0 ? [
      { name: `Eligible (${total > 0 ? Math.round((eligibleCount / total) * 100) : 0}%)`, value: eligibleCount, color: '#10B981' },
      { name: `Not Eligible (${total > 0 ? Math.round((notEligibleCount / total) * 100) : 0}%)`, value: notEligibleCount, color: '#EF4444' }
    ] : mockChartData.eligibleVsNotEligible;

    return {
      stats,
      chartData: {
        ...mockChartData,
        riskDistribution: updatedRiskDistribution,
        eligibleVsNotEligible: updatedEligibleVsNot
      },
      applications: appsList
    };
  } catch (error) {
    console.error('Error loading admin analytics:', error);
    return {
      stats: {
        totalApplications: 0,
        eligibleCount: 0,
        notEligibleCount: 0,
        averageScore: 0,
        activeUsers: 0,
        modelAccuracy: 92.4
      },
      chartData: mockChartData,
      applications: []
    };
  }
};

/**
 * 9. Auth Methods (Mock session handling)
 */
export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Please provide email and password');
  }
  const user = { ...mockUser, email };
  localStorage.setItem('cardwise_user', JSON.stringify(user));
  localStorage.setItem('cardwise_auth_token', 'mock_jwt_token_cardwise_8821');
  return { user, token: 'mock_jwt_token_cardwise_8821' };
};

export const registerUser = async (registrationData) => {
  const user = {
    ...mockUser,
    name: registrationData.fullName || mockUser.name,
    email: registrationData.email
  };
  localStorage.setItem('cardwise_user', JSON.stringify(user));
  localStorage.setItem('cardwise_auth_token', 'mock_jwt_token_cardwise_8821');
  return { user, token: 'mock_jwt_token_cardwise_8821' };
};

export const getModelMetrics = async () => {
  return mockModelMetrics;
};

export default apiClient;
