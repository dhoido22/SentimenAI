import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertOctagon,
  CheckCircle,
  HelpCircle,
  Award,
  Zap,
  DollarSign,
  Users,
  Clock,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';
import { ExecutiveReport } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  report: ExecutiveReport;
  onNavigateToIssues: () => void;
  onNavigateToRecommendations: () => void;
}

export const ExecutiveSummaryTab: React.FC<Props> = ({
  report,
  onNavigateToIssues,
  onNavigateToRecommendations,
}) => {
  const { t, language } = useLanguage();
  const { executive_summary, satisfaction_metrics, metadata, strategic_insights } = report;
  const { sentiment_distribution, urgency_levels } = satisfaction_metrics;

  const statusColor =
    executive_summary.status_level === 'CRITICAL'
      ? 'border-red-500/80 bg-red-950/20 text-red-400'
      : executive_summary.status_level === 'WARNING'
      ? 'border-amber-500/80 bg-amber-950/20 text-amber-400'
      : 'border-emerald-500/80 bg-emerald-950/20 text-emerald-400';

  return (
    <div className="space-y-6">
      {/* Executive Headline & Status Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {t.reportIdLabel} #{metadata.report_id}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-blue-400 font-medium">
                {metadata.industry_sector}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">
                {new Date(metadata.generated_at).toLocaleString(language === 'en' ? 'en-US' : 'id-ID', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
              {executive_summary.headline}
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className={`px-4 py-2 rounded-xl border font-bold text-xs tracking-wider uppercase flex items-center gap-2 ${statusColor}`}>
              {executive_summary.status_level === 'CRITICAL' ? (
                <AlertOctagon className="w-4 h-4 animate-bounce" />
              ) : executive_summary.status_level === 'WARNING' ? (
                <ShieldAlert className="w-4 h-4" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span>{t.statusLabel} {executive_summary.status_level}</span>
            </div>

            <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/80 text-right">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{t.sentimentIndex}</div>
              <div className="text-lg font-black text-white flex items-center justify-end gap-1">
                <span>{executive_summary.sentiment_score}</span>
                <span className="text-xs font-medium text-slate-400">/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Key Takeaways */}
        <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {executive_summary.key_takeaways.map((takeaway, idx) => (
            <div
              key={idx}
              className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5"
            >
              <div className="w-5 h-5 rounded-full bg-blue-900/60 text-blue-400 border border-blue-700/50 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p>{takeaway}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Primary KPI Grid (CSAT, NPS, CES, Volume) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CSAT Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t.csatTitle}</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-black text-white">{satisfaction_metrics.csat_score}%</span>
            <span className="text-xs font-medium text-slate-400">{t.csatSub}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-700 ${
                satisfaction_metrics.csat_score >= 80
                  ? 'bg-emerald-500'
                  : satisfaction_metrics.csat_score >= 65
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, satisfaction_metrics.csat_score)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            {satisfaction_metrics.csat_benchmark_status}
          </p>
        </div>

        {/* NPS Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t.npsTitle}</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-3xl font-black ${
              satisfaction_metrics.nps_score >= 40
                ? 'text-emerald-400'
                : satisfaction_metrics.nps_score >= 0
                ? 'text-blue-400'
                : 'text-red-400'
            }`}>
              {satisfaction_metrics.nps_score > 0 ? `+${satisfaction_metrics.nps_score}` : satisfaction_metrics.nps_score}
            </span>
            <span className="text-xs font-medium text-slate-400">{t.npsSub}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium bg-slate-950/70 py-1.5 px-2 rounded-lg border border-slate-800 mb-1">
            <span>{t.npsCategory}</span>
            <span className="text-blue-300 font-semibold">{satisfaction_metrics.nps_category}</span>
          </div>
          <p className="text-[10px] text-slate-500">
            {sentiment_distribution.positive_count} Promoters vs {sentiment_distribution.negative_count} Detractors
          </p>
        </div>

        {/* CES Card (Customer Effort Score) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t.cesTitle}</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-black text-white">{satisfaction_metrics.ces_score}</span>
            <span className="text-xs font-medium text-slate-400">{t.cesSub}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-700 ${
                satisfaction_metrics.ces_score <= 2.5
                  ? 'bg-emerald-500'
                  : satisfaction_metrics.ces_score <= 3.8
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${(satisfaction_metrics.ces_score / 5.0) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            {satisfaction_metrics.ces_score > 3.5
              ? language === 'en' ? 'High friction (Customers experiencing obstacle loops)' : 'Tingkat usaha tinggi (Pelanggan mengalami friksi sistem)'
              : language === 'en' ? 'Low to moderate friction' : 'Friksi rendah hingga wajar'}
          </p>
        </div>

        {/* Volume & Engine Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t.totalReviewsTitle}</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-black text-white">{metadata.total_reviews_analyzed}</span>
            <span className="text-xs font-medium text-slate-400">{t.reviewsProcessed}</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mb-1.5">
            <span>{t.modelAccuracy} {metadata.confidence_score}%</span>
          </div>
          <p className="text-[10px] text-slate-500 truncate" title={metadata.analysis_engine}>
            {t.engineLabel} {metadata.analysis_engine}
          </p>
        </div>
      </div>

      {/* Sentiment Distribution & Urgency Matrix (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Distribution Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>{t.sentimentDistributionTitle}</span>
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              {sentiment_distribution.positive_count + sentiment_distribution.neutral_count + sentiment_distribution.negative_count} {t.reviewsCountUnit}
            </span>
          </div>

          {/* Stacked Progress Bar */}
          <div className="w-full h-5 rounded-full overflow-hidden flex bg-slate-800 p-0.5 gap-0.5 mb-5 shadow-inner">
            <div
              style={{ width: `${sentiment_distribution.positive_percentage}%` }}
              className="bg-emerald-500 rounded-l-full transition-all duration-700 relative group cursor-pointer"
              title={`${t.positiveLabel}: ${sentiment_distribution.positive_percentage}%`}
            />
            <div
              style={{ width: `${sentiment_distribution.neutral_percentage}%` }}
              className="bg-slate-500 transition-all duration-700 relative group cursor-pointer"
              title={`${t.neutralLabel}: ${sentiment_distribution.neutral_percentage}%`}
            />
            <div
              style={{ width: `${sentiment_distribution.negative_percentage}%` }}
              className="bg-red-500 rounded-r-full transition-all duration-700 relative group cursor-pointer"
              title={`${t.negativeLabel}: ${sentiment_distribution.negative_percentage}%`}
            />
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3 text-center">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                {t.positiveLabel}
              </span>
              <div className="text-xl sm:text-2xl font-black text-white">
                {sentiment_distribution.positive_percentage}%
              </div>
              <span className="text-[11px] text-emerald-300/80">
                ({sentiment_distribution.positive_count} {t.reviewsCountUnit})
              </span>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {t.neutralLabel}
              </span>
              <div className="text-xl sm:text-2xl font-black text-white">
                {sentiment_distribution.neutral_percentage}%
              </div>
              <span className="text-[11px] text-slate-400">
                ({sentiment_distribution.neutral_count} {t.reviewsCountUnit})
              </span>
            </div>

            <div className="bg-red-950/30 border border-red-800/40 rounded-xl p-3 text-center">
              <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block mb-1">
                {t.negativeLabel}
              </span>
              <div className="text-xl sm:text-2xl font-black text-white">
                {sentiment_distribution.negative_percentage}%
              </div>
              <span className="text-[11px] text-red-300/80">
                ({sentiment_distribution.negative_count} {t.reviewsCountUnit})
              </span>
            </div>
          </div>
        </div>

        {/* Urgency & Severity Matrix */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-red-400" />
              <span>{t.urgencyMatrixTitle}</span>
            </h3>
            <button
              onClick={onNavigateToIssues}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              <span>{t.viewIssueDetails}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
            <div className="bg-red-950/40 border border-red-800/60 rounded-xl p-3 text-center">
              <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">{t.criticalUrgent}</div>
              <div className="text-2xl font-black text-red-200">{urgency_levels.critical_urgent}</div>
              <span className="text-[10px] text-red-300/70">{t.actionRequiredImmediate}</span>
            </div>

            <div className="bg-orange-950/40 border border-orange-800/60 rounded-xl p-3 text-center">
              <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-1">{t.highUrgent}</div>
              <div className="text-2xl font-black text-orange-200">{urgency_levels.high}</div>
              <span className="text-[10px] text-orange-300/70">{t.highPriorityLabel}</span>
            </div>

            <div className="bg-amber-950/30 border border-amber-800/50 rounded-xl p-3 text-center">
              <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">{t.mediumUrgent}</div>
              <div className="text-2xl font-black text-amber-200">{urgency_levels.medium}</div>
              <span className="text-[10px] text-amber-300/70">{t.mediumLabel}</span>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{t.lowUrgent}</div>
              <div className="text-2xl font-black text-slate-200">{urgency_levels.low}</div>
              <span className="text-[10px] text-slate-400">{t.lowLabel}</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 flex items-center justify-between">
            <div>
              <span className="text-slate-400">{t.totalCategorizedIssues}</span>{' '}
              <span className="font-bold text-white">{report.issue_breakdown?.length || 0} {t.clustersCount}</span>
            </div>
            <button
              onClick={onNavigateToRecommendations}
              className="text-xs bg-blue-900/60 hover:bg-blue-800/80 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-700/60 font-semibold transition-all"
            >
              {t.solutionRecommendations}
            </button>
          </div>
        </div>
      </div>

      {/* Strategic Insights & Churn Impact Projection */}
      {strategic_insights && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{t.coreStrengthsTitle}</span>
            </h4>
            <div className="space-y-2">
              {strategic_insights.core_strengths?.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-300 flex items-start gap-2.5"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span>{t.churnProjectionTitle}</span>
            </h4>
            <div className="space-y-3">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
                <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                  {t.churnProjectionSub}
                </div>
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  {strategic_insights.churn_risk_projection}
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
                <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">
                  {t.revenueImpactSub}
                </div>
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  {strategic_insights.revenue_impact_estimate}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
