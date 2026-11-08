export interface BenchmarkQuote {
  id: string;
  nameFa: string;
  exchange: string;
  countryFlag: string;
  price: number;
  changePct: number;
  changeUsd: number;
  lowHigh: string;
  sparkline: number[];
  source: string;
  tier: 1 | 2 | 3;
}

export const GLOBAL_BENCHMARKS: BenchmarkQuote[] = [
  {
    id: 'brent',
    nameFa: 'برنت (ICE)',
    exchange: 'ICE Futures Europe',
    countryFlag: '🇬🇧',
    price: 82.75,
    changePct: 1.25,
    changeUsd: 1.02,
    lowHigh: '$81.40 – $83.15',
    sparkline: [78.2, 79.1, 78.8, 80.2, 81.0, 80.5, 81.9, 82.75],
    source: 'EIA / ICE',
    tier: 1,
  },
  {
    id: 'wti',
    nameFa: 'WTI (NYMEX)',
    exchange: 'CME / NYMEX',
    countryFlag: '🇺🇸',
    price: 79.82,
    changePct: 1.18,
    changeUsd: 0.93,
    lowHigh: '$78.60 – $80.20',
    sparkline: [75.5, 76.4, 76.1, 77.5, 78.2, 77.9, 79.1, 79.82],
    source: 'EIA / CME',
    tier: 1,
  },
  {
    id: 'dubai',
    nameFa: 'دبی (Dubai)',
    exchange: 'Platts / DME',
    countryFlag: '🇦🇪',
    price: 80.12,
    changePct: 1.1,
    changeUsd: 0.87,
    lowHigh: '$79.05 – $80.60',
    sparkline: [76.0, 76.9, 77.2, 78.0, 78.8, 79.0, 79.6, 80.12],
    source: 'Platts / GME',
    tier: 1,
  },
  {
    id: 'orb',
    nameFa: 'سبد مرجع اوپک (ORB)',
    exchange: 'OPEC Secretariat',
    countryFlag: '🌐',
    price: 81.36,
    changePct: 0.95,
    changeUsd: 0.76,
    lowHigh: '$80.25 – $81.80',
    sparkline: [77.4, 78.1, 78.5, 79.2, 79.8, 80.3, 80.9, 81.36],
    source: 'OPEC ORB',
    tier: 1,
  },
  {
    id: 'murban',
    nameFa: 'موربان (IFAD)',
    exchange: 'ICE Abu Dhabi',
    countryFlag: '🇦🇪',
    price: 81.94,
    changePct: 1.21,
    changeUsd: 0.98,
    lowHigh: '$80.90 – $82.30',
    sparkline: [77.8, 78.5, 79.0, 79.7, 80.4, 80.8, 81.3, 81.94],
    source: 'IFAD / ADNOC',
    tier: 1,
  },
  {
    id: 'urals',
    nameFa: 'اورال (FOB Primorsk)',
    exchange: 'SPIMEX / Argus',
    countryFlag: '🇷🇺',
    price: 67.45,
    changePct: -0.42,
    changeUsd: -0.28,
    lowHigh: '$66.80 – $68.10',
    sparkline: [68.9, 68.5, 68.1, 67.9, 68.2, 67.8, 67.6, 67.45],
    source: 'MinFin / Argus',
    tier: 2,
  },
];

export interface MonthlyPricePoint {
  monthFa: string;
  monthIso: string;
  brent: number;
  wti: number;
  dubai: number;
}

export const TWELVE_MONTH_PRICE_SERIES: MonthlyPricePoint[] = [
  { monthFa: 'آبان', monthIso: '2025-11', brent: 78.4, wti: 74.2, dubai: 76.8 },
  { monthFa: 'آذر', monthIso: '2025-12', brent: 83.2, wti: 78.9, dubai: 81.1 },
  { monthFa: 'دی', monthIso: '2026-01', brent: 90.8, wti: 86.1, dubai: 88.4 },
  { monthFa: 'بهمن', monthIso: '2026-02', brent: 91.5, wti: 87.0, dubai: 89.2 },
  { monthFa: 'اسفند', monthIso: '2026-03', brent: 85.4, wti: 81.2, dubai: 83.5 },
  { monthFa: 'فروردین', monthIso: '2026-04', brent: 89.7, wti: 85.3, dubai: 87.6 },
  { monthFa: 'اردیبهشت', monthIso: '2026-05', brent: 81.6, wti: 77.8, dubai: 79.9 },
  { monthFa: 'خرداد', monthIso: '2026-06', brent: 78.9, wti: 75.1, dubai: 77.3 },
  { monthFa: 'تیر', monthIso: '2026-07', brent: 74.8, wti: 71.4, dubai: 73.5 },
  { monthFa: 'مرداد', monthIso: '2026-08', brent: 81.5, wti: 78.0, dubai: 79.4 },
  { monthFa: 'شهریور', monthIso: '2026-09', brent: 79.8, wti: 76.5, dubai: 78.1 },
  { monthFa: 'مهر', monthIso: '2026-10', brent: 82.75, wti: 79.82, dubai: 80.12 },
];

export interface ExecutiveFourQuestion {
  id: string;
  questionFa: string;
  shortAnswerFa: string;
  detailedAnswerFa: string;
  badgeFa: string;
  tone: 'supportive' | 'bearish' | 'warning' | 'neutral';
  skillSource: string;
}

