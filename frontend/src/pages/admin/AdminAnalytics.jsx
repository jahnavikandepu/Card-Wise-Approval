import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Percent,
  Calendar,
  Layers
} from 'lucide-react';
import {
  LineChart,
  Line,
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
import ChartCard from '../../components/fintech/ChartCard';
import StatCard from '../../components/fintech/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getAdminData();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage message="Aggregating fintech data models..." />;
  }

  const { stats = {}, chartData = {} } = data || {};

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Comprehensive Predictive Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Deep-dive into income clusters, approval trajectories, and underwriting patterns.
          </p>
        </div>
      </div>

      {/* Analytics Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Approval Rate"
          value="62.7%"
          subtitle="Model positive predictions"
          icon={TrendingUp}
          trend="+3.2%"
          color="emerald"
          className="bg-slate-900 border-slate-800 text-white"
        />
        <StatCard
          title="Average Credit Score"
          value="712"
          subtitle="Median across intake"
          icon={Percent}
          color="indigo"
          className="bg-slate-900 border-slate-800 text-white"
        />
        <StatCard
          title="Avg Debt-To-Income"
          value="34%"
          subtitle="Healthy portfolio bounds"
          icon={Layers}
          color="blue"
          className="bg-slate-900 border-slate-800 text-white"
        />
        <StatCard
          title="Mean Processing Latency"
          value="48 ms"
          subtitle="Mock inference timing"
          icon={Calendar}
          color="amber"
          className="bg-slate-900 border-slate-800 text-white"
        />
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Monthly Application Volume & Approval Rate */}
        <ChartCard
          title="Application Volume & Approval Trend"
          subtitle="Total submissions vs favorable prediction counts"
          className="bg-slate-900 border-slate-800 text-white"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.applicationsOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#F8FAFC' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="total" name="Total Volume" stroke="#818CF8" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="eligible" name="Eligible Approved" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* 2. Income Bracket Distribution */}
        <ChartCard
          title="Applicant Annual Income Distribution"
          subtitle="Volume segmented into annual income tiers (in Lakhs)"
          className="bg-slate-900 border-slate-800 text-white"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.incomeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="range" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#F8FAFC' }} />
                <Bar dataKey="count" name="Applicants" fill="#6366F1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* 3. Credit Score Distribution */}
        <ChartCard
          title="Credit Score Tier Cluster"
          subtitle="Score distribution from Subprime (<550) to Super-Prime (800+)"
          className="bg-slate-900 border-slate-800 text-white"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.creditScoreDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="label" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#F8FAFC' }} />
                <Bar dataKey="count" name="Applicant Count" fill="#0EA5E9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* 4. Risk Profile Share */}
        <ChartCard
          title="Risk Classification Share"
          subtitle="Overall applicant risk segment distribution"
          className="bg-slate-900 border-slate-800 text-white"
        >
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.riskDistribution?.map((entry, index) => (
                    <Cell key={`analytics-risk-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#F8FAFC' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

      </div>

    </div>
  );
};

export default AdminAnalytics;
