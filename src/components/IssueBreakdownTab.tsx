import React, { useState } from 'react';
import {
  Layers,
  AlertTriangle,
  Quote,
  Flame,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Briefcase,
  GitBranch,
} from 'lucide-react';
import { IssueBreakdown, DetailedReview } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  issues: IssueBreakdown[];
  detailedReviews?: DetailedReview[];
}

export const IssueBreakdownTab: React.FC<Props> = ({ issues, detailedReviews = [] }) => {
  const { t } = useLanguage();
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);

  const filteredIssues = issues.filter((issue) => {
    const matchesSeverity =
      selectedSeverity === 'ALL' || issue.severity === selectedSeverity;
    const matchesSearch =
      issue.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.problem_summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.root_cause_analysis.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-950/60 text-red-300 border-red-500/80';
      case 'HIGH':
        return 'bg-orange-950/60 text-orange-300 border-orange-500/80';
      case 'MEDIUM':
        return 'bg-amber-950/50 text-amber-300 border-amber-500/80';
      default:
        return 'bg-slate-800/60 text-slate-300 border-slate-600';
    }
  };

  const reviewsForActiveCategory = activeCategoryFilter
    ? detailedReviews.filter((r) => r.category.toLowerCase().includes(activeCategoryFilter.toLowerCase()))
    : [];

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <span>{t.issuesTabTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.issuesTabSubtitle}
          </p>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 pl-8 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-blue-500 w-48 sm:w-56"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                  selectedSeverity === sev
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev === 'ALL' ? t.filterAll : sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Issues Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredIssues.map((issue) => (
          <div
            key={issue.category_id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getSeverityStyle(
                    issue.severity
                  )}`}
                >
                  {t.severityLevel} {issue.severity}
                </span>

                <div className="text-right">
                  <span className="text-xs font-bold text-white">
                    {t.reviewsTotalPct(issue.issue_count, issue.percentage_of_total)}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-white mb-2 leading-snug">
                {issue.category_name}
              </h3>

              {/* Problem Summary (Ringkasan Masalah) */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 mb-3.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>{t.problemSummaryTitle}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {issue.problem_summary}
                </p>
              </div>

              {/* Root Cause & Business Impact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5">
                  <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                    <GitBranch className="w-3 h-3" />
                    <span>{t.rootCauseTitle}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {issue.root_cause_analysis}
                  </p>
                </div>

                <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2.5">
                  <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    <span>{t.businessImpactTitle}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {issue.business_impact}
                  </p>
                </div>
              </div>

              {/* Representative Customer Quotes */}
              {issue.representative_quotes && issue.representative_quotes.length > 0 && (
                <div className="space-y-1.5 mb-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Quote className="w-3 h-3 text-slate-500" />
                    <span>{t.customerQuotesTitle}</span>
                  </div>
                  {issue.representative_quotes.map((quote, qIdx) => (
                    <div
                      key={qIdx}
                      className="text-xs italic text-slate-300 bg-slate-950/60 border-l-2 border-red-500/70 p-2 rounded-r-lg"
                    >
                      "{quote}"
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Inspect Filter CTA */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">
                ID: {issue.category_id}
              </span>
              <button
                onClick={() =>
                  setActiveCategoryFilter(
                    activeCategoryFilter === issue.category_name ? null : issue.category_name
                  )
                }
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                <span>{activeCategoryFilter === issue.category_name ? t.closeFilter : t.filterThisCategory}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Filtered Reviews Drawer / Bottom Section if selected */}
      {activeCategoryFilter && (
        <div className="bg-slate-900 border-2 border-blue-500/60 rounded-2xl p-5 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                {t.relatedReviewsTitle}
              </span>
              <h3 className="text-base font-bold text-white">{activeCategoryFilter}</h3>
            </div>
            <button
              onClick={() => setActiveCategoryFilter(null)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700"
            >
              {t.closeFilter}
            </button>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {reviewsForActiveCategory.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                {t.noReviewsCategory}
              </p>
            ) : (
              reviewsForActiveCategory.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-400">{rev.id}</span>
                      <span className="text-[10px] text-slate-500">• {rev.source}</span>
                      <span className="text-[10px] text-slate-500">• {rev.timestamp}</span>
                    </div>
                    <p className="text-slate-200 font-medium">{rev.text}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        rev.sentiment === 'POSITIF'
                          ? 'bg-emerald-950 text-emerald-300'
                          : rev.sentiment === 'NEGATIF'
                          ? 'bg-red-950 text-red-300'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {rev.sentiment} ({rev.sentiment_score})
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
