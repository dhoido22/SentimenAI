import React from 'react';
import {
  Sparkles,
  FileSpreadsheet,
  Printer,
  Radio,
  Code2,
  Database,
  BarChart3,
  Layers,
  LineChart,
  CheckSquare,
  ShieldAlert,
  ChevronDown,
  Languages,
} from 'lucide-react';
import { ExecutiveReport } from '../types';
import { PRESET_DATASETS } from '../data/sampleReviews';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  report: ExecutiveReport;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewAnalysisModal: () => void;
  onLoadPreset: (datasetId: string) => void;
  onExportCsv: () => void;
  onPrintPdf: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  report,
  activeTab,
  setActiveTab,
  onOpenNewAnalysisModal,
  onLoadPreset,
  onExportCsv,
  onPrintPdf,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const isSpike = report.negative_spike_alert?.is_spike_detected;

  const tabs = [
    { id: 'executive', label: t.tabExecutive, icon: BarChart3 },
    { id: 'issues', label: t.tabIssues, icon: Layers, badge: report.issue_breakdown?.length },
    { id: 'trends', label: t.tabTrends, icon: LineChart },
    { id: 'recommendations', label: t.tabRecommendations, icon: CheckSquare, badge: report.actionable_recommendations?.length },
    { id: 'realtime', label: t.tabRealtime, icon: Radio, pulse: true },
    { id: 'pure_json', label: t.tabPureJson, icon: Code2 },
    { id: 'api_bi', label: t.tabApiBi, icon: Database },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 sticky top-0 z-40 backdrop-blur-md print:hidden">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                {t.appName} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Pro</span>
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-950 text-blue-400 px-2 py-0.5 rounded border border-blue-800/60">
                {t.appBadge}
              </span>
              {isSpike && (
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-red-950 text-red-400 px-2 py-0.5 rounded border border-red-700 animate-pulse">
                  <ShieldAlert className="w-3 h-3" />
                  {t.spikeAlertBadge}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Quick controls and actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Language Switcher Button Group */}
          <div className="flex items-center bg-slate-900 border border-slate-700/80 p-0.5 rounded-lg shadow-inner">
            <button
              onClick={() => setLanguage('id')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                language === 'id'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Bahasa Indonesia"
            >
              <span>🇮🇩</span>
              <span className="text-[11px]">ID</span>
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                language === 'en'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="English"
            >
              <span>🇬🇧</span>
              <span className="text-[11px]">EN</span>
            </button>
          </div>

          {/* Preset Selector */}
          <div className="relative inline-block text-left">
            <select
              aria-label={t.selectScenario}
              onChange={(e) => onLoadPreset(e.target.value)}
              defaultValue=""
              className="appearance-none bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium py-2 pl-3 pr-8 rounded-lg border border-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            >
              <option value="" disabled>
                {t.selectScenario}
              </option>
              {PRESET_DATASETS.map((p) => {
                const name = language === 'en' ? p.nameEn : p.nameId;
                return (
                  <option key={p.id} value={p.id}>
                    {name.length > 28 ? name.slice(0, 26) + '...' : name}
                  </option>
                );
              })}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Export CSV */}
          <button
            onClick={onExportCsv}
            title={t.exportCsv}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{t.exportCsv}</span>
          </button>

          {/* Export PDF (Print Mode) */}
          <button
            onClick={onPrintPdf}
            title={t.exportPdf}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{t.exportPdf}</span>
          </button>

          {/* Analyze New Data Button */}
          <button
            onClick={onOpenNewAnalysisModal}
            className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg shadow-md shadow-blue-900/30 flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.analyzeNew}</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-thin scrollbar-thumb-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'} ${tab.pulse ? 'text-red-400 animate-pulse' : ''}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-blue-800 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
