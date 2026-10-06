import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NegativeSpikeBanner } from './components/NegativeSpikeBanner';
import { ExecutiveSummaryTab } from './components/ExecutiveSummaryTab';
import { IssueBreakdownTab } from './components/IssueBreakdownTab';
import { WeeklyTrendsTab } from './components/WeeklyTrendsTab';
import { ActionableRecommendationsTab } from './components/ActionableRecommendationsTab';
import { RealtimeStreamTab } from './components/RealtimeStreamTab';
import { PureJsonTab } from './components/PureJsonTab';
import { ApiBiHubTab } from './components/ApiBiHubTab';
import { AnalysisModal } from './components/AnalysisModal';
import { SopModal } from './components/SopModal';
import { PrintExecutiveReport } from './components/PrintExecutiveReport';
import { ExecutiveReport } from './types';
import { PRESET_DATASETS } from './data/sampleReviews';
import { INITIAL_EXECUTIVE_REPORT } from './data/initialReport';
import { generateClientReport, downloadReportAsCsv } from './utils/clientAnalyzer';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

function AppContent() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('executive');
  // Initialize with complete executive report immediately so it never shows "Gagal memuat"
  const [report, setReport] = useState<ExecutiveReport>(INITIAL_EXECUTIVE_REPORT);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState<boolean>(false);
  const [isSopModalOpen, setIsSopModalOpen] = useState<boolean>(false);
  const [isPrintReportOpen, setIsPrintReportOpen] = useState<boolean>(false);

  // Asynchronously sync with backend if available
  useEffect(() => {
    let isMounted = true;
    async function syncLatestReport() {
      try {
        const res = await fetch('/api/reports/latest');
        if (res.ok) {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await res.json();
            if (isMounted && data && data.metadata) {
              setReport(data);
            }
          }
        }
      } catch (err) {
        // Silently use INITIAL_EXECUTIVE_REPORT on static/Vercel environments
        console.debug('Operating in standalone client intelligence mode:', err);
      }
    }
    syncLatestReport();
    return () => {
      isMounted = false;
    };
  }, []);

  // Quick preset loader (works both full-stack and static)
  const handleLoadPreset = async (presetId: string) => {
    const preset = PRESET_DATASETS.find((p) => p.id === presetId);
    if (!preset) return;

    const indName = language === 'en' ? preset.industryEn : preset.industryId;

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviews: preset.reviews,
          industry: indName,
          alertThreshold: 25.0,
          lang: language,
        }),
      });

      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (data && data.metadata) {
            setReport(data);
            return;
          }
        }
      }
    } catch (err) {
      console.debug('API unreachable, computing deterministic report locally:', err);
    }

    // High-fidelity client-side fallback (for Vercel / offline)
    const clientReport = generateClientReport(preset.reviews, indName, 25.0, language);
    setReport(clientReport);
  };

  // Resilient CSV export handler (works in browser & server)
  const handleExportCsv = () => {
    downloadReportAsCsv(report);
  };

  // PDF print handler
  const handlePrintPdf = () => {
    setIsPrintReportOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Header
        report={report}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewAnalysisModal={() => setIsAnalysisModalOpen(true)}
        onLoadPreset={handleLoadPreset}
        onExportCsv={handleExportCsv}
        onPrintPdf={handlePrintPdf}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 print:p-0">
        {/* Negative Spike Alert Banner (Always visible if triggered) */}
        <NegativeSpikeBanner
          alert={report.negative_spike_alert}
          onOpenSopModal={() => setIsSopModalOpen(true)}
          onOpenBiTab={() => setActiveTab('api_bi')}
        />

        {/* Tab Content Panes */}
        {activeTab === 'executive' && (
          <ExecutiveSummaryTab
            report={report}
            onNavigateToIssues={() => setActiveTab('issues')}
            onNavigateToRecommendations={() => setActiveTab('recommendations')}
          />
        )}

        {activeTab === 'issues' && (
          <IssueBreakdownTab
            issues={report.issue_breakdown || []}
            detailedReviews={report.detailed_review_analysis || []}
          />
        )}

        {activeTab === 'trends' && (
          <WeeklyTrendsTab
            weeklyTrends={report.weekly_trends || []}
            strategicInsights={report.strategic_insights}
          />
        )}

        {activeTab === 'recommendations' && (
          <ActionableRecommendationsTab
            recommendations={report.actionable_recommendations || []}
          />
        )}

        {activeTab === 'realtime' && (
          <RealtimeStreamTab
            alertThreshold={report.negative_spike_alert?.spike_threshold_pct || 25.0}
          />
        )}

        {activeTab === 'pure_json' && (
          <PureJsonTab report={report} />
        )}

        {activeTab === 'api_bi' && (
          <ApiBiHubTab />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 mt-12 text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">{t.appName} Pro {t.appBadge}</span>
            <span>•</span>
            <span>
              {language === 'en'
                ? 'Powered by Gemini 3.8 Flash Semantic Reasoning'
                : 'Didukung oleh Gemini 3.8 Flash Semantic Reasoning'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setActiveTab('pure_json')}
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              {t.tabPureJson}
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('api_bi')}
              className="text-slate-400 hover:text-blue-400 transition-colors"
            >
              Power BI &amp; Tableau Web Connector
            </button>
            <span>•</span>
            <button
              onClick={handleExportCsv}
              className="text-slate-400 hover:text-emerald-400 transition-colors"
            >
              {t.exportCsv}
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <AnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        onReportGenerated={(newReport) => setReport(newReport)}
      />

      <SopModal
        isOpen={isSopModalOpen}
        onClose={() => setIsSopModalOpen(false)}
        alert={report.negative_spike_alert}
      />

      <PrintExecutiveReport
        report={report}
        isOpen={isPrintReportOpen}
        onClose={() => setIsPrintReportOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
