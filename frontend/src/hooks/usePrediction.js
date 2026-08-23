import { useState, useCallback } from 'react';
import { calculatePrediction } from '../utils/predictionDemo';
import { submitApplication as apiSubmitApplication } from '../services/api';

export const usePrediction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const runSimulation = useCallback((profileData) => {
    return calculatePrediction(profileData);
  }, []);

  const submitProfile = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiSubmitApplication(formData);
      setResult(response.predictionResult || response);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to analyze profile';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    result,
    runSimulation,
    submitProfile
  };
};

export default usePrediction;
