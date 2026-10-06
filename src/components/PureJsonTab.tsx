import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  ShieldCheck,
  ExternalLink,
  FileJson,
} from 'lucide-react';
import { ExecutiveReport } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  report: ExecutiveReport;
}

export const PureJsonTab: React.FC<Props> = ({ report }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(report, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Executive-Report-${report.metadata?.report_id || 'Sentiment'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Schema verification check
  const requiredKeys = [
    'metadata',
    'executive_summary',
    'satisfaction_metrics',
    'issue_breakdown',
    'weekly_trends',
    'negative_spike_alert',
    'strategic_insights',
    'actionable_recommendations',
    'detailed_review_analysis',
  ];
  const missingKeys = requiredKeys.filter((k) => !(k in report));
  const isSchemaValid = missingKeys.length === 0;

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-cyan-400" />
              <span>{t.pureJsonTitle}</span>
            </h2>
            <span className="text-[10px] font-extrabold uppercase bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded">
              {t.noIntroTextBadge}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {t.pureJsonSubtitle}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopy}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? t.copiedSuccess : t.copyJsonBtn}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-900/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.downloadJsonBtn}</span>
          </button>
        </div>
      </div>

      {/* Schema Verification Banner */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 px-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className={`w-4 h-4 ${isSchemaValid ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span className="font-semibold text-slate-200">
            {isSchemaValid
              ? t.schemaValidStatus
              : `Warning: Missing keys (${missingKeys.join(', ')})`}
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
          <span>Size: {(jsonString.length / 1024).toFixed(1)} KB</span>
          <span>•</span>
          <span>Chars: {jsonString.length}</span>
          <span>•</span>
          <a
            href="/api/reports/latest"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-sans font-semibold underline"
          >
            <span>{t.openRawApi}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Code Viewer Container */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <FileJson className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-slate-300">executive_report_schema.json</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">MIME: application/json</span>
        </div>

        <div className="p-4 overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-thumb-slate-800">
          <pre className="text-xs font-mono text-slate-200 leading-relaxed">
            <code>{jsonString}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
