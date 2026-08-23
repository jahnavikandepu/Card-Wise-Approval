import React from 'react';

const ScoreCircle = ({
  score = 0,
  size = 180,
  strokeWidth = 14,
  label = 'Eligibility Score',
  sublabel
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let strokeColor = '#10B981'; // emerald
  let textColor = 'text-emerald-600';
  let bgColor = 'text-emerald-50';

  if (clampedScore < 55) {
    strokeColor = '#EF4444'; // rose
    textColor = 'text-rose-600';
    bgColor = 'text-rose-50';
  } else if (clampedScore < 75) {
    strokeColor = '#F59E0B'; // amber
    textColor = 'text-amber-600';
    bgColor = 'text-amber-50';
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${textColor}`}>
            {clampedScore}%
          </span>
          {label && (
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">
              {label}
            </span>
          )}
        </div>
      </div>
      {sublabel && (
        <span className="text-xs text-slate-500 font-medium mt-3">{sublabel}</span>
      )}
    </div>
  );
};

export default ScoreCircle;
