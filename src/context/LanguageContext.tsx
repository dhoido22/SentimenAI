import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'id' | 'en';

export interface Translations {
  appName: string;
  appBadge: string;
  appSubtitle: string;
  spikeAlertBadge: string;
  selectScenario: string;
  exportCsv: string;
  exportPdf: string;
  analyzeNew: string;
  tabExecutive: string;
  tabIssues: string;
  tabTrends: string;
  tabRecommendations: string;
  tabRealtime: string;
  tabPureJson: string;
  tabApiBi: string;

  // Negative Spike Banner
  controlledStatus: string;
  controlledDesc: (current: number, threshold: number) => string;
  normalOperation: string;
  criticalAlert: string;
  spikeDetectedTitle: (current: number, threshold: number) => string;
  deltaLabel: string;
  immediateAction: string;
  testSound: string;
  sopContainment: string;
  sendWebhookBtn: string;
  webhookSentSuccess: string;
  sendingWebhook: string;

  // Executive Summary Tab
  reportIdLabel: string;
  statusLabel: string;
  sentimentIndex: string;
  csatTitle: string;
  csatSub: string;
  npsTitle: string;
  npsSub: string;
  npsCategory: string;
  cesTitle: string;
  cesSub: string;
  totalReviewsTitle: string;
  reviewsProcessed: string;
  modelAccuracy: string;
  engineLabel: string;
  sentimentDistributionTitle: string;
  positiveLabel: string;
  neutralLabel: string;
  negativeLabel: string;
  reviewsCountUnit: string;
  urgencyMatrixTitle: string;
  criticalUrgent: string;
  highUrgent: string;
  mediumUrgent: string;
  lowUrgent: string;
  actionRequiredImmediate: string;
  highPriorityLabel: string;
  mediumLabel: string;
  lowLabel: string;
  totalCategorizedIssues: string;
  clustersCount: string;
  viewIssueDetails: string;
  solutionRecommendations: string;
  coreStrengthsTitle: string;
  churnProjectionTitle: string;
  churnProjectionSub: string;
  revenueImpactSub: string;

  // Issue Breakdown Tab
  issuesTabTitle: string;
  issuesTabSubtitle: string;
  searchPlaceholder: string;
  filterAll: string;
  severityLevel: string;
  reviewsTotalPct: (count: number, pct: number) => string;
  problemSummaryTitle: string;
  rootCauseTitle: string;
  businessImpactTitle: string;
  customerQuotesTitle: string;
  filterThisCategory: string;
  closeFilter: string;
  relatedReviewsTitle: string;
  noReviewsCategory: string;

  // Weekly Trends Tab
  weeklyTrendsTitle: string;
  weeklyTrendsSubtitle: string;
  legendCsat: string;
  legendNps: string;
  weekLabelShort: (w: number) => string;
  dominantIssueTitle: string;
  strategicInsightsTitle: string;
  pillarsToMaintain: string;
  systemicBottlenecks: string;

  // Actionable Recommendations Tab
  recommendationsTitle: string;
  recommendationsSubtitle: string;
  priorityPrefix: string;
  ownerLabel: string;
  timelineLabel: string;
  expectedImpactLabel: string;
  tacticalStepsTitle: string;

  // Real-time Stream Tab
  realtimeTitle: string;
  realtimeSubtitle: string;
  pauseStream: string;
  startStream: string;
  speedLabel: string;
  alarmOn: string;
  alarmOff: string;
  clearBuffer: string;
  liveNegRate: string;
  livePosRate: string;
  liveBufferCount: string;
  alarmThresholdTitle: string;
  streamingRunning: string;
  streamingPaused: string;
  spikeActiveWarning: (t: number) => string;
  safeWithinTolerance: (t: number) => string;
  manualInputPlaceholder: string;
  instantAnalyzeBtn: string;
  incomingFeedTitle: string;
  queueCount: (n: number) => string;
  emptyLiveQueue: string;
  urgencyLabel: string;

  // Pure JSON Tab
  pureJsonTitle: string;
  noIntroTextBadge: string;
  pureJsonSubtitle: string;
  copyJsonBtn: string;
  copiedSuccess: string;
  downloadJsonBtn: string;
  schemaValidStatus: string;
  openRawApi: string;

