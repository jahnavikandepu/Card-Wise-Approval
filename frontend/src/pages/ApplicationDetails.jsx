import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Shield,
  User,
  Briefcase,
  AlertTriangle,
  Sparkles,
  Trash2
} from 'lucide-react';
import { getApplicationById, deleteApplication } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import RiskBadge from '../components/fintech/RiskBadge';
import ScoreCircle from '../components/fintech/ScoreCircle';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getApplicationById(id || 'CW-1001');
        setApp(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete application #${app.id}?`)) {
      return;
    }
    setDeleting(true);
    try {
      await deleteApplication(app.id);
      navigate('/applications');
    } catch (err) {
      console.error('Failed to delete application:', err);
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading application details..." />;
  }

  if (!app) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <h2 className="text-xl font-bold">Application not found</h2>
        <Link to="/applications" className="text-indigo-600 underline mt-2 block">
          Back to Applications
        </Link>
      </div>
    );
  }

  const details = app.details || {};
  const timeline = app.timeline || [
    { step: 'Application Submitted', date: '22 Aug 2026, 10:14 AM', completed: true },
    { step: 'Profile Analyzed', date: '22 Aug 2026, 10:14 AM', completed: true },
    { step: 'Prediction Generated', date: '22 Aug 2026, 10:15 AM', completed: true },
    { step: 'Result Available', date: '22 Aug 2026, 10:15 AM', completed: true }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Button & Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link
            to="/applications"
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Application #{app.id}
              </h1>
              <RiskBadge risk={app.risk} size="sm" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluated on {formatDate(app.date)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Status: {app.status || 'Completed'}
          </span>
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={handleDelete}
            loading={deleting}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Timeline Progression Component */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
          Application Audit Timeline
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative">
          {timeline.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 relative">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  {item.step}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {item.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prediction Summary Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            Model Outcome
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {app.prediction}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md">
            The profile exhibits an overall eligibility score of {app.score}% under standard risk benchmarks.
          </p>
        </div>

        <div className="shrink-0">
          <ScoreCircle score={app.score} size={140} strokeWidth={12} label="Score" />
        </div>
      </div>

      {/* Application Data Grid Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Section 1: Personal */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Personal Details</h3>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Applicant:</span>
              <span className="font-semibold text-slate-800">{details.fullName || app.applicantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Age:</span>
              <span className="font-semibold text-slate-800">{details.age || 26} Years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Gender:</span>
              <span className="font-semibold text-slate-800">{details.gender || 'Female'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Education:</span>
              <span className="font-semibold text-slate-800">{details.education || "Master's Degree"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Marital Status:</span>
              <span className="font-semibold text-slate-800">{details.maritalStatus || 'Single'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Dependents:</span>
              <span className="font-semibold text-slate-800">{details.dependents ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Financial */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Employment & Financial</h3>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Employment:</span>
              <span className="font-semibold text-slate-800">{details.employmentStatus || 'Employed Full-Time'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tenure:</span>
              <span className="font-semibold text-slate-800">{details.employmentYears || 3} Years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Annual Income:</span>
              <span className="font-semibold text-slate-800">{formatCurrency(details.annualIncome || app.income)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Monthly Expenses:</span>
              <span className="font-semibold text-slate-800">{formatCurrency(details.monthlyExpenses || 22000)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Active Loans:</span>
              <span className="font-semibold text-slate-800">{details.existingLoans ?? app.loans}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Credit */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <CreditCard className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Credit Information</h3>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Credit Score:</span>
              <span className="font-bold text-slate-900">{details.creditScore || app.creditScore}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Credit Utilization:</span>
              <span className="font-semibold text-slate-800">{details.creditUtilization || app.utilization}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Previous Defaults:</span>
              <span className="font-semibold text-slate-800">{details.previousDefaults || 'No'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Credit History:</span>
              <span className="font-semibold text-slate-800">{details.creditHistoryLength || 4} Years</span>
            </div>
          </div>
        </div>

      </div>

      {/* Decision Factors & Regulatory Tag */}
      <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start gap-3">
        <Shield className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-950 space-y-1">
          <span className="font-bold block">Simulation Audit Notice</span>
          <p>
            This application profile was processed in educational simulation mode. Actual banking products will require official identity verification, Form 16 / salary slip validation, and official bureau verification.
          </p>
        </div>
      </div>

    </div>
  );
};

export default ApplicationDetails;
