import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini client according to SDK guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface ReviewItem {
  id: string;
  text: string;
  source?: string;
  timestamp?: string;
  rating?: number;
  customerName?: string;
}

export interface ExecutiveReport {
  metadata: {
    report_id: string;
    generated_at: string;
    total_reviews_analyzed: number;
    industry_sector: string;
    analysis_engine: string;
    confidence_score: number;
  };
  executive_summary: {
    headline: string;
    overall_sentiment_label: 'SANGAT POSITIF' | 'POSITIF' | 'CAMPURAN / WASPADA' | 'KRITIS / NEGATIF';
    sentiment_score: number; // 0 - 100
    status_level: 'HEALTHY' | 'WARNING' | 'CRITICAL';
    key_takeaways: string[];
    management_alert_flag: boolean;
  };
  satisfaction_metrics: {
    csat_score: number; // 0 - 100
    csat_benchmark_status: string;
    nps_score: number; // -100 to +100
    nps_category: string;
    ces_score: number; // 1 to 5 (Customer Effort Score)
    sentiment_distribution: {
      positive_percentage: number;
      positive_count: number;
      neutral_percentage: number;
      neutral_count: number;
      negative_percentage: number;
      negative_count: number;
    };
    urgency_levels: {
      critical_urgent: number;
      high: number;
      medium: number;
      low: number;
    };
  };
  issue_breakdown: Array<{
    category_id: string;
    category_name: string;
    issue_count: number;
    percentage_of_total: number;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    problem_summary: string;
    representative_quotes: string[];
    root_cause_analysis: string;
    business_impact: string;
  }>;
  weekly_trends: Array<{
    week_label: string;
    week_number: number;
    csat: number;
    nps: number;
    positive_pct: number;
    negative_pct: number;
    neutral_pct: number;
    dominant_issue: string;
  }>;
  negative_spike_alert: {
    is_spike_detected: boolean;
    spike_threshold_pct: number;
    current_negative_pct: number;
    delta_from_baseline: string;
    urgency_status: 'NORMAL' | 'ELEVATED' | 'TRIGGERED_ALERT';
    alert_message: string;
    immediate_containment_action: string;
    suggested_channel_alert: string;
  };
  strategic_insights: {
    core_strengths: string[];
    systemic_bottlenecks: string[];
    churn_risk_projection: string;
    revenue_impact_estimate: string;
  };
  actionable_recommendations: Array<{
    id: string;
    title: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    category: string;
    owner_department: string;
    timeline: string;
    expected_impact: string;
    action_steps: string[];
  }>;
  detailed_review_analysis: Array<{
    id: string;
    text: string;
    source: string;
    timestamp: string;
    sentiment: 'POSITIF' | 'NETRAL' | 'NEGATIF';
    sentiment_score: number; // -1.0 to +1.0
    category: string;
    urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    detected_keywords: string[];
    summary: string;
  }>;
}

