/**
 * Centralized Mock Data for CardWise Frontend
 */

export const mockUser = {
  id: 'usr-8821',
  name: 'Alex Morgan',
  email: 'alex.morgan@cardwise.io',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  role: 'user',
  memberSince: 'January 2025',
  profile: {
    creditScore: 742,
    annualIncome: 650000,
    existingLoans: 1,
    creditUtilization: 28,
    employmentStatus: 'Employed Full-Time',
    employmentYears: 3.5,
    monthlyExpenses: 22000,
    education: "Master's Degree",
    gender: 'Female',
    maritalStatus: 'Single',
    dependents: 0
  }
};

export const mockDashboardStats = {
  latestScore: 82,
  totalApplications: 4,
  eligibleCount: 3,
  lastChecked: '22 Aug 2026',
  predictionStatus: 'Likely Eligible',
  riskLevel: 'Low Risk',
  creditScore: 742,
  annualIncome: 650000,
  existingLoans: 1,
  creditUtilization: 28
};

export const mockApplications = [
  {
    id: 'CW-1001',
    applicantName: 'Alex Morgan',
    applicantEmail: 'alex.morgan@cardwise.io',
    date: '2026-08-22',
    score: 82,
    prediction: 'LIKELY ELIGIBLE',
    risk: 'Low Risk',
    status: 'Completed',
    income: 650000,
    creditScore: 742,
    loans: 1,
    utilization: 28,
    timeline: [
      { step: 'Application Submitted', date: '22 Aug 2026, 10:14 AM', completed: true },
      { step: 'Profile Analyzed', date: '22 Aug 2026, 10:14 AM', completed: true },
      { step: 'Prediction Generated', date: '22 Aug 2026, 10:15 AM', completed: true },
      { step: 'Result Available', date: '22 Aug 2026, 10:15 AM', completed: true }
    ],
    details: {
      fullName: 'Alex Morgan',
      age: 26,
      gender: 'Female',
      education: "Master's Degree",
      maritalStatus: 'Single',
      dependents: 0,
      employmentStatus: 'Employed Full-Time',
      employmentYears: 3,
      annualIncome: 650000,
      monthlyIncome: 54166,
      monthlyExpenses: 20000,
      existingLoans: 1,
      creditScore: 742,
      creditUtilization: 28,
      previousDefaults: 'No',
      creditHistoryLength: 4
    }
  },
  {
    id: 'CW-1002',
    applicantName: 'Aarav Sharma',
    applicantEmail: 'aarav.sharma@example.com',
    date: '2026-08-19',
    score: 88,
    prediction: 'LIKELY ELIGIBLE',
    risk: 'Low Risk',
    status: 'Completed',
    income: 920000,
    creditScore: 780,
    loans: 0,
    utilization: 15,
    timeline: [
      { step: 'Application Submitted', date: '19 Aug 2026, 02:30 PM', completed: true },
      { step: 'Profile Analyzed', date: '19 Aug 2026, 02:30 PM', completed: true },
      { step: 'Prediction Generated', date: '19 Aug 2026, 02:31 PM', completed: true },
      { step: 'Result Available', date: '19 Aug 2026, 02:31 PM', completed: true }
    ],
    details: {
      fullName: 'Aarav Sharma',
      age: 31,
      gender: 'Male',
      education: 'Bachelor Degree',
      maritalStatus: 'Married',
      dependents: 1,
      employmentStatus: 'Employed Full-Time',
      employmentYears: 6,
      annualIncome: 920000,
      monthlyIncome: 76666,
      monthlyExpenses: 28000,
      existingLoans: 0,
      creditScore: 780,
      creditUtilization: 15,
      previousDefaults: 'No',
      creditHistoryLength: 7
    }
  },
  {
    id: 'CW-1003',
    applicantName: 'Pooja Iyer',
    applicantEmail: 'pooja.i@example.com',
    date: '2026-08-14',
    score: 64,
    prediction: 'MODERATELY ELIGIBLE',
    risk: 'Medium Risk',
    status: 'Completed',
    income: 420000,
    creditScore: 655,
    loans: 2,
    utilization: 45,
    timeline: [
      { step: 'Application Submitted', date: '14 Aug 2026, 11:20 AM', completed: true },
      { step: 'Profile Analyzed', date: '14 Aug 2026, 11:20 AM', completed: true },
      { step: 'Prediction Generated', date: '14 Aug 2026, 11:21 AM', completed: true },
      { step: 'Result Available', date: '14 Aug 2026, 11:21 AM', completed: true }
    ],
    details: {
      fullName: 'Pooja Iyer',
      age: 24,
      gender: 'Female',
      education: 'Bachelor Degree',
      maritalStatus: 'Single',
      dependents: 0,
      employmentStatus: 'Employed Full-Time',
      employmentYears: 1.5,
      annualIncome: 420000,
      monthlyIncome: 35000,
      monthlyExpenses: 18000,
      existingLoans: 2,
      creditScore: 655,
      creditUtilization: 45,
      previousDefaults: 'No',
      creditHistoryLength: 2
    }
  },
  {
    id: 'CW-1004',
    applicantName: 'Vikram Mehta',
    applicantEmail: 'vikram.m@example.com',
    date: '2026-08-05',
    score: 38,
    prediction: 'UNLIKELY ELIGIBLE',
    risk: 'High Risk',
    status: 'Completed',
    income: 300000,
    creditScore: 540,
    loans: 3,
    utilization: 75,
    timeline: [
      { step: 'Application Submitted', date: '05 Aug 2026, 04:45 PM', completed: true },
      { step: 'Profile Analyzed', date: '05 Aug 2026, 04:45 PM', completed: true },
      { step: 'Prediction Generated', date: '05 Aug 2026, 04:46 PM', completed: true },
      { step: 'Result Available', date: '05 Aug 2026, 04:46 PM', completed: true }
    ],
    details: {
      fullName: 'Vikram Mehta',
      age: 28,
      gender: 'Male',
      education: 'High School',
      maritalStatus: 'Single',
      dependents: 1,
      employmentStatus: 'Self-Employed',
      employmentYears: 1,
      annualIncome: 300000,
      monthlyIncome: 25000,
      monthlyExpenses: 20000,
      existingLoans: 3,
      creditScore: 540,
      creditUtilization: 75,
      previousDefaults: 'Yes',
      creditHistoryLength: 2
    }
  },
  {
    id: 'CW-1005',
    applicantName: 'Sneha Patel',
    applicantEmail: 'sneha.patel@example.com',
    date: '2026-08-01',
    score: 76,
    prediction: 'LIKELY ELIGIBLE',
    risk: 'Low Risk',
    status: 'Completed',
    income: 750000,
    creditScore: 715,
    loans: 1,
    utilization: 32,
    timeline: [
      { step: 'Application Submitted', date: '01 Aug 2026, 09:10 AM', completed: true },
      { step: 'Profile Analyzed', date: '01 Aug 2026, 09:10 AM', completed: true },
      { step: 'Prediction Generated', date: '01 Aug 2026, 09:11 AM', completed: true },
      { step: 'Result Available', date: '01 Aug 2026, 09:11 AM', completed: true }
    ],
    details: {
      fullName: 'Sneha Patel',
      age: 29,
      gender: 'Female',
      education: 'Bachelor Degree',
      maritalStatus: 'Married',
      dependents: 0,
      employmentStatus: 'Employed Full-Time',
      employmentYears: 4,
      annualIncome: 750000,
      monthlyIncome: 62500,
      monthlyExpenses: 24000,
      existingLoans: 1,
      creditScore: 715,
      creditUtilization: 32,
      previousDefaults: 'No',
      creditHistoryLength: 5
    }
  }
];

