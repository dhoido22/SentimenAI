import React from 'react';
import { Printer, Download, X, ArrowLeft, ShieldCheck } from 'lucide-react';
import { ExecutiveReport } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  report: ExecutiveReport;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintExecutiveReport: React.FC<Props> = ({ report, isOpen, onClose }) => {
  const { t, language } = useLanguage();
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 overflow-y-auto p-2 sm:p-6 flex flex-col items-center">
      {/* Top Floating Control Bar (Hidden on print) */}
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 p-3.5 rounded-2xl mb-4 flex items-center justify-between text-white shadow-2xl print:hidden sticky top-2 z-50">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToDashboard}</span>
        </button>

        <div className="text-xs font-semibold text-slate-300 hidden sm:block">
          {t.printPreviewNotice}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl shadow-lg transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printSavePdfBtn}</span>
          </button>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* The Printable Document (White paper design for standard PDF export) */}
      <div
        id="printable-executive-doc"
        className="w-full max-w-4xl bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-2xl border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0"
      >
        {/* Document Header Letterhead */}
        <div className="border-b-2 border-slate-900 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-black uppercase tracking-widest text-blue-700 mb-1">
              {t.officialDocHeader}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              {t.officialDocTitle}
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              {t.officialDocSubtitle}
            </p>
          </div>

          <div className="text-right text-xs text-slate-600 space-y-1 sm:border-l sm:border-slate-300 sm:pl-5">
            <div>
              <strong>{t.docNoLabel}</strong> {report.metadata?.report_id}
            </div>
            <div>
              <strong>{t.printDateLabel}</strong>{' '}
              {new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID', { dateStyle: 'long' })}
            </div>
            <div>
              <strong>{t.industryLabel}</strong> {report.metadata?.industry_sector}
            </div>
            <div>
              <strong>Sample:</strong> {t.sampleCountLabel(report.metadata?.total_reviews_analyzed)}
            </div>
          </div>
        </div>

        {/* Executive Headline & Summary */}
        <div className="bg-slate-100 border-l-4 border-blue-600 p-4 rounded-r-lg mb-6">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-800 mb-1">
            {t.executiveHeadlineTitle}
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {report.executive_summary?.headline}
          </h2>
          <div className="mt-2 text-xs text-slate-700 space-y-1">
            {report.executive_summary?.key_takeaways?.map((item, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <span className="font-bold">•</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Core KPI Grid */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="border border-slate-300 rounded-lg p-3 text-center bg-slate-50">
            <div className="text-[10px] font-bold text-slate-600 uppercase">{t.csatTitle}</div>
            <div className="text-2xl font-black text-slate-900">{report.satisfaction_metrics?.csat_score}%</div>
            <div className="text-[9px] text-slate-500">Benchmark: 80%</div>
          </div>
          <div className="border border-slate-300 rounded-lg p-3 text-center bg-slate-50">
            <div className="text-[10px] font-bold text-slate-600 uppercase">{t.npsTitle}</div>
            <div className="text-2xl font-black text-slate-900">
              {report.satisfaction_metrics?.nps_score > 0 ? `+${report.satisfaction_metrics?.nps_score}` : report.satisfaction_metrics?.nps_score}
            </div>
            <div className="text-[9px] text-slate-500">{report.satisfaction_metrics?.nps_category}</div>
          </div>
          <div className="border border-slate-300 rounded-lg p-3 text-center bg-slate-50">
            <div className="text-[10px] font-bold text-slate-600 uppercase">{t.cesTitle}</div>
            <div className="text-2xl font-black text-slate-900">{report.satisfaction_metrics?.ces_score} / 5.0</div>
            <div className="text-[9px] text-slate-500">Effort Scale</div>
          </div>
          <div className="border border-slate-300 rounded-lg p-3 text-center bg-slate-50">
            <div className="text-[10px] font-bold text-slate-600 uppercase">{t.negativeLabel} Ratio</div>
            <div className="text-2xl font-black text-red-600">
              {report.satisfaction_metrics?.sentiment_distribution?.negative_percentage}%
            </div>
            <div className="text-[9px] text-slate-500">Tolerance: {report.negative_spike_alert?.spike_threshold_pct}%</div>
          </div>
        </div>

        {/* Issue Breakdown Table */}
        <div className="mb-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2.5">
            {t.tableIssuesTitle}
          </h3>
          <table className="w-full text-left text-xs border border-slate-300 border-collapse">
            <thead>
              <tr className="bg-slate-200 text-slate-800 font-bold">
                <th className="p-2 border border-slate-300">{t.tableCategoryCol}</th>
                <th className="p-2 border border-slate-300 w-20">{t.tableUrgencyCol}</th>
                <th className="p-2 border border-slate-300 w-24">{t.tableCountCol}</th>
                <th className="p-2 border border-slate-300">{t.tableRootCauseCol}</th>
                <th className="p-2 border border-slate-300">{t.tableBusinessImpactCol}</th>
              </tr>
            </thead>
            <tbody>
              {report.issue_breakdown?.map((iss, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="p-2 border border-slate-300 font-semibold">{iss.category_name}</td>
                  <td className="p-2 border border-slate-300 font-bold text-red-700">{iss.severity}</td>
                  <td className="p-2 border border-slate-300">
                    {iss.issue_count} ({iss.percentage_of_total}%)
                  </td>
                  <td className="p-2 border border-slate-300 text-slate-700 text-[11px]">{iss.root_cause_analysis}</td>
                  <td className="p-2 border border-slate-300 text-slate-700 text-[11px]">{iss.business_impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Weekly Trends Table */}
        <div className="mb-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2.5">
            {t.tableTrendsTitle}
          </h3>
          <table className="w-full text-left text-xs border border-slate-300 border-collapse">
            <thead>
              <tr className="bg-slate-200 text-slate-800 font-bold">
                <th className="p-2 border border-slate-300">{t.tableWeekCol}</th>
                <th className="p-2 border border-slate-300">{t.tableCsatCol}</th>
                <th className="p-2 border border-slate-300">{t.tableNpsCol}</th>
                <th className="p-2 border border-slate-300">{t.tablePosCol}</th>
                <th className="p-2 border border-slate-300">{t.tableNegCol}</th>
                <th className="p-2 border border-slate-300">{t.tableDominantCol}</th>
              </tr>
            </thead>
            <tbody>
              {report.weekly_trends?.map((w, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="p-2 border border-slate-300 font-medium">{w.week_label}</td>
                  <td className="p-2 border border-slate-300 font-bold">{w.csat}%</td>
                  <td className="p-2 border border-slate-300 font-bold">{w.nps}</td>
                  <td className="p-2 border border-slate-300 text-emerald-700">+{w.positive_pct}%</td>
                  <td className="p-2 border border-slate-300 text-red-700">-{w.negative_pct}%</td>
                  <td className="p-2 border border-slate-300">{w.dominant_issue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Actionable Recommendations */}
        <div className="mb-8">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2.5">
            {t.tableRecommendationsTitle}
          </h3>
          <div className="space-y-3">
            {report.actionable_recommendations?.map((rec, idx) => (
              <div key={idx} className="border border-slate-300 rounded-lg p-3 bg-slate-50 text-xs">
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className="text-slate-900">
                    [{rec.priority}] {rec.title}
                  </span>
                  <span className="text-slate-600 font-normal">
                    {t.picLabel}: {rec.owner_department} • {t.timelineLabel}: {rec.timeline}
                  </span>
                </div>
                <div className="text-[11px] text-emerald-800 font-semibold mb-1.5">
                  {t.impactPrefix} {rec.expected_impact}
                </div>
                <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-0.5">
                  {rec.action_steps?.map((step, sIdx) => (
                    <li key={sIdx}>{step}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Formal Signatures Block */}
        <div className="pt-6 border-t-2 border-slate-300 grid grid-cols-3 gap-6 text-center text-xs text-slate-700">
          <div>
            <div className="h-14 flex items-end justify-center font-serif italic text-slate-400">
              {t.sigPreparedBy}
            </div>
            <div className="border-t border-slate-400 pt-1 font-bold">
              {t.sigRoleAi}
            </div>
            <div className="text-[10px] text-slate-500">Customer Intelligence System</div>
          </div>

          <div>
            <div className="h-14 flex items-end justify-center font-serif italic text-slate-400">
              {t.sigOperational}
            </div>
            <div className="border-t border-slate-400 pt-1 font-bold">
              {t.sigRoleOps}
            </div>
            <div className="text-[10px] text-slate-500">Frontline Operations Lead</div>
          </div>

          <div>
            <div className="h-14 flex items-end justify-center font-serif italic text-slate-400">
              {t.sigManagement}
            </div>
            <div className="border-t border-slate-400 pt-1 font-bold">
              {t.sigRoleVp}
            </div>
            <div className="text-[10px] text-slate-500">Executive Approval</div>
          </div>
        </div>
      </div>
    </div>
  );
};
