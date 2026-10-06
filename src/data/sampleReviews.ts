export interface PresetDataset {
  id: string;
  nameId: string;
  nameEn: string;
  industryId: string;
  industryEn: string;
  descriptionId: string;
  descriptionEn: string;
  reviews: Array<{
    id: string;
    text: string;
    source: string;
    timestamp: string;
    rating?: number;
    customerName?: string;
  }>;
}

export const PRESET_DATASETS: PresetDataset[] = [
  {
    id: 'ecommerce_logistics',
    nameId: 'E-Commerce Retail & Pembayaran (Krisis Flash Sale)',
    nameEn: 'E-Commerce Retail & Payment (Flash Sale Crisis)',
    industryId: 'E-Commerce & Digital Retail',
    industryEn: 'E-Commerce & Digital Retail',
    descriptionId: 'Skenario lonjakan komplain pembayaran gateway dan keterlambatan sortir logistik pasca promo tanggal kembar.',
    descriptionEn: 'Surge in payment gateway failures and logistics sorting delays following double-day mega sales.',
    reviews: [
      {
        id: 'REV-001',
        text: 'Saldo dompet digital sudah terpotong Rp 350.000 tapi di aplikasi status masih menunggu pembayaran! CS lambat banget balas.',
        source: 'Google Play Store',
        timestamp: '2026-10-05 14:22',
        rating: 1,
        customerName: 'Budi Santoso',
      },
      {
        id: 'REV-002',
        text: 'Kurir sameday ramah sekali, paket dibungkus bubble wrap tebal dan rapi. Puas banget belanja disini!',
        source: 'Aplikasi (In-App Review)',
        timestamp: '2026-10-05 15:10',
        rating: 5,
        customerName: 'Siti Rahma',
      },
      {
        id: 'REV-003',
        text: 'Resi tidak bergerak selama 3 hari di sorting center Cakung. Padahal barang penting untuk acara besok lusa.',
        source: 'Twitter / X',
        timestamp: '2026-10-05 16:45',
        rating: 1,
        customerName: 'Denny Pratama',
      },
      {
        id: 'REV-004',
        text: 'Tampilan aplikasi baru jauh lebih segar dan gampang cari promo mingguan. Tingkatkan terus ya!',
        source: 'Apple App Store',
        timestamp: '2026-10-05 17:02',
        rating: 5,
        customerName: 'Amanda Putri',
      },
      {
        id: 'REV-005',
        text: 'Mau komplain ke CS bot muter-muter disuruh baca FAQ. Butuh agen manusia tolong dibenahi sistemnya.',
        source: 'Helpdesk Ticket',
        timestamp: '2026-10-05 18:30',
        rating: 2,
        customerName: 'Reza Fahlevi',
      },
      {
        id: 'REV-006',
        text: 'Gagal bayar QRIS berkali-kali waktu checkout jam 8 malam. Akhirnya kupon diskon 50% saya hangus!',
        source: 'Google Play Store',
        timestamp: '2026-10-05 20:12',
        rating: 1,
        customerName: 'Ferry Gunawan',
      },
      {
        id: 'REV-007',
        text: 'Produk original sesuai deskripsi, packing kayu sangat aman. Pengiriman kilat cuma 1 hari sampai!',
        source: 'Ulasan Produk',
        timestamp: '2026-10-05 21:05',
        rating: 5,
        customerName: 'Nadia Safitri',
      },
      {
        id: 'REV-008',
        text: 'Kategori filter barang sering reset sendiri kalau di-scroll cepat di Android versi lama.',
        source: 'Apple App Store',
        timestamp: '2026-10-05 21:44',
        rating: 3,
        customerName: 'Hendra Wijaya',
      },
    ],
  },
  {
    id: 'fintech_banking',
    nameId: 'FinTech & Bank Digital (Insiden Biometrik & Transaksi)',
    nameEn: 'FinTech & Digital Banking (Biometric & Transfer Glitch)',
    industryId: 'Financial Technology & Digital Banking',
    industryEn: 'Financial Technology & Digital Banking',
    descriptionId: 'Skenario evaluasi pasca update aplikasi versi 3.0: sensor sidik jari bermasalah dan latensi BI-Fast.',
    descriptionEn: 'Evaluation following app release v3.0: fingerprint sensor authentication loop and interbank settlement lag.',
    reviews: [
      {
        id: 'FB-001',
        text: 'Latest app update broke fingerprint authentication, had to enter passcode 5 times and account got locked.',
        source: 'Google Play Store',
        timestamp: '2026-10-04 09:12',
        rating: 1,
        customerName: 'Robert Vance',
      },
      {
        id: 'FB-002',
        text: 'The automatic high-yield pocket savings feature is brilliant! Clean UI and seamless daily interest credit.',
        source: 'In-App Feedback',
        timestamp: '2026-10-04 10:30',
        rating: 5,
        customerName: 'Sarah Jenkins',
      },
      {
        id: 'FB-003',
        text: 'Fast wire transfer shows successful on my side but the recipient has not received the $500 after 5 hours. Extremely stressed!',
        source: 'Twitter / X',
        timestamp: '2026-10-04 12:45',
        rating: 1,
        customerName: 'Michael Chang',
      },
      {
        id: 'FB-004',
        text: 'Instant KYC verification with photo ID selfie took less than 3 minutes. Flawless onboarding experience.',
        source: 'Google Play Store',
        timestamp: '2026-10-04 14:20',
        rating: 5,
        customerName: 'Emily Watson',
      },
      {
        id: 'FB-005',
        text: 'Unannounced maintenance fee deducted without prior email notice. Transparency is declining.',
        source: 'Helpdesk Ticket',
        timestamp: '2026-10-04 15:50',
        rating: 2,
        customerName: 'David Miller',
      },
      {
        id: 'FB-006',
        text: 'Smoothest digital banking interface I have used so far. Zero fee virtual cards are a lifesaver.',
        source: 'Apple App Store',
        timestamp: '2026-10-04 17:15',
        rating: 5,
        customerName: 'Jessica Taylor',
      },
    ],
  },
  {
    id: 'saas_b2b',
    nameId: 'SaaS B2B Cloud Platform (Latensi Dashboard & SLA API)',
    nameEn: 'SaaS B2B Cloud Platform (Dashboard Latency & API SLA)',
    industryId: 'Enterprise Software & SaaS',
    industryEn: 'Enterprise Software & SaaS',
    descriptionId: 'Evaluasi sentimen tech leads & manajer mengenai kestabilan endpoint API dan timeout dashboard.',
    descriptionEn: 'Sentiment analysis among tech leads regarding REST API rate limits and analytics dashboard latency.',
    reviews: [
      {
        id: 'SAAS-001',
        text: 'Bulk CSV export frequently hits 504 Gateway Timeout when processing over 50k customer records. Blocks our monthly reports.',
        source: 'Slack Connect Channel',
        timestamp: '2026-10-03 11:00',
        rating: 2,
        customerName: 'Alex - CTO TechCorp',
      },
      {
        id: 'SAAS-002',
        text: 'REST API documentation is top tier. Our engineering team wired up the webhook ingestion in less than 2 days.',
        source: 'Developer Forum',
        timestamp: '2026-10-03 13:25',
        rating: 5,
        customerName: 'Rachel - Lead Architect',
      },
      {
        id: 'SAAS-003',
        text: 'Enterprise pricing increased by 30% but uptime dropped to 99.1% with 2 incidents during peak business hours.',
        source: 'Account Review Call',
        timestamp: '2026-10-03 16:10',
        rating: 1,
        customerName: 'Marcus - VP Ops',
      },
      {
        id: 'SAAS-004',
        text: 'The drill-down weekly sentiment trend charts are phenomenal for our weekly executive leadership briefings.',
        source: 'CS Survey',
        timestamp: '2026-10-03 17:40',
        rating: 5,
        customerName: 'Elena - Head of Product',
      },
    ],
  },
];