  // BI Hub Tab
  biHubTitle: string;
  biHubSubtitle: string;
  webhookDispatcherTitle: string;
  webhookDispatcherSubtitle: string;
  webhookInputPlaceholder: string;
  testWebhookBtn: string;
  curlCopied: string;
  copyCurl: string;
  testThisEndpoint: string;
  biGuideTitle: string;

  // Analysis Modal
  modalTitle: string;
  modalSubtitle: string;
  selectIndustryPreset: string;
  pasteCustomText: string;
  presetScenarioLabel: string;
  reviewsReady: (n: number) => string;
  pasteLabel: string;
  pastePlaceholder: string;
  industrySectorLabel: string;
  spikeThresholdLabel: string;
  cancelBtn: string;
  runGeminiBtn: string;
  analyzingProgress: string;

  // SOP Modal
  sopTitle: string;
  sopSubtitle: string;
  crisisTrigger: string;
  connectedChannels: string;
  containmentProtocolTitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step3Title: string;
  step3Desc: string;
  closeSopBtn: string;

  // Print Executive Document
  backToDashboard: string;
  printPreviewNotice: string;
  printSavePdfBtn: string;
  officialDocHeader: string;
  officialDocTitle: string;
  officialDocSubtitle: string;
  docNoLabel: string;
  printDateLabel: string;
  industryLabel: string;
  sampleCountLabel: (n: number) => string;
  executiveHeadlineTitle: string;
  tableIssuesTitle: string;
  tableCategoryCol: string;
  tableUrgencyCol: string;
  tableCountCol: string;
  tableRootCauseCol: string;
  tableBusinessImpactCol: string;
  tableTrendsTitle: string;
  tableWeekCol: string;
  tableCsatCol: string;
  tableNpsCol: string;
  tablePosCol: string;
  tableNegCol: string;
  tableDominantCol: string;
  tableRecommendationsTitle: string;
  picLabel: string;
  impactPrefix: string;
  sigPreparedBy: string;
  sigOperational: string;
  sigManagement: string;
  sigRoleAi: string;
  sigRoleOps: string;
  sigRoleVp: string;
}

