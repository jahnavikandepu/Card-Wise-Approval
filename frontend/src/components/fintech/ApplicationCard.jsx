import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, CreditCard, Percent, Trash2 } from 'lucide-react';
import RiskBadge from './RiskBadge';
import { formatDate } from '../../utils/formatters';

const ApplicationCard = ({
  application,
  isAdmin = false,
  basePath = '/applications',
  onDelete
}) => {
  const targetLink = isAdmin ? `/admin/applications?id=${application.id}` : `${basePath}/${application.id}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs transition-all hover:shadow-card-hover relative">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="font-mono text-xs font-bold text-indigo-600">
            {application.id}
          </span>
          {isAdmin && (
            <div className="text-xs font-semibold text-slate-800 mt-0.5">
              {application.applicantName}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <RiskBadge risk={application.risk} size="sm" />
          {onDelete && (
            <button
              onClick={() => onDelete(application.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="py-4 space-y-2.5 text-xs text-slate-600">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Date:
          </span>
          <span className="font-medium text-slate-700">{formatDate(application.date)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5" /> Score:
          </span>
          <span className="font-bold text-slate-900 text-sm">{application.score}%</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5" /> Prediction:
          </span>
          <span
            className={`font-semibold ${
              application.score >= 75
                ? 'text-emerald-600'
                : application.score >= 55
                ? 'text-amber-600'
                : 'text-rose-600'
            }`}
          >
            {application.prediction}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-500">
          Status: <strong className="text-slate-700">{application.status || 'Completed'}</strong>
        </span>
        <Link
          to={targetLink}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default ApplicationCard;