export const mockDefaultPrediction = {
  score: 82,
  prediction: 'LIKELY ELIGIBLE',
  risk: 'Low Risk',
  badgeColor: 'emerald',
  breakdown: {
    creditScoreRating: 85,
    incomeStability: 78,
    debtLevelRating: 72,
    creditUtilizationRating: 81
  },
  positiveFactors: [
    'Strong credit score of 742+ within prime threshold',
    'Stable income with favorable debt-to-income balance',
    'Healthy credit utilization rate maintained under 30%'
  ],
  attentionFactors: [
    'Existing active loan level could be reduced for higher credit limits'
  ],
  recommendations: [
    'Maintain timely credit payments to push your score over 750+.',
    'Keep your credit utilization below 30% across all lines.',
    'Keep debt obligations manageable before submitting final bank application.'
  ]
};

export const mockAdminStats = {
  totalApplications: 1248,
  eligibleCount: 782,
  notEligibleCount: 466,
  averageScore: 71,
  activeUsers: 840,
  modelAccuracy: 92.4
};

export const mockChartData = {
  applicationsOverTime: [
    { month: 'Jan', total: 65, eligible: 42, notEligible: 23 },
    { month: 'Feb', total: 88, eligible: 56, notEligible: 32 },
    { month: 'Mar', total: 110, eligible: 70, notEligible: 40 },
    { month: 'Apr', total: 145, eligible: 94, notEligible: 51 },
    { month: 'May', total: 180, eligible: 118, notEligible: 62 },
    { month: 'Jun', total: 210, eligible: 135, notEligible: 75 },
    { month: 'Jul', total: 225, eligible: 142, notEligible: 83 },
    { month: 'Aug', total: 225, eligible: 125, notEligible: 100 }
  ],
  eligibleVsNotEligible: [
    { name: 'Eligible (62.7%)', value: 782, color: '#10B981' },
    { name: 'Not Eligible (37.3%)', value: 466, color: '#EF4444' }
  ],
  riskDistribution: [
    { name: 'Low Risk', value: 580, color: '#10B981' },
    { name: 'Medium Risk', value: 410, color: '#F59E0B' },
    { name: 'High Risk', value: 258, color: '#EF4444' }
  ],
  creditScoreDistribution: [
    { range: '300-549', count: 95, label: 'Poor' },
    { range: '550-649', count: 210, label: 'Fair' },
    { range: '650-719', count: 425, label: 'Good' },
    { range: '720-799', count: 370, label: 'Very Good' },
    { range: '800-850', count: 148, label: 'Exceptional' }
  ],
  incomeDistribution: [
    { range: '< ₹3L', count: 180 },
    { range: '₹3L - ₹6L', count: 460 },
    { range: '₹6L - ₹10L', count: 380 },
    { range: '₹10L - ₹15L', count: 150 },
    { range: '> ₹15L', count: 78 }
  ]
};

export const mockModelMetrics = {
  accuracy: 92.4,
  precision: 89.1,
  recall: 87.6,
  f1Score: 88.3,
  rocAuc: 94.2,
  lastTrained: '15 Aug 2026',
  datasetSize: '45,000 samples',
  featuresCount: 14,
  modelComparisons: [
    { model: 'Logistic Regression', accuracy: 81.2, precision: 79.4, recall: 76.5, f1: 77.9, rocAuc: 83.5 },
    { model: 'Decision Tree', accuracy: 84.6, precision: 82.1, recall: 80.8, f1: 81.4, rocAuc: 86.2 },
    { model: 'Random Forest (Active)', accuracy: 92.4, precision: 89.1, recall: 87.6, f1: 88.3, rocAuc: 94.2 },
    { model: 'XGBoost', accuracy: 93.1, precision: 90.3, recall: 88.5, f1: 89.4, rocAuc: 95.0 }
  ],
  confusionMatrix: {
    truePositive: 685,
    falsePositive: 84,
    falseNegative: 97,
    trueNegative: 382
  }
};