export const translations: Record<Language, Translations> = {
  id: {
    appName: 'SentimenAI',
    appBadge: 'Enterprise BI',
    appSubtitle: 'Sistem Analisis Ulasan & Intelijen Pelanggan Eksekutif',
    spikeAlertBadge: 'Peringatan Lonjakan',
    selectScenario: 'Pilih Skenario Data...',
    exportCsv: 'Ekspor CSV',
    exportPdf: 'Ekspor PDF',
    analyzeNew: 'Analisis Ulasan Baru',
    tabExecutive: 'Ringkasan Eksekutif & KPI',
    tabIssues: 'Kategori Isu & Masalah',
    tabTrends: 'Tren Mingguan & Wawasan',
    tabRecommendations: 'Rekomendasi Tindakan',
    tabRealtime: 'Real-Time Stream Feed',
    tabPureJson: 'JSON Murni (Schema)',
    tabApiBi: 'Integrasi API & BI Hub',

    controlledStatus: 'Status Sentimen Terkendali:',
    controlledDesc: (current, threshold) =>
      `Rasio negatif saat ini (${current}%) berada di bawah batas toleransi (${threshold}%).`,
    normalOperation: 'Operasi Normal',
    criticalAlert: 'PERINGATAN KRITIS',
    spikeDetectedTitle: (current, threshold) =>
      `Lonjakan Sentimen Negatif Melampaui Batas Toleransi (${current}% vs Batas ${threshold}%)`,
    deltaLabel: 'Kenaikan:',
    immediateAction: 'Tindakan Segera:',
    testSound: 'Tes Suara',
    sopContainment: 'SOP Penahanan Cepat',
    sendWebhookBtn: 'Kirim Alert ke BI/Slack',
    webhookSentSuccess: 'Alert Webhook Terkirim!',
    sendingWebhook: 'Mengirim...',

    reportIdLabel: 'Laporan Eksekutif',
    statusLabel: 'Status:',
    sentimentIndex: 'Indeks Sentimen',
    csatTitle: 'Skor CSAT',
    csatSub: 'Kepuasan Pelanggan',
    npsTitle: 'Net Promoter Score (NPS)',
    npsSub: 'skala -100 s/d +100',
    npsCategory: 'Kategori:',
    cesTitle: 'Customer Effort Score (CES)',
    cesSub: '/ 5.0 (Usaha Pelanggan)',
    totalReviewsTitle: 'Total Sampel Ulasan',
    reviewsProcessed: 'ulasan diproses',
    modelAccuracy: 'Akurasi Model:',
    engineLabel: 'Mesin:',
    sentimentDistributionTitle: 'Distribusi Sentimen Umpan Balik',
    positiveLabel: 'Positif',
    neutralLabel: 'Netral',
    negativeLabel: 'Negatif',
    reviewsCountUnit: 'Ulasan',
    urgencyMatrixTitle: 'Matriks Tingkat Urgensi Masalah',
    criticalUrgent: 'Critical',
    highUrgent: 'High',
    mediumUrgent: 'Medium',
    lowUrgent: 'Low',
    actionRequiredImmediate: 'Tindakan Segera',
    highPriorityLabel: 'Prioritas Tinggi',
    mediumLabel: 'Sedang',
    lowLabel: 'Rendah / Positif',
    totalCategorizedIssues: 'Total Isu Terkategori:',
    clustersCount: 'Kluster Masalah',
    viewIssueDetails: 'Lihat Rincian Isu',
    solutionRecommendations: 'Rekomendasi Solusi',
    coreStrengthsTitle: 'Kekuatan Utama yang Diapresiasi Pelanggan',
    churnProjectionTitle: 'Proyeksi Risiko Churn & Estimasi Pendapatan',
    churnProjectionSub: 'Proyeksi Churn Pelanggan',
    revenueImpactSub: 'Estimasi Dampak Pendapatan / GMV',

    issuesTabTitle: 'Kategorisasi Isu & Ringkasan Masalah Pelanggan',
    issuesTabSubtitle:
      'Pengelompokan keluhan berbasis AI Semantik lengkap dengan analisis akar masalah dan dampak bisnis.',
    searchPlaceholder: 'Cari kategori / masalah...',
    filterAll: 'SEMUA',
    severityLevel: 'Tingkat',
    reviewsTotalPct: (count, pct) => `${count} Ulasan (${pct}% dari total)`,
    problemSummaryTitle: 'Ringkasan Masalah Eksekutif',
    rootCauseTitle: 'Akar Masalah (Root Cause)',
    businessImpactTitle: 'Dampak Bisnis',
    customerQuotesTitle: 'Kutipan Langsung Pelanggan:',
    filterThisCategory: 'Filter Ulasan Kategori Ini',
    closeFilter: 'Tutup Filter',
    relatedReviewsTitle: 'Daftar Ulasan Terkait:',
    noReviewsCategory: 'Tidak ada ulasan individual spesifik yang terindeks langsung untuk kategori ini dalam sampel detail.',

    weeklyTrendsTitle: 'Tren Mingguan Kepuasan & Dinamika Sentimen',
    weeklyTrendsSubtitle:
      'Lintasan performa 4 minggu terakhir untuk evaluasi efektivitas pembaruan produk dan stabilitas operasional.',
    legendCsat: 'Garis Hijau: CSAT (%)',
    legendNps: 'Garis Biru: NPS (Skala)',
    weekLabelShort: (w) => `Minggu ${w}`,
    dominantIssueTitle: 'Isu Paling Dominan:',
    strategicInsightsTitle: 'Wawasan Strategis Bagi Manajemen untuk Peningkatan Kualitas Layanan',
    pillarsToMaintain: 'Pilar Keunggulan Layanan yang Perlu Dipertahankan',
    systemicBottlenecks: 'Hambatan Sistemik (Systemic Bottlenecks)',

    recommendationsTitle: 'Rekomendasi Tindakan Perbaikan Cepat (Actionable Roadmap)',
    recommendationsSubtitle:
      'Daftar inisiatif prioritas dengan penanggung jawab departemen, timeline ketat, dan estimasi dampak terukur.',
    priorityPrefix: 'Prioritas',
    ownerLabel: 'PIC Departemen',
    timelineLabel: 'Batas Waktu',
    expectedImpactLabel: 'Estimasi Dampak (Expected Impact):',
    tacticalStepsTitle: 'Langkah Taktis Implementasi:',

    realtimeTitle: 'Analisis Sentimen Umpan Balik Pengguna Secara Real-Time',
    realtimeSubtitle:
      'Pemrosesan ulasan masuk secara langsung per detik dengan detektor lonjakan sentimen negatif otomatis.',
    pauseStream: 'Jeda Stream',
    startStream: 'Mulai Stream Live',
    speedLabel: 'Kecepatan:',
    alarmOn: 'Alarm ON',
    alarmOff: 'Alarm OFF',
    clearBuffer: 'Bersihkan Buffer',
    liveNegRate: 'Rasio Negatif Live',
    livePosRate: 'Rasio Positif Live',
    liveBufferCount: 'Buffer Ulasan Teranalisis',
    alarmThresholdTitle: 'Batas Ambang Alarm',
    streamingRunning: 'Streaming Berjalan',
    streamingPaused: 'Dijeda',
    spikeActiveWarning: (t) => `⚠️ LONJAKAN AKTIF (Batas: ${t}%)`,
    safeWithinTolerance: (t) => `✓ Dalam Batas Aman (${t}%)`,
    manualInputPlaceholder:
      "Ketik ulasan pelanggan secara langsung untuk diuji (contoh: 'Barang cepat sampai tapi CS susah dihubungi')...",
    instantAnalyzeBtn: 'Analisis Instan',
    incomingFeedTitle: 'Feed Ulasan Masuk Real-Time (Urutan Terkini):',
    queueCount: (n) => `${n} item di antrean`,
    emptyLiveQueue: "Antrean ulasan kosong. Aktifkan 'Mulai Stream Live' atau kirim ulasan manual di atas.",
    urgencyLabel: 'Urgensi:',

    pureJsonTitle: 'Laporan Eksekutif Berformat JSON Murni Sesuai Skema',
    noIntroTextBadge: 'Tanpa Teks Pengantar',
    pureJsonSubtitle:
      'Sesuai instruksi khusus: JSON murni valid untuk integrasi otomatis ke database eksekutif & BI pipeline.',
    copyJsonBtn: 'Salin JSON Murni',
    copiedSuccess: 'Tersalin ke Clipboard!',
    downloadJsonBtn: 'Unduh File .json',
    schemaValidStatus: 'Status Skema: 100% Valid & Memenuhi Standar JSON Eksekutif',
    openRawApi: 'Buka Langsung Raw Endpoint API',

    biHubTitle: 'Integrasi API ke Dasbor Analitik Bisnis (BI Dashboard Hub)',
    biHubSubtitle:
      'Hubungkan pipeline analitik SentimenAI Pro secara langsung ke Microsoft Power BI, Tableau, Looker Studio, atau sistem ERP internal.',
    webhookDispatcherTitle: 'Notifikasi Otomatis Lonjakan Sentimen Negatif (Webhook Alert Dispatcher)',
    webhookDispatcherSubtitle:
      'Kirimkan peringatan instan secara otomatis ke channel Slack Incident, Microsoft Teams, Discord, atau PagerDuty saat rasio sentimen negatif melewati batas ambang toleransi.',
    webhookInputPlaceholder: 'Masukkan URL Webhook (Slack, Discord, atau ERP Endpoint)...',
    testWebhookBtn: 'Uji Kirim Webhook Alert',
    curlCopied: 'cURL Tersalin',
    copyCurl: 'Salin cURL',
    testThisEndpoint: 'Uji Endpoint Ini',
    biGuideTitle: 'Panduan Koneksi ke Platform Business Intelligence Populer',

    modalTitle: 'Analisis Ulasan Baru & Buat Laporan Eksekutif',
    modalSubtitle: 'Pilih dataset realistis multi-industri atau tempelkan ulasan Anda sendiri.',
    selectIndustryPreset: 'Pilih Skenario Dataset Industri',
    pasteCustomText: 'Tempel Ulasan Kustom (Teks Bebas)',
    presetScenarioLabel: 'Skenario Ulasan Industri:',
    reviewsReady: (n) => `${n} ulasan siap dianalisis`,
    pasteLabel: 'Tempelkan Ulasan Pelanggan (1 ulasan per baris):',
    pastePlaceholder:
      'Contoh:\nSaldo terpotong saat pembayaran QRIS tapi pesanan batal!\nKurir sameday sangat ramah dan cepat sampai.\nRespon CS lambat sekali, chat bot tidak membantu.',
    industrySectorLabel: 'Sektor Industri:',
    spikeThresholdLabel: 'Batas Toleransi Lonjakan Negatif:',
    cancelBtn: 'Batal',
    runGeminiBtn: 'Jalankan Analisis Gemini AI',
    analyzingProgress: 'Menganalisis...',

    sopTitle: 'SOP Penahanan Cepat Insiden Lonjakan Sentimen Negatif',
    sopSubtitle: 'Prosedur Operasional Standar (Incident Containment Protocol)',
    crisisTrigger: 'Pemicu Krisis:',
    connectedChannels: 'Kanal Notifikasi Terkoneksi:',
    containmentProtocolTitle: 'Langkah Penanganan Darurat 0 - 60 Menit:',
    step1Title: 'Aktivasi Satgas Tanggap Darurat & Komunikasi Internal',
    step1Desc: 'Adakan standup kilat 15 menit antara Tech Lead, Head of Operations, dan CS Manager.',
    step2Title: 'Tindakan Penahanan Teknis (Containment)',
    step3Title: 'Pengumuman Proaktif ke Pengguna Terdampak',
    step3Desc: 'Pasang in-app announcement banner agar pelanggan tidak merasa diabaikan atau mengajukan ulasan bintang 1 massal.',
    closeSopBtn: 'Tutup SOP',

    backToDashboard: 'Kembali ke Dasbor',
    printPreviewNotice: 'Pratinjau Cetak / Ekspor PDF Dokumen Eksekutif',
    printSavePdfBtn: 'Cetak / Simpan ke PDF Sekarang',
    officialDocHeader: 'SENTIMENAI PRO • ENTERPRISE CUSTOMER INTELLIGENCE',
    officialDocTitle: 'LAPORAN EKSEKUTIF ANALISIS DATA PELANGGAN',
    officialDocSubtitle:
      'Evaluasi Metrik Kepuasan, Analisis Sentimen, Kategorisasi Isu & Rekomendasi Tindakan Strategis',
    docNoLabel: 'No. Dokumen:',
    printDateLabel: 'Tanggal Cetak:',
    industryLabel: 'Industri:',
    sampleCountLabel: (n) => `${n} ulasan pelanggan`,
    executiveHeadlineTitle: 'Ringkasan Manajemen (Executive Headline)',
    tableIssuesTitle: '1. Tabel Kategorisasi Isu & Analisis Akar Masalah',
    tableCategoryCol: 'Kategori Masalah',
    tableUrgencyCol: 'Urgensi',
    tableCountCol: 'Jumlah & %',
    tableRootCauseCol: 'Akar Masalah (Root Cause)',
    tableBusinessImpactCol: 'Dampak Bisnis',
    tableTrendsTitle: '2. Tren Pergerakan Metrik Mingguan (4 Minggu Terakhir)',
    tableWeekCol: 'Periode Minggu',
    tableCsatCol: 'CSAT (%)',
    tableNpsCol: 'NPS',
    tablePosCol: 'Positif %',
    tableNegCol: 'Negatif %',
    tableDominantCol: 'Isu Utama Mingguan',
    tableRecommendationsTitle: '3. Rekomendasi Tindakan Perbaikan Segera',
    picLabel: 'PIC',
    impactPrefix: 'Dampak:',
    sigPreparedBy: '(Disiapkan oleh AI Engine)',
    sigOperational: '(Tanda Tangan Operasional)',
    sigManagement: '(Pengesahan Manajemen)',
    sigRoleAi: 'SentimenAI Analytic Engine',
    sigRoleOps: 'Head of Customer Operations',
    sigRoleVp: 'VP of Product & Quality',
  },

  en: {
    appName: 'SentimenAI',
    appBadge: 'Enterprise BI',
    appSubtitle: 'Executive Customer Data Intelligence & Sentiment Analytics',
    spikeAlertBadge: 'Spike Alert',
    selectScenario: 'Select Data Scenario...',
    exportCsv: 'Export CSV',
    exportPdf: 'Export PDF',
    analyzeNew: 'Analyze New Reviews',
    tabExecutive: 'Executive Summary & KPIs',
    tabIssues: 'Issue Categories & Problems',
    tabTrends: 'Weekly Trends & Insights',
    tabRecommendations: 'Actionable Recommendations',
    tabRealtime: 'Real-Time Stream Feed',
    tabPureJson: 'Pure JSON (Schema)',
    tabApiBi: 'API Integration & BI Hub',

    controlledStatus: 'Sentiment Status Controlled:',
    controlledDesc: (current, threshold) =>
      `Current negative ratio (${current}%) is below the alert threshold (${threshold}%).`,
    normalOperation: 'Normal Operation',
    criticalAlert: 'CRITICAL ALERT',
    spikeDetectedTitle: (current, threshold) =>
      `Negative Sentiment Spike Exceeded Threshold (${current}% vs Tolerance ${threshold}%)`,
    deltaLabel: 'Delta:',
    immediateAction: 'Immediate Action:',
    testSound: 'Test Chime',
    sopContainment: 'Rapid Containment SOP',
    sendWebhookBtn: 'Dispatch Alert to BI/Slack',
    webhookSentSuccess: 'Webhook Alert Dispatched!',
    sendingWebhook: 'Dispatching...',

    reportIdLabel: 'Executive Report',
    statusLabel: 'Status:',
    sentimentIndex: 'Sentiment Index',
    csatTitle: 'CSAT Score',
    csatSub: 'Customer Satisfaction',
    npsTitle: 'Net Promoter Score (NPS)',
    npsSub: 'scale -100 to +100',
    npsCategory: 'Category:',
    cesTitle: 'Customer Effort Score (CES)',
    cesSub: '/ 5.0 (Effort Friction)',
    totalReviewsTitle: 'Total Review Sample',
    reviewsProcessed: 'reviews analyzed',
    modelAccuracy: 'Model Confidence:',
    engineLabel: 'Engine:',
    sentimentDistributionTitle: 'Customer Feedback Sentiment Distribution',
    positiveLabel: 'Positive',
    neutralLabel: 'Neutral',
    negativeLabel: 'Negative',
    reviewsCountUnit: 'Reviews',
    urgencyMatrixTitle: 'Issue Severity & Urgency Matrix',
    criticalUrgent: 'Critical',
    highUrgent: 'High',
    mediumUrgent: 'Medium',
    lowUrgent: 'Low',
    actionRequiredImmediate: 'Immediate Action',
    highPriorityLabel: 'High Priority',
    mediumLabel: 'Moderate',
    lowLabel: 'Low / Positive',
    totalCategorizedIssues: 'Total Categorized Issues:',
    clustersCount: 'Problem Clusters',
    viewIssueDetails: 'View Issue Breakdown',
    solutionRecommendations: 'View Solutions',
    coreStrengthsTitle: 'Core Strengths Appreciated by Customers',
    churnProjectionTitle: 'Projected Churn Risk & Revenue Impact',
    churnProjectionSub: 'Customer Churn Projection',
    revenueImpactSub: 'Estimated Revenue / GMV Risk',

    issuesTabTitle: 'Issue Categorization & Problem Summaries',
    issuesTabSubtitle:
      'AI-driven semantic clustering of user complaints complete with root-cause analysis and business impact.',
    searchPlaceholder: 'Search categories / issues...',
    filterAll: 'ALL',
    severityLevel: 'Severity',
    reviewsTotalPct: (count, pct) => `${count} Reviews (${pct}% of total)`,
    problemSummaryTitle: 'Executive Problem Summary',
    rootCauseTitle: 'Systemic Root Cause',
    businessImpactTitle: 'Business Impact',
    customerQuotesTitle: 'Representative Customer Quotes:',
    filterThisCategory: 'Filter Reviews for this Category',
    closeFilter: 'Close Filter',
    relatedReviewsTitle: 'Associated Reviews:',
    noReviewsCategory: 'No specific individual reviews matched this category in the current sample.',

    weeklyTrendsTitle: 'Weekly Satisfaction Trends & Sentiment Dynamics',
    weeklyTrendsSubtitle:
      '4-week trajectory tracking to evaluate the effectiveness of product rollouts and operational stability.',
    legendCsat: 'Green Line: CSAT (%)',
    legendNps: 'Blue Line: NPS (Score)',
    weekLabelShort: (w) => `Week ${w}`,
    dominantIssueTitle: 'Dominant Issue:',
    strategicInsightsTitle: 'Strategic Insights for Management to Enhance Service Quality',
    pillarsToMaintain: 'Service Excellence Pillars to Preserve',
    systemicBottlenecks: 'Systemic Bottlenecks',

    recommendationsTitle: 'Actionable Improvement Roadmap',
    recommendationsSubtitle:
      'Prioritized initiatives with department owners, strict SLA timelines, and measurable impact projections.',
    priorityPrefix: 'Priority',
    ownerLabel: 'PIC Department',
    timelineLabel: 'Timeline',
    expectedImpactLabel: 'Expected Business Impact:',
    tacticalStepsTitle: 'Tactical Implementation Steps:',

    realtimeTitle: 'Real-Time User Feedback Sentiment Analysis',
    realtimeSubtitle:
      'Per-second real-time review processing equipped with an automated negative sentiment spike detector.',
    pauseStream: 'Pause Stream',
    startStream: 'Start Live Stream',
    speedLabel: 'Speed:',
    alarmOn: 'Alarm ON',
    alarmOff: 'Alarm OFF',
    clearBuffer: 'Clear Buffer',
    liveNegRate: 'Live Negative Rate',
    livePosRate: 'Live Positive Rate',
    liveBufferCount: 'Analyzed Review Buffer',
    alarmThresholdTitle: 'Alarm Threshold',
    streamingRunning: 'Stream Active',
    streamingPaused: 'Paused',
    spikeActiveWarning: (t) => `⚠️ SPIKE TRIGGERED (Limit: ${t}%)`,
    safeWithinTolerance: (t) => `✓ Within Safe Range (${t}%)`,
    manualInputPlaceholder:
      "Type a live customer review to test (e.g., 'Fast delivery but the CS chatbot is unresponsive')...",
    instantAnalyzeBtn: 'Analyze Instantly',
    incomingFeedTitle: 'Incoming Real-Time Review Feed (Latest First):',
    queueCount: (n) => `${n} items in buffer`,
    emptyLiveQueue: "Buffer is empty. Click 'Start Live Stream' or submit a review above.",
    urgencyLabel: 'Urgency:',

    pureJsonTitle: 'Pure JSON Executive Report (Strict Schema Compliant)',
    noIntroTextBadge: 'Zero Intro Text',
    pureJsonSubtitle:
      'Strict executive schema: Pure valid JSON without conversational wrapper text, ready for BI pipelines.',
    copyJsonBtn: 'Copy Pure JSON',
    copiedSuccess: 'Copied to Clipboard!',
    downloadJsonBtn: 'Download .json File',
    schemaValidStatus: 'Schema Validation: 100% Compliant with Executive Standard',
    openRawApi: 'Open Direct Raw API Endpoint',

    biHubTitle: 'BI Dashboard API Integration Hub',
    biHubSubtitle:
      'Connect SentimenAI Pro analytics directly into Microsoft Power BI, Tableau, Looker Studio, or internal ERP.',
    webhookDispatcherTitle: 'Negative Sentiment Spike Webhook Alert Dispatcher',
    webhookDispatcherSubtitle:
      'Automatically dispatch urgent webhook alerts to Slack Incident channels, Microsoft Teams, Discord, or PagerDuty when negative ratios surpass thresholds.',
    webhookInputPlaceholder: 'Enter Webhook URL (Slack, Discord, or ERP Endpoint)...',
    testWebhookBtn: 'Test Dispatch Webhook Alert',
    curlCopied: 'cURL Copied',
    copyCurl: 'Copy cURL',
    testThisEndpoint: 'Test This Endpoint',
    biGuideTitle: 'Popular Business Intelligence Connector Guidelines',

    modalTitle: 'Analyze New Reviews & Generate Executive Report',
    modalSubtitle: 'Select a realistic multi-industry scenario or paste your own raw reviews.',
    selectIndustryPreset: 'Select Industry Dataset Scenario',
    pasteCustomText: 'Paste Custom Reviews (Free Text)',
    presetScenarioLabel: 'Industry Review Scenarios:',
    reviewsReady: (n) => `${n} reviews ready for analysis`,
    pasteLabel: 'Paste Customer Reviews (1 review per line):',
    pastePlaceholder:
      'Example:\nCharged on my credit card but the booking was cancelled!\nSame-day courier was extremely polite and careful.\nCustomer support took 45 minutes to respond.',
    industrySectorLabel: 'Industry Sector:',
    spikeThresholdLabel: 'Negative Spike Tolerance Threshold:',
    cancelBtn: 'Cancel',
    runGeminiBtn: 'Run Gemini AI Analysis',
    analyzingProgress: 'Analyzing...',

    sopTitle: 'Standard Operating Procedure: Rapid Containment Protocol',
    sopSubtitle: 'Emergency Incident Containment SOP for Negative Sentiment Surges',
    crisisTrigger: 'Crisis Trigger:',
    connectedChannels: 'Connected Notification Channels:',
    containmentProtocolTitle: '0 - 60 Minutes Emergency Action Steps:',
    step1Title: 'Emergency Taskforce Activation & Internal Sync',
    step1Desc: 'Conduct a 15-minute rapid standup between Tech Lead, Head of Operations, and CS Manager.',
    step2Title: 'Technical Containment Action',
    step3Title: 'Proactive Customer Transparency Notice',
    step3Desc: 'Deploy in-app transparency announcements so affected users avoid bulk 1-star reviews.',
    closeSopBtn: 'Close SOP',

    backToDashboard: 'Back to Dashboard',
    printPreviewNotice: 'Executive Document Print / Export PDF Preview',
    printSavePdfBtn: 'Print / Save to PDF Now',
    officialDocHeader: 'SENTIMENAI PRO • ENTERPRISE CUSTOMER INTELLIGENCE',
    officialDocTitle: 'EXECUTIVE CUSTOMER DATA ANALYSIS REPORT',
    officialDocSubtitle:
      'Satisfaction Metrics Evaluation, Sentiment Analytics, Issue Categorization & Strategic Action Roadmap',
    docNoLabel: 'Doc ID:',
    printDateLabel: 'Issue Date:',
    industryLabel: 'Industry:',
    sampleCountLabel: (n) => `${n} customer reviews`,
    executiveHeadlineTitle: 'Executive Headline & Core Summary',
    tableIssuesTitle: '1. Issue Categorization & Root Cause Analysis Table',
    tableCategoryCol: 'Issue Category',
    tableUrgencyCol: 'Severity',
    tableCountCol: 'Volume & %',
    tableRootCauseCol: 'Systemic Root Cause',
    tableBusinessImpactCol: 'Business Impact',
    tableTrendsTitle: '2. 4-Week Satisfaction & Sentiment Trends Table',
    tableWeekCol: 'Period',
    tableCsatCol: 'CSAT (%)',
    tableNpsCol: 'NPS',
    tablePosCol: 'Positive %',
    tableNegCol: 'Negative %',
    tableDominantCol: 'Primary Issue',
    tableRecommendationsTitle: '3. Immediate Actionable Improvement Roadmap',
    picLabel: 'Owner',
    impactPrefix: 'Impact:',
    sigPreparedBy: '(Prepared by AI Engine)',
    sigOperational: '(Operations Verification)',
    sigManagement: '(Executive Approval)',
    sigRoleAi: 'SentimenAI Analytic Engine',
    sigRoleOps: 'Head of Customer Operations',
    sigRoleVp: 'VP of Product & Quality',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'id',
  setLanguage: () => {},
  t: translations.id,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('id');

  useEffect(() => {
    const saved = localStorage.getItem('sentimenai_lang') as Language;
    if (saved === 'id' || saved === 'en') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sentimenai_lang', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