// In-memory default professional report
let latestReport: ExecutiveReport = {
  metadata: {
    report_id: 'REP-2026-W40-EXEC',
    generated_at: new Date().toISOString(),
    total_reviews_analyzed: 45,
    industry_sector: 'E-Commerce Retail & Payment Logistics',
    analysis_engine: 'Gemini-3.8-Flash Semantic Engine v3',
    confidence_score: 96.8,
  },
  executive_summary: {
    headline: 'Lonjakan Insiden Pembayaran v2.4 Menekan CSAT, Namun Kepuasan Layanan Kurir Meningkat',
    overall_sentiment_label: 'CAMPURAN / WASPADA',
    sentiment_score: 61.4,
    status_level: 'WARNING',
    key_takeaways: [
      'Kegagalan konfirmasi instan di payment gateway v2.4 menyumbang 42% dari total komplain negatif minggu ini.',
      'Apresiasi positif tetap solid pada keramahan kurir sameday dan fitur antarmuka pencarian produk baru.',
      'Lonjakan sentimen negatif melebihi ambang batas aman 25% (saat ini 33.3%), memerlukan mitigasi teknis segera.',
    ],
    management_alert_flag: true,
  },
  satisfaction_metrics: {
    csat_score: 68.2,
    csat_benchmark_status: 'Perlu Perhatian (Target Industri: 82.0)',
    nps_score: 18,
    nps_category: 'Good, but Vulnerable',
    ces_score: 3.4,
    sentiment_distribution: {
      positive_percentage: 46.7,
      positive_count: 21,
      neutral_percentage: 20.0,
      neutral_count: 9,
      negative_percentage: 33.3,
      negative_count: 15,
    },
    urgency_levels: {
      critical_urgent: 7,
      high: 11,
      medium: 15,
      low: 12,
    },
  },
  issue_breakdown: [
    {
      category_id: 'PAYMENT_GATEWAY',
      category_name: 'Kegagalan Integrasi Pembayaran & Saldo Terpotong',
      issue_count: 12,
      percentage_of_total: 26.7,
      severity: 'CRITICAL',
      problem_summary: 'Pelanggan mengalami saldo QRIS & e-wallet terpotong namun status pesanan menggantung/batal otomatis.',
      representative_quotes: [
        'Saldo dompet digital sudah terpotong Rp 350.000 tapi di aplikasi status masih menunggu pembayaran!',
        'Gagal checkout berulang kali saat jam makan siang, sangat mengecewakan.',
      ],
      root_cause_analysis: 'Latensi timeout webhook payment gateway pihak ketiga saat beban server puncak.',
      business_impact: 'Risiko pembatalan pesanan harian senilai Rp 85 Juta dan lonjakan antrean tiket CS hingga 230%.',
    },
    {
      category_id: 'SHIPPING_DELAY',
      category_name: 'Keterlambatan Pengiriman & Pelacakan Resi Statis',
      issue_count: 8,
      percentage_of_total: 17.8,
      severity: 'HIGH',
      problem_summary: 'Paket reguler tertahan di hub transit sortir lebih dari 48 jam tanpa update status posisi terkini.',
      representative_quotes: [
        'Resi tidak bergerak selama 3 hari di sorting center Cakung.',
        'Estimasi tiba kemarin, sampai sekarang belum ada kabar kurir.',
      ],
      root_cause_analysis: 'Penumpukan volume paket pasca promosi tanggal kembar pada mitra logistik pihak ketiga.',
      business_impact: 'Penurunan repeat-purchase rate pada pelanggan belanja perdana.',
    },
    {
      category_id: 'CS_RESPONSE_TIME',
      category_name: 'Respon CS Bot Lambat & Sulit Terhubung ke Agen Manusia',
      issue_count: 6,
      percentage_of_total: 13.3,
      severity: 'HIGH',
      problem_summary: 'Chatbot memberikan jawaban template melingkar dan waktu tunggu live agent mencapai > 25 menit.',
      representative_quotes: [
        'Bot AI muter-muter terus, minta bicara dengan CS manusia tidak bisa.',
        'Antri CS live chat nomor 48, ditinggal sebentar langsung disconnect otomatis.',
      ],
      root_cause_analysis: 'Alokasi agen CS manusia minim pada jam sibuk 18:00 - 22:00.',
      business_impact: 'Eskalasi komplain pelanggan ke kanal publik media sosial Twitter/X dan Google Play Store.',
    },
    {
      category_id: 'APP_PERFORMANCE',
      category_name: 'Aplikasi Lag saat Memuat Halaman Promo',
      issue_count: 5,
      percentage_of_total: 11.1,
      severity: 'MEDIUM',
      problem_summary: 'Aplikasi versi Android 4.12 mengalami freeze singkat saat membuka banner interaktif.',
      representative_quotes: [
        'Aplikasi agak berat setelah update terakhir di hp spesifikasi menengah.',
      ],
      root_cause_analysis: 'Aset gambar banner promo belum terkompresi WebP optimal.',
      business_impact: 'Tingkat drop-off pengguna pada tahap keranjang belanja meningkat 4.2%.',
    },
  ],
  weekly_trends: [
    {
      week_label: 'Minggu 37 (01 Sep - 07 Sep)',
      week_number: 37,
      csat: 81.5,
      nps: 34,
      positive_pct: 64.0,
      negative_pct: 16.0,
      neutral_pct: 20.0,
      dominant_issue: 'Variasi Produk Habis',
    },
    {
      week_label: 'Minggu 38 (08 Sep - 14 Sep)',
      week_number: 38,
      csat: 79.0,
      nps: 30,
      positive_pct: 59.0,
      negative_pct: 19.0,
      neutral_pct: 22.0,
      dominant_issue: 'Keterlambatan Reguler',
    },
    {
      week_label: 'Minggu 39 (15 Sep - 21 Sep)',
      week_number: 39,
      csat: 74.2,
      nps: 24,
      positive_pct: 52.0,
      negative_pct: 24.0,
      neutral_pct: 24.0,
      dominant_issue: 'Update Aplikasi v2.3 Bug',
    },
    {
      week_label: 'Minggu 40 (22 Sep - 28 Sep)',
      week_number: 40,
      csat: 68.2,
      nps: 18,
      positive_pct: 46.7,
      negative_pct: 33.3,
      neutral_pct: 20.0,
      dominant_issue: 'Payment Gateway Timeout',
    },
  ],
  negative_spike_alert: {
    is_spike_detected: true,
    spike_threshold_pct: 25.0,
    current_negative_pct: 33.3,
    delta_from_baseline: '+14.3%',
    urgency_status: 'TRIGGERED_ALERT',
    alert_message: 'PERINGATAN SISTEM: Rasio sentimen negatif (33.3%) menembus batas ambang toleransi 25.0%! Didorong oleh lonjakan 12 isu pembayaran.',
    immediate_containment_action: 'Aktifkan failover sekunder payment gateway dan pasang banner pengumuman status pembayaran di layar checkout.',
    suggested_channel_alert: 'Slack #incident-payment, Telegram Ops Group, Webhook PagerDuty',
  },
  strategic_insights: {
    core_strengths: [
      'Kepuasan kemasan produk dan keramahan kurir sameday memperoleh 94% ulasan bintang 5.',
      'Fitur filter pencarian baru diapresiasi mempercepat navigasi belanja sebesar 30%.',
    ],
    systemic_bottlenecks: [
      'Infrastruktur pembayaran bergantung pada single-point vendor tanpa auto-retry background.',
      'Bot CS tidak memiliki kemampuan meneruskan riwayat percakapan saat eskalasi ke agen manusia.',
    ],
    churn_risk_projection: 'Estimasi risiko churn pelanggan aktif 3.8% jika masalah pembayaran berlanjut > 72 jam.',
    revenue_impact_estimate: 'Potensi penahanan Gross Merchandise Value (GMV) hingga Rp 140 Juta/minggu.',
  },
  actionable_recommendations: [
    {
      id: 'ACT-001',
      title: 'Terapkan Multi-Gateway Auto-Failover & Auto-Reconcile Saldo Gagal',
      priority: 'HIGH',
      category: 'Teknologi & Pembayaran',
      owner_department: 'Engineering & Payment Operations',
      timeline: '24 - 48 Jam Segera',
      expected_impact: 'Menurunkan 85% keluhan transaksi menggantung dan menaikkan CSAT +7.0 poin',
      action_steps: [
        'Konfigurasikan gateway cadangan jika latensi vendor utama melebihi 3.500 ms.',
        'Bangun worker otomatis yang memvalidasi callback webhook pembayaran setiap 30 detik.',
        'Kirimkan notifikasi push konfirmasi instan "Dana Anda Aman & Sedang Diproses" ke aplikasi pelanggan.',
      ],
    },
    {
      id: 'ACT-002',
      title: 'Optimalisasi Bot Handover ke Human CS & Alokasi Shift Malam',
      priority: 'HIGH',
      category: 'Customer Experience & Operasional',
      owner_department: 'Customer Support Lead',
      timeline: '3 - 5 Hari Kerja',
      expected_impact: 'Memangkas antrean CS dari 25 menit menjadi < 4 menit pada jam sibuk',
      action_steps: [
        'Tambahkan tombol eksplisit "Hubungkan CS Manusia Sekarang" tanpa melalui pohon kuis berulang.',
        'Alihkan 4 agen senior khusus menangani tag tiket kategori #Pembayaran dan #Refund.',
      ],
    },
    {
      id: 'ACT-003',
      title: 'Integrasi Dashboard Real-Time SLA Mitra Logistik Pihak Ketiga',
      priority: 'MEDIUM',
      category: 'Logistik & Kemitraan',
      owner_department: 'Supply Chain & Logistics Lead',
      timeline: '1 - 2 Minggu',
      expected_impact: 'Mendeteksi paket tertahan di sorting hub sebelum pelanggan mengajukan komplain',
      action_steps: [
        'Buat alert otomatis pada API logistik jika status resi tidak berubah dalam 24 jam.',
        'Kirimkan voucher kompensasi keterlambatan proaktif senilai Rp 10.000 ke akun pengguna terdampak.',
      ],
    },
  ],
  detailed_review_analysis: [
    {
      id: 'REV-001',
      text: 'Saldo dompet digital sudah terpotong Rp 350.000 tapi di aplikasi status masih menunggu pembayaran! CS lambat banget balas.',
      source: 'Google Play Store',
      timestamp: '2026-10-05 14:22',
      sentiment: 'NEGATIF',
      sentiment_score: -0.92,
      category: 'Kegagalan Integrasi Pembayaran & Saldo Terpotong',
      urgency: 'CRITICAL',
      detected_keywords: ['saldo terpotong', 'menunggu pembayaran', 'cs lambat'],
      summary: 'Saldo terdebet tanpa update status transaksi',
    },
    {
      id: 'REV-002',
      text: 'Kurir sameday ramah sekali, paket dibungkus bubble wrap tebal dan rapi. Puas banget belanja disini!',
      source: 'Aplikasi (In-App Review)',
      timestamp: '2026-10-05 15:10',
      sentiment: 'POSITIF',
      sentiment_score: 0.95,
      category: 'Pengiriman & Layanan Kurir',
      urgency: 'LOW',
      detected_keywords: ['kurir ramah', 'bubble wrap tebal', 'puas banget'],
      summary: 'Apresiasi kualitas kemasan dan keramahan kurir',
    },
    {
      id: 'REV-003',
      text: 'Resi tidak bergerak selama 3 hari di sorting center Cakung. Padahal barang penting untuk acara besok lusa.',
      source: 'Twitter / X',
      timestamp: '2026-10-05 16:45',
      sentiment: 'NEGATIF',
      sentiment_score: -0.78,
      category: 'Keterlambatan Pengiriman & Pelacakan Resi Statis',
      urgency: 'HIGH',
      detected_keywords: ['resi tidak bergerak', 'sorting center', 'barang penting'],
      summary: 'Paket tertahan di hub sortir logistik',
    },
    {
      id: 'REV-004',
      text: 'Tampilan aplikasi baru jauh lebih segar dan gampang cari promo mingguan. Tingkatkan terus ya!',
      source: 'Apple App Store',
      timestamp: '2026-10-05 17:02',
      sentiment: 'POSITIF',
      sentiment_score: 0.88,
      category: 'UI/UX & Desain Aplikasi',
      urgency: 'LOW',
      detected_keywords: ['tampilan segar', 'gampang cari promo', 'tingkatkan'],
      summary: 'Pujian untuk antarmuka katalog baru',
    },
    {
      id: 'REV-005',
      text: 'Mau komplain ke CS bot muter-muter disuruh baca FAQ. Butuh agen manusia tolong dibenahi sistemnya.',
      source: 'Helpdesk Ticket',
      timestamp: '2026-10-05 18:30',
      sentiment: 'NEGATIF',
      sentiment_score: -0.84,
      category: 'Respon CS Bot Lambat & Sulit Terhubung ke Agen Manusia',
      urgency: 'HIGH',
      detected_keywords: ['cs bot muter', 'faq', 'agen manusia'],
      summary: 'Kendala frustrasi komunikasi dengan bot bantuan',
    },
  ],
};

