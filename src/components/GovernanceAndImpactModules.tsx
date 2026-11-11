import React, { useState } from 'react';
import {
  ShieldCheck,
  GitCommit,
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Database,
  Hash,
  Calendar,
  Building2,
  DollarSign,
  TrendingUp,
  Anchor,
  Layers,
  X,
  Edit3,
  ExternalLink,
  Sliders,
} from 'lucide-react';
import {
  toPersianDigits,
  formatSignedPersian,
  computeVintageRevisionStats,
  evaluateHitlQueueGate,
  convertNyReleaseToTehran,
  computeOrganizationalImpact,
  computeDataQualityScore,
  VintagePoint,
} from '../utils/oilAnalytics';
import { DeepPageId } from './CockpitViews';

// ============================================================================
// 1. LINEAGE & VINTAGE DRILL-DOWN DATA & MODAL
// ============================================================================

export interface ObservationLineageRecord {
  seriesKey: string;
  titleFa: string;
  displayValueFa: string;
  numericValue: number;
  unit: string;
  unitFa: string;
  sourceId: string;
  sourceNameFa: string;
  tier: 1 | 2 | 3;
  periodStart: string;
  periodEnd: string;
  frequencyFa: string;
  geography: string;
  product: string;
  metric: string;
  method: string;
  rawUnit: string;
  conversionFormulaFa: string;
  rawLakePath: string;
  sha256Digest: string;
  httpStatus: number;
  freshnessScore: number; // 0..15
  consistencyScore: number; // 0..15
  seriesBreakNoteFa: string | null;
  crossCheckPairFa: string;
  rawSnippetJson: string;
  vintages: VintagePoint[];
}

