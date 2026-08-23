import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ArrowUpRight, Trash2 } from 'lucide-react';
import RiskBadge from './RiskBadge';
import { formatDate } from '../../utils/formatters';

const ApplicationTable = ({
  applications = [],
  isAdmin = false,
  basePath = '/applications',
  onDelete
}) => {
  if (!applications.length) {
    return null;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-xs">
      <table className="min-w-full divide-y divide-slate-200 text-left text-xs sm:text-sm">
        <thead className="bg-slate-50/80 font-semibold text-slate-600">
          <tr>
            <th scope="col" className="px-4 py-3.5 sm:px-6">Application ID</th>
            {isAdmin && <th scope="col" className="px-4 py-3.5 sm:px-6">Applicant</th>}
            <th scope="col" className="px-4 py-3.5 sm:px-6">Date</th>
            <th scope="col" className="px-4 py-3.5 sm:px-6">Eligibility Score</th>
            <th scope="col" className="px-4 py-3.5 sm:px-6">Prediction</th>
            <th scope="col" className="px-4 py-3.5 sm:px-6">Risk</th>
            <th scope="col" className="px-4 py-3.5 sm:px-6">Status</th>
            <th scope="col" className="px-4 py-3.5 sm:px-6 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {applications.map((app) => {
            const targetLink = isAdmin ? `/admin/applications?id=${app.id}` : `${basePath}/${app.id}`;
            return (
              <tr key={app.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="whitespace-nowrap px-4 py-4 sm:px-6 font-mono font-semibold text-indigo-600">
                  {app.id}
                </td>
                {isAdmin && (
                  <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                    <div className="font-semibold text-slate-800">{app.applicantName}</div>
                    <div className="text-[11px] text-slate-400">{app.applicantEmail}</div>
                  </td>
                )}
                <td className="whitespace-nowrap px-4 py-4 sm:px-6 text-slate-600">
                  {formatDate(app.date)}
                </td>
                <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{app.score}%</span>
                    <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                      <div
                        className={`h-full rounded-full ${
                          app.score >= 75
                            ? 'bg-emerald-500'
                            : app.score >= 55
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${app.score}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                  <span
                    className={`font-semibold text-xs ${
                      app.score >= 75
                        ? 'text-emerald-700'
                        : app.score >= 55
                        ? 'text-amber-700'
                        : 'text-rose-700'
                    }`}
                  >
                    {app.prediction}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                  <RiskBadge risk={app.risk} size="sm" />
                </td>
                <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {app.status || 'Completed'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 sm:px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={targetLink}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-xs font-semibold text-indigo-700 transition"
                    >
                      <span>View</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(app.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title={`Delete application ${app.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationTable;
