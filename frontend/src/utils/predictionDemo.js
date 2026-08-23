/**
 * CardWise Mock Prediction Calculation Engine
 * 
 * Generates an educational / demo ML prediction score based on applicant financial variables.
 * NOTE: This is a frontend simulation. A real Python ML model (FastAPI) will be integrated later.
 */

export const calculatePrediction = ({
  creditScore = 700,
  annualIncome = 600000,
  monthlyExpenses = 25000,
  existingLoans = 1,
  employmentYears = 3,
  creditUtilization = 30,
  previousDefaults = 'no'
}) => {
  // Normalize Credit Score (300-850) -> max 40 points
  const csNum = Number(creditScore);
  const csFactor = Math.max(0, Math.min(1, (csNum - 300) / 550));
  const creditScorePoints = csFactor * 40;

  // Income vs Expenses (Debt to Income ratio) -> max 25 points
  const monthlyInc = Number(annualIncome) / 12;
  const expNum = Number(monthlyExpenses);
  const dti = monthlyInc > 0 ? expNum / monthlyInc : 1;
  let incomePoints = 25;
  if (dti > 0.7) incomePoints = 6;
  else if (dti > 0.5) incomePoints = 14;
  else if (dti > 0.3) incomePoints = 20;
  else incomePoints = 25;

  // Existing Loans penalty -> max 15 points
  const loanNum = Number(existingLoans);
  let loanPoints = 15;
  if (loanNum === 0) loanPoints = 15;
  else if (loanNum === 1) loanPoints = 12;
  else if (loanNum === 2) loanPoints = 8;
  else if (loanNum === 3) loanPoints = 4;
  else loanPoints = 1;

  // Employment Stability -> max 10 points
  const empNum = Number(employmentYears);
  let empPoints = 10;
  if (empNum >= 5) empPoints = 10;
  else if (empNum >= 2) empPoints = 8;
  else if (empNum >= 1) empPoints = 5;
  else empPoints = 2;

  // Credit Utilization -> max 10 points
  const utilNum = Number(creditUtilization);
  let utilPoints = 10;
  if (utilNum <= 20) utilPoints = 10;
  else if (utilNum <= 35) utilPoints = 8;
  else if (utilNum <= 50) utilPoints = 5;
  else if (utilNum <= 70) utilPoints = 2;
  else utilPoints = 0;

  let totalScore = Math.round(creditScorePoints + incomePoints + loanPoints + empPoints + utilPoints);

  // Defaults penalty
  if (previousDefaults === 'yes' || previousDefaults === true) {
    totalScore = Math.max(15, totalScore - 25);
  }

  // Cap between 10 and 99
  totalScore = Math.max(12, Math.min(96, totalScore));

  // Determine Prediction Category & Risk
  let prediction = 'LIKELY ELIGIBLE';
  let risk = 'Low Risk';
  let badgeColor = 'emerald';

  if (totalScore >= 75) {
    prediction = 'LIKELY ELIGIBLE';
    risk = 'Low Risk';
    badgeColor = 'emerald';
  } else if (totalScore >= 55) {
    prediction = 'MODERATELY ELIGIBLE';
    risk = 'Medium Risk';
    badgeColor = 'amber';
  } else {
    prediction = 'UNLIKELY ELIGIBLE';
    risk = 'High Risk';
    badgeColor = 'rose';
  }

  // Dynamic breakdown
  const breakdown = {
    creditScoreRating: Math.round(csFactor * 100),
    incomeStability: Math.round(Math.min(100, (monthlyInc / 50000) * 80 + (empNum * 4))),
    debtLevelRating: Math.max(10, Math.round(100 - (loanNum * 20) - (dti * 40))),
    creditUtilizationRating: Math.max(10, Math.round(100 - utilNum))
  };

  // Positive & attention factors
  const positiveFactors = [];
  const attentionFactors = [];

  if (csNum >= 720) positiveFactors.push('Strong credit score above 720+');
  else if (csNum >= 650) positiveFactors.push('Satisfactory credit history baseline');
  else attentionFactors.push('Credit score is below prime tier (< 650)');

  if (dti <= 0.35) positiveFactors.push('Healthy income-to-expense ratio');
  else attentionFactors.push('Monthly expenses consume a high share of income');

  if (utilNum <= 30) positiveFactors.push('Favorable credit utilization below 30%');
  else attentionFactors.push(`High credit utilization (${utilNum}%) detected`);

  if (loanNum <= 1) positiveFactors.push('Low existing loan obligations');
  else attentionFactors.push('Existing loan count is higher than optimal');

  if (empNum >= 2) positiveFactors.push('Stable employment duration');
  else attentionFactors.push('Short employment tenure');

  const recommendations = [];
  if (utilNum > 30) recommendations.push('Reduce credit card balances to keep utilization under 30%.');
  if (csNum < 750) recommendations.push('Maintain timely on-time payments across all active utility and loan accounts.');
  if (loanNum > 1) recommendations.push('Prepay or consolidate existing micro-loans to lower debt obligations.');
  if (recommendations.length < 3) recommendations.push('Avoid multiple new hard credit inquiries in a short window.');

  return {
    score: totalScore,
    prediction,
    risk,
    badgeColor,
    breakdown,
    positiveFactors: positiveFactors.slice(0, 3),
    attentionFactors: attentionFactors.slice(0, 2),
    recommendations
  };
};
