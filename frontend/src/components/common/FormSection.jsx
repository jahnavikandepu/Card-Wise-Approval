import React from 'react';

const FormSection = ({
  title,
  subtitle,
  icon: Icon,
  children,
  action,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs ${className}`}>
      {(title || subtitle || Icon) && (
        <div className="flex items-start justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