export const EXECUTIVE_FOUR_QUESTIONS: ExecutiveFourQuestion[] = [
  {
    id: 'where',
    questionFa: 'الان بازار کجاست؟',
    shortAnswerFa: 'قیمت نفت در محدوده ۸۲٫۷۵ دلار و روند صعودی ملایم؛ اسپرد برنت/WTI در ۲٫۹۳ دلار و بکواردیشن ۳ ماهه.',
    detailedAnswerFa:
      'موجودی بنزین آمریکا ۴٫۱ میلیون بشکه افزایش یافت در حالی که الگوی فصلی ۵ ساله ۰٫۱ کاهش است (فشار نزولی بر فرآورده)، اما موجودی تجاری نفت خام ۴۱۵٫۰ میلیون بشکه و ۱٫۷ میلیون بشکه زیر میانگین ۵ ساله قرار دارد.',
    badgeFa: 'متعادل با تمایل صعودی',
    tone: 'supportive',
    skillSource: 'eia-weekly-stocks + EIA Spot',
  },
  {
    id: 'why',
    questionFa: 'چرا حرکت کرد؟',
    shortAnswerFa: 'کاهش موجودی تجاری آمریکا، تقاضای احتیاطی ناشی از تنش‌های خاورمیانه و کنترل عرضه اوپک+.',
    detailedAnswerFa:
      'از ۱۲٫۹٪ افزایش قیمت واقعی در ۱۲ ماه گذشته (تا ۲۰۲۶-۰۸)، سهم تقریبی تقاضای اختصاصی نفت (احتیاطی و موجودی) ۱۷٫۲+ واحد لگاریتمی و شوک عرضه ۶٫۲+ واحد بود؛ در حالی که تقاضای کل اقتصاد جهانی ۱۱٫۲− واحد از آن کاست (روش Kilian 2009).',
    badgeFa: 'ریسک احتیاطی (+۱۷٫۲)',
    tone: 'warning',
    skillSource: 'oil-shock-decomposition (Kilian / BH / Känzig)',
  },
  {
    id: 'where_to',
    questionFa: 'به کجا می‌رود؟',
    shortAnswerFa: 'ادامه نوسان رو به بالا در کوتاه‌مدت (محدوده ۸۲ تا ۸۸ دلار در افق ۳ ماهه).',
    detailedAnswerFa:
      'مدل مبتنی بر منحنی آتی (futures) در هر چهار افق با آزمون Diebold–Mariano (نسبت خطا ۰٫۵۴ در ۱ ماه، p=0.000) معیار «بدون تغییر» را شکست داد؛ میانه پیش‌بینی ۳ ماهه ۷۸٫۲ تا ۸۵٫۵ دلار با بازه ۶۸٪ احتمال ۷۰٫۸ تا ۸۵٫۳ دلار است.',
    badgeFa: 'مدل تأییدشده (DM p<0.01)',
    tone: 'supportive',
    skillSource: 'forecast-benchmark (Diebold-Mariano HLN)',
  },
  {
    id: 'meaning',
    questionFa: 'برای ما چه معنایی دارد؟',
    shortAnswerFa: 'فرصت تثبیت درآمد صادراتی بالای نقطه سربه‌سر بودجه‌ای و بهینه‌سازی تفاضل OSP آسیا.',
    detailedAnswerFa:
      'با تغییر فرمول OSP ادنوک از نوامبر ۲۰۲۶ به Platts Dubai و پایداری کرک اسپرد گازوئیل، حاشیه فروش محموله‌های سنگین و متوسط در بازار آسیا تقویت شده است؛ توصیه به پوشش ریسک ۲۰٪ محموله‌های فصل آینده در بازه ۸۵ تا ۸۸ دلار.',
    badgeFa: 'حاشیه مثبت صادراتی',
    tone: 'supportive',
    skillSource: 'osp-tracker + executive-oil-brief-fa',
  },
];

// Section 8 Dossier: EIA Weekly Stocks (eia-weekly-stocks skill output)
export interface EiaSeriesRow {
  id: string;
  nameFa: string;
  level: number;
  wow: number;
  avg5yChange: number;
  devVs5y: number;
  devVs5yPct: number;
  unit: 'mb' | 'kbd' | 'pct';
  unitFa: string;
  role: 'core' | 'optional';
}

export const EIA_WPSR_TABLE: EiaSeriesRow[] = [
  {
    id: 'WCESTUS1',
    nameFa: 'نفت خام تجاری (بدون SPR)',
    level: 415.0,
    wow: 0.0,
    avg5yChange: 0.8,
    devVs5y: -1.7,
    devVs5yPct: -0.4,
    unit: 'mb',
    unitFa: 'میلیون بشکه',
    role: 'core',
  },
  {
    id: 'W_EPC0_SAX_YCUOK_MBBL',
    nameFa: 'موجودی کاشینگ (اوکلاهاما)',
    level: 22.3,
    wow: 0.2,
    avg5yChange: 0.2,
    devVs5y: -0.1,
    devVs5yPct: -0.4,
    unit: 'mb',
    unitFa: 'میلیون بشکه',
    role: 'core',
  },
  {
    id: 'WGTSTUS1',
    nameFa: 'موجودی بنزین کل',
    level: 214.6,
    wow: 4.1,
    avg5yChange: -0.1,
    devVs5y: 0.1,
    devVs5yPct: 0.05,
    unit: 'mb',
    unitFa: 'میلیون بشکه',
    role: 'core',
  },
  {
    id: 'WDISTUS1',
    nameFa: 'موجودی تقطیری (گازوئیل)',
    level: 111.0,
    wow: 0.9,
    avg5yChange: 0.2,
    devVs5y: 0.4,
    devVs5yPct: 0.36,
    unit: 'mb',
    unitFa: 'میلیون بشکه',
    role: 'core',
  },
  {
    id: 'WCSSTUS1',
    nameFa: 'ذخایر استراتژیک (SPR)',
    level: 400.5,
    wow: 0.9,
    avg5yChange: 1.3,
    devVs5y: 0.1,
    devVs5yPct: 0.02,
    unit: 'mb',
    unitFa: 'میلیون بشکه',
    role: 'core',
  },
  {
    id: 'WPULEUS3',
    nameFa: 'نرخ بهره‌برداری پالایشگاه‌ها',
    level: 87.8,
    wow: 0.1,
    avg5yChange: 0.0,
    devVs5y: 0.5,
    devVs5yPct: 0.57,
    unit: 'pct',
    unitFa: 'درصد',
    role: 'core',
  },
  {
    id: 'WCRRIUS2',
    nameFa: 'خوراک نفت خام پالایشگاه‌ها',
    level: 15566,
    wow: -101,
    avg5yChange: 21,
    devVs5y: -81,
    devVs5yPct: -0.52,
    unit: 'kbd',
    unitFa: 'هزار بشکه در روز',
    role: 'core',
  },
  {
    id: 'WCRFPUS2',
    nameFa: 'تولید میدانی نفت خام آمریکا',
    level: 13278,
    wow: 37,
    avg5yChange: -39,
    devVs5y: -22,
    devVs5yPct: -0.17,
    unit: 'kbd',
    unitFa: 'هزار بشکه در روز',
    role: 'core',
  },
];

export const EIA_26W_TRAJECTORY = [
  { week: 'W18', actual2026: 442.0, avg5y: 438.5 },
  { week: 'W20', actual2026: 439.2, avg5y: 436.0 },
  { week: 'W22', actual2026: 435.8, avg5y: 433.4 },
  { week: 'W24', actual2026: 433.1, avg5y: 430.2 },
  { week: 'W26', actual2026: 429.5, avg5y: 427.8 },
  { week: 'W28', actual2026: 426.0, avg5y: 425.1 },
  { week: 'W30', actual2026: 423.4, avg5y: 422.9 },
  { week: 'W32', actual2026: 420.8, avg5y: 420.5 },
  { week: 'W34', actual2026: 418.9, avg5y: 419.2 },
  { week: 'W36', actual2026: 417.2, avg5y: 418.0 },
  { week: 'W38', actual2026: 416.1, avg5y: 417.4 },
  { week: 'W40', actual2026: 415.4, avg5y: 417.0 },
  { week: 'W42', actual2026: 415.0, avg5y: 416.7 },
];

// Section 8 Dossier: Oil Shock Decomposition (oil-shock-decomposition skill output)
export const SHOCK_WINDOWS_TABLE = [
  {
    driverFa: 'تقاضای اختصاصی نفت (احتیاطی و موجودی)',
    key: 'oil_specific_demand',
    m1: 6.4,
    m3: 24.2,
    m12: 17.2,
    color: '#D4F338',
  },
  {
    driverFa: 'شوک عرضه نفت',
    key: 'supply',
    m1: -0.7,
    m3: 2.6,
    m12: 6.2,
    color: '#F59E0B',
  },
  {
    driverFa: 'تقاضای کل اقتصاد جهانی (IGREA)',
    key: 'aggregate_demand',
    m1: -1.6,
    m3: 0.0,
    m12: -11.2,
    color: '#3B82F6',
  },
  {
    driverFa: 'پایه (شرایط اولیه)',
    key: 'base',
    m1: 0.0,
    m3: 0.0,
    m12: 0.0,
    color: '#94A3B8',
  },
];

