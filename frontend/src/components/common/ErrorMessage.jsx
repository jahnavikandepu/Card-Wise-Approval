import React from 'react';
import { AlertOctagon, RotateCw } from 'lucide-react';
import Button from './Button';

const ErrorMessage = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this section.',
  onRetry
}) => {
  return (
    <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 text-center sm:text-left">
        <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
          <AlertOctagon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-rose-900">{title}</h4>
          <p className="text-xs text-rose-700 mt-0.5">{message}</p>
        </div>
      </div>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          icon={RotateCw}
          className="border-rose-200 text-rose-700 hover:bg-rose-100"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;
