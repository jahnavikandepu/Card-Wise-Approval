import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  PlusCircle,
  Sparkles,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { getApplications, deleteApplication, clearApplicationHistory } from '../services/api';
import ApplicationTable from '../components/fintech/ApplicationTable';
import ApplicationCard from '../components/fintech/ApplicationCard';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchApps = async () => {
    try {
      const res = await getApplications();
      setApplications(res);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  // Delete a single application from history
  const handleDeleteApplication = async (id) => {
    if (!window.confirm(`Are you sure you want to delete application #${id}?`)) {
      return;
    }
    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((a) => a.id !== id && a.applicationId !== id));
    } catch (err) {
      console.error(`Failed to delete application #${id}:`, err);
    }
  };

  // Clear all application history
  const handleConfirmClearAll = async () => {
    try {
      await clearApplicationHistory();
      setApplications([]);
      setClearModalOpen(false);
    } catch (err) {
      console.error('Failed to clear application history:', err);
    }
  };

  // Summary counts
  const totalCount = applications.length;
  const eligibleCount = applications.filter((a) => a.score >= 70).length;
  const notEligibleCount = applications.filter((a) => a.score < 50).length;
  const pendingCount = applications.filter((a) => a.score >= 50 && a.score < 70).length;

  // Filtered list
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      (app.id && app.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.applicantName && app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'ELIGIBLE') return app.score >= 70;
    if (statusFilter === 'NOT_ELIGIBLE') return app.score < 50;
    if (statusFilter === 'PENDING') return app.score >= 50 && app.score < 70;
    return true;
  });

  if (loading) {
    return <LoadingSpinner fullPage message="Loading application history..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review past simulated evaluations, prediction metrics, and risk assessments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {applications.length > 0 && (
            <Button
              variant="secondary"
              size="md"
              icon={Trash2}
              onClick={() => setClearModalOpen(true)}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
            >
              Clear History
            </Button>
          )}
          <Link to="/apply">
            <Button variant="primary" size="md" icon={PlusCircle}>
              New Application
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Filter Pills / Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'ALL'
              ? 'bg-indigo-50/80 border-indigo-200 ring-2 ring-indigo-500/20'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-semibold text-slate-500 block">Total</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{totalCount}</span>
        </button>

        <button
          onClick={() => setStatusFilter('ELIGIBLE')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'ELIGIBLE'
              ? 'bg-emerald-50/80 border-emerald-200 ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700">Eligible</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <span className="text-2xl font-extrabold text-emerald-900 mt-1 block">{eligibleCount}</span>
        </button>

        <button
          onClick={() => setStatusFilter('PENDING')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'PENDING'
              ? 'bg-amber-50/80 border-amber-200 ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700">Moderate / Review</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <span className="text-2xl font-extrabold text-amber-900 mt-1 block">{pendingCount}</span>
        </button>

        <button
          onClick={() => setStatusFilter('NOT_ELIGIBLE')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'NOT_ELIGIBLE'
              ? 'bg-rose-50/80 border-rose-200 ring-2 ring-rose-500/20'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700">Not Eligible</span>
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <span className="text-2xl font-extrabold text-rose-900 mt-1 block">{notEligibleCount}</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search application ID (e.g. CW-1001)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {['ALL', 'ELIGIBLE', 'PENDING', 'NOT_ELIGIBLE'].map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setStatusFilter(filterKey)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                statusFilter === filterKey
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filterKey === 'ALL' ? 'All' : filterKey.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List (Responsive: Desktop Table / Mobile Cards) */}
      {filteredApplications.length > 0 ? (
        <>
          <div className="hidden md:block">
            <ApplicationTable
              applications={filteredApplications}
              basePath="/applications"
              onDelete={handleDeleteApplication}
            />
          </div>
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredApplications.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                basePath="/applications"
                onDelete={handleDeleteApplication}
              />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={FileText}
          title="No applications in history"
          description="You can check your credit card eligibility to generate and store a new assessment."
          actionLabel="Check Eligibility"
          onAction={() => setStatusFilter('ALL')}
          actionIcon={Sparkles}
        />
      )}

      {/* Confirmation Modal to Clear All History */}
      <Modal
        isOpen={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        title="Clear Application History"
        subtitle="This action cannot be undone"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-slate-700 text-sm">
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p>
              Are you sure you want to clear your entire application history? All previous assessment records will be permanently removed from MongoDB and local storage.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setClearModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={handleConfirmClearAll}
            >
              Yes, Clear All History
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Applications;
