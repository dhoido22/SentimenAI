import React from 'react';
import {
  LineChart as LineChartIcon,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertCircle,
  Sparkles,
  Award,
  Zap,
} from 'lucide-react';
import { WeeklyTrend, StrategicInsights } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  weeklyTrends: WeeklyTrend[];
  strategicInsights: StrategicInsights;
}

export const WeeklyTrendsTab: React.FC<Props> = ({ weeklyTrends, strategicInsights }) => {
  const { t } = useLanguage();

  if (!weeklyTrends || weeklyTrends.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        Data tren mingguan belum tersedia.
      </div>
    );
  }

  // Calculate chart boundaries for clean SVG rendering
  const csatValues = weeklyTrends.map((t) => t.csat);
  const minCsat = Math.min(...csatValues, 50);
  const maxCsat = Math.max(...csatValues, 95);

  const npsValues = weeklyTrends.map((t) => t.nps);
  const minNps = Math.min(...npsValues, -20);
  const maxNps = Math.max(...npsValues, 50);

  // SVG coordinate mapper
  const chartWidth = 600;
  const chartHeight = 200;
  const paddingX = 50;
  const paddingY = 30;

  const getCsatY = (val: number) => {
    const range = maxCsat - minCsat || 1;
    return chartHeight - paddingY - ((val - minCsat) / range) * (chartHeight - paddingY * 2);
  };

  const getNpsY = (val: number) => {
    const range = maxNps - minNps || 1;
    return chartHeight - paddingY - ((val - minNps) / range) * (chartHeight - paddingY * 2);
  };

  const getX = (idx: number) => {
    const step = (chartWidth - paddingX * 2) / Math.max(weeklyTrends.length - 1, 1);
    return paddingX + idx * step;
  };

  // Generate paths
  const csatPoints = weeklyTrends.map((t, idx) => `${getX(idx)},${getCsatY(t.csat)}`).join(' ');
  const npsPoints = weeklyTrends.map((t, idx) => `${getX(idx)},${getNpsY(t.nps)}`).join(' ');

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <LineChartIcon className="w-5 h-5 text-blue-400" />
            <span>{t.weeklyTrendsTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.weeklyTrendsSubtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-800/60">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>{t.legendCsat}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold bg-blue-950/50 px-2.5 py-1 rounded-lg border border-blue-800/60">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            <span>{t.legendNps}</span>
          </div>
        </div>
      </div>

      {/* Interactive Trend Chart */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px]">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-52 overflow-visible"
            >
              <defs>
                <linearGradient id="csatGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="npsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = paddingY + ratio * (chartHeight - paddingY * 2);
                return (
                  <line
                    key={i}
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#1e293b"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* CSAT Area & Line */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                points={csatPoints}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* NPS Line */}
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                points={npsPoints}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points & labels */}
              {weeklyTrends.map((trendItem, idx) => {
                const x = getX(idx);
                const csatY = getCsatY(trendItem.csat);
                const npsY = getNpsY(trendItem.nps);

                return (
                  <g key={idx}>
                    {/* CSAT Point */}
                    <circle cx={x} cy={csatY} r="5" fill="#10b981" stroke="#0f172a" strokeWidth="2" />
                    <text
                      x={x}
                      y={csatY - 10}
                      fill="#10b981"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {trendItem.csat}%
                    </text>

                    {/* NPS Point */}
                    <circle cx={x} cy={npsY} r="5" fill="#3b82f6" stroke="#0f172a" strokeWidth="2" />
                    <text
                      x={x}
                      y={npsY + 16}
                      fill="#3b82f6"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      NPS {trendItem.nps}
                    </text>

                    {/* Week X-axis label */}
                    <text
                      x={x}
                      y={chartHeight - 8}
                      fill="#94a3b8"
                      fontSize="10"
                      textAnchor="middle"
                    >
                      W{trendItem.week_number}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Weekly Cards Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {weeklyTrends.map((w, idx) => (
          <div
            key={idx}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                  {t.weekLabelShort(w.week_number)}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {w.week_label.split('(')[1]?.replace(')', '') || ''}
                </span>
              </div>

              <div className="flex items-baseline justify-between mb-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">CSAT</div>
                  <div className="text-xl font-black text-white">{w.csat}%</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">NPS</div>
                  <div className="text-xl font-black text-blue-400">{w.nps}</div>
                </div>
              </div>

              {/* Sentiment mini bar */}
              <div className="mb-3">
                <div className="flex justify-between text-[10px] text-slate-400 font-medium mb-1">
                  <span className="text-emerald-400">+{w.positive_pct}%</span>
                  <span className="text-slate-400">{w.neutral_pct}%</span>
                  <span className="text-red-400">-{w.negative_pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-800">
                  <div style={{ width: `${w.positive_pct}%` }} className="bg-emerald-500" />
                  <div style={{ width: `${w.neutral_pct}%` }} className="bg-slate-500" />
                  <div style={{ width: `${w.negative_pct}%` }} className="bg-red-500" />
                </div>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                {t.dominantIssueTitle}
              </span>
              <span className="text-slate-200 font-medium">{w.dominant_issue}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Strategic Insights & Systemic Bottlenecks */}
      {strategicInsights && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>{t.strategicInsightsTitle}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>{t.pillarsToMaintain}</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {strategicInsights.core_strengths.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{t.systemicBottlenecks}</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {strategicInsights.systemic_bottlenecks.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
