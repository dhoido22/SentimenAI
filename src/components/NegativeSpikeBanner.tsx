import React, { useState } from 'react';
import { AlertTriangle, BellRing, ShieldAlert, Send, CheckCircle2, ChevronRight, Volume2 } from 'lucide-react';
import { NegativeSpikeAlert } from '../types';
import { playNegativeSpikeAlarm } from '../utils/audioAlert';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  alert: NegativeSpikeAlert;
  onOpenSopModal: () => void;
  onOpenBiTab: () => void;
}

export const NegativeSpikeBanner: React.FC<Props> = ({ alert, onOpenSopModal, onOpenBiTab }) => {
  const { t } = useLanguage();
  const [webhookSent, setWebhookSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!alert.is_spike_detected) {
    return (
      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3.5 px-4 mb-6 flex items-center justify-between text-xs sm:text-sm text-emerald-200 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-emerald-300">{t.controlledStatus}</span>
          <span>{t.controlledDesc(alert.current_negative_pct, alert.spike_threshold_pct)}</span>
        </div>
        <span className="text-xs bg-emerald-900/60 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-700/50">
          {t.normalOperation}
        </span>
      </div>
    );
  }

  const handleSendWebhook = async () => {
    setIsSending(true);
    try {
      await fetch('/api/webhook/simulate-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      playNegativeSpikeAlarm();
      setWebhookSent(true);
      setTimeout(() => setWebhookSent(false), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-red-950/90 via-red-900/70 to-rose-950/80 border-2 border-red-500/80 rounded-2xl p-4 sm:p-5 mb-6 text-white shadow-xl shadow-red-950/40">
      {/* Background glow animation */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 max-w-3xl">
          <div className="p-2.5 bg-red-600/30 border border-red-400/50 rounded-xl text-red-300 shadow-inner shrink-0 mt-0.5">
            <ShieldAlert className="w-6 h-6 text-red-400 animate-bounce" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="bg-red-500 text-white font-extrabold text-[11px] tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                {t.criticalAlert}
              </span>
              <span className="font-bold text-red-200 text-sm sm:text-base">
                {t.spikeDetectedTitle(alert.current_negative_pct, alert.spike_threshold_pct)}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-900/80 text-red-300 border border-red-700/60">
                {t.deltaLabel} {alert.delta_from_baseline}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-red-100/90 leading-relaxed font-medium">
              {alert.alert_message}
            </p>
            <div className="mt-2 text-xs text-rose-200/80 flex items-center gap-1.5 font-sans">
              <span className="font-semibold text-rose-300">{t.immediateAction}</span>
              <span className="italic">{alert.immediate_containment_action}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-red-800/60">
          <button
            onClick={() => playNegativeSpikeAlarm()}
            title={t.testSound}
            className="p-2 bg-red-900/60 hover:bg-red-800/70 text-red-200 rounded-lg border border-red-700/60 transition-all text-xs flex items-center gap-1.5"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">{t.testSound}</span>
          </button>

          <button
            onClick={onOpenSopModal}
            className="px-3.5 py-2 bg-red-800/80 hover:bg-red-700 text-white text-xs font-semibold rounded-lg border border-red-600 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t.sopContainment}</span>
          </button>

          <button
            onClick={handleSendWebhook}
            disabled={isSending}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-md ${
              webhookSent
                ? 'bg-emerald-600 text-white'
                : 'bg-white hover:bg-red-50 text-red-900'
            }`}
          >
            {webhookSent ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>{t.webhookSentSuccess}</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? t.sendingWebhook : t.sendWebhookBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
