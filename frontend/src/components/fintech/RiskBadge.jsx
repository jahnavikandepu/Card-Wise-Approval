import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

const RiskBadge = ({ risk = 'Low Risk', size = 'md' }) => {
  const normalized = risk.toLowerCase();

  let colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let Icon = ShieldCheck;

  if (normalized.includes('high') || normalized.includes('unlikely') || normalized.includes('critical')) {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
    Icon = ShieldX;
  } else if (normalized.includes('medium') || normalized.includes('moderate') || normalized.includes('fair')) {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
    Icon = ShieldAlert;
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm font-semibold gap-2'
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${colorClasses} ${sizes[size] || sizes.md}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{risk}</span>
    </span>
  );
};

export default RiskBadge;