export const LINEAGE_VINTAGE_CATALOG: ObservationLineageRecord[] = [
  {
    seriesKey: 'eia.wpsr.crude_stocks',
    titleFa: 'موجودی نفت خام تجاری آمریکا (بدون SPR)',
    displayValueFa: '۴۱۵٫۰ میلیون بشکه',
    numericValue: 415.0,
    unit: 'mb',
    unitFa: 'میلیون بشکه (Million Barrels)',
    sourceId: 'eia_wpsr',
    sourceNameFa: 'EIA Weekly Petroleum Status Report (API v2)',
    tier: 1,
    periodStart: '2026-10-17',
    periodEnd: '2026-10-23',
    frequencyFa: 'هفتگی (منتهی به جمعه)',
    geography: 'USA (PADD 1–5 Total)',
    product: 'crude_oil_excl_spr',
    metric: 'ending_stocks',
    method: 'survey_reported (Form EIA-800/805)',
    rawUnit: 'Thousand Barrels (kb)',
    conversionFormulaFa: '۴۱۵٬۰۱۲ هزار بشکه ÷ ۱٬۰۰۰ = ۴۱۵٫۰ میلیون بشکه (بدون تبدیل چگالی)',
    rawLakePath: 'raw/source=eia/dataset=wpsr/vintage=2026-10-28T14:30:04Z/payload.json',
    sha256Digest: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    httpStatus: 200,
    freshnessScore: 15,
    consistencyScore: 14,
    seriesBreakNoteFa: null,
    crossCheckPairFa: 'API Weekly Statistical Bulletin (اختلاف هفتگی: ۰٫۳ میلیون بشکه — در بازه مجاز)',
    rawSnippetJson: `{
  "response": {
    "data": [{
      "period": "2026-10-23",
      "series": "WCESTUS1",
      "series-description": "U.S. Ending Stocks of Crude Oil excluding SPR",
      "value": 415012,
      "units": "MBBL"
    }]
  }
}`,
    vintages: [
      {
        vintageId: 'v1-flash',
        vintageTs: '2026-10-28T14:30:04Z',
        value: 415.0,
        method: 'wpsr_weekly_flash',
        noteFa: 'انتشار اولیه هفتگی (چهارشنبه ۱۰:۳۰ نیویورک)',
      },
      {
        vintageId: 'v2-prior-week',
        vintageTs: '2026-10-21T14:30:02Z',
        value: 415.4,
        method: 'wpsr_weekly_flash',
        noteFa: 'مقدار اولیه هفته قبل پیش از تعدیل واردات گمرکی',
      },
      {
        vintageId: 'v3-psm-bench',
        vintageTs: '2026-10-30T16:00:00Z',
        value: 415.0,
        method: 'psm_reconciled',
        noteFa: 'تطبیق نهایی با Petroleum Supply Monthly (بدون تغییر)',
      },
    ],
  },
  {
    seriesKey: 'eia.wpsr.gasoline_stocks',
    titleFa: 'موجودی کل بنزین موتور آمریکا (WGTSTUS1)',
    displayValueFa: '۲۱۴٫۶ میلیون بشکه (۴٫۱+ mb هفتگی)',
    numericValue: 214.6,
    unit: 'mb',
    unitFa: 'میلیون بشکه',
    sourceId: 'eia_wpsr',
    sourceNameFa: 'EIA Weekly Petroleum Status Report',
    tier: 1,
    periodStart: '2026-10-17',
    periodEnd: '2026-10-23',
    frequencyFa: 'هفتگی',
    geography: 'USA',
    product: 'motor_gasoline_total',
    metric: 'ending_stocks',
    method: 'survey_reported (Form EIA-800/801)',
    rawUnit: 'Thousand Barrels (kb)',
    conversionFormulaFa: '۲۱۴٬۶۰۸ هزار بشکه ÷ ۱٬۰۰۰ = ۲۱۴٫۶ میلیون بشکه',
    rawLakePath: 'raw/source=eia/dataset=wpsr/vintage=2026-10-28T14:30:04Z/gasoline.json',
    sha256Digest: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    httpStatus: 200,
    freshnessScore: 15,
    consistencyScore: 15,
    seriesBreakNoteFa: null,
    crossCheckPairFa: 'EIA Product Supplied 4W Avg (۸٬۴۱۷ هزار بشکه در روز)',
    rawSnippetJson: `{
  "period": "2026-10-23",
  "series": "WGTSTUS1",
  "value": 214608,
  "wow_change_mb": 4.1,
  "seasonal_5y_avg_change_mb": -0.1,
  "signal": "bearish_strong"
}`,
    vintages: [
      {
        vintageId: 'v1',
        vintageTs: '2026-10-21T14:30:00Z',
        value: 210.5,
        method: 'wpsr_weekly',
        noteFa: 'موجودی هفته منتهی به ۱۶ اکتبر',
      },
      {
        vintageId: 'v2',
        vintageTs: '2026-10-28T14:30:04Z',
        value: 214.6,
        method: 'wpsr_weekly',
        noteFa: 'افزایش ۴٫۱ میلیون بشکه‌ای در هفته ۲۳ اکتبر (فشار نزولی)',
      },
    ],
  },
  {
    seriesKey: 'adnoc.osp.murban_asia',
    titleFa: 'تفاضل قیمت رسمی فروش (OSP) موربان امارات به آسیا',
    displayValueFa: '۱٫۶۵+ دلار بر بشکه نسبت به Platts Dubai',
    numericValue: 1.65,
    unit: 'usd/bbl',
    unitFa: 'دلار بر بشکه (تفاضل نسبت به بنچمارک)',
    sourceId: 'gulf_osps',
    sourceNameFa: 'ADNOC Official Selling Price Release + Platts',
    tier: 1,
    periodStart: '2026-11-01',
    periodEnd: '2026-11-30',
    frequencyFa: 'ماهانه (اعلام روز ۵ ماه قبل)',
    geography: 'UAE -> Asia-Pacific',
    product: 'murban_crude_api_40',
    metric: 'osp_differential',
    method: 'official_notice + dual_media_verified',
    rawUnit: 'USD/bbl differential',
    conversionFormulaFa: 'مستقیم به دلار بر بشکه (تغییر بنچمارک پایه از IFAD به Platts Dubai)',
    rawLakePath: 'raw/source=adnoc/dataset=osp/vintage=2026-10-07T09:15:00Z/adnoc_nov2026.pdf',
    sha256Digest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    httpStatus: 200,
    freshnessScore: 14,
    consistencyScore: 14,
    seriesBreakNoteFa:
      'شکست ساختاری ثبت‌شده (2026-11-01): تغییر مرجع فرمول OSP ادنوک از قرارداد آتی IFAD Murban به میانگین ماهانه Platts Dubai.',
    crossCheckPairFa: 'Aramco Arab Extra Light OSP (+1.90 USD/bbl vs Oman/Dubai)',
    rawSnippetJson: `{
  "producer": "ADNOC",
  "effective_month": "2026-11",
  "grade": "Murban",
  "benchmark": "Platts Dubai Monthly Avg",
  "differential_usd_bbl": 1.65,
  "series_break_flag": true
}`,
    vintages: [
      {
        vintageId: 'v1-media',
        vintageTs: '2026-10-06T18:20:00Z',
        value: 1.60,
        method: 'llm_news_wire_draft',
        noteFa: 'برآورد اولیه نظرسنجی پالایشگران آسیایی رویترز',
      },
      {
        vintageId: 'v2-official',
        vintageTs: '2026-10-07T09:15:00Z',
        value: 1.65,
        method: 'adnoc_official_circular',
        noteFa: 'ابلاغیه رسمی ادنوک و تأیید تحلیلگر در صف HITL',
      },
    ],
  },
  {
    seriesKey: 'opec.momr.iran_secondary_prod',
    titleFa: 'تولید نفت خام ایران (منابع ثانویه اوپک MOMR)',
    displayValueFa: '۳٬۳۲۰ هزار بشکه در روز',
    numericValue: 3320,
    unit: 'kb/d',
    unitFa: 'هزار بشکه در روز (kb/d)',
    sourceId: 'opec_momr',
    sourceNameFa: 'OPEC Monthly Oil Market Report (Table 5-7)',
    tier: 1,
    periodStart: '2026-09-01',
    periodEnd: '2026-09-30',
    frequencyFa: 'ماهانه',
    geography: 'Iran (IRN)',
    product: 'crude_oil',
    metric: 'production',
    method: 'secondary_sources (پنل جدید ۸ منبع از فوریه ۲۰۲۵)',
    rawUnit: 'Thousand Barrels per Day (tb/d)',
    conversionFormulaFa: '۳٬۳۲۰ tb/d = ۳٫۳۲ میلیون بشکه در روز (ارقام ارتباط مستقیم: ۳٬۴۱۰ kb/d)',
    rawLakePath: 'raw/source=opec/dataset=momr/vintage=2026-10-14T11:00:00Z/momr_oct2026_tables.xlsx',
    sha256Digest: '7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730',
    httpStatus: 200,
    freshnessScore: 13,
    consistencyScore: 13,
    seriesBreakNoteFa:
      'شکست روش‌شناختی (2025-02-01): تغییر ترکیب منابع ثانویه اوپک (حذف EIA و Rystad؛ افزودن Kpler، OilX و ESAI).',
    crossCheckPairFa: 'ارتباط مستقیم وزارت نفت ایران (۳٬۴۱۰ kb/d — واگرایی ۹۰ هزار بشکه در روز)',
    rawSnippetJson: `{
  "report": "OPEC MOMR October 2026",
  "table": "5-7: OPEC Crude Oil Production based on Secondary Sources",
  "country": "IR Iran",
  "sep_2026_kbd": 3320,
  "direct_communication_kbd": 3410,
  "row_sum_verified": true
}`,
    vintages: [
      {
        vintageId: 'v1-prelim',
        vintageTs: '2026-09-12T12:00:00Z',
        value: 3285,
        method: 'secondary_sources_prelim',
        noteFa: 'برآورد اولیه در گزارش ماه سپتامبر',
      },
      {
        vintageId: 'v2-revised',
        vintageTs: '2026-10-14T11:00:00Z',
        value: 3320,
        method: 'secondary_sources_revised',
        noteFa: 'بازنگری ۳۵+ هزار بشکه در روز پس از تکمیل داده نفتکش Kpler/OilX',
      },
    ],
  },
  {
    seriesKey: 'kilian.svar.precautionary_demand_12m',
    titleFa: 'سهم تقاضای اختصاصی/احتیاطی نفت در تغییر ۱۲ ماهه قیمت واقعی',
    displayValueFa: '۱۷٫۲+ واحد لگاریتمی',
    numericValue: 17.2,
    unit: 'log_pts',
    unitFa: 'واحد لگاریتمی (تقریب درصد تغییر)',
    sourceId: 'fred_macro',
    sourceNameFa: 'موتور oil-shock-decomposition (FRED IGREA + EIA + CPI)',
    tier: 1,
    periodStart: '2025-08-01',
    periodEnd: '2026-08-31',
    frequencyFa: 'ماهانه (پنجره ۱۲ ماهه)',
    geography: 'Global',
    product: 'real_crude_oil_price',
    metric: 'historical_decomposition_contribution',
    method: 'svar_kilian_2009_cholesky_24lags',
    rawUnit: '100 × log(Real Price / CPI)',
    conversionFormulaFa: 'تورم‌زدایی قیمت اسمی با CPIAUCSL و تجزیه تاریخی ماتریس همراه پایدار (ریشه ۰٫۹۷۳)',
    rawLakePath: 'raw/source=fred/dataset=svar_inputs/vintage=2026-10-30T18:00:00Z/decompose_output.json',
    sha256Digest: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
    httpStatus: 200,
    freshnessScore: 14,
    consistencyScore: 14,
    seriesBreakNoteFa: null,
    crossCheckPairFa: 'سری شوک عرضه Känzig (2021) و روش بیزی Baumeister–Hamilton (2019)',
    rawSnippetJson: `{
  "skill": "oil-shock-decomposition",
  "window": "12m (2025-08 to 2026-08)",
  "contributions_log_pts": {
    "oil_specific_demand": 17.2,
    "supply": 6.2,
    "aggregate_demand": -11.2,
    "total_real_price_change_pct": 12.9
  },
  "max_companion_eigenvalue": 0.973
}`,
    vintages: [
      {
        vintageId: 'v1-aug-initial',
        vintageTs: '2026-09-28T18:00:00Z',
        value: 16.8,
        method: 'svar_kilian_v1',
        noteFa: 'محاسبه اولیه پیش از بازنگری شاخص فعالیت اقتصادی جهانی (IGREA)',
      },
      {
        vintageId: 'v2-oct-bench',
        vintageTs: '2026-10-30T18:00:00Z',
        value: 17.2,
        method: 'svar_kilian_v2',
        noteFa: 'محاسبه نهایی پس از به‌روزرسانی FRED IGREA و تولید جهانی EIA',
      },
    ],
  },
  {
    seriesKey: 'imf.portwatch.hormuz_flow',
    titleFa: 'عبور روزانه نفت خام و میعانات از تنگه هرمز',
    displayValueFa: '۱۹٫۸ میلیون بشکه در روز (۴۱ نفتکش)',
    numericValue: 19.8,
    unit: 'mb/d',
    unitFa: 'میلیون بشکه در روز',
    sourceId: 'imf_portwatch',
    sourceNameFa: 'IMF PortWatch Chokepoint Transit + Sentinel-1 SAR',
    tier: 1,
    periodStart: '2026-10-29',
    periodEnd: '2026-10-30',
    frequencyFa: 'روزانه',
    geography: 'Strait of Hormuz (OMN / IRN)',
    product: 'crude_and_products',
    metric: 'chokepoint_transit_flow',
    method: 'ais_terrestrial_satellite_fusion',
    rawUnit: 'Deadweight Tons (DWT) -> Barrels',
    conversionFormulaFa: 'تبدیل ظرفیت اسمی DWT نفتکش‌های عبوری با ضریب بارگیری ۰٫۸۸ و چگالی ۷٫۳۳ بشکه بر تن',
    rawLakePath: 'raw/source=imf_portwatch/dataset=chokepoints/vintage=2026-10-30T12:00:00Z/hormuz.json',
    sha256Digest: 'f5ca38f748a1d6eaf726b8a42fb575c3c71f1864a8143301782de13da2d9202b',
    httpStatus: 200,
    freshnessScore: 15,
    consistencyScore: 13,
    seriesBreakNoteFa: null,
    crossCheckPairFa: 'JMIC / UKMTO Threat Advisory + رادار دهانه ترکیبی Sentinel-1 (پایش کشتی‌های خاموش)',
    rawSnippetJson: `{
  "chokepoint_id": "chokepoint_hormuz",
  "date": "2026-10-30",
  "n_tankers": 41,
  "estimated_oil_flow_mbd": 19.8,
  "normal_baseline_mbd": 20.9,
  "ais_spoofing_anomaly": "HIGH"
}`,
    vintages: [
      {
        vintageId: 'v1-ais-only',
        vintageTs: '2026-10-30T06:00:00Z',
        value: 18.9,
        method: 'ais_raw_count',
        noteFa: 'شمارش اولیه AIS زمینی (بدون لحاظ نفتکش‌های دارای فرستنده خاموش)',
      },
      {
        vintageId: 'v2-sar-corrected',
        vintageTs: '2026-10-30T12:00:00Z',
        value: 19.8,
        method: 'ais_plus_sentinel1_sar',
        noteFa: 'اصلاح ۰٫۹+ میلیون بشکه پس از تطبیق با تصویر راداری Sentinel-1',
      },
    ],
  },
];

interface LineageVintageModalProps {
  isOpen: boolean;
  initialSeriesKey?: string;
  onClose: () => void;
}

