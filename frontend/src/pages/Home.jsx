import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  FileText
} from 'lucide-react';
import Button from '../components/common/Button';
import CreditCard from '../components/fintech/CreditCard';

const Home = () => {
  return (
    <div className="flex-1 flex flex-col justify-center py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-100/60 to-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Copy & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Know your credit eligibility{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
              before you apply.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
            CardWise uses machine-learning based prediction to help you understand your credit profile and explore your eligibility without impacting your credit score.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
            <Link to="/apply" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                className="w-full sm:w-auto shadow-lg shadow-indigo-600/25"
              >
                Check My Eligibility
              </Button>
            </Link>
            <Link to="/applications" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                icon={FileText}
                className="w-full sm:w-auto"
              >
                View Applications
              </Button>
            </Link>
          </div>

        </div>

        {/* Right Column: Virtual Credit Card Showcase */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="w-full max-w-md">
            <CreditCard
              holderName="JAHNAVI K"
              cardNumber="•••• •••• •••• 4821"
              validThru="12/29"
              cardType="AI ELITE MEMBER"
              className="shadow-2xl hover:rotate-1"
            />

            {/* Floating Pill Below Card */}
            <div className="mt-4 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-card flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  82%
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Likely Eligible</span>
                  <span className="text-[10px] text-slate-500">Predicted approval tier</span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                Low Risk
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
