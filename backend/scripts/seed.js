import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Application from '../models/Application.js';

dotenv.config();

const sampleApplications = [
  {
    applicationId: 'CW-1001',
    fullName: 'Jahnavi K',
    email: 'jahnavi.k@cardwise.io',
    age: 26,
    gender: 'Female',
    educationLevel: "Master's Degree",
    maritalStatus: 'Single',
    dependents: 0,
    employmentStatus: 'Employed Full-Time',
    employmentYears: 3.5,
    annualIncome: 650000,
    monthlyIncome: 54166,
    monthlyExpenses: 20000,
    existingLoans: 1,
    creditScore: 742,
    creditHistory: 4,
    creditUtilization: 28,
    previousDefaults: 'no',
    prediction: 'LIKELY ELIGIBLE',
    eligibilityScore: 82,
    riskLevel: 'Low Risk',
    predictionFactors: [
      'Strong credit score above 720+',
      'Healthy income-to-expense ratio',
      'Favorable credit utilization below 30%'
    ],
    breakdown: {
      creditScoreRating: 85,
      incomeStability: 78,
      debtLevelRating: 72,
      creditUtilizationRating: 81
    },
    recommendations: [
      'Maintain timely on-time payments across all active utility and loan accounts.',
      'Keep credit utilization under 30% on revolving cards.',
      'Maintain steady debt-to-income ratio before applying with lenders.'
    ],
    status: 'Completed'
  },
  {
    applicationId: 'CW-1002',
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    age: 31,
    gender: 'Male',
    educationLevel: 'Bachelor Degree',
    maritalStatus: 'Married',
    dependents: 1,
    employmentStatus: 'Employed Full-Time',
    employmentYears: 6,
    annualIncome: 920000,
    monthlyIncome: 76666,
    monthlyExpenses: 28000,
    existingLoans: 0,
    creditScore: 780,
    creditHistory: 7,
    creditUtilization: 15,
    previousDefaults: 'no',
    prediction: 'LIKELY ELIGIBLE',
    eligibilityScore: 88,
    riskLevel: 'Low Risk',
    predictionFactors: [
      'Strong credit score above 720+',
      'Healthy income-to-expense ratio',
      'Favorable credit utilization below 30%'
    ],
    breakdown: {
      creditScoreRating: 92,
      incomeStability: 86,
      debtLevelRating: 88,
      creditUtilizationRating: 90
    },
    recommendations: [
      'Maintain timely on-time payments across all active utility and loan accounts.',
      'Keep credit utilization under 30% on revolving cards.'
    ],
    status: 'Completed'
  },
  {
    applicationId: 'CW-1003',
    fullName: 'Pooja Iyer',
    email: 'pooja.i@example.com',
    age: 24,
    gender: 'Female',
    educationLevel: 'Bachelor Degree',
    maritalStatus: 'Single',
    dependents: 0,
    employmentStatus: 'Employed Full-Time',
    employmentYears: 1.5,
    annualIncome: 420000,
    monthlyIncome: 35000,
    monthlyExpenses: 18000,
    existingLoans: 2,
    creditScore: 655,
    creditHistory: 2,
    creditUtilization: 45,
    previousDefaults: 'no',
    prediction: 'MODERATELY ELIGIBLE',
    eligibilityScore: 64,
    riskLevel: 'Medium Risk',
    predictionFactors: [
      'Satisfactory credit history baseline',
      'Stable employment duration'
    ],
    breakdown: {
      creditScoreRating: 64,
      incomeStability: 60,
      debtLevelRating: 58,
      creditUtilizationRating: 55
    },
    recommendations: [
      'Reduce credit card balances to keep utilization under 30%.',
      'Prepay or consolidate existing micro-loans to lower debt obligations.'
    ],
    status: 'Completed'
  },
  {
    applicationId: 'CW-1004',
    fullName: 'Vikram Mehta',
    email: 'vikram.m@example.com',
    age: 28,
    gender: 'Male',
    educationLevel: 'High School',
    maritalStatus: 'Single',
    dependents: 1,
    employmentStatus: 'Self-Employed',
    employmentYears: 1,
    annualIncome: 300000,
    monthlyIncome: 25000,
    monthlyExpenses: 20000,
    existingLoans: 3,
    creditScore: 540,
    creditHistory: 2,
    creditUtilization: 75,
    previousDefaults: 'yes',
    prediction: 'UNLIKELY ELIGIBLE',
    eligibilityScore: 38,
    riskLevel: 'High Risk',
    predictionFactors: [
      'Active income flow'
    ],
    breakdown: {
      creditScoreRating: 35,
      incomeStability: 40,
      debtLevelRating: 30,
      creditUtilizationRating: 25
    },
    recommendations: [
      'Reduce credit card balances to keep utilization under 30%.',
      'Maintain timely on-time payments across all active accounts.',
      'Prepay or consolidate existing active loans.'
    ],
    status: 'Completed'
  },
  {
    applicationId: 'CW-1005',
    fullName: 'Sneha Patel',
    email: 'sneha.patel@example.com',
    age: 29,
    gender: 'Female',
    educationLevel: 'Bachelor Degree',
    maritalStatus: 'Married',
    dependents: 0,
    employmentStatus: 'Employed Full-Time',
    employmentYears: 4,
    annualIncome: 750000,
    monthlyIncome: 62500,
    monthlyExpenses: 24000,
    existingLoans: 1,
    creditScore: 715,
    creditHistory: 5,
    creditUtilization: 32,
    previousDefaults: 'no',
    prediction: 'LIKELY ELIGIBLE',
    eligibilityScore: 76,
    riskLevel: 'Low Risk',
    predictionFactors: [
      'Strong credit score above 720+',
      'Healthy income-to-expense ratio',
      'Stable employment duration'
    ],
    breakdown: {
      creditScoreRating: 78,
      incomeStability: 75,
      debtLevelRating: 74,
      creditUtilizationRating: 68
    },
    recommendations: [
      'Reduce credit card balances to keep utilization under 30%.',
      'Maintain timely on-time payments across all active utility and loan accounts.'
    ],
    status: 'Completed'
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cardwise';
    console.log(`[Seed] Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('[Seed] Clearing existing Application records...');
    await Application.deleteMany({});

    console.log('[Seed] Inserting sample applications (CW-1001 to CW-1005)...');
    await Application.insertMany(sampleApplications);

    console.log(`[Seed] Successfully seeded ${sampleApplications.length} applications!`);
    process.exit(0);
  } catch (error) {
    console.error(`[Seed] Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