export const LineageVintageModal: React.FC<LineageVintageModalProps> = ({
  isOpen,
  initialSeriesKey = 'eia.wpsr.crude_stocks',
  onClose,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>(initialSeriesKey);
  const [forecastOriginDate, setForecastOriginDate] = useState<string>('2026-10-30');

  if (!isOpen) return null;

  const record =
    LINEAGE_VINTAGE_CATALOG.find((r) => r.seriesKey === selectedKey) ||
    LINEAGE_VINTAGE_CATALOG[0];

  const revStats = computeVintageRevisionStats(
    record.vintages,
    `${forecastOriginDate}T23:59:59Z`
  );

  const qualityScore = computeDataQualityScore({
    tier: record.tier,
    freshnessScore: record.freshnessScore,
    consistencyScore: record.consistencyScore,
    revisionStabilityScore: revStats.revisionStabilityScore,
  });

  return (
    <div
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label="بازرس ردیابی عدد تا منبع خام و تاریخچه بازنگری‌ها"
      className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-[#FAF9F5] rounded-2xl max-w-5xl w-full p-6 border border-stone-300 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto text-[#1E1D1B]">
        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#B83E16]/15 border border-[#B83E16]/30 flex items-center justify-center text-[#B83E16]">
              <GitCommit className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#B83E16]">
                حاکمیت داده و حسابرسی Point-in-Time (بخش ۳-۲ و ۴-۶ پرونده)
              </span>
              <h2 className="text-lg font-extrabold text-[#1E1D1B]">
                ردیابی عدد تا منبع خام و تاریخچه بازنگری‌ها (Lineage & Vintage Drill-Down)
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="بستن پنجره ردیابی منبع"
            className="p-2 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Series Selector Pills */}
        <div>
          <div className="text-xs font-bold text-stone-600 mb-2">
            انتخاب سری داده جهت حسابرسی زنجیره تأمین داده (Lineage):
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {LINEAGE_VINTAGE_CATALOG.map((item) => (
              <button
                key={item.seriesKey}
                type="button"
                onClick={() => setSelectedKey(item.seriesKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  record.seriesKey === item.seriesKey
                    ? 'bg-[#B83E16] text-white shadow-xs'
                    : 'bg-stone-200/80 text-stone-700 hover:bg-stone-300/70'
                }`}
              >
                <span>{item.titleFa.split('(')[0]}</span>
                <span className="font-mono-num text-[10px] mr-1.5 opacity-80" dir="ltr">
                  [{item.seriesKey}]
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Top Summary Strip: Canonical Observation + Quality Score Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 bg-white rounded-xl p-4 border border-stone-200/90 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
              <div>
                <div className="text-xs text-stone-500">عنوان شاخص در جدول مشاهدات (observation):</div>
                <h3 className="text-base font-extrabold text-stone-900 mt-0.5">{record.titleFa}</h3>
              </div>
              <div className="text-left">
                <span className="px-3 py-1 rounded-lg bg-[#1E1D1B] text-[#F2DA63] font-mono-num text-sm font-extrabold">
                  {record.displayValueFa}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-stone-100">
                <span className="text-stone-500 block text-[11px]">شناسه یکتای سری:</span>
                <span className="font-mono-num font-bold text-stone-900 text-[11px]" dir="ltr">
                  {record.seriesKey}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-100">
                <span className="text-stone-500 block text-[11px]">منبع و سطح اعتبار:</span>
                <span className="font-bold text-stone-900">
                  سطح {toPersianDigits(record.tier)} · {record.sourceId}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-100">
                <span className="text-stone-500 block text-[11px]">بازه زمانی (Period):</span>
                <span className="font-mono-num font-bold text-stone-900" dir="ltr">
                  {record.periodEnd}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-100">
                <span className="text-stone-500 block text-[11px]">روش تولید (method):</span>
                <span className="font-mono-num font-bold text-[#B83E16] text-[11px]" dir="ltr">
                  {record.method}
                </span>
              </div>
            </div>

            {/* Unit Conversion & Cross-Check Audit */}
            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/80 text-xs space-y-1.5">
              <div>
                <strong className="text-stone-900">تبدیل واحد و چگالی (Unit Standardizer): </strong>
                <span className="text-stone-700">
                  واحد خام ({record.rawUnit}) ← {record.conversionFormulaFa}
                </span>
              </div>
              <div>
                <strong className="text-stone-900">جفت تطبیق بین‌منبعی (Cross-Source Check): </strong>
                <span className="text-stone-700">{record.crossCheckPairFa}</span>
              </div>
            </div>

            {/* Structural Series Break Alert (if applicable) */}
            {record.seriesBreakNoteFa && (
              <div className="p-3 rounded-lg bg-[#D96B27]/12 border border-[#D96B27]/40 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-[#B83E16] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#B83E16] block">
                    هشدار جدول شکست سری (series_breaks):
                  </strong>
                  <span className="text-stone-800">{record.seriesBreakNoteFa}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Card: 0..100 Quality Score & Look-Ahead Bias Gate */}
          <div className="lg:col-span-4 bg-[#22211F] text-white rounded-xl p-4 border border-stone-800 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <span className="text-xs font-bold text-[#E68A56]">امتیاز کیفیت نقطه داده</span>
                <span className="font-mono-num text-2xl font-extrabold text-[#F2DA63]">
                  {toPersianDigits(qualityScore)} / ۱۰۰
                </span>
              </div>

              <div className="space-y-2 mt-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-400">پایه سطح اعتبار (Tier {record.tier}):</span>
                  <span className="font-mono-num font-bold text-white">
                    {toPersianDigits(record.tier === 1 ? 60 : record.tier === 2 ? 45 : 30)} / ۶۰
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">تازگی داده (Freshness):</span>
                  <span className="font-mono-num font-bold text-white">
                    {toPersianDigits(record.freshnessScore)} / ۱۵
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">سازگاری بین‌منبعی:</span>
                  <span className="font-mono-num font-bold text-white">
                    {toPersianDigits(record.consistencyScore)} / ۱۵
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">پایداری در بازنگری (Vintage):</span>
                  <span className="font-mono-num font-bold text-white">
                    {toPersianDigits(revStats.revisionStabilityScore)} / ۱۰
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Look-Ahead Bias Tester */}
            <div className="pt-3 border-t border-stone-800 space-y-2 text-xs">
              <label className="block text-stone-300 font-bold">
                آزمون عدم نشت آینده (Look-Ahead Gate) در تاریخ مبدأ:
              </label>
              <input
                type="date"
                value={forecastOriginDate}
                onChange={(e) => setForecastOriginDate(e.target.value)}
                aria-label="تاریخ مبدأ پیش‌بینی برای کنترل نشت آینده"
                className="w-full px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-white font-mono-num text-xs"
              />
              <div
                className={`p-2 rounded-lg text-[11px] font-bold flex items-center gap-1.5 ${
                  revStats.lookAheadSafe
                    ? 'bg-[#2D8A4E]/25 text-[#68D391] border border-[#2D8A4E]/50'
                    : 'bg-[#B83E16]/30 text-[#FEB2B2] border border-[#B83E16]'
                }`}
              >
                {revStats.lookAheadSafe ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>مجاز برای مدل پیش‌بینی (vintage_ts ≤ origin)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>مسدود: نشت اطلاعات آینده! (vintage_ts &gt; origin)</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Point-in-Time Vintage Revision History Ledger */}
        <div className="bg-white rounded-xl p-4 border border-stone-200/90 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-extrabold text-[#1E1D1B]">
                دفتر کل تاریخچه بازنگری‌ها (Point-in-Time Vintage Ledger — ستون vintage_ts)
              </h3>
              <p className="text-[11px] text-stone-500">
                هیچ بازنگری‌ای روی مقدار قبلی بازنویسی (Overwrite) نمی‌شود؛ هر انتشار یک ردیف جدید با زمان ثبت دقیق ایجاد می‌کند
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 font-bold">
                مقدار اولیه: <strong className="font-mono-num">{toPersianDigits(revStats.initialValue)}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 font-bold">
                آخرین بازنگری: <strong className="font-mono-num">{toPersianDigits(revStats.latestValue)}</strong>
              </span>
              <span
                className={`px-2.5 py-1 rounded-md font-bold font-mono-num ${
                  revStats.netRevision === 0
                    ? 'bg-stone-200 text-stone-700'
                    : 'bg-[#B83E16]/15 text-[#B83E16]'
                }`}
              >
                خالص بازنگری: {formatSignedPersian(revStats.netRevision, 2)} ({formatSignedPersian(revStats.netRevisionPct, 2)}٪)
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="text-stone-500 border-b border-stone-200">
                  <th className="pb-2">نسخه (Vintage ID)</th>
                  <th className="pb-2">زمان ثبت در انبار (vintage_ts)</th>
                  <th className="pb-2">مقدار ثبت‌شده</th>
                  <th className="pb-2">روش (method)</th>
                  <th className="pb-2">توضیح بازنگری و منشأ تغییر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {record.vintages.map((v, idx) => (
                  <tr key={v.vintageId} className="hover:bg-stone-50">
                    <td className="py-2 font-mono-num font-bold text-stone-900" dir="ltr">
                      {v.vintageId} {idx === record.vintages.length - 1 ? '(فعلی)' : ''}
                    </td>
                    <td className="py-2 font-mono-num text-stone-600" dir="ltr">
                      {v.vintageTs}
                    </td>
                    <td className="py-2 font-mono-num font-extrabold text-[#B83E16]">
                      {toPersianDigits(v.value)} <span className="text-[10px] font-normal">{record.unit}</span>
                    </td>
                    <td className="py-2 font-mono-num text-stone-700" dir="ltr">
                      {v.method}
                    </td>
                    <td className="py-2 text-stone-700">{v.noteFa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Section: Raw Data Lake Manifest & SHA-256 Cryptographic Proof */}
        <div className="bg-[#22211F] text-stone-200 rounded-xl p-4 border border-stone-800 space-y-2.5 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-2">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-[#F2DA63]" />
              <span className="font-bold text-white">
                گواهی دریاچه داده خام (Raw Data Lake Manifest & SHA-256 Digest)
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#2D8A4E] text-white font-mono-num text-[11px] font-bold">
              HTTP {record.httpStatus} · VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono-num text-[11px]" dir="ltr">
            <div className="p-2 rounded bg-stone-900 border border-stone-800 truncate">
              <span className="text-stone-400">raw_ref: </span>
              <span className="text-[#F2DA63]">{record.rawLakePath}</span>
            </div>
            <div className="p-2 rounded bg-stone-900 border border-stone-800 truncate">
              <span className="text-stone-400">sha256: </span>
              <span className="text-emerald-400">{record.sha256Digest}</span>
            </div>
          </div>

          <pre
            dir="ltr"
            className="font-mono-num text-[11px] bg-stone-950 text-stone-300 p-3 rounded-lg overflow-x-auto leading-relaxed"
          >
            {record.rawSnippetJson}
          </pre>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. HUMAN-IN-THE-LOOP (HITL) VERIFICATION QUEUE PANEL
// ============================================================================

export interface HitlQueueItem {
  id: string;
  pattern: 'D_OSP' | 'C_PDF' | 'TIER3_ALERT';
  patternLabelFa: string;
  titleFa: string;
  sourceFa: string;
  extractedValue: number;
  unitFa: string;
  priorValue: number;
  rowSumDelta?: number;
  independentSourcesCount: number;
  corroboratingSourceFa: string;
  llmConfidencePct: number;
  rawExcerptFa: string;
  analystApproved: boolean;
  analystRejected: boolean;
  seriesKey: string;
}

export const INITIAL_HITL_QUEUE: HitlQueueItem[] = [
  {
    id: 'hitl-osp-nioc',
    pattern: 'D_OSP',
    patternLabelFa: 'الگوی D · استخراج OSP از خبر + LLM',
    titleFa: 'تفاضل OSP نفت سبک ایران (Iranian Light) تحویل آسیا — نوامبر ۲۰۲۶',
    sourceFa: 'گزارش اولیه Reuters + MEES (نیازمند تأیید تحلیلگر)',
    extractedValue: 1.85,
    unitFa: 'دلار بر بشکه نسبت به میانگین عمان/دبی',
    priorValue: 1.60,
    independentSourcesCount: 2,
    corroboratingSourceFa: 'تطبیق با جدول ابلاغی به پالایشگران آسیایی در Platts',
    llmConfidencePct: 94,
    rawExcerptFa:
      '«شرکت ملی نفت ایران (NIOC) قیمت رسمی فروش نفت خام ایران سبک برای تحویل ماه نوامبر به مشتریان آسیایی را ۲۵ سنت افزایش داد و به ۱٫۸۵ دلار بالاتر از میانگین عمان/دبی رساند.»',
    analystApproved: false,
    analystRejected: false,
    seriesKey: 'adnoc.osp.murban_asia',
  },
  {
    id: 'hitl-pdf-momr',
    pattern: 'C_PDF',
    patternLabelFa: 'الگوی C · استخراج جدول PDF با کنترل جمع سطرها',
    titleFa: 'جدول ۵-۷ گزارش ماهانه اوپک (MOMR): تولید ۱۲ عضو بر اساس منابع ثانویه',
    sourceFa: 'OPEC MOMR October 2026 PDF (صفحه ۵۸)',
    extractedValue: 26540,
    unitFa: 'هزار بشکه در روز (جمع کل اوپک-۱۲)',
    priorValue: 26485,
    rowSumDelta: 0,
    independentSourcesCount: 2,
    corroboratingSourceFa: 'کنترل خودکار: جمع تک‌تک اعضا (۲۶٬۵۴۰) دقیقاً برابر سرجمع جدول است (اختلاف: ۰)',
    llmConfidencePct: 99,
    rawExcerptFa:
      'عربستان: ۸٬۹۹۲ · عراق: ۴٬۱۶۰ · ایران: ۳٬۳۲۰ · امارات: ۲٬۹۵۵ · کویت: ۲٬۴۱۸ · نیجریه: ۱٬۴۳۵ ... سرجمع جدول: ۲۶٬۵۴۰ هزار بشکه در روز.',
    analystApproved: true,
    analystRejected: false,
    seriesKey: 'opec.momr.iran_secondary_prod',
  },
  {
    id: 'hitl-pdf-gacc',
    pattern: 'C_PDF',
    patternLabelFa: 'الگوی C · استخراج جدول وب گمرک چین (GACC)',
    titleFa: 'واردات نفت خام چین در ماه سپتامبر ۲۰۲۶ (تبدیل تن متریک به بشکه در روز)',
    sourceFa: 'بیانیه گمرک چین (GACC) — جدول کالایی فصل ۲۷',
    extractedValue: 11085,
    unitFa: 'هزار بشکه در روز (با ضریب ۷٫۳۳ بشکه بر تن)',
    priorValue: 11560,
    rowSumDelta: 14,
    independentSourcesCount: 1,
    corroboratingSourceFa: 'هشدار جمع سطرها: اختلاف ۱۴ هزار بشکه ناشی از گرد کردن ضریب چگالی (نیازمند تأیید تحلیلگر)',
    llmConfidencePct: 86,
    rawExcerptFa:
      'حجم واردات ماه سپتامبر: ۴۵٫۳۷ میلیون تن متریک در ۳۰ روز ← ۴۵٫۳۷ × ۷٫۳۳ ÷ ۳۰ = ۱۱٫۰۸۵ میلیون بشکه در روز.',
    analystApproved: false,
    analystRejected: false,
    seriesKey: 'eia.wpsr.crude_stocks',
  },
  {
    id: 'hitl-tier3-sts',
    pattern: 'TIER3_ALERT',
    patternLabelFa: 'دروازه هشدار سطح ۳ · الزام تأیید منبع دوم مستقل',
    titleFa: 'گزارش انتقال کشتی‌به‌کشتی (STS) ۱٫۸ میلیون بشکه نفت خام در شرق جوهور (مالاکا)',
    sourceFa: 'ردیاب سطح ۳ (TankerTrackers / KSE) + رادار Sentinel-1 SAR',
    extractedValue: 1.8,
    unitFa: 'میلیون بشکه (۲ فروند VLCC ناوگان سایه)',
    priorValue: 1.2,
    independentSourcesCount: 2,
    corroboratingSourceFa: 'تأیید مستقل توسط تصویر رادار دهانه ترکیبی Copernicus Sentinel-1 در مختصات 1.42°N, 104.38°E',
    llmConfidencePct: 91,
    rawExcerptFa:
      '«دو نفتکش VLCC با فرستنده AIS خاموش در ۳۵ مایلی شرق سنگاپور توسط تصویر SAR شناسایی شدند؛ هم‌سنجی با داده PortWatch انجام شد.»',
    analystApproved: false,
    analystRejected: false,
    seriesKey: 'imf.portwatch.hormuz_flow',
  },
];

interface HitlVerificationQueuePanelProps {
  onInspectLineage?: (seriesKey: string) => void;
}

export const HitlVerificationQueuePanel: React.FC<HitlVerificationQueuePanelProps> = ({
  onInspectLineage,
}) => {
  const [queue, setQueue] = useState<HitlQueueItem[]>(INITIAL_HITL_QUEUE);
  const [filterPattern, setFilterPattern] = useState<'ALL' | 'D_OSP' | 'C_PDF' | 'TIER3_ALERT'>('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState<string>('');

  const filteredItems = queue.filter(
    (item) => filterPattern === 'ALL' || item.pattern === filterPattern
  );

  const pendingCount = queue.filter((i) => !i.analystApproved && !i.analystRejected).length;

  const handleApprove = (id: string) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              analystApproved: true,
              analystRejected: false,
              rowSumDelta: 0,
              independentSourcesCount: Math.max(2, item.independentSourcesCount),
            }
          : item
      )
    );
  };

  const handleReject = (id: string) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, analystApproved: false, analystRejected: true } : item
      )
    );
  };

  const handleAddCorroboratingSource = (id: string) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, independentSourcesCount: item.independentSourcesCount + 1 }
          : item
      )
    );
  };

  const handleSaveEdit = (id: string) => {
    const parsed = parseFloat(editVal);
    if (!Number.isNaN(parsed)) {
      setQueue((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, extractedValue: parsed, rowSumDelta: 0 } : item
        )
      );
    }
    setEditingId(null);
  };

  return (
    <div className="bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs space-y-4" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div>
          <div className="text-xs font-bold text-[#B83E16]">
            لایه ۳ معماری (اعتبارسنجی ۵ لایه) · صف تأیید انسانی (Human-in-the-Loop Verification Queue)
          </div>
          <h3 className="text-base font-extrabold text-[#1E1D1B] mt-0.5">
            صف بازبینی و تأیید تحلیلگر برای OSP خلیج فارس (الگوی D)، جداول PDF (الگوی C) و هشدارهای سطح ۳
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-[#B83E16]/15 text-[#B83E16] text-xs font-extrabold">
            در انتظار تأیید: {toPersianDigits(pendingCount)} مورد
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 bg-stone-200/70 p-1 rounded-lg text-xs">
        {(
          [
            { id: 'ALL', label: 'همه موارد صف تأیید' },
            { id: 'D_OSP', label: 'تفاضل‌های OSP (الگوی D)' },
            { id: 'C_PDF', label: 'استخراج جداول PDF/وب (الگوی C)' },
            { id: 'TIER3_ALERT', label: 'هشدارهای سطح ۳ (تأیید دوگانه)' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterPattern(tab.id)}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
              filterPattern === tab.id
                ? 'bg-[#1E1D1B] text-white'
                : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Queue Items */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const gate = evaluateHitlQueueGate({
            pattern: item.pattern,
            rowSumDelta: item.rowSumDelta,
            independentSourcesCount: item.independentSourcesCount,
            analystApproved: item.analystApproved,
          });

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                item.analystRejected
                  ? 'bg-stone-100 border-stone-300 opacity-65'
                  : gate.gateStatus === 'APPROVED'
                  ? 'bg-white border-[#2D8A4E]/50'
                  : gate.gateStatus === 'BLOCKED'
                  ? 'bg-[#B83E16]/5 border-[#B83E16]/50'
                  : 'bg-white border-stone-300'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-800 text-[11px] font-bold">
                    {item.patternLabelFa}
                  </span>
                  <h4 className="text-sm font-extrabold text-[#1E1D1B]">{item.titleFa}</h4>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                    item.analystRejected
                      ? 'bg-stone-600 text-white'
                      : gate.gateStatus === 'APPROVED'
                      ? 'bg-[#2D8A4E] text-white'
                      : gate.gateStatus === 'BLOCKED'
                      ? 'bg-[#B83E16] text-white'
                      : 'bg-[#D96B27] text-white'
                  }`}
                >
                  {item.analystRejected ? 'رد شده توسط تحلیلگر' : gate.gateLabelFa}
                </span>
              </div>

              {/* Extracted Value vs Prior + Confidence */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center my-2.5 p-3 rounded-lg bg-stone-100/90 border border-stone-200/80 text-xs">
                <div className="md:col-span-5">
                  <span className="text-stone-500 block text-[11px]">مقدار استخراج‌شده از منبع:</span>
                  {editingId === item.id ? (
                    <div className="flex items-center gap-1.5 mt-1">
                      <input
                        type="number"
                        step="0.05"
                        value={editVal}
                        onChange={(e) => setEditVal(e.target.value)}
                        aria-label="ویرایش مقدار استخراج‌شده"
                        className="w-28 px-2 py-1 rounded border border-stone-400 bg-white font-mono-num text-xs font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(item.id)}
                        className="px-2.5 py-1 rounded bg-[#2D8A4E] text-white text-[11px] font-bold"
                      >
                        ذخیره
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono-num text-base font-extrabold text-[#B83E16]">
                        {toPersianDigits(item.extractedValue)}
                      </span>
                      <span className="text-stone-600 text-[11px]">{item.unitFa}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(item.id);
                          setEditVal(String(item.extractedValue));
                        }}
                        title="اصلاح دستی عدد پیش از تأیید"
                        className="text-stone-500 hover:text-stone-900 p-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="md:col-span-4">
                  <span className="text-stone-500 block text-[11px]">مقدار دوره قبل و تعداد منابع مستقل:</span>
                  <div className="font-bold text-stone-800 mt-0.5">
                    دوره قبل: <span className="font-mono-num">{toPersianDigits(item.priorValue)}</span> ·{' '}
                    <span className="text-[#2D8A4E]">
                      {toPersianDigits(item.independentSourcesCount)} منبع مستقل
                    </span>
                  </div>
                </div>

                <div className="md:col-span-3 text-left">
                  <span className="text-stone-500 block text-[11px]">اطمینان استخراج (Confidence):</span>
                  <span className="font-mono-num font-extrabold text-stone-900">
                    {toPersianDigits(item.llmConfidencePct)}٪
                  </span>
                </div>
              </div>

              <div className="text-xs text-stone-700 space-y-1 leading-relaxed">
                <div>
                  <strong className="text-stone-900">گزیده متن/جدول خام: </strong>
                  {item.rawExcerptFa}
                </div>
                <div>
                  <strong className="text-stone-900">وضعیت کنترل متقابل: </strong>
                  {item.corroboratingSourceFa} — <span className="text-stone-500">{gate.reasonFa}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 pt-2.5 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-stone-500">منبع: {item.sourceFa}</span>
                  {onInspectLineage && (
                    <button
                      type="button"
                      onClick={() => onInspectLineage(item.seriesKey)}
                      className="text-[#B83E16] font-bold hover:underline flex items-center gap-1"
                    >
                      <span>ردیابی تا فایل خام (Lineage)</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {item.independentSourcesCount < 2 && (
                    <button
                      type="button"
                      onClick={() => handleAddCorroboratingSource(item.id)}
                      className="px-2.5 py-1 rounded-md bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold transition-colors"
                    >
                      + ثبت منبع پشتیبان دوم
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleApprove(item.id)}
                    disabled={item.analystApproved}
                    className={`px-3 py-1 rounded-md font-bold transition-colors flex items-center gap-1 ${
                      item.analystApproved
                        ? 'bg-[#2D8A4E]/20 text-[#2D8A4E] cursor-default'
                        : 'bg-[#2D8A4E] hover:bg-[#236B3C] text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {item.analystApproved
                        ? 'تأیید و ثبت‌شده در observation'
                        : 'تأیید تحلیلگر و ثبت در انبار'}
                    </span>
                  </button>
                  {!item.analystRejected && (
                    <button
                      type="button"
                      onClick={() => handleReject(item.id)}
                      className="px-2.5 py-1 rounded-md bg-stone-200 hover:bg-[#B83E16] hover:text-white text-stone-700 font-bold transition-colors"
                    >
                      رد و بازفرستی
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// 3. INTERACTIVE TEHRAN / NEW YORK RELEASE & CATALYST CALENDAR
// ============================================================================

export interface ReleaseCalendarEvent {
  id: string;
  sourceId: string;
  titleFa: string;
  category: 'weekly' | 'monthly' | 'daily' | 'catalyst';
  categoryFa: string;
  dayOfWeekFa: string;
  nyHour24: number;
  nyMinute: number;
  countdownFa: string;
  holidayShiftEligible: boolean;
  holidayNoteFa: string;
  targetModule: DeepPageId;
  seriesKeyForLineage: string;
}

export const RELEASE_CALENDAR_EVENTS: ReleaseCalendarEvent[] = [
  {
    id: 'cal-wpsr',
    sourceId: 'eia_wpsr',
    titleFa: 'گزارش هفتگی وضعیت نفت آمریکا (EIA WPSR)',
    category: 'weekly',
    categoryFa: 'هفتگی',
    dayOfWeekFa: 'چهارشنبه',
    nyHour24: 10,
    nyMinute: 30,
    countdownFa: '۲ روز و ۴ ساعت مانده',
    holidayShiftEligible: true,
    holidayNoteFa: 'در هفته‌های دارای تعطیلی رسمی فدرال آمریکا به پنج‌شنبه ۱۱:۰۰ نیویورک منتقل می‌شود.',
    targetModule: 'eia_stocks',
    seriesKeyForLineage: 'eia.wpsr.crude_stocks',
  },
  {
    id: 'cal-cot-cftc',
    sourceId: 'cftc_cot',
    titleFa: 'گزارش موقعیت معامله‌گران آتی WTI (CFTC Disaggregated COT)',
    category: 'weekly',
    categoryFa: 'هفتگی',
    dayOfWeekFa: 'جمعه',
    nyHour24: 15,
    nyMinute: 30,
    countdownFa: '۴ روز و ۹ ساعت مانده',
    holidayShiftEligible: true,
    holidayNoteFa: 'شامل موقعیت خالص پول هوشمند (Managed Money) تا سه‌شنبه همان هفته.',
    targetModule: 'cot_macro_sentiment',
    seriesKeyForLineage: 'eia.wpsr.crude_stocks',
  },
  {
    id: 'cal-baker',
    sourceId: 'baker_hughes',
    titleFa: 'آمار هفتگی دکل‌های حفاری آمریکا و جهان (Baker Hughes Rig Count)',
    category: 'weekly',
    categoryFa: 'هفتگی',
    dayOfWeekFa: 'جمعه',
    nyHour24: 13,
    nyMinute: 0,
    countdownFa: '۴ روز و ۶ ساعت مانده',
    holidayShiftEligible: true,
    holidayNoteFa: 'پیش‌نگر تولید شیل آمریکا در افق ۴ تا ۶ ماه آینده.',
    targetModule: 'balance_opec',
    seriesKeyForLineage: 'eia.wpsr.crude_stocks',
  },
  {
    id: 'cal-eia-spot',
    sourceId: 'eia_spot',
    titleFa: 'قیمت‌های اسپات روزانه برنت، WTI و فرآورده‌ها (EIA / FRED)',
    category: 'daily',
    categoryFa: 'روزانه',
    dayOfWeekFa: 'دوشنبه',
    nyHour24: 10,
    nyMinute: 0,
    countdownFa: '۶ ساعت مانده',
    holidayShiftEligible: false,
    holidayNoteFa: 'به‌روزرسانی روزهای کاری؛ ورودی مستقیم محاسبه کرک اسپرد ۳:۲:۱.',
    targetModule: 'osp_crack_margins',
    seriesKeyForLineage: 'eia.wpsr.gasoline_stocks',
  },
  {
    id: 'cal-portwatch',
    sourceId: 'imf_portwatch',
    titleFa: 'تردد روزانه نفتکش‌ها در تنگه هرمز و باب‌المندب (IMF PortWatch)',
    category: 'daily',
    categoryFa: 'روزانه',
    dayOfWeekFa: 'دوشنبه',
    nyHour24: 8,
    nyMinute: 0,
    countdownFa: '۴ ساعت مانده',
    holidayShiftEligible: false,
    holidayNoteFa: 'هم‌سنجی خودکار با رادار Sentinel-1 برای تشخیص نفتکش‌های خاموش.',
    targetModule: 'geopolitics',
    seriesKeyForLineage: 'imf.portwatch.hormuz_flow',
  },
  {
    id: 'cal-opec-momr',
    sourceId: 'opec_momr',
    titleFa: 'گزارش ماهانه بازار نفت اوپک (OPEC MOMR — ۱۴ نوامبر ۲۰۲۶)',
    category: 'monthly',
    categoryFa: 'ماهانه',
    dayOfWeekFa: 'سه‌شنبه',
    nyHour24: 7,
    nyMinute: 0,
    countdownFa: '۱۲ روز مانده',
    holidayShiftEligible: false,
    holidayNoteFa: 'اجرای خودکار پارسر جدول ۵-۷ منابع ثانویه و تطبیق با IEA OMR.',
    targetModule: 'balance_opec',
    seriesKeyForLineage: 'opec.momr.iran_secondary_prod',
  },
  {
    id: 'cal-gulf-osp',
    sourceId: 'gulf_osps',
    titleFa: 'پنجره اعلام قیمت‌های رسمی فروش (OSP) آرامکو، ادنوک و NIOC (روز ۵ تا ۸ ماه)',
    category: 'monthly',
    categoryFa: 'ماهانه',
    dayOfWeekFa: 'پنج‌شنبه',
    nyHour24: 6,
    nyMinute: 0,
    countdownFa: '۵ روز مانده',
    holidayShiftEligible: false,
    holidayNoteFa: 'ورود خودکار به صف تأیید انسانی (الگوی D) پس از انتشار در رویترز و بلومبرگ.',
    targetModule: 'osp_crack_margins',
    seriesKeyForLineage: 'adnoc.osp.murban_asia',
  },
  {
    id: 'cal-opec-jmmc',
    sourceId: 'opec_jmmc',
    titleFa: 'نشست کمیته مشترک وزارتی نظارت بر بازار اوپک+ (JMMC & ONOMM)',
    category: 'catalyst',
    categoryFa: 'رویداد کلیدی / اوپک+',
    dayOfWeekFa: 'چهارشنبه',
    nyHour24: 9,
    nyMinute: 0,
    countdownFa: '۱۸ روز مانده (۱ دسامبر ۲۰۲۶)',
    holidayShiftEligible: false,
    holidayNoteFa: 'تصمیم‌گیری درباره سهمیه‌های سه‌ماهه اول ۲۰۲۷ و برنامه جبران اضافه‌تولید عراق و قزاقستان.',
    targetModule: 'forecast_scenario',
    seriesKeyForLineage: 'opec.momr.iran_secondary_prod',
  },
];

interface InteractiveReleaseCalendarPanelProps {
  onNavigateModule?: (page: DeepPageId) => void;
  onInspectLineage?: (seriesKey: string) => void;
}

export const InteractiveReleaseCalendarPanel: React.FC<InteractiveReleaseCalendarPanelProps> = ({
  onNavigateModule,
  onInspectLineage,
}) => {
  const [isUsDst, setIsUsDst] = useState<boolean>(true);
  const [isUsHolidayWeek, setIsUsHolidayWeek] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'weekly' | 'monthly' | 'daily' | 'catalyst'>('ALL');

  const visibleEvents = RELEASE_CALENDAR_EVENTS.filter(
    (ev) => categoryFilter === 'ALL' || ev.category === categoryFilter
  );

  return (
    <div className="bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs space-y-4" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div>
          <div className="text-xs font-bold text-[#B83E16]">
            زمان‌بندی تقویم‌محور جمع‌آوری داده (بخش ۴-۵ پرونده) · هماهنگ با ساعت تهران (IRST) و نیویورک (ET)
          </div>
          <h3 className="text-base font-extrabold text-[#1E1D1B] mt-0.5">
            تقویم تعاملی انتشارهای موج ۱، نشست‌های اوپک+ و شبیه‌ساز شیفت تعطیلات آمریکا
          </h3>
        </div>

        {/* Timezone & Holiday Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setIsUsDst((v) => !v)}
            className="px-3 py-1.5 rounded-lg bg-[#22211F] text-[#F2DA63] font-bold hover:bg-stone-800 transition-colors"
          >
            {isUsDst
              ? 'حالت فعلی: تابستانی آمریکا (EDT · اختلاف +۷:۳۰ با تهران)'
              : 'حالت فعلی: زمستانی آمریکا (EST · اختلاف +۸:۳۰ با تهران)'}
          </button>

          <button
            type="button"
            onClick={() => setIsUsHolidayWeek((v) => !v)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors border ${
              isUsHolidayWeek
                ? 'bg-[#B83E16] text-white border-[#B83E16]'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
            }`}
          >
            {isUsHolidayWeek ? '✓ هفته تعطیل رسمی آمریکا (شیفت +۱ روز فعال)' : 'شبیه‌سازی هفته تعطیل آمریکا'}
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 bg-stone-200/70 p-1 rounded-lg text-xs">
        {(
          [
            { id: 'ALL', label: 'همه انتشارها و کاتالیزورها' },
            { id: 'daily', label: 'روزانه (Spot / PortWatch)' },
            { id: 'weekly', label: 'هفتگی (WPSR / COT / دکل‌ها)' },
            { id: 'monthly', label: 'ماهانه (MOMR / OSP / STEO)' },
            { id: 'catalyst', label: 'نشست‌های اوپک+ و رویدادها' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setCategoryFilter(tab.id)}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
              categoryFilter === tab.id
                ? 'bg-[#B83E16] text-white'
                : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Calendar Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="text-stone-500 border-b border-stone-300">
              <th className="pb-2">عنوان انتشار / رویداد</th>
              <th className="pb-2">تناوب</th>
              <th className="pb-2">روز انتشار</th>
              <th className="pb-2">ساعت نیویورک (ET)</th>
              <th className="pb-2">ساعت دقیق تهران (IRST)</th>
              <th className="pb-2">شمارش معکوس</th>
              <th className="pb-2">عملیات و ردیابی</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {visibleEvents.map((ev) => {
              const converted = convertNyReleaseToTehran({
                nyHour24: ev.nyHour24,
                nyMinute: ev.nyMinute,
                isUsDst,
                isUsHolidayWeek: isUsHolidayWeek && ev.holidayShiftEligible,
                dayOfWeekFa: ev.dayOfWeekFa,
              });

              return (
                <tr key={ev.id} className="hover:bg-stone-200/40">
                  <td className="py-3">
                    <div className="font-extrabold text-stone-900">{ev.titleFa}</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">{ev.holidayNoteFa}</div>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-800 font-bold text-[11px]">
                      {ev.categoryFa}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-stone-800">
                    {converted.effectiveDayFa}
                    {isUsHolidayWeek && ev.holidayShiftEligible && (
                      <span className="block text-[10px] text-[#B83E16] font-extrabold">
                        (شیفت تعطیلات آمریکا)
                      </span>
                    )}
                  </td>
                  <td className="py-3 font-mono-num font-bold text-stone-700" dir="ltr">
                    {toPersianDigits(converted.nyFormatted)}
                  </td>
                  <td className="py-3 font-mono-num font-extrabold text-[#B83E16]">
                    {toPersianDigits(converted.tehranFormatted)}
                  </td>
                  <td className="py-3 font-bold text-[#2D8A4E]">{ev.countdownFa}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1.5">
                      {onInspectLineage && (
                        <button
                          type="button"
                          onClick={() => onInspectLineage(ev.seriesKeyForLineage)}
                          className="px-2 py-1 rounded bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-[11px]"
                        >
                          ردیابی داده
                        </button>
                      )}
                      {onNavigateModule && (
                        <button
                          type="button"
                          onClick={() => onNavigateModule(ev.targetModule)}
                          className="px-2.5 py-1 rounded bg-[#1E1D1B] hover:bg-stone-800 text-white font-bold text-[11px]"
                        >
                          ماژول ←
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// 4. DEDICATED "ORGANIZATIONAL IMPACT" MODULE (ماژول اثر بر سازمان — سؤال چهارم)
// ============================================================================

interface ExportGradePreset {
  id: string;
  nameFa: string;
  apiGravity: string;
  sulfurPct: string;
  defaultOspDiffUsd: number;
  benchmarkName: string;
}

const EXPORT_GRADE_PRESETS: ExportGradePreset[] = [
  {
    id: 'iran_light',
    nameFa: 'نفت خام ایران سبک (Iranian Light)',
    apiGravity: '33.4° API',
    sulfurPct: '1.36% S',
    defaultOspDiffUsd: 1.85,
    benchmarkName: 'میانگین عمان/دبی (Oman/Dubai)',
  },
  {
    id: 'iran_heavy',
    nameFa: 'نفت خام ایران سنگین (Iranian Heavy)',
    apiGravity: '29.5° API',
    sulfurPct: '1.99% S',
    defaultOspDiffUsd: -0.35,
    benchmarkName: 'میانگین عمان/دبی (Oman/Dubai)',
  },
  {
    id: 'forozan',
    nameFa: 'نفت خام فروزان (Forozan Blend)',
    apiGravity: '30.8° API',
    sulfurPct: '2.15% S',
    defaultOspDiffUsd: -0.15,
    benchmarkName: 'میانگین عمان/دبی (Oman/Dubai)',
  },
  {
    id: 'condensate',
    nameFa: 'میعانات گازی پارس جنوبی (South Pars Condensate)',
    apiGravity: '58.0° API',
    sulfurPct: '0.04% S',
    defaultOspDiffUsd: 2.40,
    benchmarkName: 'Platts Dubai',
  },
];

interface DestinationCorridorPreset {
  id: string;
  nameFa: string;
  vlccFreightUsdBbl: number;
  warRiskInsuranceUsdBbl: number;
  transitDays: number;
}

const DESTINATION_CORRIDORS: DestinationCorridorPreset[] = [
  {
    id: 'china_shandong',
    nameFa: 'شرق چین (پالایشگاه‌های شاندونگ و نینگبو-ژوشان)',
    vlccFreightUsdBbl: 2.45,
    warRiskInsuranceUsdBbl: 0.55,
    transitDays: 22,
  },
  {
    id: 'india_jamnagar',
    nameFa: 'غرب هند (مجتمع پالایشی جام‌نگر و سیکا)',
    vlccFreightUsdBbl: 1.15,
    warRiskInsuranceUsdBbl: 0.45,
    transitDays: 6,
  },
  {
    id: 'med_turkey',
    nameFa: 'مدیترانه و ترکیه (مسیر دریای سرخ / سوئز)',
    vlccFreightUsdBbl: 3.30,
    warRiskInsuranceUsdBbl: 0.85,
    transitDays: 19,
  },
];

interface OrganizationalImpactDeepPageProps {
  onInspectLineage?: (seriesKey: string) => void;
}

export const OrganizationalImpactDeepPage: React.FC<OrganizationalImpactDeepPageProps> = ({
  onInspectLineage,
}) => {
  const [selectedGradeId, setSelectedGradeId] = useState<string>('iran_light');
  const [selectedDestId, setSelectedDestId] = useState<string>('china_shandong');
  const [benchmarkDubaiUsd, setBenchmarkDubaiUsd] = useState<number>(80.12);
  const [ospDiffUsd, setOspDiffUsd] = useState<number>(1.85);
  const [vlccFreightUsdBbl, setVlccFreightUsdBbl] = useState<number>(2.45);
  const [warRiskInsuranceUsdBbl, setWarRiskInsuranceUsdBbl] = useState<number>(0.55);
  const [commercialDiscountUsdBbl, setCommercialDiscountUsdBbl] = useState<number>(3.97);
  const [exportVolumeMbd, setExportVolumeMbd] = useState<number>(1.60);
  const [budgetTargetVolumeMbd, setBudgetTargetVolumeMbd] = useState<number>(1.50);
  const [fiscalBreakevenUsd, setFiscalBreakevenUsd] = useState<number>(72.0);
  const [hedgeCoverageRatioPct, setHedgeCoverageRatioPct] = useState<number>(40);
  const [hedgeFloorUsd, setHedgeFloorUsd] = useState<number>(78.0);

  const handleSelectGrade = (grade: ExportGradePreset) => {
    setSelectedGradeId(grade.id);
    setOspDiffUsd(grade.defaultOspDiffUsd);
  };

  const handleSelectDest = (dest: DestinationCorridorPreset) => {
    setSelectedDestId(dest.id);
    setVlccFreightUsdBbl(dest.vlccFreightUsdBbl);
    setWarRiskInsuranceUsdBbl(dest.warRiskInsuranceUsdBbl);
  };

  const impact = computeOrganizationalImpact({
    benchmarkDubaiUsd,
    ospDiffUsd,
    vlccFreightUsdBbl,
    warRiskInsuranceUsdBbl,
    commercialDiscountUsdBbl,
    exportVolumeMbd,
    budgetTargetVolumeMbd,
    fiscalBreakevenUsd,
    hedgeCoverageRatioPct,
    hedgeFloorUsd,
    downsideBenchmarkDubaiUsd: 64.0,
  });

  const activeGrade =
    EXPORT_GRADE_PRESETS.find((g) => g.id === selectedGradeId) || EXPORT_GRADE_PRESETS[0];
  const activeDest =
    DESTINATION_CORRIDORS.find((d) => d.id === selectedDestId) || DESTINATION_CORRIDORS[0];

  return (
    <div className="space-y-4" dir="rtl">
      {/* Top Banner: Answering Question #4 ("برای ما چه معنایی دارد؟") */}
      <div className="bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-[#B83E16]">
            پاسخ به پرسش چهارم اتاق وضعیت نفت: «۴. برای ما چه معنایی دارد؟» · متصل به osp-tracker و forecast-benchmark
          </div>
          <h2 className="text-xl font-extrabold text-[#1E1D1B] mt-1">
            ماژول اختصاصی «اثر بر سازمان»: محاسبه خالص دریافتی صادرات (FOB Netback)، تراز بودجه‌ای و پوشش ریسک
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {onInspectLineage && (
            <button
              type="button"
              onClick={() => onInspectLineage('adnoc.osp.murban_asia')}
              className="px-3 py-1.5 rounded-lg bg-[#22211F] text-[#F2DA63] text-xs font-bold hover:bg-stone-800 transition-colors"
            >
              حسابرسی فرمول OSP و منبع خام ←
            </button>
          )}
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[#FAF9F5] rounded-xl p-4 border border-stone-300/80 shadow-xs">
          <div className="text-xs font-bold text-stone-500">قیمت خالص تحقق‌یافته (FOB Netback)</div>
          <div className="font-mono-num text-2xl font-extrabold text-[#1E1D1B] mt-1">
            ${toPersianDigits(impact.realizedFobNetbackUsd.toFixed(2))}
            <span className="text-xs font-normal text-stone-500 mr-1">/ بشکه</span>
          </div>
          <div className="text-[11px] text-stone-600 mt-1">
            کسر خالص حمل، بیمه جنگ و تخفیف:{' '}
            <strong className="font-mono-num text-[#B83E16]">
              ${toPersianDigits(impact.totalDeductionsUsd.toFixed(2))}
            </strong>
          </div>
        </div>

        <div className="bg-[#FAF9F5] rounded-xl p-4 border border-stone-300/80 shadow-xs">
          <div className="text-xs font-bold text-stone-500">درآمد صادراتی سالانه سازمان (Annualized)</div>
          <div className="font-mono-num text-2xl font-extrabold text-[#2D8A4E] mt-1">
            ${toPersianDigits(impact.annualizedRevenueBusd.toFixed(2))} B
          </div>
          <div className="text-[11px] text-stone-600 mt-1">
            درآمد روزانه:{' '}
            <strong className="font-mono-num">
              ${toPersianDigits(impact.dailyRevenueMusd.toFixed(1))} میلیون دلار
            </strong>
          </div>
        </div>

        <div className="bg-[#FAF9F5] rounded-xl p-4 border border-stone-300/80 shadow-xs">
          <div className="text-xs font-bold text-stone-500">تراز نسبت به بودجه مصوب نفتی</div>
          <div
            className={`font-mono-num text-2xl font-extrabold mt-1 ${
              impact.fiscalAnnualBalanceBusd >= 0 ? 'text-[#2D8A4E]' : 'text-[#B83E16]'
            }`}
          >
            {formatSignedPersian(impact.fiscalAnnualBalanceBusd, 2)} میلیارد دلار
          </div>
          <div className="text-[11px] text-stone-600 mt-1">
            فاصله از سربه‌سر بودجه ({toPersianDigits(fiscalBreakevenUsd)}$):{' '}
            <strong className="font-mono-num">
              {formatSignedPersian(impact.netbackMarginVsBreakevenUsd, 2)}$
            </strong>
          </div>
        </div>

        <div className="bg-[#22211F] text-white rounded-xl p-4 border border-stone-800 shadow-xs">
          <div className="text-xs font-bold text-[#F2DA63]">سپر پوشش ریسک در سناریوی ریزش (q5 = 64$)</div>
          <div className="font-mono-num text-2xl font-extrabold text-white mt-1">
            +${toPersianDigits(impact.hedgingProtectionGainBusd.toFixed(2))} B
          </div>
          <div className="text-[11px] text-stone-300 mt-1">
            کف قیمت محافظت‌شده:{' '}
            <strong className="font-mono-num text-[#E68A56]">
              ${toPersianDigits(impact.effectiveDownsideNetbackUsd.toFixed(2))} / bbl
            </strong>
          </div>
        </div>
      </div>

      {/* Main Interactive Workbench: Left Controls + Right Waterfall & Stress Test */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 6 Columns: Grade, Corridor & Cost Structure Sliders */}
        <div className="lg:col-span-6 bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-[#1E1D1B] border-b border-stone-200 pb-2">
            ۱. پیکربندی گرید صادراتی، کریدور مقصد و ساختار هزینه‌های دریایی
          </h3>

          {/* Crude Grade Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              انتخاب گرید نفت خام / میعانات صادراتی:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EXPORT_GRADE_PRESETS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => handleSelectGrade(g)}
                  className={`p-2.5 rounded-lg border text-right transition-all ${
                    selectedGradeId === g.id
                      ? 'bg-[#B83E16]/12 border-[#B83E16] text-stone-950'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400'
                  }`}
                >
                  <div className="text-xs font-extrabold">{g.nameFa}</div>
                  <div className="text-[11px] text-stone-500 mt-0.5 font-mono-num" dir="ltr">
                    {g.apiGravity} · {g.sulfurPct} · OSP {g.defaultOspDiffUsd >= 0 ? `+${g.defaultOspDiffUsd}` : g.defaultOspDiffUsd}$
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Destination Corridor Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              انتخاب کریدور دریایی مقصد (از پایانه خارگ / تنگه هرمز):
            </label>
            <div className="space-y-1.5">
              {DESTINATION_CORRIDORS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => handleSelectDest(d)}
                  className={`w-full p-2.5 rounded-lg border flex items-center justify-between text-xs transition-all ${
                    selectedDestId === d.id
                      ? 'bg-[#1E1D1B] text-white border-[#1E1D1B]'
                      : 'bg-white text-stone-800 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <span className="font-bold">{d.nameFa}</span>
                  <span className="font-mono-num text-[11px] opacity-90">
                    حمل: ${d.vlccFreightUsdBbl} · بیمه: ${d.warRiskInsuranceUsdBbl} ({toPersianDigits(d.transitDays)} روز)
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Fine-Tuning Sliders */}
          <div className="space-y-3 pt-2 border-t border-stone-200 text-xs">
            <div>
              <div className="flex justify-between">
                <span className="font-bold text-stone-700">قیمت پایه دبی/عمان (Platts Dubai):</span>
                <span className="font-mono-num font-extrabold text-[#1E1D1B]">
                  ${toPersianDigits(benchmarkDubaiUsd.toFixed(2))}
                </span>
              </div>
              <input
                type="range"
                min="55"
                max="115"
                step="0.25"
                value={benchmarkDubaiUsd}
                onChange={(e) => setBenchmarkDubaiUsd(Number(e.target.value))}
                className="w-full accent-[#B83E16] mt-1"
              />
            </div>

            <div>
              <div className="flex justify-between">
                <span className="font-bold text-stone-700">تفاضل قیمت رسمی فروش (OSP Differential):</span>
                <span className="font-mono-num font-extrabold text-[#2D8A4E]">
                  {formatSignedPersian(ospDiffUsd, 2)} دلار
                </span>
              </div>
              <input
                type="range"
                min="-4.0"
                max="5.0"
                step="0.05"
                value={ospDiffUsd}
                onChange={(e) => setOspDiffUsd(Number(e.target.value))}
                className="w-full accent-[#B83E16] mt-1"
              />
            </div>

            <div>
              <div className="flex justify-between">
                <span className="font-bold text-stone-700">تخفیف تجاری و هزینه لجستیک ناوگان:</span>
                <span className="font-mono-num font-extrabold text-[#B83E16]">
                  ${toPersianDigits(commercialDiscountUsdBbl.toFixed(2))} / bbl
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="0.1"
                value={commercialDiscountUsdBbl}
                onChange={(e) => setCommercialDiscountUsdBbl(Number(e.target.value))}
                className="w-full accent-[#B83E16] mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between">
                  <span className="font-bold text-stone-700">حجم صادرات روزانه:</span>
                  <span className="font-mono-num font-extrabold text-[#1E1D1B]">
                    {toPersianDigits(exportVolumeMbd.toFixed(2))} mb/d
                  </span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="2.6"
                  step="0.05"
                  value={exportVolumeMbd}
                  onChange={(e) => setExportVolumeMbd(Number(e.target.value))}
                  className="w-full accent-[#B83E16] mt-1"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="font-bold text-stone-700">نقطه سربه‌سر بودجه:</span>
                  <span className="font-mono-num font-extrabold text-[#1E1D1B]">
                    ${toPersianDigits(fiscalBreakevenUsd.toFixed(1))}
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="0.5"
                  value={fiscalBreakevenUsd}
                  onChange={(e) => setFiscalBreakevenUsd(Number(e.target.value))}
                  className="w-full accent-[#B83E16] mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 6 Columns: FOB Netback Waterfall + Hedging Stress Test + Board Policy */}
        <div className="lg:col-span-6 space-y-4">
          {/* Waterfall Breakdown Table */}
          <div className="bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs space-y-3">
            <h3 className="text-sm font-extrabold text-[#1E1D1B] border-b border-stone-200 pb-2">
              ۲. جدول آبشاری تشکیل قیمت خالص صادراتی ( از بنچمارک تا خالص خزانه)
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-100">
                <span className="font-bold text-stone-800">
                  ۱. قیمت پایه بنچمارک ({activeGrade.benchmarkName})
                </span>
                <span className="font-mono-num font-extrabold text-stone-900">
                  ${toPersianDigits(benchmarkDubaiUsd.toFixed(2))}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-100">
                <span className="font-bold text-stone-800">
                  ۲. تفاضل قیمت رسمی فروش ({activeGrade.nameFa})
                </span>
                <span
                  className={`font-mono-num font-extrabold ${
                    ospDiffUsd >= 0 ? 'text-[#2D8A4E]' : 'text-[#B83E16]'
                  }`}
                >
                  {formatSignedPersian(ospDiffUsd, 2)}$
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-100">
                <span className="font-bold text-stone-800">
                  ۳. کسر کرایه حمل نفتکش VLCC ({activeDest.nameFa.split('(')[0]})
                </span>
                <span className="font-mono-num font-extrabold text-[#B83E16]">
                  −${toPersianDigits(vlccFreightUsdBbl.toFixed(2))}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-100">
                <span className="font-bold text-stone-800">
                  ۴. کسر حق بیمه ریسک جنگ تنگه هرمز (War Risk Premium)
                </span>
                <span className="font-mono-num font-extrabold text-[#B83E16]">
                  −${toPersianDigits(warRiskInsuranceUsdBbl.toFixed(2))}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-100">
                <span className="font-bold text-stone-800">
                  ۵. کسر تخفیف رقابتی و هزینه تراکنش ناوگان
                </span>
                <span className="font-mono-num font-extrabold text-[#B83E16]">
                  −${toPersianDigits(commercialDiscountUsdBbl.toFixed(2))}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#1E1D1B] text-white">
                <span className="font-extrabold text-[#F2DA63]">
                  قیمت خالص تحقق‌یافته FOB (Realized Netback):
                </span>
                <span className="font-mono-num text-base font-extrabold text-white">
                  ${toPersianDigits(impact.realizedFobNetbackUsd.toFixed(2))} / بشکه
                </span>
              </div>
            </div>
          </div>

          {/* Hedging & Downside Stress-Test Card */}
          <div className="bg-[#22211F] text-white rounded-xl p-5 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <h3 className="text-sm font-extrabold text-[#E68A56]">
                ۳. شبیه‌ساز پوشش ریسک (Hedging) در برابر سناریوی دم چپ نمودار بادبزنی (۶۴ دلار)
              </h3>
              <span className="font-mono-num text-xs font-bold text-[#F2DA63]">
                پوشش فعلی: {toPersianDigits(hedgeCoverageRatioPct)}٪
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-stone-300">نسبت پوشش ریسک محموله‌ها:</span>
                  <span className="font-mono-num font-bold text-[#F2DA63]">
                    {toPersianDigits(hedgeCoverageRatioPct)}٪
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="5"
                  value={hedgeCoverageRatioPct}
                  onChange={(e) => setHedgeCoverageRatioPct(Number(e.target.value))}
                  className="w-full accent-[#E68A56]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-stone-300">کف قیمت قرارداد پوشش (Put Floor):</span>
                  <span className="font-mono-num font-bold text-[#F2DA63]">
                    ${toPersianDigits(hedgeFloorUsd.toFixed(1))}
                  </span>
                </div>
                <input
                  type="range"
                  min="68"
                  max="86"
                  step="1"
                  value={hedgeFloorUsd}
                  onChange={(e) => setHedgeFloorUsd(Number(e.target.value))}
                  className="w-full accent-[#E68A56]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
                <span className="text-stone-400 block text-[11px]">درآمد بدون پوشش در ۶۴$:</span>
                <span className="font-mono-num font-bold text-stone-200 text-sm">
                  ${toPersianDigits(impact.downsideUnhedgedAnnualBusd.toFixed(2))} B
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
                <span className="text-stone-400 block text-[11px]">درآمد با پوشش ریسک:</span>
                <span className="font-mono-num font-bold text-[#68D391] text-sm">
                  ${toPersianDigits(impact.downsideHedgedAnnualBusd.toFixed(2))} B
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#B83E16]/30 border border-[#B83E16]">
                <span className="text-[#F2DA63] block text-[11px]">محافظت مالی ایجادشده:</span>
                <span className="font-mono-num font-extrabold text-white text-sm">
                  +${toPersianDigits(impact.hedgingProtectionGainBusd.toFixed(2))} B
                </span>
              </div>
            </div>

            <div className="text-[11px] text-stone-300 leading-relaxed pt-1">
              <strong className="text-[#F2DA63]">توصیه عملیاتی به کمیته ریسک: </strong>
              برای تحقق کامل بودجه مصوب نفتی (${toPersianDigits(impact.budgetAnnualTargetBusd.toFixed(1))} میلیارد دلار در سال) با قیمت خالص فعلی، حداقل حجم صادرات روزانه باید{' '}
              <strong className="font-mono-num text-white">
                {toPersianDigits(impact.requiredBreakevenVolumeMbd.toFixed(2))} میلیون بشکه در روز
              </strong>{' '}
              حفظ شود.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
