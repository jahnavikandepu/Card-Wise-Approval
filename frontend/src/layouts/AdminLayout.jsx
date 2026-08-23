import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  ArrowLeft,
  Shield,
  CheckCircle2
} from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import { useAuth } from '../hooks/useAuth';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area (Offset by sidebar on lg) */}
      <div className="lg:pl-64 flex flex-col flex-1">
        
        {/* Admin Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick search input */}
            <div className="relative hidden sm:block w-64 md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search applicants, ID (e.g. CW-1001)..."
                className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* Right Header Area */}
          <div className="flex items-center gap-3">
            <button
              className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="System Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-900" />
            </button>

            <div className="h-5 w-px bg-slate-800 mx-1" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/90 border border-indigo-400/40 text-white flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-slate-200">Admin Control</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Live Sync
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Admin Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-950 text-slate-200">
          <Outlet />
        </main>

        {/* Admin Footer */}
        <footer className="h-12 bg-slate-900 border-t border-slate-800/80 px-6 flex items-center justify-between text-[11px] text-slate-500">
          <div>CardWise Internal Administration Portal &bull; ML Simulation Engine</div>
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>Encrypted Environment</span>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default AdminLayout;