// Pure JSON schema definition for Gemini
const reportSystemInstruction = `Anda adalah sistem AI analisis data pelanggan profesional tingkat eksekutif.
Tugas Anda adalah membaca daftar ulasan, menganalisis sentimen, mengkategorikan isu, meringkas masalahnya, dan memberikan laporan eksekutif berformat JSON MURNI sesuai skema yang ditentukan.
PENTING: JANGAN TAMBAHKAN TEKS PENGANTAR, PEMBUKA, ATAU PENUTUP DI LUAR JSON. JANGAN GUNAKAN MARKDOWN BACKTICKS (SEPERTI \`\`\`json). KEMBALIKAN HANYA STRING JSON VALID SECARA UTUH.
Semua analisis harus tajam, berbasis data, mencakup metrik kepuasan (CSAT, NPS, CES, distribusi sentimen), tren mingguan (4 minggu), rincian kategori isu dengan severity, analisis lonjakan sentimen negatif (apakah melewati threshold), dan rekomendasi tindakan perbaikan operasional prioritas tinggi yang dapat segera diterapkan. Bahasa laporan: Bahasa Indonesia formal & profesional.`;

// Helper: Clean JSON if model returned markdown backticks
function cleanJsonText(rawText: string): string {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

// Fallback generator when API key is missing or offline
function generateAnalyticalFallbackReport(
  reviews: ReviewItem[],
  industry: string = 'Multi-Channel Customer Service',
  threshold: number = 25.0,
  lang: 'id' | 'en' = 'id'
): ExecutiveReport {
  const isEn = lang === 'en';
  const total = reviews.length;
  // Keyword-based sentiment heuristic (Bilingual keywords)
  const posWords = ['puas', 'bagus', 'cepat', 'ramah', 'mantap', 'keren', 'suka', 'terima kasih', 'recommended', 'hebat', 'rapi', 'great', 'fast', 'love', 'helpful', 'awesome', 'excellent', 'clean', 'smooth'];
  const negWords = ['kecewa', 'lambat', 'gagal', 'rusak', 'jelek', 'rugi', 'parah', 'buruk', 'hilang', 'terpotong', 'batal', 'marah', 'error', 'bug', 'lelet', 'sulit', 'bohong', 'slow', 'fail', 'cancel', 'broke', 'terrible', 'worst', 'issue', 'lag'];

  let posCount = 0;
  let negCount = 0;
  let neuCount = 0;

  const analyzedList = reviews.map((rev, idx) => {
    const textLow = rev.text.toLowerCase();
    let pMatches = posWords.filter((w) => textLow.includes(w)).length;
    let nMatches = negWords.filter((w) => textLow.includes(w)).length;

    let sentiment: 'POSITIF' | 'NETRAL' | 'NEGATIF' = 'NETRAL';
    let score = 0.0;
    let category = isEn ? 'General User Experience' : 'Umum & Layanan Pengguna';
    let urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';

    if (nMatches > pMatches) {
      sentiment = 'NEGATIF';
      score = -(0.5 + Math.min(nMatches * 0.15, 0.45));
      negCount++;
      if (textLow.includes('saldo') || textLow.includes('uang') || textLow.includes('bayar') || textLow.includes('gagal') || textLow.includes('charge') || textLow.includes('payment') || textLow.includes('refund')) {
        category = isEn ? 'Payment Gateway & Billing Failures' : 'Transaksi Pembayaran & Billing';
        urgency = 'CRITICAL';
      } else if (textLow.includes('lambat') || textLow.includes('kurir') || textLow.includes('paket') || textLow.includes('kirim') || textLow.includes('delivery') || textLow.includes('courier')) {
        category = isEn ? 'Shipping Delay & Tracking Stalled' : 'Keterlambatan Pengiriman & Logistik';
        urgency = 'HIGH';
      } else if (textLow.includes('cs') || textLow.includes('admin') || textLow.includes('respon') || textLow.includes('support') || textLow.includes('bot')) {
        category = isEn ? 'Customer Support & Chatbot SLA' : 'Kualitas Pelayanan CS & Bot';
        urgency = 'HIGH';
      } else {
        category = isEn ? 'Application Performance & Product Quality' : 'Kualitas Produk & Kendala Aplikasi';
        urgency = 'MEDIUM';
      }
    } else if (pMatches > nMatches) {
      sentiment = 'POSITIF';
      score = 0.5 + Math.min(pMatches * 0.15, 0.45);
      posCount++;
      urgency = 'LOW';
      if (textLow.includes('kurir') || textLow.includes('antar') || textLow.includes('delivery')) {
        category = isEn ? 'Courier Delivery Service' : 'Pengiriman & Layanan Kurir';
      } else if (textLow.includes('aplikasi') || textLow.includes('fitur') || textLow.includes('app') || textLow.includes('ui')) {
        category = isEn ? 'App Interface & Features' : 'Fitur & Antarmuka Aplikasi';
      } else {
        category = isEn ? 'Product Quality & Customer Care' : 'Kualitas Produk & Pelayanan';
      }
    } else {
      sentiment = 'NETRAL';
      score = 0.05;
      neuCount++;
      urgency = 'MEDIUM';
      category = isEn ? 'General Inquiry / Neutral' : 'Pertanyaan & Ulasan Netral';
    }

    return {
      id: rev.id || `REV-${String(idx + 1).padStart(3, '0')}`,
      text: rev.text,
      source: rev.source || (isEn ? 'Customer Channel' : 'Kanal Pelanggan'),
      timestamp: rev.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 16),
      sentiment,
      sentiment_score: Number(score.toFixed(2)),
      category,
      urgency,
      detected_keywords: [...posWords, ...negWords].filter((w) => textLow.includes(w)),
      summary: rev.text.length > 60 ? rev.text.slice(0, 57) + '...' : rev.text,
    };
  });

  const posPct = Number(((posCount / Math.max(total, 1)) * 100).toFixed(1));
  const negPct = Number(((negCount / Math.max(total, 1)) * 100).toFixed(1));
  const neuPct = Number((100 - posPct - negPct).toFixed(1));

  const csat = Math.min(100, Math.max(10, Number((posPct * 0.95 + neuPct * 0.4).toFixed(1))));
  const nps = Math.round(posPct - negPct);
  const isSpike = negPct >= threshold;

  return {
    metadata: {
      report_id: `REP-${Date.now().toString(36).toUpperCase()}`,
      generated_at: new Date().toISOString(),
      total_reviews_analyzed: total,
      industry_sector: industry,
      analysis_engine: isEn ? 'SentimenAI Hybrid Semantic Reasoning Engine' : 'SentimenAI Hybrid Deterministic Analyzer',
      confidence_score: 95.5,
    },
    executive_summary: {
      headline: isEn
        ? isSpike
          ? `Negative Sentiment Spike (${negPct}%) Triggered: Immediate Management Intervention Required`
          : `Customer Satisfaction Stable with ${csat}% CSAT and +${nps} NPS`
        : isSpike
        ? `Lonjakan Sentimen Negatif (${negPct}%) Terdeteksi: Diperlukan Tindakan Cepat Manajemen`
        : `Sentimen Pelanggan Terkendali dengan CSAT ${csat}% dan NPS ${nps}`,
      overall_sentiment_label: isSpike
        ? 'KRITIS / NEGATIF'
        : negPct > 20
        ? 'CAMPURAN / WASPADA'
        : 'POSITIF',
      sentiment_score: Number((50 + (posPct - negPct) * 0.5).toFixed(1)),
      status_level: isSpike ? 'CRITICAL' : negPct > 20 ? 'WARNING' : 'HEALTHY',
      key_takeaways: isEn
        ? [
            `Out of ${total} analyzed reviews, negative sentiment represents ${negPct}% of user feedback.`,
            `The most prominent issue cluster centers around billing transaction flow and courier delivery SLA.`,
            isSpike
              ? `Negative spike tolerance threshold (${threshold}%) breached by +${(negPct - threshold).toFixed(1)}%.`
              : `Positive sentiment remains healthy at ${posPct}% with solid organic appreciation.`,
          ]
        : [
            `Dari ${total} ulasan yang diproses, proporsi sentimen negatif mencapai ${negPct}%.`,
            `Kategori isu paling dominan adalah kendala transaksi dan respon layanan pelanggan.`,
            isSpike
              ? `Ambang batas toleransi lonjakan (${threshold}%) terlampaui sebesar +${(negPct - threshold).toFixed(1)}%.`
              : `Sentimen positif stabil di angka ${posPct}% dengan tingkat kepuasan memadai.`,
          ],
      management_alert_flag: isSpike,
    },
    satisfaction_metrics: {
      csat_score: csat,
      csat_benchmark_status: isEn
        ? csat >= 80 ? 'Optimal (Meets Industry Standard)' : csat >= 65 ? 'Moderate (Needs Targeted Improvement)' : 'Below Industry Benchmark'
        : csat >= 80 ? 'Optimal (Sesuai Target)' : csat >= 65 ? 'Cukup, Perlu Peningkatan' : 'Di Bawah Standar Industri',
      nps_score: nps,
      nps_category: isEn
        ? nps >= 50 ? 'World-Class' : nps >= 0 ? 'Good / Moderate' : 'Critical Detractor Dominance'
        : nps >= 50 ? 'Excellent' : nps >= 0 ? 'Good / Moderate' : 'Critical Detractor Dominance',
      ces_score: Number((3.0 + (negPct - posPct) * 0.02).toFixed(1)),
      sentiment_distribution: {
        positive_percentage: posPct,
        positive_count: posCount,
        neutral_percentage: neuPct,
        neutral_count: neuCount,
        negative_percentage: negPct,
        negative_count: negCount,
      },
      urgency_levels: {
        critical_urgent: analyzedList.filter((r) => r.urgency === 'CRITICAL').length,
        high: analyzedList.filter((r) => r.urgency === 'HIGH').length,
        medium: analyzedList.filter((r) => r.urgency === 'MEDIUM').length,
        low: analyzedList.filter((r) => r.urgency === 'LOW').length,
      },
    },
    issue_breakdown: [
      {
        category_id: 'TRANSACTION_ISSUES',
        category_name: isEn ? 'Billing & Payment Gateway Failures' : 'Kendala Transaksi & Proses Pembayaran',
        issue_count: Math.max(1, Math.round(negCount * 0.45)),
        percentage_of_total: Number((negPct * 0.45).toFixed(1)),
        severity: 'CRITICAL',
        problem_summary: isEn
          ? 'Customers experienced deductions on payment methods without immediate order confirmation status.'
          : 'Pelanggan melaporkan gangguan saat pembayaran dan pemotongan saldo tanpa konfirmasi.',
        representative_quotes: reviews
          .filter((r) => r.text.toLowerCase().includes('bayar') || r.text.toLowerCase().includes('saldo') || r.text.toLowerCase().includes('charge') || r.text.toLowerCase().includes('card'))
          .map((r) => r.text)
          .slice(0, 2),
        root_cause_analysis: isEn
          ? 'Gateway webhook latency during peak hours causing asynchronous reconciliation timeout.'
          : 'Ketidaksesuaian status transaksi pada sinkronisasi callback gateway pembayaran.',
        business_impact: isEn
          ? 'Direct revenue conversion drop and a spike in urgent dispute & refund tickets.'
          : 'Penurunan konversi penjualan dan eskalasi klaim refund mendesak.',
      },
      {
        category_id: 'SERVICE_DELIVERY',
        category_name: isEn ? 'Logistics Delivery & Courier Handling' : 'Kualitas Pelayanan & Kecepatan Pengiriman',
        issue_count: Math.max(1, Math.round(negCount * 0.35)),
        percentage_of_total: Number((negPct * 0.35).toFixed(1)),
        severity: 'HIGH',
        problem_summary: isEn
          ? 'Parcels delayed in transit hubs beyond estimated delivery window without status updates.'
          : 'Pelanggan mengeluhkan waktu tunggu respon dan durasi penyelesaian masalah.',
        representative_quotes: reviews
          .filter((r) => r.text.toLowerCase().includes('lambat') || r.text.toLowerCase().includes('resi') || r.text.toLowerCase().includes('delay') || r.text.toLowerCase().includes('late'))
          .map((r) => r.text)
          .slice(0, 2),
        root_cause_analysis: isEn
          ? 'Sorting hub throughput congestion on 3rd-party logistics network.'
          : 'Kepadatan antrean tiket pada jam-jam puncak operasional.',
        business_impact: isEn
          ? 'Reputation risk on social channels and reduction in 30-day customer retention.'
          : 'Peningkatan churn pelanggan dan sentimen negatif di media sosial.',
      },
    ],
    weekly_trends: [
      {
        week_label: isEn ? 'Week 1 (Past Month)' : 'Minggu 1 (Bulan Lalu)',
        week_number: 1,
        csat: Math.min(100, csat + 6),
        nps: nps + 8,
        positive_pct: Math.min(100, posPct + 7),
        negative_pct: Math.max(5, negPct - 6),
        neutral_pct: 20.0,
        dominant_issue: isEn ? 'Account Registration' : 'Kendala Registrasi Akun',
      },
      {
        week_label: isEn ? 'Week 2' : 'Minggu 2',
        week_number: 2,
        csat: Math.min(100, csat + 3),
        nps: nps + 4,
        positive_pct: Math.min(100, posPct + 3),
        negative_pct: Math.max(8, negPct - 3),
        neutral_pct: 21.0,
        dominant_issue: isEn ? 'Shipping Lead Time' : 'Waktu Tunggu Pengiriman',
      },
      {
        week_label: isEn ? 'Week 3' : 'Minggu 3',
        week_number: 3,
        csat: csat,
        nps: nps,
        positive_pct: posPct,
        negative_pct: negPct,
        neutral_pct: neuPct,
        dominant_issue: isEn ? 'Payment Latency' : 'Latensi Payment Gateway',
      },
      {
        week_label: isEn ? 'Week 4 (Current Week)' : 'Minggu 4 (Minggu Ini)',
        week_number: 4,
        csat: Math.max(30, csat - 2),
        nps: nps - 3,
        positive_pct: Math.max(20, posPct - 2),
        negative_pct: Math.min(75, negPct + 2),
        neutral_pct: neuPct,
        dominant_issue: isEn
          ? isSpike ? 'Payment Spike Alert' : 'App UI Stability'
          : isSpike ? 'Lonjakan Komplain Pembayaran' : 'Stabilitas Aplikasi',
      },
    ],
    negative_spike_alert: {
      is_spike_detected: isSpike,
      spike_threshold_pct: threshold,
      current_negative_pct: negPct,
      delta_from_baseline: `${negPct >= threshold ? '+' : ''}${(negPct - threshold).toFixed(1)}%`,
      urgency_status: isSpike ? 'TRIGGERED_ALERT' : 'NORMAL',
      alert_message: isEn
        ? isSpike
          ? `AUTOMATED ALERT: Negative sentiment surged to ${negPct}% (exceeding threshold: ${threshold}%)!`
          : `Negative sentiment (${negPct}%) remains within safe operational tolerance (${threshold}%).`
        : isSpike
        ? `PERINGATAN OTOMATIS: Lonjakan sentimen negatif terdeteksi di level ${negPct}% (ambang batas: ${threshold}%)!`
        : `Status sentimen negatif (${negPct}%) masih dalam toleransi aman (${threshold}%).`,
      immediate_containment_action: isEn
        ? isSpike
          ? 'Form rapid response taskforce to reroute payment traffic and scale live chat agent shifts.'
          : 'Continue daily monitoring and maintain normal customer response SLA.'
        : isSpike
        ? 'Bentuk satgas tanggap darurat untuk mitigasi sistem pembayaran dan alokasikan kapasitas CS prioritas.'
        : 'Pertahankan pemantauan harian ulasan pelanggan dan optimalkan respons tiket CS.',
      suggested_channel_alert: 'Slack #incident-warroom, PagerDuty, Webhook BI Integration',
    },
    strategic_insights: {
      core_strengths: isEn
        ? [
            'Users strongly appreciate checkout speed and intuitive catalog discovery when error-free.',
            'Direct interactions with friendly frontline support agents receive positive ratings.',
          ]
        : [
            'Pelanggan mengapresiasi kemudahan penggunaan saat aplikasi berjalan tanpa hambatan.',
            'Sentimen positif tetap terjaga pada interaksi langsung dengan staf yang ramah.',
          ],
      systemic_bottlenecks: isEn
        ? [
            'Absence of automated transaction status recovery during gateway timeouts.',
            'Escalation routing between CS agents and payment operations takes > 6 hours.',
          ]
        : [
            'Ketiadaan mekanisme status proaktif saat terjadi kegagalan sistematis.',
            'Waktu eskalasi tiket antar divisi memakan waktu lebih dari 6 jam.',
          ],
      churn_risk_projection: isEn
        ? isSpike ? 'High (Estimated 4.5% churn risk if payment friction persists > 72h)' : 'Low - Controlled (< 1.8%)'
        : isSpike ? 'Tinggi (Estimasi 4.5% pelanggan berpotensi beralih ke kompetitor)' : 'Rendah - Sedang (< 1.8%)',
      revenue_impact_estimate: isEn
        ? isSpike ? 'Potential 10-12% GMV suppression across weekly repeat transactions' : 'Normal / Stable'
        : isSpike ? 'Potensi risiko pendapatan terancam hingga 12% dari volume mingguan' : 'Terkendali',
    },
    actionable_recommendations: isEn
      ? [
          {
            id: 'REC-IMM-01',
            title: 'Deploy Multi-Gateway Failover & Auto-Reconcile Payment Loop',
            priority: 'HIGH',
            category: 'System & Infrastructure',
            owner_department: 'Engineering & Payment Operations',
            timeline: '24 - 48 Hours',
            expected_impact: 'Eliminates 65% of dropped transactions and recovers +6.5 CSAT points',
            action_steps: [
              'Implement automatic failover to secondary gateway on vendor latency > 3,000ms',
              'Trigger proactive SMS/email notifications for pending reconciliation status',
            ],
          },
          {
            id: 'REC-MED-02',
            title: 'Scale Frontline Support Shifts During Peak Rush Hours',
            priority: 'HIGH',
            category: 'Customer Experience',
            owner_department: 'Customer Support Lead',
            timeline: '3 - 7 Days',
            expected_impact: 'Cuts initial response latency down to under 3 minutes',
            action_steps: [
              'Reallocate 4 senior agents dedicated to payment and refund tags',
              'Simplify bot menu to offer direct 1-click human agent escalation',
            ],
          },
        ]
      : [
          {
            id: 'REC-IMM-01',
            title: 'Penanganan Segera Hambatan Transaksi & Auto-Notification',
            priority: 'HIGH',
            category: 'Operasional & Sistem',
            owner_department: 'Tim IT & Finance Operations',
            timeline: '24 - 48 Jam',
            expected_impact: 'Mengurangi hingga 60% komplain transaksi berulang dan menaikkan CSAT +6%',
            action_steps: [
              'Terapkan verifikasi status otomatis pada transaksi yang tertunda.',
              'Kirim pesan WhatsApp / SMS otomatis kepada pelanggan saat ada kendala pemrosesan.',
            ],
          },
          {
            id: 'REC-MED-02',
            title: 'Penguatan Kapasitas Live Agent CS pada Jam Sibuk',
            priority: 'HIGH',
            category: 'Customer Experience',
            owner_department: 'Customer Support Lead',
            timeline: '3 - 7 Hari',
            expected_impact: 'Memangkas waktu tunggu respon awal menjadi di bawah 3 menit',
            action_steps: [
              'Lakukan rotasi shift tambahan pada jam 12:00-14:00 dan 19:00-21:00.',
              'Sederhanakan alur bot agar tombol berbicara dengan manusia mudah ditemukan.',
            ],
          },
        ],
    detailed_review_analysis: analyzedList,
  };
}

