import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import RiskBadge from './RiskBadge';
import Button from '../common/Button';

const PredictionCard = ({
  score = 82,
  prediction = 'LIKELY ELIGIBLE',
  risk = 'Low Risk',
  onViewResult,
  viewResultLink = '/result',
  className = ''
}) => {
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/40 ${className}`}>
      {/* Glow decorative effects */}
      <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Latest ML Evaluation
            </span>
            <RiskBadge risk={risk} size="md" />
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-baseline gap-3">
              <span>{score}%</span>
              <span className="text-lg sm:text-xl font-bold text-emerald-400 uppercase tracking-wide">
                {prediction}
              </span>
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-md">
              Based on your credit history, income stability, and debt obligations, your profile demonstrates strong approval fundamentals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 pt-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              No hard inquiry impact
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Educational ML baseline
            </span>
          </div>
        </div>

        {/* Right CTA */}
        <div className="shrink-0 flex sm:flex-col justify-end gap-2">
          <Link to={viewResultLink}>
            <Button
              variant="primary"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              className="w-full shadow-lg shadow-indigo-600/30"
            >
              View Full Result
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default PredictionCard;
