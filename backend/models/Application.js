import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: [true, 'Application ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true
    },
    // Step 1: Personal Demographics
    fullName: {
      type: String,
      required: [true, 'Full Name is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      default: 'applicant@cardwise.io'
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [18, 'Age must be at least 18'],
      max: [100, 'Age cannot exceed 100']
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      trim: true
    },
    educationLevel: {
      type: String,
      required: [true, 'Education Level is required'],
      alias: 'education',
      trim: true
    },
    maritalStatus: {
      type: String,
      required: [true, 'Marital Status is required'],
      trim: true
    },
    dependents: {
      type: Number,
      default: 0,
      min: [0, 'Dependents cannot be negative']
    },

    // Step 2: Financial & Employment Information
    employmentStatus: {
      type: String,
      required: [true, 'Employment Status is required'],
      trim: true
    },
    employmentYears: {
      type: Number,
      required: [true, 'Employment tenure is required'],
      min: [0, 'Employment tenure cannot be negative']
    },
    annualIncome: {
      type: Number,
      required: [true, 'Annual Income is required'],
      min: [0, 'Annual Income cannot be negative']
    },
    monthlyIncome: {
      type: Number,
      default: 0,
      min: [0, 'Monthly Income cannot be negative']
    },
    monthlyExpenses: {
      type: Number,
      required: [true, 'Monthly Expenses is required'],
      min: [0, 'Monthly Expenses cannot be negative']
    },
    existingLoans: {
      type: Number,
      default: 0,
      min: [0, 'Existing Loans cannot be negative']
    },

    // Step 3: Credit Metrics
    creditScore: {
      type: Number,
      required: [true, 'Credit Score is required'],
      min: [300, 'Credit score must be between 300 and 850'],
      max: [850, 'Credit score must be between 300 and 850']
    },
    creditHistory: {
      type: Number,
      default: 0,
      alias: 'creditHistoryLength',
      min: [0, 'Credit history length cannot be negative']
    },
    creditUtilization: {
      type: Number,
      required: [true, 'Credit Utilization is required'],
      min: [0, 'Credit utilization must be between 0 and 100%'],
      max: [100, 'Credit utilization must be between 0 and 100%']
    },
    previousDefaults: {
      type: String,
      default: 'no',
      trim: true
    },

    // Prediction & Assessment Results
    prediction: {
      type: String,
      required: true,
      default: 'LIKELY ELIGIBLE'
    },
    eligibilityScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    riskLevel: {
      type: String,
      required: true,
      default: 'Low Risk'
    },
    predictionFactors: {
      type: [String],
      default: []
    },
    breakdown: {
      creditScoreRating: { type: Number, default: 0 },
      incomeStability: { type: Number, default: 0 },
      debtLevelRating: { type: Number, default: 0 },
      creditUtilizationRating: { type: Number, default: 0 }
    },
    recommendations: {
      type: [String],
      default: []
    },

    // Status Tracking
    status: {
      type: String,
      enum: ['Completed', 'Pending', 'In Review', 'Rejected', 'Approved'],
      default: 'Completed'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

export const Application = mongoose.model('Application', applicationSchema);
export default Application;
