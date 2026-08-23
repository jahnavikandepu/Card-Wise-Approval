import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Briefcase,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Loader2,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { usePrediction } from '../hooks/usePrediction';
import { validateApplicationStep } from '../utils/validation';
import { formatCurrency } from '../utils/formatters';
import Button from '../components/common/Button';
import InputField from '../components/common/InputField';
import SelectField from '../components/common/SelectField';
import ProgressSteps from '../components/common/ProgressSteps';
import FormSection from '../components/common/FormSection';

const stepsConfig = [
  { id: 1, title: 'Personal', subtitle: 'Demographics' },
  { id: 2, title: 'Financial', subtitle: 'Income & Work' },
  { id: 3, title: 'Credit', subtitle: 'Score & History' },
  { id: 4, title: 'Review', subtitle: 'Verify & Submit' },
];

const Apply = () => {
  const { user } = useAuth();
  const { submitProfile, loading, error: apiError } = usePrediction();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal
    fullName: user?.name || 'Jahnavi K',
    email: user?.email || 'jahnavi.k@cardwise.io',
    age: '26',
    gender: 'Female',
    education: "Master's Degree",
    maritalStatus: 'Single',
    dependents: '0',

    // Step 2: Financial
    employmentStatus: 'Employed Full-Time',
    employmentYears: '3',
    annualIncome: '650000',
    monthlyIncome: '54000',
    monthlyExpenses: '22000',
    existingLoans: '1',

    // Step 3: Credit
    creditScore: '742',
    creditUtilization: '28',
    previousDefaults: 'no',
    creditHistoryLength: '4'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto compute monthly income if annual income changes
      if (name === 'annualIncome' && Number(value) > 0) {
        updated.monthlyIncome = String(Math.round(Number(value) / 12));
      }
      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleNext = () => {
    const { isValid, errors: stepErrors } = validateApplicationStep(currentStep, formData);
    if (!isValid) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setCurrentStep((prev) => Math.min(stepsConfig.length, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitProfile(formData);
      navigate('/result');
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Credit Card Eligibility Application
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Complete the 4-step financial profile to evaluate ML approval likelihood without impacting your credit score.
        </p>
      </div>

      {/* Multi-step progress indicator */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs">
        <ProgressSteps
          steps={stepsConfig}
          currentStep={currentStep}
          onStepClick={(step) => {
            if (step < currentStep) setCurrentStep(step);
          }}
        />
      </div>

      {apiError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Form Steps Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* STEP 1: PERSONAL INFORMATION */}
        {currentStep === 1 && (
          <FormSection
            title="Step 1: Personal Information"
            subtitle="Basic demographic details for risk category calibration."
            icon={User}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Jahnavi K"
                error={errors.fullName}
                required
              />

              <InputField
                label="Age"
                name="age"
                type="number"
                min="18"
                max="100"
                value={formData.age}
                onChange={handleChange}
                placeholder="18 - 100"
                error={errors.age}
                required
              />

              <SelectField
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={[
                  { value: 'Female', label: 'Female' },
                  { value: 'Male', label: 'Male' },
                  { value: 'Non-Binary', label: 'Non-Binary' },
                  { value: 'Prefer not to say', label: 'Prefer not to say' }
                ]}
                error={errors.gender}
                required
              />

              <SelectField
                label="Education Level"
                name="education"
                value={formData.education}
                onChange={handleChange}
                options={[
                  { value: 'High School', label: 'High School' },
                  { value: 'Associate Degree', label: 'Associate Degree' },
                  { value: 'Bachelor Degree', label: 'Bachelor Degree' },
                  { value: "Master's Degree", label: "Master's Degree" },
                  { value: 'Doctorate / PhD', label: 'Doctorate / PhD' },
                  { value: 'Professional Degree', label: 'Professional Degree' }
                ]}
                error={errors.education}
                required
              />

              <SelectField
                label="Marital Status"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                options={[
                  { value: 'Single', label: 'Single' },
                  { value: 'Married', label: 'Married' },
                  { value: 'Divorced', label: 'Divorced' },
                  { value: 'Widowed', label: 'Widowed' }
                ]}
                error={errors.maritalStatus}
                required
              />

              <InputField
                label="Number of Dependents"
                name="dependents"
                type="number"
                min="0"
                max="10"
                value={formData.dependents}
                onChange={handleChange}
                placeholder="0"
                error={errors.dependents}
                required
              />
            </div>
          </FormSection>
        )}

        {/* STEP 2: EMPLOYMENT & FINANCIAL INFORMATION */}
        {currentStep === 2 && (
          <FormSection
            title="Step 2: Employment & Financial Information"
            subtitle="Income stability, employment tenure, and debt obligation metrics."
            icon={Briefcase}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField
                label="Employment Status"
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleChange}
                options={[
                  { value: 'Employed Full-Time', label: 'Employed Full-Time' },
                  { value: 'Employed Part-Time', label: 'Employed Part-Time' },
                  { value: 'Self-Employed / Business Owner', label: 'Self-Employed / Business Owner' },
                  { value: 'Freelancer / Consultant', label: 'Freelancer / Consultant' },
                  { value: 'Student', label: 'Student' },
                  { value: 'Retired', label: 'Retired' }
                ]}
                error={errors.employmentStatus}
                required
              />

              <InputField
                label="Employment Duration (Years)"
                name="employmentYears"
                type="number"
                min="0"
                max="50"
                step="0.5"
                value={formData.employmentYears}
                onChange={handleChange}
                placeholder="e.g. 3"
                suffix="Years"
                error={errors.employmentYears}
                required
              />

              <InputField
                label="Annual Income"
                name="annualIncome"
                type="number"
                prefix="₹"
                value={formData.annualIncome}
                onChange={handleChange}
                placeholder="e.g. 650000"
                helperText={`Approx ${formatCurrency(formData.annualIncome)} per annum`}
                error={errors.annualIncome}
                required
              />

              <InputField
                label="Monthly Income"
                name="monthlyIncome"
                type="number"
                prefix="₹"
                value={formData.monthlyIncome}
                onChange={handleChange}
                placeholder="e.g. 54000"
                error={errors.monthlyIncome}
                required
              />

              <InputField
                label="Monthly Expenses"
                name="monthlyExpenses"
                type="number"
                prefix="₹"
                value={formData.monthlyExpenses}
                onChange={handleChange}
                placeholder="e.g. 22000"
                helperText="Living expenses, rent, utilities"
                error={errors.monthlyExpenses}
                required
              />

              <InputField
                label="Existing Active Loans"
                name="existingLoans"
                type="number"
                min="0"
                max="10"
                value={formData.existingLoans}
                onChange={handleChange}
                placeholder="0"
                helperText="Personal, auto, home or education loans"
                error={errors.existingLoans}
                required
              />
            </div>
          </FormSection>
        )}

        {/* STEP 3: CREDIT INFORMATION */}
        {currentStep === 3 && (
          <FormSection
            title="Step 3: Credit Information"
            subtitle="Credit score rating and repayment track record."
            icon={CreditCard}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <InputField
                  label="Credit Score (CIBIL / Experian)"
                  name="creditScore"
                  type="number"
                  min="300"
                  max="850"
                  value={formData.creditScore}
                  onChange={handleChange}
                  placeholder="300 - 850"
                  helperText="Standard credit score range: 300 to 850 (750+ recommended)"
                  error={errors.creditScore}
                  required
                />
              </div>

              <InputField
                label="Credit Card Utilization"
                name="creditUtilization"
                type="number"
                min="0"
                max="100"
                suffix="%"
                value={formData.creditUtilization}
                onChange={handleChange}
                placeholder="0 - 100"
                helperText="Percentage of total credit limit utilized (under 30% is optimal)"
                error={errors.creditUtilization}
                required
              />

              <SelectField
                label="Any Previous Defaults?"
                name="previousDefaults"
                value={formData.previousDefaults}
                onChange={handleChange}
                options={[
                  { value: 'no', label: 'No – Clean repayment record' },
                  { value: 'yes', label: 'Yes – Past delayed payment / default' }
                ]}
                error={errors.previousDefaults}
                required
              />

              <InputField
                label="Credit History Length"
                name="creditHistoryLength"
                type="number"
                min="0"
                max="50"
                suffix="Years"
                value={formData.creditHistoryLength}
                onChange={handleChange}
                placeholder="e.g. 4"
                error={errors.creditHistoryLength}
                required
              />
            </div>
          </FormSection>
        )}

        {/* STEP 4: REVIEW */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
              <p className="text-xs text-indigo-900 leading-relaxed font-medium">
                Please verify your details before running the predictive model. No hard credit inquiry will be registered with credit bureaus.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Personal Summary */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">1. Personal</h4>
                  <button type="button" onClick={() => setCurrentStep(1)} className="text-xs text-indigo-600 hover:underline">Edit</button>
                </div>
                <div className="text-xs space-y-1.5 text-slate-600">
                  <p><strong className="text-slate-900">Name:</strong> {formData.fullName}</p>
                  <p><strong className="text-slate-900">Age:</strong> {formData.age} yrs</p>
                  <p><strong className="text-slate-900">Gender:</strong> {formData.gender}</p>
                  <p><strong className="text-slate-900">Education:</strong> {formData.education}</p>
                  <p><strong className="text-slate-900">Marital:</strong> {formData.maritalStatus}</p>
                  <p><strong className="text-slate-900">Dependents:</strong> {formData.dependents}</p>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">2. Financial</h4>
                  <button type="button" onClick={() => setCurrentStep(2)} className="text-xs text-indigo-600 hover:underline">Edit</button>
                </div>
                <div className="text-xs space-y-1.5 text-slate-600">
                  <p><strong className="text-slate-900">Status:</strong> {formData.employmentStatus}</p>
                  <p><strong className="text-slate-900">Tenure:</strong> {formData.employmentYears} yrs</p>
                  <p><strong className="text-slate-900">Annual:</strong> {formatCurrency(formData.annualIncome)}</p>
                  <p><strong className="text-slate-900">Monthly:</strong> {formatCurrency(formData.monthlyIncome)}</p>
                  <p><strong className="text-slate-900">Expenses:</strong> {formatCurrency(formData.monthlyExpenses)}</p>
                  <p><strong className="text-slate-900">Loans:</strong> {formData.existingLoans} active</p>
                </div>
              </div>

              {/* Credit Summary */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">3. Credit</h4>
                  <button type="button" onClick={() => setCurrentStep(3)} className="text-xs text-indigo-600 hover:underline">Edit</button>
                </div>
                <div className="text-xs space-y-1.5 text-slate-600">
                  <p><strong className="text-slate-900">Credit Score:</strong> {formData.creditScore}</p>
                  <p><strong className="text-slate-900">Utilization:</strong> {formData.creditUtilization}%</p>
                  <p><strong className="text-slate-900">Defaults:</strong> {formData.previousDefaults === 'yes' ? 'Yes' : 'None'}</p>
                  <p><strong className="text-slate-900">History:</strong> {formData.creditHistoryLength} yrs</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleBack}
              icon={ArrowLeft}
              disabled={loading}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {currentStep < stepsConfig.length ? (
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleNext}
              icon={ArrowRight}
              iconPosition="right"
            >
              Continue to Step {currentStep + 1}
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon={Sparkles}
              iconPosition="right"
              className="shadow-lg shadow-indigo-600/30"
            >
              {loading ? 'Analyzing your profile...' : 'Submit Application & Predict'}
            </Button>
          )}
        </div>

      </form>

      {/* Loading Overlay Modal when analyzing */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Analyzing your profile...</h3>
            <p className="text-xs text-slate-500">
              Evaluating credit factors, debt obligations, and computing ML eligibility score.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default Apply;