export const SHOCK_TRIANGULATION_ROWS = [
  { month: '2026-03', kilian: -0.3, bh: 0.3, kaenzig: -0.6, label: 'disagree' as const, labelFa: 'ناهمسو' },
  { month: '2026-04', kilian: 0.6, bh: 1.4, kaenzig: 0.5, label: 'agree' as const, labelFa: 'همسو' },
  { month: '2026-05', kilian: 1.4, bh: 1.5, kaenzig: 1.5, label: 'agree' as const, labelFa: 'همسو' },
  { month: '2026-06', kilian: 0.0, bh: -0.7, kaenzig: 0.0, label: 'partial' as const, labelFa: 'نیمه‌همسو' },
  { month: '2026-07', kilian: 0.4, bh: 1.1, kaenzig: -0.4, label: 'disagree' as const, labelFa: 'ناهمسو' },
  { month: '2026-08', kilian: -0.3, bh: -1.2, kaenzig: -1.2, label: 'agree' as const, labelFa: 'همسو' },
];

export const MONTHLY_SHOCK_BARS = [
  { month: '2025-11', oilSpecific: 2.1, aggDemand: -1.4, supply: 0.8, total: 1.5 },
  { month: '2025-12', oilSpecific: 3.4, aggDemand: -0.9, supply: 1.2, total: 3.7 },
  { month: '2026-01', oilSpecific: 4.8, aggDemand: -2.1, supply: 1.9, total: 4.6 },
  { month: '2026-02', oilSpecific: -1.2, aggDemand: -1.8, supply: 0.4, total: -2.6 },
  { month: '2026-03', oilSpecific: -5.4, aggDemand: -2.2, supply: -0.8, total: -8.4 },
  { month: '2026-04', oilSpecific: 6.1, aggDemand: -1.0, supply: 1.6, total: 6.7 },
  { month: '2026-05', oilSpecific: -16.8, aggDemand: -0.2, supply: -1.1, total: -18.1 },
  { month: '2026-06', oilSpecific: 8.2, aggDemand: 0.9, supply: 1.8, total: 10.9 },
  { month: '2026-07', oilSpecific: 9.6, aggDemand: 0.7, supply: 1.5, total: 11.8 },
  { month: '2026-08', oilSpecific: 6.4, aggDemand: -1.6, supply: -0.7, total: 4.1 },
];

// Section 8 Dossier: Forecast Benchmark (forecast-benchmark skill output)
export interface FanChartHorizonRow {
  horizonKey: string;
  horizonFa: string;
  targetMonth: string;
  q5: number;
  q16: number;
  q50: number;
  q84: number;
  q95: number;
  model: string;
}

export const FAN_CHART_TABLE: FanChartHorizonRow[] = [
  {
    horizonKey: '1m',
    horizonFa: '۱ ماه · ۲۰۲۶-۱۰',
    targetMonth: '2026-10',
    q5: 69.8,
    q16: 71.3,
    q50: 74.6,
    q84: 77.8,
    q95: 79.9,
    model: 'futures',
  },
  {
    horizonKey: '3m',
    horizonFa: '۳ ماه · ۲۰۲۶-۱۲',
    targetMonth: '2026-12',
    q5: 67.1,
    q16: 70.8,
    q50: 78.2,
    q84: 85.3,
    q95: 91.7,
    model: 'futures',
  },
  {
    horizonKey: '6m',
    horizonFa: '۶ ماه · ۲۰۲۷-۰۳',
    targetMonth: '2027-03',
    q5: 58.2,
    q16: 67.5,
    q50: 82.4,
    q84: 99.1,
    q95: 108.3,
    model: 'futures',
  },
  {
    horizonKey: '12m',
    horizonFa: '۱۲ ماه · ۲۰۲۷-۰۹',
    targetMonth: '2027-09',
    q5: 46.8,
    q16: 55.3,
    q50: 83.4,
    q84: 129.2,
    q95: 163.6,
    model: 'futures',
  },
];

export interface ScoreboardRow {
  model: string;
  n: number;
  mspeRatio: number;
  dmPvalue: number | null;
  hitRatePct: number | null;
  verdictFa: string;
  verdict: 'significantly_better' | 'better_not_significant' | 'not_better' | 'benchmark';
}

export const SCOREBOARD_1M: ScoreboardRow[] = [
  { model: 'futures', n: 224, mspeRatio: 0.54, dmPvalue: 0.0, hitRatePct: 82, verdictFa: 'بهتر، معنی‌دار', verdict: 'significantly_better' },
  { model: 'combo_inv_mspe', n: 221, mspeRatio: 0.66, dmPvalue: 0.0, hitRatePct: 79, verdictFa: 'بهتر، معنی‌دار', verdict: 'significantly_better' },
  { model: 'combo_equal', n: 224, mspeRatio: 0.74, dmPvalue: 0.0, hitRatePct: 77, verdictFa: 'بهتر، معنی‌دار', verdict: 'significantly_better' },
  { model: 'ar1_logdiff', n: 224, mspeRatio: 1.0, dmPvalue: 0.484, hitRatePct: 66, verdictFa: 'بهتر، غیرمعنی‌دار', verdict: 'better_not_significant' },
  { model: 'no_change', n: 224, mspeRatio: 1.0, dmPvalue: null, hitRatePct: null, verdictFa: 'معیار', verdict: 'benchmark' },
  { model: 'drift', n: 224, mspeRatio: 1.03, dmPvalue: 0.932, hitRatePct: 47, verdictFa: 'بهتر نیست', verdict: 'not_better' },
];

export const SCOREBOARD_12M: ScoreboardRow[] = [
  { model: 'futures', n: 213, mspeRatio: 0.67, dmPvalue: 0.011, hitRatePct: 75, verdictFa: 'بهتر، معنی‌دار', verdict: 'significantly_better' },
  { model: 'combo_inv_mspe', n: 199, mspeRatio: 0.88, dmPvalue: 0.16, hitRatePct: 65, verdictFa: 'بهتر، غیرمعنی‌دار', verdict: 'better_not_significant' },
  { model: 'combo_equal', n: 213, mspeRatio: 0.93, dmPvalue: 0.231, hitRatePct: 65, verdictFa: 'بهتر، غیرمعنی‌دار', verdict: 'better_not_significant' },
  { model: 'no_change', n: 213, mspeRatio: 1.0, dmPvalue: null, hitRatePct: null, verdictFa: 'معیار', verdict: 'benchmark' },
  { model: 'ar1_logdiff', n: 213, mspeRatio: 1.09, dmPvalue: 0.781, hitRatePct: 47, verdictFa: 'بهتر نیست', verdict: 'not_better' },
  { model: 'drift', n: 213, mspeRatio: 1.16, dmPvalue: 0.936, hitRatePct: 38, verdictFa: 'بهتر نیست', verdict: 'not_better' },
];

