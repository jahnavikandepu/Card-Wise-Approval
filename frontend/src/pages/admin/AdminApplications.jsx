import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Eye,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  User,
  CreditCard,
  Briefcase
} from 'lucide-react';
import { getApplications } from '../../services/api';
import { formatDate, formatCurrency } from '../../utils/formatters';
import RiskBadge from '../../components/fintech/RiskBadge';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminApplications = () => {
  const [searchParams] = useSearchParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [predictionFilter, setPredictionFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await getApplications();
        setApplications(res);

        // Auto open details if query param provided
        const queryId = searchParams.get('id');
        if (queryId) {
          const match = res.find((a) => a.id.toLowerCase() === queryId.toLowerCase());
          if (match) setSelectedApp(match);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [searchParams]);

  // Filtering & Sorting
  const filteredList = applications
    .filter((app) => {
      const matchesSearch =
        app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicantEmail?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (predictionFilter === 'ELIGIBLE' && app.score < 70) return false;
      if (predictionFilter === 'NOT_ELIGIBLE' && app.score >= 50) return false;

      if (riskFilter !== 'ALL' && !app.risk.toLowerCase().includes(riskFilter.toLowerCase())) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'score-desc') return b.score - a.score;
      if (sortBy === 'score-asc') return a.score - b.score;
      return 0;
    });

  if (loading) {
    return <LoadingSpinner fullPage message="Loading application registry..." />;
  }

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin Application Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Audit, inspect, and evaluate individual simulated applicant profiles.
          </p>
        </div>

        <span className="px-3 py-1 bg-indigo-950/80 border border-indigo-800 text-indigo-300 text-xs font-semibold rounded-full self-start sm:self-auto">
          {filteredList.length} Total Records Found
        </span>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, email, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Prediction Filter */}
        <select
          value={predictionFilter}
          onChange={(e) => setPredictionFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
        >
          <option value="ALL">All Predictions</option>
          <option value="ELIGIBLE">Likely Eligible (70%+)</option>
          <option value="NOT_ELIGIBLE">Unlikely (&lt;50%)</option>
        </select>

        {/* Risk Filter */}
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
        >
          <option value="ALL">All Risk Tiers</option>
          <option value="low">Low Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="high">High Risk</option>
        </select>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
        >
          <option value="date-desc">Newest Date First</option>
          <option value="date-asc">Oldest Date First</option>
          <option value="score-desc">Highest Score First</option>
          <option value="score-asc">Lowest Score First</option>
        </select>

      </div>

      {/* Applications Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-left text-xs">
            <thead className="bg-slate-950 font-semibold text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Application ID</th>
                <th className="px-5 py-3.5">Applicant Name</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Score</th>
                <th className="px-5 py-3.5">Prediction</th>
                <th className="px-5 py-3.5">Risk Tier</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900 text-slate-300">
              {filteredList.map((app) => (
                <tr key={app.id} className="hover:bg-slate-800/60 transition-colors">
                  <td className="whitespace-nowrap px-5 py-4 font-mono font-bold text-indigo-400">
                    {app.id}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="font-semibold text-white">{app.applicantName}</div>
                    <div className="text-[10px] text-slate-500">{app.applicantEmail}</div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-400">
                    {formatDate(app.date)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 font-bold text-white">
                    {app.score}%
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`font-semibold ${
                        app.score >= 75
                          ? 'text-emerald-400'
                          : app.score >= 55
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {app.prediction}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <RiskBadge risk={app.risk} size="sm" />
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {app.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-semibold transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Applicant Inspection: #${selectedApp.id}`}
          subtitle={`Evaluated on ${formatDate(selectedApp.date)}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-5 text-slate-800">
            {/* Top Score Banner */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Score & Risk</span>
                <div className="text-xl font-bold flex items-center gap-2">
                  <span>{selectedApp.score}%</span>
                  <span className="text-sm font-semibold text-emerald-400">{selectedApp.prediction}</span>
                </div>
              </div>
              <RiskBadge risk={selectedApp.risk} size="md" />
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 block font-semibold">Applicant</span>
                <p className="font-bold text-slate-900">{selectedApp.applicantName}</p>
                <p className="text-slate-600">{selectedApp.applicantEmail}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 block font-semibold">Financial Data</span>
                <p className="font-bold text-slate-900">Income: {formatCurrency(selectedApp.income)}</p>
                <p className="text-slate-600">Credit Score: {selectedApp.creditScore}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="secondary" size="sm" onClick={() => setSelectedApp(null)}>
                Close Window
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default AdminApplications;
