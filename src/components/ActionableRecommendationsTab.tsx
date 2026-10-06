import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  Building2,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { ActionableRecommendation } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  recommendations: ActionableRecommendation[];
}

export const ActionableRecommendationsTab: React.FC<Props> = ({ recommendations }) => {
  const { t } = useLanguage();
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (stepKey: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  const filtered = recommendations.filter((r) =>
    filterPriority === 'ALL' ? true : r.priority === filterPriority
  );

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-950/80 text-red-300 border-red-500/80';
      case 'MEDIUM':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/80';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-400" />
            <span>{t.recommendationsTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.recommendationsSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                filterPriority === p
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p === 'ALL' ? t.filterAll : p}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {filtered.map((rec) => (
          <div
            key={rec.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 hover:border-slate-700 transition-all shadow-xl"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getPriorityStyle(
                    rec.priority
                  )}`}
                >
                  {t.priorityPrefix} {rec.priority}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {rec.category}
                </span>
                <span className="text-xs font-mono text-slate-500">{rec.id}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-semibold">{rec.owner_department}</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-300 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-800/60 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{t.timelineLabel}: {rec.timeline}</span>
                </div>
              </div>
            </div>

            {/* Recommendation Title */}
            <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
              {rec.title}
            </h3>

            {/* Expected Impact Card */}
            <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3 mb-4 flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  {t.expectedImpactLabel}
                </span>
                <p className="text-xs font-semibold text-emerald-200/90 leading-relaxed">
                  {rec.expected_impact}
                </p>
              </div>
            </div>

            {/* Action Steps Checklist */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {t.tacticalStepsTitle}
              </div>
              <div className="space-y-2">
                {rec.action_steps.map((step, sIdx) => {
                  const stepKey = `${rec.id}-step-${sIdx}`;
                  const isChecked = !!completedSteps[stepKey];
                  return (
                    <div
                      key={sIdx}
                      onClick={() => toggleStep(stepKey)}
                      className={`cursor-pointer flex items-start gap-3 p-2.5 rounded-xl border transition-all ${
                        isChecked
                          ? 'bg-emerald-950/20 border-emerald-800/50 text-slate-400 line-through'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-all ${
                          isChecked
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                            : 'border-slate-600 bg-slate-900'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className="text-xs leading-relaxed font-medium">{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
