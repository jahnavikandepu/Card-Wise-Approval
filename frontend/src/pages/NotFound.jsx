import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-6 shadow-inner">
        <CreditCard className="w-8 h-8" />
      </div>

      <span className="text-sm font-extrabold text-indigo-600 uppercase tracking-widest">
        404 Error
      </span>
      <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2 mb-3">
        Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
        The financial page or application record you are looking for does not exist or may have been moved.
      </p>

      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="primary" size="md" icon={Home}>
            Back to Home
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="secondary" size="md" icon={ArrowLeft}>
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
