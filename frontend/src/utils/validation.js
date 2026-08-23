/**
 * Form validation utilities for CardWise
 */

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};

export const getPasswordStrength = (password) => {
  if (!password) return { level: 'None', percent: 0, color: 'bg-slate-200' };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) {
    return { level: 'Weak', percent: 25, color: 'bg-rose-500', text: 'text-rose-600' };
  } else if (score <= 3) {
    return { level: 'Medium', percent: 65, color: 'bg-amber-500', text: 'text-amber-600' };
  } else {
    return { level: 'Strong', percent: 100, color: 'bg-emerald-500', text: 'text-emerald-600' };
  }
};

export const validateApplicationStep = (step, formData) => {
  const errors = {};

  if (step === 1) {
    if (!formData.fullName?.trim()) {
      errors.fullName = 'Full Name is required';
    }
    const age = Number(formData.age);
    if (!formData.age || isNaN(age)) {
      errors.age = 'Age is required';
    } else if (age < 18 || age > 100) {
      errors.age = 'Age must be between 18 and 100';
    }
    if (!formData.gender) {
      errors.gender = 'Gender is required';
    }
    if (!formData.education) {
      errors.education = 'Education level is required';
    }
    if (!formData.maritalStatus) {
      errors.maritalStatus = 'Marital status is required';
    }
    if (formData.dependents === undefined || formData.dependents === '' || Number(formData.dependents) < 0) {
      errors.dependents = 'Please enter valid number of dependents (0 or more)';
    }
  }

  if (step === 2) {
    if (!formData.employmentStatus) {
      errors.employmentStatus = 'Employment status is required';
    }
    const empYears = Number(formData.employmentYears);
    if (formData.employmentYears === '' || isNaN(empYears) || empYears < 0 || empYears > 50) {
      errors.employmentYears = 'Employment years must be between 0 and 50';
    }
    const annualIncome = Number(formData.annualIncome);
    if (!formData.annualIncome || isNaN(annualIncome) || annualIncome <= 0) {
      errors.annualIncome = 'Annual income must be a positive amount';
    }
    const monthlyIncome = Number(formData.monthlyIncome);
    if (!formData.monthlyIncome || isNaN(monthlyIncome) || monthlyIncome <= 0) {
      errors.monthlyIncome = 'Monthly income must be a positive amount';
    }
    const monthlyExpenses = Number(formData.monthlyExpenses);
    if (formData.monthlyExpenses === '' || isNaN(monthlyExpenses) || monthlyExpenses < 0) {
      errors.monthlyExpenses = 'Monthly expenses must be 0 or positive';
    }
    const existingLoans = Number(formData.existingLoans);
    if (formData.existingLoans === '' || isNaN(existingLoans) || existingLoans < 0) {
      errors.existingLoans = 'Existing loans must be 0 or positive';
    }
  }

  if (step === 3) {
    const creditScore = Number(formData.creditScore);
    if (!formData.creditScore || isNaN(creditScore) || creditScore < 300 || creditScore > 850) {
      errors.creditScore = 'Credit score must be between 300 and 850';
    }
    const creditUtil = Number(formData.creditUtilization);
    if (formData.creditUtilization === '' || isNaN(creditUtil) || creditUtil < 0 || creditUtil > 100) {
      errors.creditUtilization = 'Credit utilization must be between 0% and 100%';
    }
    if (formData.previousDefaults === undefined || formData.previousDefaults === '') {
      errors.previousDefaults = 'Please select if you have previous defaults';
    }
    const creditHistory = Number(formData.creditHistoryLength);
    if (formData.creditHistoryLength === '' || isNaN(creditHistory) || creditHistory < 0) {
      errors.creditHistoryLength = 'Credit history length must be 0 or more years';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
