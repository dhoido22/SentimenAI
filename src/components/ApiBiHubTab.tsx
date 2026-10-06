import React, { useState } from 'react';
import {
  Database,
  Terminal,
  Send,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  BellRing,
  Globe,
  Share2,
  Code,
  Layers,
} from 'lucide-react';
import { playNegativeSpikeAlarm } from '../utils/audioAlert';
import { useLanguage } from '../context/LanguageContext';

export const ApiBiHubTab: React.FC = () => {
  const { t, language } = useLanguage();
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState<string>('https://hooks.slack.com/services/T00/B00/XXXXX');
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null);
  const [isTestingWebhook, setIsTestingWebhook] = useState<boolean>(false);
  const [apiTestResponse, setApiTestResponse] = useState<any>(null);
  const [isTestingApi, setIsTestingApi] = useState<boolean>(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2500);
  };

  const handleTestApi = async (endpoint: string) => {
    setIsTestingApi(true);
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      setApiTestResponse({ status: res.status, data });
    } catch (err: any) {
      setApiTestResponse({ error: err.message });
    } finally {
      setIsTestingApi(false);
    }
  };

  const handleTestWebhook = async () => {
    setIsTestingWebhook(true);
    try {
      const res = await fetch('/api/webhook/simulate-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl: webhookUrl }),
      });
      const result = await res.json();
      playNegativeSpikeAlarm();
      setWebhookStatus(
        language === 'en'
          ? 'Webhook alert successfully simulated & payload dispatched.'
          : 'Notifikasi webhook berhasil disimulasikan & payload siap disalurkan.'
      );
    } catch (err: any) {
      setWebhookStatus(language === 'en' ? 'Failed to deliver webhook: ' + err.message : 'Gagal mengirim webhook: ' + err.message);
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const endpoints = [
    {
      id: 'latest_report',
      method: 'GET',
      path: '/api/reports/latest',
      description: language === 'en'
        ? 'Returns complete pure JSON executive report for automated BI analytics.'
        : 'Mengembalikan laporan eksekutif lengkap berformat JSON murni untuk dasbor BI.',
      curl: `curl -X GET "${baseUrl}/api/reports/latest" -H "Accept: application/json"`,
    },
    {
      id: 'bi_feed',
      method: 'GET',
      path: '/api/metrics/bi-feed',
      description: language === 'en'
        ? 'Dedicated tabular / OData JSON endpoint tailored for Microsoft Power BI & Tableau Web Connector.'
        : 'Endpoint khusus format OData/Tabular JSON untuk Microsoft Power BI & Tableau Web Connector.',
      curl: `curl -X GET "${baseUrl}/api/metrics/bi-feed"`,
    },
    {
      id: 'analyze_batch',
      method: 'POST',
      path: '/api/analyze',
      description: language === 'en'
        ? 'Receives raw customer reviews, analyzes sentiment, categorizes issues, and returns pure JSON report.'
        : 'Menerima batch ulasan mentah, menganalisis sentimen, isu, dan menghasilkan laporan eksekutif.',
      curl: `curl -X POST "${baseUrl}/api/analyze" -H "Content-Type: application/json" -d '{"reviews":[{"id":"R1","text":"Fast service and great quality!"}],"industry":"E-Commerce","lang":"${language}"}'`,
    },
    {
      id: 'export_csv',
      method: 'GET',
      path: '/api/export/csv',
      description: language === 'en'
        ? 'Directly downloads structured CSV recap with UTF-8 BOM for Microsoft Excel compatibility.'
        : 'Mengunduh langsung rekapan CSV terstruktur (UTF-8 BOM) untuk analisis spreadsheet.',
      curl: `curl -X GET "${baseUrl}/api/export/csv" -o customer_feedback_recap.csv`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">
              {t.biHubTitle}
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            {t.biHubSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-950 text-blue-300 border border-blue-800/80 px-3 py-1.5 rounded-xl font-semibold">
            REST API v1.2 Ready
          </span>
        </div>
      </div>

      {/* Webhook Negative Spike Alert Configuration */}
      <div className="bg-gradient-to-r from-red-950/40 to-slate-900 border border-red-900/50 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2.5 mb-2">
          <BellRing className="w-5 h-5 text-red-400" />
          <h3 className="text-base font-bold text-white">
            {t.webhookDispatcherTitle}
          </h3>
        </div>
        <p className="text-xs text-slate-300 mb-4 max-w-3xl leading-relaxed">
          {t.webhookDispatcherSubtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-3">
          <input
            type="text"
            placeholder={t.webhookInputPlaceholder}
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 py-2.5 px-4 rounded-xl focus:outline-none focus:border-red-500 flex-1 font-mono"
          />
          <button
            onClick={handleTestWebhook}
            disabled={isTestingWebhook}
            className="bg-red-600 hover:bg-red-500 disabled:bg-slate-800 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-lg shadow-red-950/50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isTestingWebhook ? t.sendingWebhook : t.testWebhookBtn}</span>
          </button>
        </div>

        {webhookStatus && (
          <div className="text-xs bg-slate-950/80 border border-slate-800 text-emerald-300 p-3 rounded-xl flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{webhookStatus}</span>
          </div>
        )}
      </div>

      {/* Endpoints Catalog */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
          {language === 'en' ? 'REST API Endpoints Catalog' : 'Katalog REST API Endpoints'}
        </h3>

        <div className="space-y-3">
          {endpoints.map((ep) => (
            <div
              key={ep.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-slate-700 transition-all shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded font-mono ${
                      ep.method === 'GET'
                        ? 'bg-blue-950 text-blue-300 border border-blue-700'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-mono text-sm font-bold text-white">{ep.path}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTestApi(ep.path)}
                    disabled={ep.method !== 'GET' || isTestingApi}
                    className="text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 px-3 py-1 rounded-lg border border-slate-700 transition-all font-semibold"
                  >
                    {t.testThisEndpoint}
                  </button>

                  <button
                    onClick={() => copyToClipboard(ep.curl, ep.id)}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-all font-semibold"
                  >
                    {copiedEndpoint === ep.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">{t.curlCopied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>{t.copyCurl}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-400 mb-2.5">{ep.description}</p>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 overflow-x-auto">
                <code className="text-[11px] font-mono text-cyan-300/90 whitespace-nowrap">
                  {ep.curl}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live API Response Preview Box if tested */}
      {apiTestResponse && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Output Respons Pengujian API (Status: {apiTestResponse.status || 'OK'})
            </span>
            <button
              onClick={() => setApiTestResponse(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>
          <pre className="text-xs font-mono text-slate-300 bg-slate-900/80 p-4 rounded-xl max-h-72 overflow-y-auto leading-relaxed border border-slate-800">
            {JSON.stringify(apiTestResponse.data || apiTestResponse, null, 2)}
          </pre>
        </div>
      )}

      {/* BI Connector Step-by-Step Guide */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-emerald-400" />
          <span>{t.biGuideTitle}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              1. Microsoft Power BI
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {language === 'en'
                ? 'Select Get Data > Web and input the tabular analytics feed URL:'
                : 'Gunakan opsi Get Data > Web lalu masukkan URL feed analitik:'}
            </p>
            <div className="bg-slate-900 p-2 rounded text-[11px] font-mono text-slate-300 break-all border border-slate-800 mb-2">
              {baseUrl}/api/metrics/bi-feed
            </div>
            <span className="text-[10px] text-slate-500">
              {language === 'en'
                ? 'Power BI will automatically parse the time-series and KPI schema in Power Query Editor.'
                : 'Power BI akan memetakan tabel otomatis ke dalam modul Query Editor.'}
            </span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
              2. Tableau Desktop / Online
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {language === 'en'
                ? 'Use the Web Data Connector (WDC) or JSON file source:'
                : 'Gunakan Web Data Connector (WDC) atau JSON file connector:'}
            </p>
            <div className="bg-slate-900 p-2 rounded text-[11px] font-mono text-slate-300 break-all border border-slate-800 mb-2">
              {baseUrl}/api/reports/latest
            </div>
            <span className="text-[10px] text-slate-500">
              {language === 'en'
                ? 'Supports multi-dimensional JSON schema extraction directly into dashboards.'
                : 'Mendukung ekstraksi otomatis skema JSON multidimensi.'}
            </span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              3. Google Looker Studio
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {language === 'en'
                ? 'Connect via Community JSON Connector or Google Apps Script Webhook:'
                : 'Hubungkan via Community JSON Connector atau Google Apps Script sync:'}
            </p>
            <div className="bg-slate-900 p-2 rounded text-[11px] font-mono text-slate-300 break-all border border-slate-800 mb-2">
              {baseUrl}/api/reports/latest
            </div>
            <span className="text-[10px] text-slate-500">
              {language === 'en'
                ? 'Synchronizes weekly trend series and KPI gauges automatically on each report load.'
                : 'Data time-series tren mingguan langsung sinkron per refresh.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
