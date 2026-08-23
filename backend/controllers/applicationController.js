import Application from '../models/Application.js';
import { generatePrediction } from '../services/predictionService.js';
import { generateApplicationId } from '../utils/applicationId.js';

/**
 * Format an application document into the structure expected by the React frontend
 */
const formatApplicationForFrontend = (appDoc) => {
  const app = appDoc.toObject ? appDoc.toObject() : appDoc;
  const dateStr = app.createdAt ? new Date(app.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

  const formattedDate = app.createdAt
    ? new Date(app.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Recently';

  return {
    _id: app._id,
    id: app.applicationId,
    applicationId: app.applicationId,
    applicantName: app.fullName,
    applicantEmail: app.email || 'applicant@cardwise.io',
    date: dateStr,
    score: app.eligibilityScore,
    eligibilityScore: app.eligibilityScore,
    prediction: app.prediction,
    risk: app.riskLevel,
    riskLevel: app.riskLevel,
    status: app.status || 'Completed',
    income: Number(app.annualIncome),
    creditScore: Number(app.creditScore),
    loans: Number(app.existingLoans),
    utilization: Number(app.creditUtilization),
    timeline: [
      { step: 'Application Submitted', date: formattedDate, completed: true },
      { step: 'Profile Analyzed', date: formattedDate, completed: true },
      { step: 'Prediction Generated', date: formattedDate, completed: true },
      { step: 'Result Available', date: formattedDate, completed: true }
    ],
    details: {
      fullName: app.fullName,
      email: app.email,
      age: app.age,
      gender: app.gender,
      education: app.educationLevel,
      educationLevel: app.educationLevel,
      maritalStatus: app.maritalStatus,
      dependents: app.dependents,
      employmentStatus: app.employmentStatus,
      employmentYears: app.employmentYears,
      annualIncome: app.annualIncome,
      monthlyIncome: app.monthlyIncome || Math.round(app.annualIncome / 12),
      monthlyExpenses: app.monthlyExpenses,
      existingLoans: app.existingLoans,
      creditScore: app.creditScore,
      creditUtilization: app.creditUtilization,
      previousDefaults: app.previousDefaults,
      creditHistoryLength: app.creditHistory || 0
    },
    predictionResult: {
      score: app.eligibilityScore,
      prediction: app.prediction,
      risk: app.riskLevel,
      breakdown: app.breakdown || {},
      positiveFactors: app.predictionFactors || [],
      recommendations: app.recommendations || []
    },
    createdAt: app.createdAt,
    updatedAt: app.updatedAt
  };
};

/**
 * @desc    Submit a new credit card eligibility application
 * @route   POST /api/applications
 * @access  Public
 */
export const submitApplication = async (req, res, next) => {
  try {
    const payload = req.body;

    // 1. Run predictive assessment via Python ML Service
    const predictionResult = await generatePrediction(payload);

    // 2. Generate sequential Application ID (CW-100X)
    const applicationId = await generateApplicationId();

    // 3. Compute monthly income if not directly provided
    const monthlyIncome = payload.monthlyIncome
      ? Number(payload.monthlyIncome)
      : Math.round(Number(payload.annualIncome) / 12);

    // 4. Save application document to MongoDB
    const application = new Application({
      applicationId,
      fullName: payload.fullName,
      email: payload.email || 'applicant@cardwise.io',
      age: Number(payload.age),
      gender: payload.gender,
      educationLevel: payload.educationLevel || payload.education || "Bachelor's Degree",
      maritalStatus: payload.maritalStatus,
      dependents: Number(payload.dependents || 0),
      employmentStatus: payload.employmentStatus,
      employmentYears: Number(payload.employmentYears),
      annualIncome: Number(payload.annualIncome),
      monthlyIncome,
      monthlyExpenses: Number(payload.monthlyExpenses),
      existingLoans: Number(payload.existingLoans || 0),
      creditScore: Number(payload.creditScore),
      creditHistory: Number(payload.creditHistory || payload.creditHistoryLength || 0),
      creditUtilization: Number(payload.creditUtilization),
      previousDefaults: String(payload.previousDefaults || 'no'),

      prediction: predictionResult.prediction,
      eligibilityScore: predictionResult.eligibilityScore,
      riskLevel: predictionResult.riskLevel,
      predictionFactors: predictionResult.predictionFactors,
      breakdown: predictionResult.breakdown,
      recommendations: predictionResult.recommendations,
      status: 'Completed'
    });

    const savedApp = await application.save();

    // 5. Return structured response matching requirements
    res.status(201).json({
      success: true,
      applicationId: savedApp.applicationId,
      prediction: savedApp.prediction,
      eligibilityScore: savedApp.eligibilityScore,
      riskLevel: savedApp.riskLevel,
      predictionFactors: savedApp.predictionFactors,
      data: formatApplicationForFrontend(savedApp)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all applications with optional search and status filtering
 * @route   GET /api/applications
 * @access  Public
 */
export const getApplications = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    // Apply status filter
    if (status && status !== 'ALL') {
      const upperStatus = status.toUpperCase();
      if (upperStatus === 'ELIGIBLE') {
        filter.eligibilityScore = { $gte: 70 };
      } else if (upperStatus === 'PENDING') {
        filter.eligibilityScore = { $gte: 50, $lt: 70 };
      } else if (upperStatus === 'NOT_ELIGIBLE') {
        filter.eligibilityScore = { $lt: 50 };
      } else {
        filter.status = new RegExp(status, 'i');
      }
    }

    // Apply keyword search filter
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { applicationId: searchRegex },
        { fullName: searchRegex },
        { email: searchRegex }
      ];
    }

    const applications = await Application.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    const formatted = applications.map(formatApplicationForFrontend);

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get aggregate statistics for the applications portfolio
 * @route   GET /api/applications/statistics
 * @access  Public
 */
export const getApplicationStatistics = async (req, res, next) => {
  try {
    const total = await Application.countDocuments();
    const eligible = await Application.countDocuments({ eligibilityScore: { $gte: 70 } });
    const moderate = await Application.countDocuments({ eligibilityScore: { $gte: 50, $lt: 70 } });
    const notEligible = await Application.countDocuments({ eligibilityScore: { $lt: 50 } });

    res.status(200).json({
      success: true,
      data: {
        total,
        eligible,
        moderate,
        notEligible
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single application details by Application ID or MongoDB _id
 * @route   GET /api/applications/:applicationId
 * @access  Public
 */
export const getApplicationById = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    // Search by applicationId (e.g. CW-1001) or by MongoDB ObjectId
    let application = await Application.findOne({
      applicationId: new RegExp(`^${applicationId.trim()}$`, 'i')
    });

    if (!application && applicationId.match(/^[0-9a-fA-F]{24}$/)) {
      application = await Application.findById(applicationId);
    }

    if (!application) {
      return res.status(404).json({
        success: false,
        message: `Application not found with ID: ${applicationId}`
      });
    }

    res.status(200).json({
      success: true,
      data: formatApplicationForFrontend(application)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an application by Application ID or MongoDB _id
 * @route   DELETE /api/applications/:applicationId
 * @access  Public
 */
export const deleteApplication = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    let deleted = await Application.findOneAndDelete({
      applicationId: new RegExp(`^${applicationId.trim()}$`, 'i')
    });

    if (!deleted && applicationId.match(/^[0-9a-fA-F]{24}$/)) {
      deleted = await Application.findByIdAndDelete(applicationId);
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Application not found to delete with ID: ${applicationId}`
      });
    }

    res.status(200).json({
      success: true,
      message: `Application ${deleted.applicationId} deleted successfully`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear all applications / history from MongoDB
 * @route   DELETE /api/applications
 * @access  Public
 */
export const clearAllApplications = async (req, res, next) => {
  try {
    const result = await Application.deleteMany({});
    res.status(200).json({
      success: true,
      message: `Cleared ${result.deletedCount} applications successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    next(error);
  }
};

