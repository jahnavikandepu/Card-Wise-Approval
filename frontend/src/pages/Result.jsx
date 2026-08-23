// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   Sparkles,
//   CheckCircle2,
//   AlertTriangle,
//   ArrowRight,
//   PlusCircle,
//   FileText,
//   LayoutDashboard,
//   Shield,
//   Lightbulb,
//   Share2
// } from 'lucide-react';
// import { getPrediction } from '../services/api';
// import ScoreCircle from '../components/fintech/ScoreCircle';
// import RiskBadge from '../components/fintech/RiskBadge';
// import Button from '../components/common/Button';
// import LoadingSpinner from '../components/common/LoadingSpinner';

// const Result = () => {
//   const [predictionData, setPredictionData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await getPrediction();
//         setPredictionData(res);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   if (loading) {
//     return <LoadingSpinner fullPage message="Fetching your prediction assessment..." />;
//   }

//   const score = predictionData?.score ?? predictionData?.eligibilityScore ?? 82;
//   const prediction = predictionData?.prediction || 'LIKELY ELIGIBLE';
//   const risk = predictionData?.risk || predictionData?.riskLevel || 'Low Risk';
//   const breakdown = predictionData?.breakdown || predictionData?.predictionResult?.breakdown || {
//     creditScoreRating: 85,
//     incomeStability: 78,
//     debtLevelRating: 72,
//     creditUtilizationRating: 81
//   };
//   const positiveFactors = (predictionData?.positiveFactors?.length ? predictionData.positiveFactors : null)
//     || (predictionData?.predictionFactors?.length ? predictionData.predictionFactors : null)
//     || [
//       'Strong credit score baseline',
//       'Stable income with comfortable debt-to-income balance',
//       'Healthy credit utilization maintained'
//     ];
//   const attentionFactors = (predictionData?.attentionFactors?.length ? predictionData.attentionFactors : null)
//     || (predictionData?.recommendations?.length ? predictionData.recommendations : null)
//     || [
//       'Maintain on-time payments across all accounts'
//     ];
//   const applicationId = predictionData?.applicationId || predictionData?.id || 'CW-1001';

//   return (
//     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

//       {/* Header */}
//       <div className="text-center max-w-2xl mx-auto space-y-2">
//         <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
//           <Sparkles className="w-3.5 h-3.5" />
//           AI Evaluation Completed
//         </span>
//         <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
//           Your Eligibility Result
//         </h1>
//         <p className="text-xs sm:text-sm text-slate-500">
//           Evaluated Application ID: <span className="font-mono font-bold text-slate-700">{applicationId}</span>
//         </p>
//       </div>

//       {/* Main Score Hero Card */}
//       <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-card text-center relative overflow-hidden">

//         {/* Top Disclaimer Pill */}
//         <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium mb-6">
//           <Shield className="w-3.5 h-3.5 text-indigo-600" />
//           <span>ML Prediction — Not an actual bank approval</span>
//         </div>

//         {/* Circular Gauge */}
//         <div className="my-2">
//           <ScoreCircle score={score} size={200} strokeWidth={16} label="Eligibility Score" />
//         </div>

//         {/* Prediction Status Badge */}
//         <div className="mt-4 space-y-2">
//           <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase">
//             {prediction}
//           </h2>
//           <div className="flex items-center justify-center gap-2">
//             <RiskBadge risk={risk} size="lg" />
//           </div>
//           <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2">
//             Our predictive model suggests that your current profile aligns favorably with prime credit card issuance benchmarks.
//           </p>
//         </div>

//         {/* Quick Action Buttons */}
//         <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3">
//           <Link to="/apply">
//             <Button variant="primary" size="md" icon={PlusCircle}>
//               New Evaluation
//             </Button>
//           </Link>
//           <Link to={`/applications/${applicationId}`}>
//             <Button variant="secondary" size="md" icon={FileText}>
//               View Application
//             </Button>
//           </Link>
//           <Link to="/dashboard">
//             <Button variant="ghost" size="md" icon={LayoutDashboard}>
//               Back to Dashboard
//             </Button>
//           </Link>
//         </div>