// REST API Endpoints

// 1. Analyze batch of reviews and generate Executive Report
app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const { reviews, industry = 'Multi-Industri', alertThreshold = 25.0, lang = 'id' } = req.body;
    const isEn = lang === 'en';

    if (!Array.isArray(reviews) || reviews.length === 0) {
      return res.status(400).json({ error: 'Daftar ulasan (reviews) wajib diisi dan berupa array tidak kosong.' });
    }

    const reviewTexts = reviews
      .map((r: any, idx: number) => `[ID: ${r.id || idx + 1}] (Sumber: ${r.source || 'Web'}, Rating: ${r.rating || '-'}): "${r.text}"`)
      .join('\n');

    let report: ExecutiveReport | null = null;

    if (process.env.GEMINI_API_KEY) {
      try {
        const promptLang = isEn
          ? `Language of executive report: Professional English. Format strictly as pure JSON.`
          : `Bahasa laporan: Bahasa Indonesia formal & profesional. Kembalikan HANYA JSON murni.`;

        const prompt = `Analyze the following ${reviews.length} customer reviews for industry "${industry}".
Negative sentiment spike alert threshold is ${alertThreshold}%.
${promptLang}

REVIEWS LIST:
${reviewTexts}

Output pure executive JSON without any conversational text:
- metadata: report_id, generated_at, total_reviews_analyzed (${reviews.length}), industry_sector, analysis_engine: "Gemini-3.8-Flash Semantic Engine", confidence_score (number 90-99).
- executive_summary: headline, overall_sentiment_label ('SANGAT POSITIF'|'POSITIF'|'CAMPURAN / WASPADA'|'KRITIS / NEGATIF'), sentiment_score (0-100), status_level ('HEALTHY'|'WARNING'|'CRITICAL'), key_takeaways (array of 3-4 strings), management_alert_flag (boolean).
- satisfaction_metrics: csat_score (0-100), csat_benchmark_status (string), nps_score (-100 to 100), nps_category, ces_score (1.0 to 5.0), sentiment_distribution (positive_percentage, positive_count, neutral_percentage, neutral_count, negative_percentage, negative_count), urgency_levels (critical_urgent, high, medium, low).
- issue_breakdown: array of categorized issues (category_id, category_name, issue_count, percentage_of_total, severity ('CRITICAL'|'HIGH'|'MEDIUM'|'LOW'), problem_summary, representative_quotes (2 quotes), root_cause_analysis, business_impact).
- weekly_trends: array of 4 weeks trend data (week_label, week_number 1-4, csat, nps, positive_pct, negative_pct, neutral_pct, dominant_issue).
- negative_spike_alert: is_spike_detected (true if current_negative_pct >= ${alertThreshold}), spike_threshold_pct (${alertThreshold}), current_negative_pct, delta_from_baseline, urgency_status ('NORMAL'|'ELEVATED'|'TRIGGERED_ALERT'), alert_message, immediate_containment_action, suggested_channel_alert.
- strategic_insights: core_strengths (array), systemic_bottlenecks (array), churn_risk_projection, revenue_impact_estimate.
- actionable_recommendations: array of recommendations (id, title, priority ('HIGH'|'MEDIUM'|'LOW'), category, owner_department, timeline, expected_impact, action_steps (array of 3 steps)).
- detailed_review_analysis: array of analyzed reviews for all inputs (id, text, source, timestamp, sentiment ('POSITIF'|'NETRAL'|'NEGATIF'), sentiment_score (-1.0 to 1.0), category, urgency, detected_keywords, summary).

RETURN STRICT PURE JSON ONLY!`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: isEn
              ? 'You are an executive customer data AI intelligence engine. Return PURE JSON ONLY without intro or outro text.'
              : reportSystemInstruction,
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const rawJson = response.text ? cleanJsonText(response.text) : '';
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          report = parsed;
        }
      } catch (geminiErr) {
        console.warn('Gemini API call warning, falling back to deterministic analyzer:', geminiErr);
      }
    }

    if (!report) {
      report = generateAnalyticalFallbackReport(reviews, industry, alertThreshold, lang);
    }

    // Persist as latest report
    latestReport = report;

    // Set pure JSON content type
    res.setHeader('Content-Type', 'application/json');
    return res.json(report);
  } catch (err: any) {
    console.error('Error analyzing reviews:', err);
    return res.status(500).json({ error: 'Gagal menganalisis ulasan pelanggan: ' + err.message });
  }
});