// OPEC+ Member Compliance & Secondary Sources (Feb 2025 new 8 secondary sources panel)
export interface OpecMemberRow {
  countryFa: string;
  flag: string;
  quotaKbd: number | null;
  secondarySourcesKbd: number;
  directCommKbd: number;
  spareCapacityKbd: number;
  compliancePct: number | null;
}

export const OPEC_PLUS_MEMBERS: OpecMemberRow[] = [
  { countryFa: 'عربستان سعودی', flag: '🇸🇦', quotaKbd: 8978, secondarySourcesKbd: 8992, directCommKbd: 8980, spareCapacityKbd: 3100, compliancePct: 99 },
  { countryFa: 'روسیه', flag: '🇷🇺', quotaKbd: 8978, secondarySourcesKbd: 9045, directCommKbd: 8995, spareCapacityKbd: 450, compliancePct: 94 },
  { countryFa: 'عراق (SOMO)', flag: '🇮🇶', quotaKbd: 4000, secondarySourcesKbd: 4160, directCommKbd: 4010, spareCapacityKbd: 620, compliancePct: 82 },
  { countryFa: 'امارات متحده عربی', flag: '🇦🇪', quotaKbd: 2912, secondarySourcesKbd: 2955, directCommKbd: 2915, spareCapacityKbd: 1450, compliancePct: 95 },
  { countryFa: 'کویت', flag: '🇰🇼', quotaKbd: 2413, secondarySourcesKbd: 2418, directCommKbd: 2413, spareCapacityKbd: 380, compliancePct: 99 },
  { countryFa: 'قزاقستان', flag: '🇰🇿', quotaKbd: 1468, secondarySourcesKbd: 1545, directCommKbd: 1490, spareCapacityKbd: 90, compliancePct: 79 },
  { countryFa: 'ایران (معاف از سهمیه)', flag: '🇮🇷', quotaKbd: null, secondarySourcesKbd: 3320, directCommKbd: 3410, spareCapacityKbd: 350, compliancePct: null },
  { countryFa: 'نیجریه', flag: '🇳🇬', quotaKbd: 1500, secondarySourcesKbd: 1435, directCommKbd: 1460, spareCapacityKbd: 180, compliancePct: 104 },
];

// Official Selling Prices (OSP) - including Nov 2026 ADNOC formula shift
export interface OspRow {
  gradeFa: string;
  producerFa: string;
  benchmark: string;
  asiaDiffUsd: number;
  momChangeUsd: number;
  europeDiffUsd: number;
  verificationStatus: 'verified' | 'pending_review';
  noteFa: string;
}

export const OSP_TABLE: OspRow[] = [
  {
    gradeFa: 'Arab Light (عرب سبک)',
    producerFa: 'آرامکو عربستان',
    benchmark: 'Oman/Dubai Avg',
    asiaDiffUsd: 2.2,
    momChangeUsd: 0.3,
    europeDiffUsd: 0.9,
    verificationStatus: 'verified',
    noteFa: 'تأیید دوگانه (Reuters + بلومبرگ)',
  },
  {
    gradeFa: 'Murban / Upper Zakum',
    producerFa: 'ادنوک امارات (ADNOC)',
    benchmark: 'Platts Dubai (فرمول جدید نوامبر ۲۰۲۶)',
    asiaDiffUsd: 1.65,
    momChangeUsd: 0.15,
    europeDiffUsd: 0.7,
    verificationStatus: 'verified',
    noteFa: 'شکست سری ثبت‌شده: تغییر از IFAD به Platts Dubai',
  },
  {
    gradeFa: 'Basrah Medium (بصره متوسط)',
    producerFa: 'سومو عراق (SOMO)',
    benchmark: 'Oman/Dubai Avg',
    asiaDiffUsd: -0.4,
    momChangeUsd: 0.2,
    europeDiffUsd: -3.15,
    verificationStatus: 'verified',
    noteFa: 'بیانیه رسمی SOMO',
  },
  {
    gradeFa: 'Iranian Light (ایران سبک)',
    producerFa: 'شرکت ملی نفت ایران (NIOC)',
    benchmark: 'Oman/Dubai Avg',
    asiaDiffUsd: 1.85,
    momChangeUsd: 0.25,
    europeDiffUsd: -1.4,
    verificationStatus: 'pending_review',
    noteFa: 'استخراج LLM از رسانه؛ در صف تأیید تحلیلگر',
  },
  {
    gradeFa: 'Kuwait Export Crude (KEC)',
    producerFa: 'مؤسسه نفت کویت (KPC)',
    benchmark: 'Oman/Dubai Avg',
    asiaDiffUsd: 1.45,
    momChangeUsd: 0.2,
    europeDiffUsd: -0.8,
    verificationStatus: 'verified',
    noteFa: 'تأیید دوگانه',
  },
];

// Geopolitical Chokepoints (IMF PortWatch + JMIC/UKMTO)
export interface ChokepointStatus {
  id: string;
  nameFa: string;
  dailyOilFlowMbd: number;
  normalFlowMbd: number;
  tankerTransitsDaily: number;
  jmicThreatLevel: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'LOW';
  threatFa: string;
  warRiskPremiumPct: string;
  vlccFreightWs: number;
  score: number; // 0..100
  summaryFa: string;
}

export const CHOKEPOINTS_DATA: ChokepointStatus[] = [
  {
    id: 'hormuz',
    nameFa: 'تنگه هرمز',
    dailyOilFlowMbd: 19.8,
    normalFlowMbd: 20.9,
    tankerTransitsDaily: 41,
    jmicThreatLevel: 'HIGH',
    threatFa: 'پرریسک (بحران ۲۰۲۶)',
    warRiskPremiumPct: '0.45% ارزش بدنه',
    vlccFreightWs: 74,
    score: 82,
    summaryFa: 'نوسان شدید بارگیری و جعل سیگنال AIS در خلیج فارس؛ نظارت لحظه‌ای PortWatch و Sentinel-1.',
  },
  {
    id: 'babelmandeb',
    nameFa: 'تنگه باب‌المندب و دریای سرخ',
    dailyOilFlowMbd: 3.4,
    normalFlowMbd: 8.6,
    tankerTransitsDaily: 14,
    jmicThreatLevel: 'CRITICAL',
    threatFa: 'بحرانی (تغییر مسیر دماغه امید نیک)',
    warRiskPremiumPct: '0.65% ارزش بدنه',
    vlccFreightWs: 81,
    score: 86,
    summaryFa: 'کاهش ۶۰٪ ترانزیت نفتکش نسبت به میانگین تاریخی؛ افزایش ۱۴ روزه مسیر اروپا-آسیا.',
  },
  {
    id: 'suez',
    nameFa: 'کانال سوئز و خط سومد',
    dailyOilFlowMbd: 4.1,
    normalFlowMbd: 7.9,
    tankerTransitsDaily: 19,
    jmicThreatLevel: 'ELEVATED',
    threatFa: 'هشدار بالا',
    warRiskPremiumPct: '0.25% ارزش بدنه',
    vlccFreightWs: 68,
    score: 64,
    summaryFa: 'افت ترانزیت جنوب به شمال به دلیل انحراف نفتکش‌ها به مسیر آفریقا.',
  },
  {
    id: 'malacca',
    nameFa: 'تنگه مالاکا و سنگاپور',
    dailyOilFlowMbd: 23.2,
    normalFlowMbd: 23.0,
    tankerTransitsDaily: 78,
    jmicThreatLevel: 'LOW',
    threatFa: 'پایدار (کم‌ریسک)',
    warRiskPremiumPct: '0.05% ارزش بدنه',
    vlccFreightWs: 62,
    score: 28,
    summaryFa: 'تردد عادی؛ تمرکز انتقال کشتی‌به‌کشتی (STS) ناوگان سایه در شرق جوهور.',
  },
  {
    id: 'danish_cpc',
    nameFa: 'تنگه‌های دانمارک و پایانه CPC',
    dailyOilFlowMbd: 3.6,
    normalFlowMbd: 3.9,
    tankerTransitsDaily: 26,
    jmicThreatLevel: 'ELEVATED',
    threatFa: 'متوسط (محدودیت سقف قیمت و تحریم)',
    warRiskPremiumPct: '0.30% ارزش بدنه',
    vlccFreightWs: 71,
    score: 58,
    summaryFa: 'سقف قیمت ۴۴٫۱۰ دلار ائتلاف G7+ و بازرسی بیمه‌ای نفتکش‌های ناوگان سایه (بسته ۶۷۱ کشتی اتحادیه اروپا).',
  },
];