//       </div>

//       {/* Why Did CardWise Predict This? */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//         {/* Positive Factors */}
//         <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-6 space-y-4">
//           <div className="flex items-center gap-2 text-emerald-900">
//             <CheckCircle2 className="w-5 h-5 text-emerald-600" />
//             <h3 className="text-base font-bold">Positive Profile Factors</h3>
//           </div>
//           <ul className="space-y-2.5 text-xs sm:text-sm text-emerald-950 font-medium">
//             {positiveFactors.map((factor, idx) => (
//               <li key={idx} className="flex items-start gap-2">
//                 <span className="text-emerald-600 font-bold">✓</span>
//                 <span>{factor}</span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Attention Areas */}
//         <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 space-y-4">
//           <div className="flex items-center gap-2 text-amber-900">
//             <AlertTriangle className="w-5 h-5 text-amber-600" />
//             <h3 className="text-base font-bold">Areas for Improvement</h3>
//           </div>
//           <ul className="space-y-2.5 text-xs sm:text-sm text-amber-950 font-medium">
//             {attentionFactors.map((factor, idx) => (
//               <li key={idx} className="flex items-start gap-2">
//                 <span className="text-amber-600 font-bold">⚠</span>
//                 <span>{factor}</span>
//               </li>
//             ))}
//           </ul>
//         </div>

//       </div>

//       {/* Profile Breakdown Matrix */}
//       <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
//         <div>
//           <h3 className="text-lg font-bold text-slate-900">Profile Factor Breakdown</h3>
//           <p className="text-xs text-slate-500 mt-0.5">
//             Component ratings out of 100 utilized by the prediction engine.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//           {/* Factor 1: Credit Score */}
//           <div className="space-y-1.5">
//             <div className="flex items-center justify-between text-xs font-semibold">
//               <span className="text-slate-700">Credit Score Rating</span>
//               <span className="text-slate-900">{breakdown.creditScoreRating || 85}/100</span>
//             </div>
//             <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
//               <div
//                 className="bg-indigo-600 h-full rounded-full transition-all duration-700"
//                 style={{ width: `${breakdown.creditScoreRating || 85}%` }}
//               />
//             </div>
//           </div>

//           {/* Factor 2: Income Stability */}
//           <div className="space-y-1.5">
//             <div className="flex items-center justify-between text-xs font-semibold">
//               <span className="text-slate-700">Income Stability</span>
//               <span className="text-slate-900">{breakdown.incomeStability || 78}/100</span>
//             </div>
//             <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
//               <div
//                 className="bg-indigo-600 h-full rounded-full transition-all duration-700"
//                 style={{ width: `${breakdown.incomeStability || 78}%` }}
//               />
//             </div>
//           </div>

//           {/* Factor 3: Debt Level */}
//           <div className="space-y-1.5">
//             <div className="flex items-center justify-between text-xs font-semibold">
//               <span className="text-slate-700">Debt & Obligation Level</span>
//               <span className="text-slate-900">{breakdown.debtLevelRating || 72}/100</span>
//             </div>
//             <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
//               <div
//                 className="bg-indigo-600 h-full rounded-full transition-all duration-700"
//                 style={{ width: `${breakdown.debtLevelRating || 72}%` }}
//               />
//             </div>
//           </div>

//           {/* Factor 4: Credit Utilization */}
//           <div className="space-y-1.5">
//             <div className="flex items-center justify-between text-xs font-semibold">
//               <span className="text-slate-700">Credit Utilization Rating</span>
//               <span className="text-slate-900">{breakdown.creditUtilizationRating || 81}/100</span>
//             </div>
//             <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
//               <div
//                 className="bg-indigo-600 h-full rounded-full transition-all duration-700"
//                 style={{ width: `${breakdown.creditUtilizationRating || 81}%` }}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Recommended Next Steps */}
//       <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
//         <div className="flex items-center gap-2">
//           <Lightbulb className="w-5 h-5 text-amber-400" />
//           <h3 className="text-base font-bold text-white">Recommended Next Steps</h3>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           {recommendations.map((rec, i) => (
//             <div key={i} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 leading-relaxed">
//               <span className="text-indigo-400 font-bold block mb-1">0{i + 1}.</span>
//               {rec}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Regulatory Reminder Notice */}
//       <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-center text-xs text-slate-500">
//         <strong>Important Note:</strong> This assessment is an artificial intelligence simulation designed to help consumers understand credit readiness. Commercial banks perform independent credit evaluations according to their own proprietary risk models.
//       </div>

