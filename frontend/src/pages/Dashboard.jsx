import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  FileText,
  CheckCircle2,
  Calendar,
  Sparkles,
  CreditCard as CardIcon,
  DollarSign,
  Briefcase,
  Percent,
  PlusCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getDashboardData } from '../services/api';
import { formatCurrency, formatPercent } from '../utils/formatters';
import StatCard from '../components/fintech/StatCard';
import PredictionCard from '../components/fintech/PredictionCard';
import ApplicationTable from '../components/fintech/ApplicationTable';
import ApplicationCard from '../components/fintech/ApplicationCard';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getDashboardData();
        setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage message="Loading your dashboard..." />;
  }

  const stats = data?.stats || {};
  const recentApps = data?.recentApplications || [];
  const profile = user?.profile || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Good morning, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Here's an overview of your credit eligibility activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/apply">
            <Button variant="primary" size="md" icon={PlusCircle}>
              New Evaluation
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Statistics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Latest Eligibility Score"
          value={`${stats.latestScore || 82}%`}
          subtitle="Likely Eligible tier"
          icon={TrendingUp}
          trend="+4%"
          trendDirection="up"
          color="emerald"
        />
        <StatCard
          title="Applications"
          value={stats.totalApplications || 4}
          subtitle="Total evaluations performed"
          icon={FileText}
          color="indigo"
        />
        <StatCard
          title="Eligible Predictions"
          value={stats.eligibleCount || 3}
          subtitle="Passed standard criteria"
          icon={CheckCircle2}
          color="blue"
        />
        <StatCard
          title="Last Checked"
          value={stats.lastChecked || '22 Aug 2026'}
          subtitle="Evaluation timestamp"
          icon={Calendar}
          color="amber"
        />
      </div>

      {/* Large Featured Prediction Card */}
      <div>
        <PredictionCard
          score={stats.latestScore || 82}
          prediction={stats.predictionStatus || 'Likely Eligible'}
          risk={stats.riskLevel || 'Low Risk'}
          viewResultLink="/result"
        />
      </div>

      {/* Credit Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Credit Profile Overview</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Key financial markers utilized by CardWise ML predictive engine.
            </p>
          </div>
          <Link to="/profile">
            <span className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline">
              Edit Baseline
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Credit Score */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">Credit Score</span>
              <span className="text-emerald-600 font-bold">Good</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {profile.creditScore || 742}
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${((profile.creditScore || 742) / 850) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>300</span>
              <span>850 Max</span>
            </div>
          </div>

          {/* Annual Income */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">Annual Income</span>
              <span className="text-indigo-600 font-bold">Verified</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {formatCurrency(profile.annualIncome || 650000)}
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: '70%' }} />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹0</span>
              <span>₹10L+ Target</span>
            </div>
          </div>

          {/* Existing Loans */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">Existing Loans</span>
              <span className="text-emerald-600 font-bold">Low Burden</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {profile.existingLoans ?? 1} <span className="text-xs text-slate-500 font-normal">active</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '25%' }} />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 Loans</span>
              <span>4+ Heavy</span>
            </div>
          </div>

          {/* Credit Utilization */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">Credit Utilization</span>
              <span className="text-emerald-600 font-bold">&lt; 30% Ideal</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {profile.creditUtilization || 28}%
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '28%' }} />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

        </div>
      </div>

      {/* Recent Applications Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Applications</h3>
            <p className="text-xs text-slate-500">
              Historical simulated applications evaluated on CardWise.
            </p>
          </div>
          <Link to="/applications">
            <Button variant="secondary" size="sm" icon={ArrowRight} iconPosition="right">
              View All Applications
            </Button>
          </Link>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block">
          <ApplicationTable applications={recentApps} basePath="/applications" />
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recentApps.map((app) => (
            <ApplicationCard key={app.id} application={app} basePath="/applications" />
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