// Wave 1 Connectors (12 Free Official Sources from Section 4 of Dossier)
export interface Wave1Connector {
  sourceId: string;
  nameFa: string;
  pattern: 'A · API' | 'B · فایل' | 'C · استخراج PDF/وب' | 'D · خبر + LLM + تأیید انسانی';
  scheduleNy: string;
  scheduleTehran: string;
  moduleFa: string;
  tier: 1 | 2 | 3;
  qualityScore: number;
  gateStatus: 'OK' | 'WARN' | 'BLOCK';
  crossCheckPair: string;
  lastIngested: string;
}

export const WAVE1_CONNECTORS: Wave1Connector[] = [
  {
    sourceId: 'eia_wpsr',
    nameFa: 'EIA Weekly Petroleum Status Report',
    pattern: 'A · API',
    scheduleNy: 'چهارشنبه ۱۰:۳۰ ET',
    scheduleTehran: 'چهارشنبه ۱۸:۰۰ / ۱۹:۰۰ تهران',
    moduleFa: 'موجودی‌ها (eia-weekly-stocks)',
    tier: 1,
    qualityScore: 98,
    gateStatus: 'OK',
    crossCheckPair: 'API Weekly Statistical Bulletin',
    lastIngested: '۲۰۲۶-۱۰-۲۸ · ۱۸:۰۳',
  },
  {
    sourceId: 'eia_steo',
    nameFa: 'EIA Short-Term Energy Outlook (STEO)',
    pattern: 'A · API',
    scheduleNy: 'هفته دوم ماه',
    scheduleTehran: 'هفته دوم ماه · ۲۰:۰۰',
    moduleFa: 'تراز عرضه و تقاضا و پیش‌بینی ۲۴ ماهه',
    tier: 1,
    qualityScore: 96,
    gateStatus: 'OK',
    crossCheckPair: 'OPEC MOMR / IEA OMR',
    lastIngested: '۲۰۲۶-۱۰-۱۰ · ۱۹:۳۵',
  },
  {
    sourceId: 'eia_spot',
    nameFa: 'EIA Spot Prices (RWTC, RBRTE, Crack)',
    pattern: 'A · API',
    scheduleNy: 'روزانه کاری',
    scheduleTehran: 'روزانه ۱۷:۳۰ تهران',
    moduleFa: 'پایش قیمت و کرک اسپرد',
    tier: 1,
    qualityScore: 99,
    gateStatus: 'OK',
    crossCheckPair: 'FRED DCOILBRENTEU / DCOILWTICO',
    lastIngested: '۲۰۲۶-۱۰-۳۰ · ۱۷:۳۲',
  },
  {
    sourceId: 'fred_macro',
    nameFa: 'FRED / ALFRED (IGREA, CPI, DXY, Rates)',
    pattern: 'A · API',
    scheduleNy: 'روزانه / ماهانه',
    scheduleTehran: 'روزانه ۱۸:۰۰ تهران',
    moduleFa: 'تجزیه شوک‌ها (oil-shock-decomposition)',
    tier: 1,
    qualityScore: 97,
    gateStatus: 'OK',
    crossCheckPair: 'EIA Spot / Dallas Fed IGREA',
    lastIngested: '۲۰۲۶-۱۰-۳۰ · ۱۸:۰۰',
  },
  {
    sourceId: 'cftc_cot',
    nameFa: 'CFTC Commitments of Traders (WTI 067651)',
    pattern: 'A · API',
    scheduleNy: 'جمعه ۱۵:۳۰ ET',
    scheduleTehran: 'جمعه ۲۳:۰۰ / ۰۰:۰۰ تهران',
    moduleFa: 'احساسات بازار و موقعیت Managed Money',
    tier: 1,
    qualityScore: 95,
    gateStatus: 'OK',
    crossCheckPair: 'ICE Futures Europe COT',
    lastIngested: '۲۰۲۶-۱۰-۲۴ · ۲۳:۰۴',
  },
  {
    sourceId: 'ice_cot',
    nameFa: 'ICE Futures Europe COT (Brent & Gasoil)',
    pattern: 'B · فایل',
    scheduleNy: 'جمعه طبق تقویم ICE',
    scheduleTehran: 'جمعه ۲۱:۰۰ تهران',
    moduleFa: 'احساسات بازار (برنت و گازوئیل)',
    tier: 1,
    qualityScore: 94,
    gateStatus: 'OK',
    crossCheckPair: 'CFTC Disaggregated COT',
    lastIngested: '۲۰۲۶-۱۰-۲۴ · ۲۱:۱۰',
  },
  {
    sourceId: 'baker_hughes',
    nameFa: 'Baker Hughes Rig Count',
    pattern: 'B · فایل',
    scheduleNy: 'جمعه ۱۳:۰۰ ET',
    scheduleTehran: 'جمعه ۲۰:۳۰ / ۲۱:۳۰ تهران',
    moduleFa: 'تراز (پیش‌نگر عرضه شیل آمریکا و بین‌الملل)',
    tier: 2,
    qualityScore: 88,
    gateStatus: 'OK',
    crossCheckPair: 'EIA-914 / Texas RRC',
    lastIngested: '۲۰۲۶-۱۰-۲۴ · ۲۰:۳۴',
  },
  {
    sourceId: 'worldbank_pink',
    nameFa: 'World Bank Pink Sheet (CMO Monthly)',
    pattern: 'B · فایل',
    scheduleNy: 'اوایل هر ماه',
    scheduleTehran: 'روز ۲ تا ۴ ماه',
    moduleFa: 'مرجع تاریخی قیمت برنت، دوبی و WTI',
    tier: 1,
    qualityScore: 96,
    gateStatus: 'OK',
    crossCheckPair: 'میانگین ماهانه EIA Spot',
    lastIngested: '۲۰۲۶-۱۰-۰۳ · ۱۶:۲۰',
  },
  {
    sourceId: 'jodi_oil',
    nameFa: 'JODI-Oil World Database (۱۰۰+ کشور)',
    pattern: 'B · فایل',
    scheduleNy: 'نیمه ماه (تأخیر ۲ ماه)',
    scheduleTehran: 'نیمه ماه · ۱۵:۰۰',
    moduleFa: 'تراز عرضه، تقاضا و موجودی کشورها',
    tier: 1,
    qualityScore: 91,
    gateStatus: 'OK',
    crossCheckPair: 'GACC چین / PPAC هند / IEF Review',
    lastIngested: '۲۰۲۶-۱۰-۱۶ · ۱۵:۱۲',
  },
  {
    sourceId: 'opec_momr',
    nameFa: 'OPEC MOMR + OPEC Reference Basket (ORB)',
    pattern: 'C · استخراج PDF/وب',
    scheduleNy: 'نیمه ماه (MOMR) / روزانه (ORB)',
    scheduleTehran: 'روزانه ۱۴:۳۰ تهران',
    moduleFa: 'ردیاب اوپک+ (opec-momr-parser) و قیمت سبد',
    tier: 1,
    qualityScore: 93,
    gateStatus: 'OK',
    crossCheckPair: 'EIA STEO / SOMO عراق',
    lastIngested: '۲۰۲۶-۱۰-۳۰ · ۱۴:۳۵',
  },
  {
    sourceId: 'gacc_ppac_somo',
    nameFa: 'GACC چین · PPAC هند · SOMO عراق',
    pattern: 'C · استخراج PDF/وب',
    scheduleNy: 'روز ۷ تا ۲۰ هر ماه',
    scheduleTehran: 'نیمه ماه',
    moduleFa: 'تقاضای آسیا و صادرات عراق',
    tier: 1,
    qualityScore: 87,
    gateStatus: 'WARN',
    crossCheckPair: 'JODI Oil / Kpler Tanker Tracking',
    lastIngested: '۲۰۲۶-۱۰-۲۰ · ۱۱:۴۰',
  },
  {
    sourceId: 'gulf_osps',
    nameFa: 'OSPهای خلیج فارس (آرامکو، ادنوک، کویت، ایران)',
    pattern: 'D · خبر + LLM + تأیید انسانی',
    scheduleNy: 'حدود روز ۵ هر ماه',
    scheduleTehran: 'روز ۵ تا ۸ ماه',
    moduleFa: 'پایش قیمت فیزیکی و تفاضل‌ها (osp-tracker)',
    tier: 1,
    qualityScore: 89,
    gateStatus: 'WARN',
    crossCheckPair: 'تأیید دوگانه رسانه‌ای + بازبینی انسانی',
    lastIngested: '۲۰۲۶-۱۰-۰۷ · ۰۹:۱۵',
  },
];