//     </div>
//   );
// };

// export default Result;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  FileText,
  LayoutDashboard,
  Shield,
  Lightbulb
} from 'lucide-react';

import { getPrediction } from '../services/api';
import ScoreCircle from '../components/fintech/ScoreCircle';
import RiskBadge from '../components/fintech/RiskBadge';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Result = () => {
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPrediction();
        setPredictionData(res);
      } catch (err) {
        console.error('Failed to load prediction:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <LoadingSpinner
        fullPage
        message="Fetching your prediction assessment..."
      />
    );
  }

  /*
   * ---------------------------------------------------------
   * Safely read prediction data from the backend response
   * ---------------------------------------------------------
   */

  const score =
    predictionData?.score ??
    predictionData?.eligibilityScore ??
    predictionData?.predictionResult?.score ??
    82;

  const prediction =
    predictionData?.prediction ??
    predictionData?.predictionResult?.prediction ??
    'LIKELY ELIGIBLE';

  const risk =
    predictionData?.risk ??
    predictionData?.riskLevel ??
    predictionData?.predictionResult?.risk ??
    'Low Risk';

  const breakdown =
    predictionData?.breakdown ??
    predictionData?.predictionResult?.breakdown ??
    {
      creditScoreRating: 85,
      incomeStability: 78,
      debtLevelRating: 72,
      creditUtilizationRating: 81
    };

  /*
   * Positive factors
   */
  const positiveFactors =
    predictionData?.positiveFactors?.length > 0
      ? predictionData.positiveFactors
      : predictionData?.predictionFactors?.length > 0
        ? predictionData.predictionFactors
        : predictionData?.predictionResult?.positiveFactors?.length > 0
          ? predictionData.predictionResult.positiveFactors
          : [
            'Strong credit score baseline',
            'Stable income with comfortable debt-to-income balance',
            'Healthy credit utilization maintained'
          ];

  /*
   * Recommendations
   *
   * IMPORTANT:
   * This variable was missing before and caused:
   *
   * ReferenceError: recommendations is not defined
   */
  const recommendations =
    predictionData?.recommendations?.length > 0
      ? predictionData.recommendations
      : predictionData?.predictionResult?.recommendations?.length > 0
        ? predictionData.predictionResult.recommendations
        : [
          'Maintain on-time payments across all accounts.',
          'Keep your credit utilization below 30%.',
          'Continue building a strong credit history.'
        ];

  /*
   * Areas for improvement
   */
  const attentionFactors =
    predictionData?.attentionFactors?.length > 0
      ? predictionData.attentionFactors
      : recommendations;

  /*
   * Application ID
   */
  const applicationId =
    predictionData?.applicationId ??
    predictionData?.id ??
    predictionData?.data?.applicationId ??
    predictionData?.data?.id ??
    'CW-1001';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
          <Sparkles className="w-3.5 h-3.5" />
          AI Evaluation Completed
        </span>

        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Your Eligibility Result
        </h1>

        <p className="text-xs sm:text-sm text-slate-500">
          Evaluated Application ID:{' '}
          <span className="font-mono font-bold text-slate-700">
            {applicationId}
          </span>
        </p>
      </div>

      {/* Main Score Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-card text-center relative overflow-hidden">

        {/* Disclaimer */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium mb-6">
          <Shield className="w-3.5 h-3.5 text-indigo-600" />
          <span>ML Prediction — Not an actual bank approval</span>
        </div>

        {/* Score */}
        <div className="my-2">
          <ScoreCircle
            score={score}
            size={200}
            strokeWidth={16}
            label="Eligibility Score"
          />
        </div>

        {/* Prediction */}
        <div className="mt-4 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase">
            {prediction}
          </h2>

          <div className="flex items-center justify-center gap-2">
            <RiskBadge risk={risk} size="lg" />
          </div>

          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2">
            Our predictive model suggests that your current profile aligns
            favorably with credit card issuance benchmarks.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3">

          <Link to="/apply">
            <Button
              variant="primary"
              size="md"
              icon={PlusCircle}
            >
              New Evaluation
            </Button>
          </Link>

          <Link to={`/applications/${applicationId}`}>
            <Button
              variant="secondary"
              size="md"
              icon={FileText}
            >
              View Application
            </Button>
          </Link>

          <Link to="/dashboard">
            <Button
              variant="ghost"
              size="md"
              icon={LayoutDashboard}
            >
              Back to Dashboard
            </Button>
          </Link>

        </div>
      </div>

      {/* Why Did CardWise Predict This? */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Positive Factors */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-6 space-y-4">

          <div className="flex items-center gap-2 text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />

            <h3 className="text-base font-bold">
              Positive Profile Factors
            </h3>
          </div>

          <ul className="space-y-2.5 text-xs sm:text-sm text-emerald-950 font-medium">

            {positiveFactors.map((factor, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2"
              >
                <span className="text-emerald-600 font-bold">
                  ✓
                </span>

                <span>{factor}</span>
              </li>
            ))}

          </ul>
        </div>

        {/* Attention Areas */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 space-y-4">

          <div className="flex items-center gap-2 text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600" />

            <h3 className="text-base font-bold">
              Areas for Improvement
            </h3>
          </div>

          <ul className="space-y-2.5 text-xs sm:text-sm text-amber-950 font-medium">

            {attentionFactors.map((factor, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2"
              >
                <span className="text-amber-600 font-bold">
                  ⚠
                </span>

                <span>{factor}</span>
              </li>
            ))}

          </ul>
        </div>
      </div>

      {/* Profile Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">

        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Profile Factor Breakdown
          </h3>

          <p className="text-xs text-slate-500 mt-0.5">
            Component ratings out of 100 utilized by the prediction engine.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Credit Score */}
          <div className="space-y-1.5">

            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700">
                Credit Score Rating
              </span>

              <span className="text-slate-900">
                {breakdown.creditScoreRating ?? 85}/100
              </span>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-700"
                style={{
                  width: `${breakdown.creditScoreRating ?? 85}%`
                }}
              />
            </div>
          </div>

          {/* Income Stability */}
          <div className="space-y-1.5">

            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700">
                Income Stability
              </span>

              <span className="text-slate-900">
                {breakdown.incomeStability ?? 78}/100
              </span>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-700"
                style={{
                  width: `${breakdown.incomeStability ?? 78}%`
                }}
              />
            </div>
          </div>

          {/* Debt Level */}
          <div className="space-y-1.5">

            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700">
                Debt & Obligation Level
              </span>

              <span className="text-slate-900">
                {breakdown.debtLevelRating ?? 72}/100
              </span>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-700"
                style={{
                  width: `${breakdown.debtLevelRating ?? 72}%`
                }}
              />
            </div>
          </div>

          {/* Credit Utilization */}
          <div className="space-y-1.5">

            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700">
                Credit Utilization Rating
              </span>

              <span className="text-slate-900">
                {breakdown.creditUtilizationRating ?? 81}/100
              </span>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-700"
                style={{
                  width: `${breakdown.creditUtilizationRating ?? 81}%`
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Recommended Next Steps */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">

        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />

          <h3 className="text-base font-bold text-white">
            Recommended Next Steps
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {recommendations.map((rec, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 leading-relaxed"
            >
              <span className="text-indigo-400 font-bold block mb-1">
                {String(i + 1).padStart(2, '0')}.
              </span>

              {rec}
            </div>
          ))}

        </div>
      </div>

      {/* Regulatory Reminder */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-center text-xs text-slate-500">

        <strong>Important Note:</strong>{' '}
        This assessment is an artificial intelligence simulation designed
        to help consumers understand credit readiness. Commercial banks
        perform independent credit evaluations according to their own
        proprietary risk models.

      </div>

    </div>
  );
};

export default Result;
