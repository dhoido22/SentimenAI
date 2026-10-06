import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Layers,
  UploadCloud,
  Sliders,
  Check,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { PRESET_DATASETS } from '../data/sampleReviews';
import { ExecutiveReport } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { generateClientReport } from '../utils/clientAnalyzer';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onReportGenerated: (newReport: ExecutiveReport) => void;
}

export const AnalysisModal: React.FC<Props> = ({ isOpen, onClose, onReportGenerated }) => {
  const { t, language } = useLanguage();
  const [selectedPresetId, setSelectedPresetId] = useState<string>('ecommerce_logistics');
  const [industry, setIndustry] = useState<string>('E-Commerce & Digital Retail');
  const [customText, setCustomText] = useState<string>('');
  const [useCustom, setUseCustom] = useState<boolean>(false);
  const [alertThreshold, setAlertThreshold] = useState<number>(25.0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    setUseCustom(false);
    const p = PRESET_DATASETS.find((x) => x.id === presetId);
    if (p) {
      setIndustry(language === 'en' ? p.industryEn : p.industryId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setLoadingStep(t.analyzingProgress);

    try {
      let reviewsToAnalyze: Array<{ id: string; text: string; source: string }> = [];

      if (useCustom) {
        const lines = customText
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => l.length > 5);

        if (lines.length === 0) {
          throw new Error(
            language === 'en'
              ? 'Please provide at least 1 line of customer review text.'
              : 'Harap masukkan minimal 1 baris teks ulasan pelanggan.'
          );
        }

        reviewsToAnalyze = lines.map((line, idx) => ({
          id: `USR-${String(idx + 1).padStart(3, '0')}`,
          text: line,
          source: language === 'en' ? 'User Custom Input' : 'Input Pengguna',
        }));
      } else {
        const p = PRESET_DATASETS.find((x) => x.id === selectedPresetId);
        if (!p) throw new Error('Preset data not found.');
        reviewsToAnalyze = p.reviews;
      }

      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reviews: reviewsToAnalyze,
            industry,
            alertThreshold,
            lang: language,
          }),
        });

        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const report: ExecutiveReport = await response.json();
            if (report && report.metadata) {
              onReportGenerated(report);
              onClose();
              setIsLoading(false);
              return;
            }
          }
        }
      } catch (networkErr) {
        // Fallback to local computation
      }

      // High-fidelity fallback for offline or Vercel static deployment
      const fallbackReport = generateClientReport(reviewsToAnalyze, industry, alertThreshold, language);
      onReportGenerated(fallbackReport);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred during processing.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {t.modalTitle}
            </h3>
            <p className="text-xs text-slate-400">
              {t.modalSubtitle}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-950/60 border border-red-700/80 rounded-xl p-3 text-xs text-red-300 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Toggle Preset vs Custom */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => setUseCustom(false)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                !useCustom ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.selectIndustryPreset}
            </button>
            <button
              type="button"
              onClick={() => setUseCustom(true)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                useCustom ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.pasteCustomText}
            </button>
          </div>

          {!useCustom ? (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                {t.presetScenarioLabel}
              </label>
              <div className="grid grid-cols-1 gap-2">
                {PRESET_DATASETS.map((p) => {
                  const name = language === 'en' ? p.nameEn : p.nameId;
                  const desc = language === 'en' ? p.descriptionEn : p.descriptionId;

                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectPreset(p.id)}
                      className={`cursor-pointer p-3 rounded-xl border transition-all text-xs flex items-center justify-between ${
                        selectedPresetId === p.id
                          ? 'bg-blue-950/50 border-blue-500 text-white'
                          : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-200">{name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{desc}</div>
                        <div className="text-[10px] text-blue-400 mt-1 font-semibold">
                          {t.reviewsReady(p.reviews.length)}
                        </div>
                      </div>
                      {selectedPresetId === p.id && (
                        <Check className="w-4 h-4 text-blue-400 shrink-0 ml-2" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                {t.pasteLabel}
              </label>
              <textarea
                rows={6}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder={t.pastePlaceholder}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          {/* Configuration Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {t.industrySectorLabel}
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {t.spikeThresholdLabel}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="15"
                  max="40"
                  step="1"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(Number(e.target.value))}
                  className="flex-1 accent-blue-600"
                />
                <span className="text-xs font-bold text-amber-400 font-mono w-12 text-right">
                  {alertThreshold}%
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              {t.cancelBtn}
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-900/30 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{loadingStep || t.analyzingProgress}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.runGeminiBtn}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