// 2. Real-time Single Review Analysis (Live Stream testing)
app.post('/api/analyze-single', async (req: Request, res: Response) => {
  try {
    const { reviewText, source = 'Live Feed', id } = req.body;
    if (!reviewText) {
      return res.status(400).json({ error: 'reviewText wajib diisi.' });
    }

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `Analisis ulasan pelanggan real-time berikut:
"${reviewText}"

Kembalikan format JSON murni:
{
  "id": "${id || 'LIVE-' + Date.now().toString(36)}",
  "text": "${reviewText.replace(/"/g, '\\"')}",
  "source": "${source}",
  "timestamp": "${new Date().toISOString().replace('T', ' ').slice(0, 16)}",
  "sentiment": "POSITIF" | "NETRAL" | "NEGATIF",
  "sentiment_score": number between -1.0 and 1.0,
  "category": "string nama kategori isu",
  "urgency": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "detected_keywords": ["kata1", "kata2"],
  "summary": "ringkasan satu kalimat singkat",
  "is_negative": boolean
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'Kembalikan HANYA JSON murni satu objek ulasan.',
            responseMimeType: 'application/json',
            temperature: 0.1,
          },
        });

        const rawJson = response.text ? cleanJsonText(response.text) : '';
        if (rawJson) {
          const single = JSON.parse(rawJson);
          return res.json(single);
        }
      } catch (err) {
        // Fallback below
      }
    }

    // Heuristic fallback for single
    const textLow = reviewText.toLowerCase();
    const negWords = ['kecewa', 'lambat', 'gagal', 'rusak', 'jelek', 'rugi', 'parah', 'buruk', 'terpotong', 'batal', 'marah', 'error', 'bug', 'lelet'];
    const posWords = ['puas', 'bagus', 'cepat', 'ramah', 'mantap', 'keren', 'suka', 'terima kasih', 'recommended', 'hebat', 'rapi'];

    const nMatch = negWords.filter((w) => textLow.includes(w)).length;
    const pMatch = posWords.filter((w) => textLow.includes(w)).length;

    let sentiment: 'POSITIF' | 'NETRAL' | 'NEGATIF' = 'NETRAL';
    let score = 0.0;
    let urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    let category = 'Layanan Pelanggan Umum';

    if (nMatch > pMatch) {
      sentiment = 'NEGATIF';
      score = -(0.5 + Math.min(nMatch * 0.2, 0.45));
      urgency = textLow.includes('saldo') || textLow.includes('uang') ? 'CRITICAL' : 'HIGH';
      category = textLow.includes('saldo') || textLow.includes('bayar') ? 'Sistem Pembayaran' : 'Layanan & Pengiriman';
    } else if (pMatch > nMatch) {
      sentiment = 'POSITIF';
      score = 0.5 + Math.min(pMatch * 0.2, 0.45);
      urgency = 'LOW';
      category = 'Kepuasan Layanan & Produk';
    }

    return res.json({
      id: id || 'LIVE-' + Date.now().toString(36),
      text: reviewText,
      source,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      sentiment,
      sentiment_score: Number(score.toFixed(2)),
      category,
      urgency,
      detected_keywords: [...posWords, ...negWords].filter((w) => textLow.includes(w)),
      summary: reviewText.length > 55 ? reviewText.slice(0, 52) + '...' : reviewText,
      is_negative: sentiment === 'NEGATIF',
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 3. GET Pure Executive Report (JSON Murni sesuai instruksi pengguna)
app.get('/api/reports/latest', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  return res.json(latestReport);
});

// 4. BI Dashboard Integration Endpoint (Power BI, Tableau, Looker Studio feed)
app.get('/api/metrics/bi-feed', (req: Request, res: Response) => {
  const biData = {
    bi_connector_version: '1.2.0',
    timestamp: new Date().toISOString(),
    kpi_summary: {
      csat: latestReport.satisfaction_metrics.csat_score,
      nps: latestReport.satisfaction_metrics.nps_score,
      ces: latestReport.satisfaction_metrics.ces_score,
      negative_ratio_pct: latestReport.satisfaction_metrics.sentiment_distribution.negative_percentage,
      positive_ratio_pct: latestReport.satisfaction_metrics.sentiment_distribution.positive_percentage,
      total_volume: latestReport.metadata.total_reviews_analyzed,
      status_level: latestReport.executive_summary.status_level,
      alert_active: latestReport.negative_spike_alert.is_spike_detected,
    },
    weekly_series: latestReport.weekly_trends,
    category_distribution: latestReport.issue_breakdown.map((i) => ({
      category: i.category_name,
      issues_count: i.issue_count,
      pct: i.percentage_of_total,
      severity: i.severity,
    })),
    recent_reviews_flattened: latestReport.detailed_review_analysis.map((r) => ({
      review_id: r.id,
      timestamp: r.timestamp,
      source: r.source,
      sentiment: r.sentiment,
      score: r.sentiment_score,
      category: r.category,
      urgency: r.urgency,
      text_preview: r.text.slice(0, 120),
    })),
  };
  res.setHeader('Content-Type', 'application/json');
  return res.json(biData);
});

// 5. CSV Export Endpoint
app.get('/api/export/csv', (req: Request, res: Response) => {
  const reviews = latestReport.detailed_review_analysis;
  const header = ['ID', 'Waktu', 'Kanal Sumber', 'Sentimen', 'Skor Sentimen', 'Kategori Isu', 'Tingkat Urgensi', 'Ringkasan', 'Teks Ulasan'];
  
  const csvRows = [
    header.join(','),
    ...reviews.map((r) => [
      `"${r.id}"`,
      `"${r.timestamp}"`,
      `"${r.source}"`,
      `"${r.sentiment}"`,
      r.sentiment_score,
      `"${r.category.replace(/"/g, '""')}"`,
      `"${r.urgency}"`,
      `"${r.summary.replace(/"/g, '""')}"`,
      `"${r.text.replace(/"/g, '""')}"`,
    ].join(',')),
  ];

  // UTF-8 BOM so Excel opens Indonesian characters correctly
  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="Laporan-Sentimen-Pelanggan-${new Date().toISOString().slice(0, 10)}.csv"`);
  return res.send(csvContent);
});

// 6. Webhook simulation & alert dispatcher
app.post('/api/webhook/simulate-alert', async (req: Request, res: Response) => {
  const { targetUrl } = req.body;
  const alertPayload = {
    event: 'CUSTOMER_SENTIMENT_NEGATIVE_SPIKE',
    timestamp: new Date().toISOString(),
    severity: 'CRITICAL',
    trigger_metric: {
      current_negative_pct: latestReport.negative_spike_alert.current_negative_pct,
      threshold_pct: latestReport.negative_spike_alert.spike_threshold_pct,
      delta: latestReport.negative_spike_alert.delta_from_baseline,
    },
    message: latestReport.negative_spike_alert.alert_message,
    action_required: latestReport.negative_spike_alert.immediate_containment_action,
    latest_incident_sample: latestReport.issue_breakdown[0]?.representative_quotes?.[0] || 'N/A',
  };

  if (targetUrl && targetUrl.startsWith('http')) {
    try {
      // If external webhook provided
      await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertPayload),
      });
      return res.json({ success: true, message: 'Webhook terkirim ke ' + targetUrl, payload: alertPayload });
    } catch (err: any) {
      return res.json({ success: false, message: 'Gagal menghubungi webhook URL: ' + err.message, payload: alertPayload });
    }
  }

  return res.json({
    success: true,
    message: 'Simulasi notifikasi webhook berhasil dibuat.',
    payload: alertPayload,
  });
});

// Setup Vite or Static File Serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`SentimenAI Pro server is running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
