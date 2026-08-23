import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Lock,
  Bell,
  LogOut,
  Save,
  CheckCircle2,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/formatters';
import Button from '../components/common/Button';
import InputField from '../components/common/InputField';
import FormSection from '../components/common/FormSection';
import Toast from '../components/common/Toast';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [personalData, setPersonalData] = useState({
    name: user?.name || 'Jahnavi K',
    email: user?.email || 'jahnavi.k@cardwise.io',
    phone: user?.phone || '+91 98765 43210'
  });

  const [creditData, setCreditData] = useState({
    creditScore: user?.profile?.creditScore || 742,
    annualIncome: user?.profile?.annualIncome || 650000,
    existingLoans: user?.profile?.existingLoans ?? 1,
    creditUtilization: user?.profile?.creditUtilization || 28
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    scoreChanges: true
  });

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreditChange = (e) => {
    const { name, value } = e.target;
    setCreditData((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      ...personalData,
      profile: {
        ...user?.profile,
        ...creditData
      }
    });
    setToastType('success');
    setToastMessage('Profile and financial metrics updated successfully!');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-indigo-600/20">
            {user?.name?.charAt(0) || 'J'}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {user?.name || 'Jahnavi K'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> {user?.email || 'jahnavi.k@cardwise.io'}
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleLogout}
          icon={LogOut}
          className="self-start sm:self-auto text-rose-600 border-rose-200 hover:bg-rose-50"
        >
          Logout
        </Button>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        
        {/* SECTION 1: PERSONAL INFORMATION */}
        <FormSection
          title="Personal Information"
          subtitle="Manage your contact information and identity credentials."
          icon={User}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="Full Name"
              name="name"
              value={personalData.name}
              onChange={handlePersonalChange}
              placeholder="Full Name"
              required
            />
            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={personalData.email}
              onChange={handlePersonalChange}
              placeholder="name@domain.com"
              required
            />
            <InputField
              label="Phone Number"
              name="phone"
              type="tel"
              value={personalData.phone}
              onChange={handlePersonalChange}
              placeholder="+91 98765 43210"
            />
          </div>
        </FormSection>

        {/* SECTION 2: DEFAULT CREDIT PROFILE */}
        <FormSection
          title="Baseline Credit Profile"
          subtitle="Default parameters pre-populated into credit evaluations and applications."
          icon={CreditCard}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <InputField
              label="Credit Score"
              name="creditScore"
              type="number"
              min="300"
              max="850"
              value={creditData.creditScore}
              onChange={handleCreditChange}
            />
            <InputField
              label="Annual Income"
              name="annualIncome"
              type="number"
              prefix="₹"
              value={creditData.annualIncome}
              onChange={handleCreditChange}
            />
            <InputField
              label="Existing Loans"
              name="existingLoans"
              type="number"
              min="0"
              max="10"
              value={creditData.existingLoans}
              onChange={handleCreditChange}
            />
            <InputField
              label="Credit Utilization"
              name="creditUtilization"
              type="number"
              min="0"
              max="100"
              suffix="%"
              value={creditData.creditUtilization}
              onChange={handleCreditChange}
            />
          </div>
        </FormSection>

        {/* SECTION 3: ACCOUNT & NOTIFICATIONS SETTINGS */}
        <FormSection
          title="Notification & Security Preferences"
          subtitle="Configure system alerts and profile communications."
          icon={Bell}
        >
          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
              <span className="font-semibold text-slate-800">Email Eligibility Updates</span>
              <input
                type="checkbox"
                checked={notifications.emailAlerts}
                onChange={(e) => setNotifications((p) => ({ ...p, emailAlerts: e.target.checked }))}
                className="w-4 h-4 rounded text-indigo-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
              <span className="font-semibold text-slate-800">Score Improvement Alerts</span>
              <input
                type="checkbox"
                checked={notifications.scoreChanges}
                onChange={(e) => setNotifications((p) => ({ ...p, scoreChanges: e.target.checked }))}
                className="w-4 h-4 rounded text-indigo-600"
              />
            </label>
          </div>
        </FormSection>

        {/* Save CTA */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={Save}
            className="shadow-md shadow-indigo-600/20"
          >
            Save Profile Changes
          </Button>
        </div>

      </form>

      {/* Toast Confirmation */}
      <Toast
        type={toastType}
        message={toastMessage}
        visible={!!toastMessage}
        onClose={() => setToastMessage('')}
      />

    </div>
  );
};

export default Profile;
