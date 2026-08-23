import React, { useEffect, useState } from 'react';
import {
  Cpu,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertCircle,
  Database,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { getModelMetrics } from '../../services/api';
import ChartCard from '../../components/fintech/ChartCard';
import StatCard from '../../components/fintech/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ModelPerformance = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await getModelMetrics();
        setMetrics(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage message="Evaluating ML model benchmarks..." />;
  }

  const {
    accuracy = 92.4,
    precision = 89.1,
    recall = 87.6,
    f1Score = 88.3,
    rocAuc = 94.2,
    modelComparisons = [],
    confusionMatrix = { truePositive: 685, falsePositive: 84, falseNegative: 97, trueNegative: 382 }
  } = metrics || {};

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800 text-indigo-300 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Active Model: Random Forest Classifier (v2.4)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Machine Learning Model Performance
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Validation scores, ROC-AUC curves, cross-algorithm benchmarks, and confusion matrix.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Database className="w-4 h-4 text-indigo-400" />
          <span>Training Set: 45,000 samples</span>
        </div>
      </div>

      {/* Model Performance Note */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/80 text-indigo-200 text-xs flex items-start gap-3">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white block mb-0.5">Evaluation Environment</span>
          Demo metrics — actual values will be loaded from the Python FastAPI machine-learning microservice upon backend integration.
        </div>
      </div>

      {/* Top 5 Core Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="Accuracy"
          value={`${accuracy}%`}
          subtitle="Overall correct predictions"
          icon={CheckCircle2}
          color="emerald"
          className="bg-slate-900 border-slate-800 text-white"
        />
        <StatCard
          title="Precision"
          value={`${precision}%`}
          subtitle="True positive precision"
          icon={TrendingUp}
          color="indigo"
          className="bg-slate-900 border-slate-800 text-white"
        />
        <StatCard
          title="Recall"
          value={`${recall}%`}
          subtitle="Sensitivity rate"
          icon={Activity}
          color="blue"
          className="bg-slate-900 border-slate-800 text-white"
        />
        <StatCard
          title="F1 Score"
          value={`${f1Score}%`}
          subtitle="Harmonic mean score"
          icon={Layers}
          color="amber"
          className="bg-slate-900 border-slate-800 text-white"
        />
        <StatCard
          title="ROC-AUC"
          value={`${rocAuc}%`}
          subtitle="Separability power"
          icon={Sparkles}
          color="emerald"
          className="bg-slate-900 border-slate-800 text-white"
        />
      </div>

      {/* Algorithm Benchmark Comparison & Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Model Comparison Chart */}
        <div className="lg:col-span-7">
          <ChartCard
            title="Algorithm Comparison Benchmark"
            subtitle="Comparing Accuracy, Precision, and Recall across 4 classifiers"
            className="bg-slate-900 border-slate-800 text-white"
          >
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelComparisons} margin={{ top: 20, right: 20, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="model" stroke="#94A3B8" fontSize={10} interval={0} angle={-10} textAnchor="end" />
                  <YAxis domain={[70, 100]} stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#F8FAFC' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="accuracy" name="Accuracy (%)" fill="#6366F1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="precision" name="Precision (%)" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="f1" name="F1 Score (%)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Right: Confusion Matrix Visualization */}
        <div className="lg:col-span-5 bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Confusion Matrix</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Testing distribution across 1,248 validation test records.
            </p>
          </div>

          {/* Matrix Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            
            {/* True Positive */}
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                True Positive (TP)
              </span>
              <div className="text-2xl font-black text-emerald-300">
                {confusionMatrix.truePositive}
              </div>
              <p className="text-[10px] text-emerald-500">Predicted Eligible, Actually Approved</p>
            </div>

            {/* False Positive */}
            <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-800 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                False Positive (FP)
              </span>
              <div className="text-2xl font-black text-rose-300">
                {confusionMatrix.falsePositive}
              </div>
              <p className="text-[10px] text-rose-500">Predicted Eligible, Actually Declined</p>
            </div>

            {/* False Negative */}
            <div className="p-4 rounded-2xl bg-amber-950/50 border border-amber-800 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                False Negative (FN)
              </span>
              <div className="text-2xl font-black text-amber-300">
                {confusionMatrix.falseNegative}
              </div>
              <p className="text-[10px] text-amber-500">Predicted Declined, Actually Approved</p>
            </div>

            {/* True Negative */}
            <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-800 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                True Negative (TN)
              </span>
              <div className="text-2xl font-black text-indigo-300">
                {confusionMatrix.trueNegative}
              </div>
              <p className="text-[10px] text-indigo-500">Predicted Declined, Actually Declined</p>
            </div>

          </div>

          <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800">
            <span>Overall Specificity: <strong className="text-slate-200">82.0%</strong></span>
            <span>Error Rate: <strong className="text-slate-200">7.6%</strong></span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ModelPerformance;
