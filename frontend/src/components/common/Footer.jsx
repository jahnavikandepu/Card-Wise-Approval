import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Shield, Sparkles, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Card<span className="text-indigo-400">Wise</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed">
              CardWise is an AI-powered credit card eligibility intelligence platform. Know your credit approval likelihood before initiating hard credit inquiries with financial institutions.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-950/60 border border-indigo-900/60 px-3 py-1.5 rounded-lg w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Educational ML Prediction Sandbox</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link to="/apply" className="hover:text-white transition">Check Eligibility</Link>
              </li>
              <li>
                <Link to="/applications" className="hover:text-white transition">My Applications</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition">User Dashboard</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition">Admin Portal</Link>
              </li>
            </ul>
          </div>

          {/* Legal / Policy */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Legal & Security</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <span className="text-slate-400 hover:text-white transition cursor-pointer">Privacy Policy</span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-white transition cursor-pointer">Terms of Service</span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-white transition cursor-pointer">Security Protocol</span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-white transition cursor-pointer">Contact Support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclaimer */}
        <div className="mt-10 pt-6 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed flex items-start gap-3">
            <Shield className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-300 block mb-0.5">Educational ML Disclaimer</span>
              CardWise provides an ML-based eligibility prediction for educational and informational purposes and does not represent an actual bank approval decision. Financial institutions perform their own independent underwriting evaluations.
            </div>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div>
              &copy; {new Date().getFullYear()} CardWise. All rights reserved.
            </div>
            <div className="flex items-center gap-1">
              <span>Crafted for modern fintech intelligence</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