// Representative catalog of the 20 Categories (256 Global Sources)
export interface DataSourceCategoryItem {
  categoryNum: number;
  categoryFa: string;
  countInDossier: number;
  wave: 'موج ۱' | 'موج ۲' | 'موج ۳' | 'موج ۴';
  tier: 1 | 2 | 3;
  access: 'رایگان · API' | 'رایگان · فایل/وب' | 'اشتراکی · API/MCP';
  keySources: string[];
  criticalNoteFa: string;
}

export const DATA_SOURCES_20_CATEGORIES: DataSourceCategoryItem[] = [
  {
    categoryNum: 1,
    categoryFa: 'بورس‌ها و بازارهای آتی',
    countInDossier: 10,
    wave: 'موج ۳',
    tier: 1,
    access: 'اشتراکی · API/MCP',
    keySources: ['ICE Futures Europe (Brent)', 'CME / NYMEX (WTI)', 'IFAD (Murban)', 'GME Oman', 'Shanghai INE (SC)'],
    criticalNoteFa: 'نمایش داده زنده بورس در پلتفرم نیازمند مجوز نمایش است؛ داده تأخیری و تسویه روزانه در موج ۱ از EIA/FRED خوانده می‌شود.',
  },
  {
    categoryNum: 2,
    categoryFa: 'قیمت‌های رسمی فروش (OSP) و سبدهای مرجع',
    countInDossier: 10,
    wave: 'موج ۱',
    tier: 1,
    access: 'رایگان · فایل/وب',
    keySources: ['Aramco OSP', 'ADNOC OSP', 'SOMO Iraq', 'KPC Kuwait', 'NIOC Iran', 'OPEC ORB', 'PPAC Indian Basket'],
    criticalNoteFa: 'از ۱ نوامبر ۲۰۲۶ فرمول OSP ادنوک از آتی موربان IFAD به Platts Dubai تغییر می‌کند.',
  },
  {
    categoryNum: 3,
    categoryFa: 'آژانس‌های گزارش قیمت (PRA) و ترمینال‌ها',
    countInDossier: 7,
    wave: 'موج ۳',
    tier: 2,
    access: 'اشتراکی · API/MCP',
    keySources: ['S&P Global Platts (MCP رسمی)', 'Argus Media (AI-ready MCP)', 'OPIS', 'General Index', 'LSEG Workspace', 'Bloomberg'],
    criticalNoteFa: 'پشتیبانی رسمی از سرور MCP در Platts و Argus در ۲۰۲۶ فعال شده است.',
  },
  {
    categoryNum: 4,
    categoryFa: 'فرآورده‌ها، حاشیه پالایش و کیفیت نفت خام (Assays)',
    countInDossier: 12,
    wave: 'موج ۱',
    tier: 1,
    access: 'رایگان · API',
    keySources: ['EIA Spot Prices', 'EU Weekly Oil Bulletin', 'IATA Jet Fuel Monitor', 'bp / Shell Refining Margin', 'ExxonMobil / Equinor / CrudeMonitor Assays'],
    criticalNoteFa: 'کرک اسپرد ۳:۲:۱ از قیمت‌های اسپات EIA محاسبه می‌شود.',
  },
  {
    categoryNum: 5,
    categoryFa: 'نرخ حمل نفتکش و قیمت خرده‌فروشی سوخت',
    countInDossier: 12,
    wave: 'موج ۳',
    tier: 1,
    access: 'رایگان · API',
    keySources: ['Baltic Exchange (BDTI/BCTI)', 'Worldscale', 'Clarksons SIN', 'Argus Tanker Freight', 'UK Fuel Finder API', 'Tankerkönig Germany'],
    criticalNoteFa: 'نرخ‌های VLCC در مسیر خلیج فارس به آسیا (TD3C) شاخص کلیدی تنش هرمز است.',
  },
  {
    categoryNum: 6,
    categoryFa: 'APIهای رایگان و تجمیع‌کننده‌ها',
    countInDossier: 9,
    wave: 'موج ۱',
    tier: 1,
    access: 'رایگان · API',
    keySources: ['EIA Open Data API v2', 'World Bank Pink Sheet', 'IMF PCPS', 'Nasdaq Data Link', 'OilPriceAPI MCP'],
    criticalNoteFa: 'هسته رایگان موج ۱ با آرشیو پاسخ خام و هش SHA-256.',
  },
  {
    categoryNum: 7,
    categoryFa: 'نهادهای بین‌المللی و پایگاه‌های چندجانبه',
    countInDossier: 17,
    wave: 'موج ۱',
    tier: 1,
    access: 'رایگان · فایل/وب',
    keySources: ['IEA OMR / MODS', 'OPEC MOMR / ASB', 'JODI-Oil World Database', 'EIA STEO', 'Energy Institute Statistical Review', 'UN Comtrade+'],
    criticalNoteFa: 'منابع ثانویه اوپک از فوریه ۲۰۲۵ تغییر کرد (حذف EIA و Rystad؛ افزودن Kpler، OilX و ESAI).',
  },
  {
    categoryNum: 8,
    categoryFa: 'آمار رسمی: ایالات متحده',
    countInDossier: 14,
    wave: 'موج ۱',
    tier: 1,
    access: 'رایگان · API',
    keySources: ['EIA WPSR', 'EIA PSM', 'EIA-914', 'Baker Hughes Rig Count', 'Texas RRC', 'BSEE Offshore', 'DOE SPR'],
    criticalNoteFa: 'انتشار چهارشنبه ۱۰:۳۰ نیویورک؛ در هفته‌های تعطیل آمریکا یک روز جابه‌جا می‌شود.',
  },
  {
    categoryNum: 9,
    categoryFa: 'آمار رسمی: آسیا (چین، هند، ژاپن، کره، سنگاپور، فجیره)',
    countInDossier: 14,
    wave: 'موج ۱',
    tier: 1,
    access: 'رایگان · فایل/وب',
    keySources: ['GACC China Customs', 'NBS China', 'PPAC India', 'METI / PAJ Japan', 'KNOC Petronet Korea', 'Enterprise Singapore Stocks', 'FEDCom Fujairah'],
    criticalNoteFa: 'آمار ژانویه و فوریه چین به دلیل سال نو قمری تجمیعی منتشر می‌شود.',
  },
  {
    categoryNum: 10,
    categoryFa: 'آمار رسمی: اروپا، روسیه و خزر',
    countInDossier: 12,
    wave: 'موج ۲',
    tier: 1,
    access: 'رایگان · API',
    keySources: ['Insights Global ARA Stocks', 'Euroilstock', 'Sodir Norway', 'NSTA / DESNZ UK', 'CPC Pipeline', 'Kazakhstan Stat'],
    criticalNoteFa: 'انتشار آمار CDU TEK روسیه از آوریل ۲۰۲۲ متوقف شده است.',
  },
  {
    categoryNum: 11,
    categoryFa: 'آمار رسمی: قاره آمریکا، خاورمیانه و آفریقا',
    countInDossier: 13,
    wave: 'موج ۲',
    tier: 1,
    access: 'رایگان · فایل/وب',
    keySources: ['CER / AER Canada', 'ANP Brazil', 'Pemex BDI Mexico', 'Aramco / JODI Saudi', 'NUPRC Nigeria', 'NOC Libya'],
    criticalNoteFa: 'اعلامیه‌های فورس‌ماژور لیبی (NOC) مستقیماً به گراف رویداد متصل می‌شوند.',
  },
  {
    categoryNum: 12,
    categoryFa: 'پایگاه‌های تجاری بالادستی، پالایشی و جریان تجارت',
    countInDossier: 8,
    wave: 'موج ۳',
    tier: 2,
    access: 'اشتراکی · API/MCP',
    keySources: ['Kpler (MCP رسمی ۵۰ ابزاری)', 'Vortexa SDK', 'Rystad Energy UCube', 'Wood Mackenzie Lens', 'IIR Energy Outages'],
    criticalNoteFa: 'گروه Kpler (مالک MarineTraffic و Spire) و گروه Energy Aspects (مالک OilX و Kayrros) در تطبیق، یک منبع واحد شمرده می‌شوند.',
  },
  {
    categoryNum: 13,
    categoryFa: 'ردیابی نفتکش، AIS و ناوگان سایه',
    countInDossier: 20,
    wave: 'موج ۲',
    tier: 2,
    access: 'رایگان · API',
    keySources: ['LSEG Vessel Tracking', 'Signal Ocean', 'MarineTraffic / Spire', 'aisstream.io', 'Global Fishing Watch Sentinel-1', 'TankerTrackers', 'KSE / CREA Shadow Fleet'],
    criticalNoteFa: 'منابع KSE، CREA و UANI سطح ۳ هستند و با فهرست‌های رسمی تحریم (بخش ۱۷) تطبیق داده می‌شوند.',
  },
  {
    categoryNum: 14,
    categoryFa: 'ماهواره، مخازن سقف شناور، فلرینگ و پالایشگاه',
    countInDossier: 10,
    wave: 'موج ۲',
    tier: 1,
    access: 'رایگان · API',
    keySources: ['Copernicus Sentinel-1/2/5P', 'VIIRS Nightfire v4', 'NASA FIRMS', 'Kayrros Crude Inventories', 'Ursa Space SAR', 'Planet Labs'],
    criticalNoteFa: 'VIIRS Nightfire برای پایش فلرینگ میدان‌های نفتی و NASA FIRMS برای تشخیص حریق پالایشگاه در کمتر از ۳ ساعت.',
  },
  {
    categoryNum: 15,
    categoryFa: 'خطوط لوله، بنادر، تنگه‌ها، هواشناسی و تحرک',
    countInDossier: 16,
    wave: 'موج ۲',
    tier: 1,
    access: 'رایگان · API',
    keySources: ['IMF PortWatch', 'JMIC / UKMTO', 'Suez & Panama Canal', 'MPA Singapore Bunker', 'ECMWF Open Data', 'NOAA NHC Hurricanes', 'OpenSky ADS-B'],
    criticalNoteFa: 'IMF PortWatch ترانزیت روزانه نفتکش‌ها در تنگه هرمز، باب‌المندب و سوئز را رایگان ارائه می‌دهد.',
  },
  {
    categoryNum: 16,
    categoryFa: 'بازارهای مالی، موقعیت معامله‌گران و کلان',
    countInDossier: 15,
    wave: 'موج ۱',
    tier: 1,
    access: 'رایگان · API',
    keySources: ['CFTC COT', 'ICE COT', 'FRED / ALFRED', 'BIS / IMF / OECD CLI', 'China NBS & RatingDog PMI', 'Cboe OVX Volatility', 'USO ETF Flows'],
    criticalNoteFa: 'از اوت ۲۰۲۵ شاخص RatingDog China PMI جایگزین Caixin PMI شده است.',
  },
  {
    categoryNum: 17,
    categoryFa: 'اخبار، ژئوپلیتیک و تحریم‌ها',
    countInDossier: 19,
    wave: 'موج ۲',
    tier: 1,
    access: 'رایگان · API',
    keySources: ['OPEC Press Releases', 'OFAC SDN', 'EU Annex XLII (۶۷۱ کشتی)', 'UK Sanctions List (جایگزین OFSI از ژانویه ۲۰۲۶)', 'OpenSanctions yente MCP', 'GDELT', 'GPR Index'],
    criticalNoteFa: 'فهرست تجمیعی OFSI انگلیس در ۲۸ ژانویه ۲۰۲۶ بسته شد و UK Sanctions List جایگزین آن شد.',
  },
  {
    categoryNum: 18,
    categoryFa: 'پژوهش، چشم‌انداز بلندمدت و مشاوران',
    countInDossier: 18,
    wave: 'موج ۲',
    tier: 1,
    access: 'رایگان · فایل/وب',
    keySources: ['IEA WEO', 'OPEC WOO 2026 (۱۲۴ mb/d)', 'EIA AEO/IEO', 'Energy Aspects', 'Oxford OIES', 'KAPSARC API', 'Dallas & KC Fed Energy Surveys'],
    criticalNoteFa: 'نظرسنجی فصلی Dallas Fed قیمت سربه‌سر حفاری شیل آمریکا را مشخص می‌کند.',
  },
  {
    categoryNum: 19,
    categoryFa: 'منابع فارسی، خاورمیانه و منطقه‌ای',
    countInDossier: 13,
    wave: 'موج ۲',
    tier: 1,
    access: 'رایگان · فایل/وب',
    keySources: ['شانا (SHANA)', 'وزارت نفت (MOP)', 'شرکت ملی نفت (NIOC)', 'بورس انرژی ایران (IRENEX)', 'بورس کالا (IME)', 'بانک مرکزی و مرکز آمار ایران', 'MEES', 'GASTAT / FCSC'],
    criticalNoteFa: 'تبدیل خودکار تقویم شمسی به میلادی و تطبیق ارقام صادرات با داده نفتکش.',
  },
  {
    categoryNum: 20,
    categoryFa: 'داده‌های باز، دانشگاهی و زیرساخت مکانی (GIS)',
    countInDossier: 6,
    wave: 'موج ۲',
    tier: 1,
    access: 'رایگان · API',
    keySources: ['Our World in Data Energy', 'GEM Global Oil Infrastructure Tracker (۱۶۳۴ خط لوله)', 'NETL GOGI (۴٫۸ میلیون عارضه)', 'OpenStreetMap Overpass'],
    criticalNoteFa: 'لایه GIS خطوط لوله و پایانه‌ها بر پایه GEM و NETL GOGI.',
  },
];

