import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileCheck2,
  AlertOctagon,
  Percent,
  ArrowRight,
  TrendingUp,
  Shield,
  Filter
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { getAdminData } from '../../services/api';
import StatCard from '../../components/fintech/StatCard';
import ChartCard from '../../components/fintech/ChartCard';
import ApplicationTable from '../../components/fintech/ApplicationTable';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAdminData();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage message="Aggregating admin intelligence..." />;
  }

  const { stats = {}, chartData = {}, applications = [] } = data || {};

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin Overview & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time telemetry, classification distributions, and model inference statistics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/admin/model">
            <Button
              variant="dark"
              size="sm"
              icon={Shield}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700"
            >
              ML Model Status
            </Button>
          </Link>
          <Link to="/admin/applications">
            <Button
              variant="primary"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
            >
              All Applications
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 4 KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Applications"
          value={stats.totalApplications?.toLocaleString() || '1,248'}
          subtitle="+14% this month"
          icon={Users}
          trend="+18%"
          trendDirection="up"
          color="indigo"
          className="bg-slate-900 border-slate-800 text-white"
        />
        <StatCard
          title="Eligible Predictions"
          value={stats.eligibleCount?.toLocaleString() || '782'}
          subtitle="62.7% Approval Ratio"
          icon={FileCheck2}
          trend="+8%"
          trendDirection="up"
          color="emerald"
          className="bg-slate-900 border-slate-800 text-white"
        />
        <StatCard
          title="Not Eligible"
          value={stats.notEligibleCount?.toLocaleString() || '466'}
          subtitle="37.3% Below Threshold"
          icon={AlertOctagon}
          trend="-3%"
          trendDirection="down"
          color="rose"
          className="bg-slate-900 border-slate-800 text-white"
        />
        <StatCard
          title="Average Score"
          value={`${stats.averageScore || 71}%`}
          subtitle="Consistent across batches"
          icon={Percent}
          color="amber"
          className="bg-slate-900 border-slate-800 text-white"
        />
      </div>

      {/* 4 Recharts Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Applications Over Time */}
        <ChartCard
          title="Applications Trend Over Time"
          subtitle="Monthly volume of simulated evaluations vs approval yields"
          badge="Live Feed"
          className="bg-slate-900 border-slate-800 text-white"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.applicationsOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="eligibleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#F8FAFC' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="total" name="Total Volume" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#totalGrad)" />
                <Area type="monotone" dataKey="eligible" name="Eligible" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#eligibleGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 2: Eligible vs Not Eligible Donut */}
        <ChartCard
          title="Eligible vs. Not Eligible Breakdown"
          subtitle="Proportion of simulated approvals vs declines"
          className="bg-slate-900 border-slate-800 text-white"
        >
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.eligibleVsNotEligible}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.eligibleVsNotEligible?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#F8FAFC' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 3: Risk Distribution */}
        <ChartCard
          title="Risk Category Distribution"
          subtitle="Applicant volume segmented across Low, Medium, and High risk"
          className="bg-slate-900 border-slate-800 text-white"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.riskDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#F8FAFC' }}
                />
                <Bar dataKey="value" name="Applicants" radius={[8, 8, 0, 0]}>
                  {chartData.riskDistribution?.map((entry, index) => (
                    <Cell key={`risk-cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 4: Credit Score Distribution */}
        <ChartCard
          title="Credit Score Tier Distribution"
          subtitle="Applicant volume clustered across CIBIL/Experian score ranges"
          className="bg-slate-900 border-slate-800 text-white"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.creditScoreDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="range" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#F8FAFC' }}
                />
                <Bar dataKey="count" name="Applicants" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

      </div>

      {/* Recent Applications Feed */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 text-white">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">Recent Intake Evaluations</h3>
            <p className="text-xs text-slate-400">All submissions parsed through CardWise demo pipeline.</p>
          </div>
          <Link to="/admin/applications">
            <span className="text-xs font-semibold text-indigo-400 hover:underline">
              View Full Directory &rarr;
            </span>
          </Link>
        </div>

        <ApplicationTable applications={applications} isAdmin={true} />
      </div>

    </div>
  );
};

export default AdminDashboard;
