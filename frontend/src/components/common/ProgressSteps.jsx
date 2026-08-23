import React from 'react';
import { Check } from 'lucide-react';

const ProgressSteps = ({
  steps = [],
  currentStep = 1,
  onStepClick,
  allowClickPrevious = true
}) => {
  return (
    <div className="w-full py-4">
      {/* Desktop Progress Bar */}
      <div className="hidden md:flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 w-full z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 transition-all duration-500 z-0"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
          }}
        />

        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const isClickable = allowClickPrevious && isCompleted && onStepClick;

          return (
            <div
              key={step.id || stepNum}
              className="relative z-10 flex flex-col items-center group cursor-default"
              onClick={() => isClickable && onStepClick(stepNum)}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  isCompleted
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                    : isCurrent
                    ? 'bg-white text-indigo-600 border-2 border-indigo-600 ring-4 ring-indigo-50 shadow-sm'
                    : 'bg-white text-slate-400 border border-slate-300'
                } ${isClickable ? 'cursor-pointer group-hover:scale-105' : ''}`}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : stepNum}
              </div>
              <div className="mt-2 text-center">
                <span
                  className={`text-xs font-medium block whitespace-nowrap ${
                    isCurrent ? 'text-indigo-600 font-semibold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                  }`}
                >
                  {step.title || step}
                </span>
                {step.subtitle && (
                  <span className="text-[10px] text-slate-400 block">{step.subtitle}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Step Indicator */}
      <div className="md:hidden flex items-center justify-between bg-slate-100 p-3.5 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
            {currentStep}
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-900 block">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title || steps[currentStep - 1]}
            </span>
          </div>
        </div>
        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
          {Math.round(((currentStep) / steps.length) * 100)}%
        </span>
      </div>
    </div>
  );
};

export default ProgressSteps;