export interface PlatformAlertItem {
  id: string;
  priority: 'P0' | 'P1' | 'P2';
  titleFa: string;
  whatHappenedFa: string;
  whyItMattersFa: string;
  sourceFa: string;
  tier: 1 | 2 | 3;
  timeAgoFa: string;
  categoryFa: string;
  acknowledged: boolean;
}

export const INITIAL_ALERTS: PlatformAlertItem[] = [
  {
    id: 'alt-1',
    priority: 'P0',
    titleFa: 'افزایش غیرمنتظره ۴٫۱ میلیون بشکه‌ای موجودی بنزین آمریکا',
    whatHappenedFa: 'در گزارش هفتگی EIA WPSR، موجودی بنزین آمریکا ۴٫۱ میلیون بشکه افزایش یافت، در حالی که میانگین ۵ ساله همین هفته ۰٫۱− میلیون بشکه بود (انحراف ۴٫۲+ میلیون بشکه).',
    whyItMattersFa: 'فشار نزولی کوتاه‌مدت بر کرک اسپرد بنزین (RBOB) و حاشیه پالایش آمریکا؛ موجودی نفت خام تجاری بدون تغییر و ۱٫۷ میلیون بشکه زیر میانگین ۵ ساله ماند.',
    sourceFa: 'EIA WPSR (Series WGTSTUS1) · سطح اعتبار ۱',
    tier: 1,
    timeAgoFa: '۱۲ دقیقه پیش',
    categoryFa: 'موجودی هفتگی',
    acknowledged: false,
  },
  {
    id: 'alt-2',
    priority: 'P1',
    titleFa: 'هشدار سطح HIGH در تنگه هرمز و اختلال سیگنال AIS',
    whatHappenedFa: 'گزارش JMIC/UKMTO و داده IMF PortWatch کاهش ۵٫۲٪ ترانزیت روزانه نفتکش‌ها (۴۱ فروند) و افزایش نرخ بیمه ریسک جنگ به ۰٫۴۵٪ ارزش بدنه را ثبت کردند.',
    whyItMattersFa: 'تقویت تقاضای احتیاطی نفت (Oil-Specific Precautionary Demand) و افزایش نرخ حمل VLCC در مسیر خلیج فارس به آسیا به WS 74.',
    sourceFa: 'IMF PortWatch + JMIC/UKMTO · سطح اعتبار ۱',
    tier: 1,
    timeAgoFa: '۳۸ دقیقه پیش',
    categoryFa: 'ژئوپلیتیک و تنگه‌ها',
    acknowledged: false,
  },
  {
    id: 'alt-3',
    priority: 'P1',
    titleFa: 'تغییر فرمول قیمت‌گذاری OSP ادنوک از ۱ نوامبر ۲۰۲۶',
    whatHappenedFa: 'شرکت ملی نفت ابوظبی (ADNOC) مرجع قیمت‌گذاری رسمی نفت خام موربان و داس را از آتی IFAD به میانگین ماهانه Platts Dubai به‌علاوه تفاضل تغییر داد.',
    whyItMattersFa: 'ثبت شکست ساختاری در جدول «شکست سری» انبار داده؛ هم‌راستایی بیشتر فرمول قیمت‌گذاری امارات با آرامکو و سومو در بازار آسیا.',
    sourceFa: 'ADNOC Official Release + Platts · سطح اعتبار ۱',
    tier: 1,
    timeAgoFa: '۲ ساعت پیش',
    categoryFa: 'قیمت رسمی فروش (OSP)',
    acknowledged: false,
  },
  {
    id: 'alt-4',
    priority: 'P2',
    titleFa: 'واگرایی برآورد تقاضای جهانی ۲۰۲۷ بین اوپک MOMR و IEA OMR',
    whatHappenedFa: 'فاصله برآورد رشد تقاضای جهانی نفت بین دبیرخانه اوپک (۱٫۴۵ میلیون بشکه در روز) و آژانس بین‌المللی انرژی (۰٫۹۲ میلیون بشکه در روز) به ۵۳۰ هزار بشکه در روز رسید.',
    whyItMattersFa: 'طبق معماری پلتفرم، اختلاف بین‌منبعی پنهان نمی‌شود بلکه به‌عنوان سیگنال عدم قطعیت تقاضای آسیا روی کاکپیت نمایش داده می‌شود.',
    sourceFa: 'OPEC MOMR vs IEA OMR · سطح اعتبار ۱',
    tier: 1,
    timeAgoFa: '۴ ساعت پیش',
    categoryFa: 'تطبیق بین‌منبعی',
    acknowledged: true,
  },
];