export const REALTIME_SIMULATOR_REVIEWS = [
  {
    text: 'Aplikasi tiba-tiba force close pas mau konfirmasi transfer! Tolong dicek bug ini.',
    source: 'Live App Stream',
    customerName: 'Pelanggan #882',
  },
  {
    text: 'Customer support answered in 45 seconds and resolved the pending refund immediately. Superb service!',
    source: 'Live Chat Feed',
    customerName: 'User #883',
  },
  {
    text: 'Kok pesanan saya tiba-tiba dibatalkan sepihak tanpa ada konfirmasi apapun?',
    source: 'Web Ticket',
    customerName: 'Pelanggan #884',
  },
  {
    text: 'Delivery was lightning fast and the package came sealed with protective bubble wrap. Highly recommend!',
    source: 'Product Review Stream',
    customerName: 'User #885',
  },
  {
    text: 'Lagi-lagi pembayaran QRIS gagal, saldo kepotong dua kali! Ini sistem apa sih parah amat!',
    source: 'Twitter / X Feed',
    customerName: 'Pelanggan #886',
  },
  {
    text: 'The executive report breakdown and actionable recommendations are crystal clear and easy to implement.',
    source: 'User Feedback',
    customerName: 'User #887',
  },
  {
    text: 'Driver refused to bring the heavy parcel up to the apartment door despite paying for door-to-door delivery.',
    source: 'Delivery Review',
    customerName: 'User #888',
  },
  {
    text: 'Antarmuka aplikasi sangat ramah pengguna, ibu saya yang usia 60 tahun bisa belanja sendiri.',
    source: 'Play Store Live',
    customerName: 'Pelanggan #889',
  },
];
