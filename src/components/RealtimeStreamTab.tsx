import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Play,
  Pause,
  Send,
  PlusCircle,
  AlertCircle,
  Flame,
  CheckCircle2,
  Volume2,
  Trash2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { REALTIME_SIMULATOR_REVIEWS } from '../data/sampleReviews';
import { playNegativeSpikeAlarm } from '../utils/audioAlert';
import { useLanguage } from '../context/LanguageContext';

interface LiveReviewItem {
  id: string;
  text: string;
  source: string;
  timestamp: string;
  sentiment: 'POSITIF' | 'NETRAL' | 'NEGATIF';
  sentiment_score: number;
  category: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  detected_keywords?: string[];
  summary?: string;
  is_negative?: boolean;
}

interface Props {
  alertThreshold?: number;
}

export const RealtimeStreamTab: React.FC<Props> = ({ alertThreshold = 25.0 }) => {
  const { t, language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMs, setSpeedMs] = useState<number>(3500); // 3.5s per review
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [manualInput, setManualInput] = useState<string>('');
  const [manualSource, setManualSource] = useState<string>('Live In-App Chat');
  const [isAnalyzingManual, setIsAnalyzingManual] = useState<boolean>(false);
  const [liveReviews, setLiveReviews] = useState<LiveReviewItem[]>([
    {
      id: 'LIVE-INIT-1',
      text: language === 'en'
        ? 'Best shopping app! Super fast delivery and the packaging is always securely bubble wrapped.'
        : 'Aplikasi belanja favorit! Pengiriman kilat dan kemasan selalu rapi bubble wrap.',
      source: 'App Store Feed',
      timestamp: new Date().toLocaleTimeString(language === 'en' ? 'en-US' : 'id-ID'),
      sentiment: 'POSITIF',
      sentiment_score: 0.92,
      category: language === 'en' ? 'Product & Service Quality' : 'Kepuasan Layanan & Produk',
      urgency: 'LOW',
      summary: language === 'en' ? 'Highly satisfied with rapid courier delivery' : 'Ulasan sangat puas pengiriman kilat',
    },
    {
      id: 'LIVE-INIT-2',
      text: language === 'en'
        ? 'QR payment failed but my checking account was debited $85, please resolve urgently!'
        : 'Gagal transaksi QRIS padahal saldo rekening berkurang Rp 120.000, tolong dibantu!',
      source: 'Twitter / X',
      timestamp: new Date().toLocaleTimeString(language === 'en' ? 'en-US' : 'id-ID'),
      sentiment: 'NEGATIF',
      sentiment_score: -0.88,
      category: language === 'en' ? 'Payment System' : 'Sistem Pembayaran',
      urgency: 'CRITICAL',
      summary: language === 'en' ? 'Account charged despite cancelled order' : 'Saldo terpotong saat transaksi QRIS',
    },
  ]);

  const simIndexRef = useRef(0);

  // Calculate live statistics
  const totalLive = liveReviews.length;
  const negCount = liveReviews.filter((r) => r.sentiment === 'NEGATIF').length;
  const posCount = liveReviews.filter((r) => r.sentiment === 'POSITIF').length;
  const neuCount = totalLive - negCount - posCount;

  const negPct = totalLive > 0 ? Number(((negCount / totalLive) * 100).toFixed(1)) : 0;
  const posPct = totalLive > 0 ? Number(((posCount / totalLive) * 100).toFixed(1)) : 0;
  const isSpike = totalLive >= 4 && negPct >= alertThreshold;

  // Sound alert trigger when spike happens
  useEffect(() => {
    if (isSpike && soundEnabled) {
      playNegativeSpikeAlarm();
    }
  }, [isSpike, soundEnabled]);

  const analyzeSingleReviewLocally = (text: string, source: string, customId?: string): LiveReviewItem => {
    const textLow = text.toLowerCase();
    const negWords = ['kecewa', 'lambat', 'gagal', 'rusak', 'jelek', 'rugi', 'parah', 'buruk', 'terpotong', 'batal', 'marah', 'error', 'bug', 'lelet', 'slow', 'fail', 'cancel', 'broke', 'terrible', 'worst'];
    const posWords = ['puas', 'bagus', 'cepat', 'ramah', 'mantap', 'keren', 'suka', 'terima kasih', 'recommended', 'hebat', 'rapi', 'great', 'fast', 'love', 'helpful', 'awesome', 'excellent'];

    const nMatch = negWords.filter((w) => textLow.includes(w)).length;
    const pMatch = posWords.filter((w) => textLow.includes(w)).length;

    let sentiment: 'POSITIF' | 'NETRAL' | 'NEGATIF' = 'NETRAL';
    let score = 0.0;
    let urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    let category = language === 'en' ? 'Customer Care' : 'Layanan Pelanggan Umum';

    if (nMatch > pMatch) {
      sentiment = 'NEGATIF';
      score = -(0.5 + Math.min(nMatch * 0.2, 0.45));
      urgency = textLow.includes('saldo') || textLow.includes('uang') || textLow.includes('charge') || textLow.includes('payment') ? 'CRITICAL' : 'HIGH';
      category = textLow.includes('saldo') || textLow.includes('bayar') || textLow.includes('payment')
        ? (language === 'en' ? 'Payment System' : 'Sistem Pembayaran')
        : (language === 'en' ? 'Delivery & Logistics' : 'Layanan & Pengiriman');
    } else if (pMatch > nMatch) {
      sentiment = 'POSITIF';
      score = 0.5 + Math.min(pMatch * 0.2, 0.45);
      urgency = 'LOW';
      category = language === 'en' ? 'Service & Product Satisfaction' : 'Kepuasan Layanan & Produk';
    }

    return {
      id: customId || `LIVE-${Date.now().toString(36).slice(-4).toUpperCase()}`,
      text,
      source,
      timestamp: new Date().toLocaleTimeString(language === 'en' ? 'en-US' : 'id-ID'),
      sentiment,
      sentiment_score: Number(score.toFixed(2)),
      category,
      urgency,
      summary: text.length > 55 ? text.slice(0, 52) + '...' : text,
      is_negative: sentiment === 'NEGATIF',
    };
  };

  // Stream Interval
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(async () => {
      const sample = REALTIME_SIMULATOR_REVIEWS[simIndexRef.current % REALTIME_SIMULATOR_REVIEWS.length];
      simIndexRef.current += 1;
      const itemId = `STREAM-${Date.now().toString(36).slice(-4).toUpperCase()}`;

      try {
        const res = await fetch('/api/analyze-single', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reviewText: sample.text,
            source: sample.source,
            id: itemId,
          }),
        });
        if (res.ok) {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await res.json();
            if (data && data.sentiment) {
              setLiveReviews((prev) => [
                {
                  ...data,
                  timestamp: new Date().toLocaleTimeString(language === 'en' ? 'en-US' : 'id-ID'),
                },
                ...prev.slice(0, 29),
              ]);
              return;
            }
          }
        }
      } catch (err) {
        // Fall back locally on offline or static deployment
      }

      // Local fallback
      const localItem = analyzeSingleReviewLocally(sample.text, sample.source, itemId);
      setLiveReviews((prev) => [localItem, ...prev.slice(0, 29)]);
    }, speedMs);

    return () => clearInterval(interval);
  }, [isPlaying, speedMs, language]);

  // Manual review submit
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    setIsAnalyzingManual(true);
    const customId = `USER-${Date.now().toString(36).slice(-4).toUpperCase()}`;
    try {
      const res = await fetch('/api/analyze-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewText: manualInput,
          source: manualSource,
          id: customId,
        }),
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const analyzed = await res.json();
          if (analyzed && analyzed.sentiment) {
            setLiveReviews((prev) => [
              {
                ...analyzed,
                timestamp: new Date().toLocaleTimeString(language === 'en' ? 'en-US' : 'id-ID'),
              },
              ...prev,
            ]);
            setManualInput('');
            setIsAnalyzingManual(false);
            return;
          }
        }
      }
    } catch (err) {
      // Fallback below
    }

    // Local classification
    const localAnalyzed = analyzeSingleReviewLocally(manualInput, manualSource, customId);
    setLiveReviews((prev) => [localAnalyzed, ...prev]);
    setManualInput('');
    setIsAnalyzingManual(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Simulator Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-400" />
              <span>{t.realtimeTitle}</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            {t.realtimeSubtitle}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>{t.pauseStream}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>{t.startStream}</span>
              </>
            )}
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-500 px-1 text-[11px] font-semibold">{t.speedLabel}</span>
            {[
              { label: '1x (3.5s)', val: 3500 },
              { label: '2x (1.8s)', val: 1800 },
              { label: '5x (0.8s)', val: 800 },
            ].map((spd) => (
              <button
                key={spd.val}
                onClick={() => setSpeedMs(spd.val)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                  speedMs === spd.val
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {spd.label}
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border text-xs transition-colors flex items-center gap-1.5 ${
              soundEnabled
                ? 'bg-blue-950 text-blue-300 border-blue-700'
                : 'bg-slate-950 text-slate-500 border-slate-800'
            }`}
            title={soundEnabled ? t.alarmOn : t.alarmOff}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{soundEnabled ? t.alarmOn : t.alarmOff}</span>
          </button>

          {/* Clear Buffer */}
          <button
            onClick={() => setLiveReviews([])}
            className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg border border-slate-800 transition-colors"
            title={t.clearBuffer}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Live Metrics Gauge & Spike Warning Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Live Neg Sentiment Rate */}
        <div className={`p-4 rounded-2xl border transition-all shadow-lg ${
          isSpike
            ? 'bg-red-950/60 border-red-500 text-red-200 animate-pulse'
            : 'bg-slate-900/80 border-slate-800 text-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-1">
            <span>{t.liveNegRate}</span>
            {isSpike && <Flame className="w-4 h-4 text-red-400 animate-bounce" />}
          </div>
          <div className="text-3xl font-black">{negPct}%</div>
          <span className="text-[11px] text-slate-400">
            {negCount} / {totalLive} {t.reviewsCountUnit}
          </span>
          <div className="mt-2 text-[10px] font-bold">
            {isSpike ? (
              <span className="text-red-400">{t.spikeActiveWarning(alertThreshold)}</span>
            ) : (
              <span className="text-emerald-400">{t.safeWithinTolerance(alertThreshold)}</span>
            )}
          </div>
        </div>

        {/* Live Pos Sentiment Rate */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            {t.livePosRate}
          </div>
          <div className="text-3xl font-black text-emerald-400">{posPct}%</div>
          <span className="text-[11px] text-slate-400">
            {posCount} {t.reviewsCountUnit}
          </span>
          <div className="mt-2 text-[10px] text-slate-500">
            {t.neutralLabel}: {neuCount}
          </div>
        </div>

        {/* Total Processed Live Buffer */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            {t.liveBufferCount}
          </div>
          <div className="text-3xl font-black text-white">{totalLive}</div>
          <span className="text-[11px] text-slate-400">
            {speedMs / 1000}s / review
          </span>
          <div className="mt-2 text-[10px] text-blue-400 font-semibold">
            Status: {isPlaying ? t.streamingRunning : t.streamingPaused}
          </div>
        </div>

        {/* Threshold setting */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              {t.alarmThresholdTitle}
            </div>
            <div className="text-2xl font-black text-amber-400">{alertThreshold}%</div>
            <span className="text-[10px] text-slate-400">
              {t.webhookDispatcherTitle}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-2">
            Neg % &gt;= {alertThreshold}%
          </div>
        </div>
      </div>

      {/* Manual Review Injection Box */}
      <form
        onSubmit={handleManualSubmit}
        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
      >
        <div className="shrink-0">
          <select
            value={manualSource}
            onChange={(e) => setManualSource(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 py-2.5 px-3 rounded-xl focus:outline-none focus:border-blue-500 w-full sm:w-40"
          >
            <option value="Live In-App Chat">Live In-App Chat</option>
            <option value="Google Play Store">Google Play Store</option>
            <option value="Twitter / X">Twitter / X</option>
            <option value="Helpdesk CS Ticket">Helpdesk CS Ticket</option>
            <option value="Web Checkout Form">Web Checkout Form</option>
          </select>
        </div>

        <input
          type="text"
          placeholder={t.manualInputPlaceholder}
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          className="bg-slate-950 border border-slate-700 text-xs text-slate-200 py-2.5 px-4 rounded-xl focus:outline-none focus:border-blue-500 flex-1"
        />

        <button
          type="submit"
          disabled={isAnalyzingManual || !manualInput.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shrink-0"
        >
          {isAnalyzingManual ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span>{t.instantAnalyzeBtn}</span>
        </button>
      </form>

      {/* Real-Time Live Feed Stream Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
          <span>{t.incomingFeedTitle}</span>
          <span>{t.queueCount(liveReviews.length)}</span>
        </div>

        {liveReviews.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
            {t.emptyLiveQueue}
          </div>
        ) : (
          liveReviews.map((rev) => (
            <div
              key={rev.id}
              className={`border rounded-xl p-3.5 transition-all text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-in slide-in-from-top-2 ${
                rev.sentiment === 'NEGATIF'
                  ? 'bg-red-950/20 border-red-900/60 hover:border-red-700'
                  : rev.sentiment === 'POSITIF'
                  ? 'bg-emerald-950/20 border-emerald-900/60 hover:border-emerald-700'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {rev.id}
                  </span>
                  <span className="text-[10px] text-blue-400 font-medium">
                    {rev.source}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {rev.timestamp}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {rev.category}
                  </span>
                </div>
                <p className="text-slate-100 font-medium text-xs sm:text-sm leading-relaxed">
                  "{rev.text}"
                </p>
                {rev.summary && (
                  <p className="text-[11px] text-slate-400 italic">
                    {rev.summary}
                  </p>
                )}
              </div>

              <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1.5 shrink-0">
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    rev.sentiment === 'POSITIF'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                      : rev.sentiment === 'NEGATIF'
                      ? 'bg-red-950 text-red-300 border-red-500'
                      : 'bg-slate-800 text-slate-300 border-slate-600'
                  }`}
                >
                  {rev.sentiment === 'POSITIF' ? t.positiveLabel : rev.sentiment === 'NEGATIF' ? t.negativeLabel : t.neutralLabel} ({rev.sentiment_score})
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  {t.urgencyLabel} <span className={rev.urgency === 'CRITICAL' ? 'text-red-400 font-bold' : ''}>{rev.urgency}</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
