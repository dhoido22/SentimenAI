import React from 'react';
import { X, ShieldAlert, CheckCircle, Clock, Send, AlertTriangle } from 'lucide-react';
import { NegativeSpikeAlert } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  alert: NegativeSpikeAlert;
}

export const SopModal: React.FC<Props> = ({ isOpen, onClose, alert }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-slate-900 border border-red-700/60 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative my-8 text-white">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {t.sopTitle}
            </h3>
            <p className="text-xs text-red-300">
              {t.sopSubtitle}
            </p>
          </div>
        </div>

        <div className="bg-red-950/40 border border-red-800/80 rounded-2xl p-4 mb-4 text-xs space-y-2">
          <div className="font-bold text-red-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t.crisisTrigger}</span>
          </div>
          <p className="text-red-100/90 leading-relaxed font-medium">
            {alert.alert_message}
          </p>
          <div className="text-[11px] text-red-300/80">
            {t.connectedChannels} <span className="font-mono">{alert.suggested_channel_alert}</span>
          </div>
        </div>

        <div className="space-y-3 mb-5 text-xs text-slate-300">
          <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            {t.containmentProtocolTitle}
          </h4>

          <div className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="w-5 h-5 rounded-full bg-red-900/60 text-red-300 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
              1
            </div>
            <div>
              <span className="font-bold text-white block mb-0.5">{t.step1Title}</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {t.step1Desc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="w-5 h-5 rounded-full bg-red-900/60 text-red-300 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
              2
            </div>
            <div>
              <span className="font-bold text-white block mb-0.5">{t.step2Title}</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {alert.immediate_containment_action}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="w-5 h-5 rounded-full bg-red-900/60 text-red-300 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
              3
            </div>
            <div>
              <span className="font-bold text-white block mb-0.5">{t.step3Title}</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {t.step3Desc}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
          >
            {t.closeSopBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
