import React, { useState } from 'react';
import {
  Search,
  Copy,
  Check,
  GitCommit,
  FileCheck2,
  Calendar,
  Database,
} from 'lucide-react';
import {
  WAVE1_CONNECTORS,
  DATA_SOURCES_20_CATEGORIES,
} from '../data/platformData';
import { computeDataQualityScore, toPersianDigits } from '../utils/oilAnalytics';
import {
  HitlVerificationQueuePanel,
  InteractiveReleaseCalendarPanel,
} from './GovernanceAndImpactModules';
import { KeylessCatalogConnectorHub } from './KeylessCatalogConnectorHub';
import { DeepPageId } from './CockpitViews';

interface GovernanceReportsProps {
  onInspectLineage?: (seriesKey?: string) => void;
  onNavigateModule?: (page: DeepPageId) => void;
}

/**
 * 6. EXECUTIVE BRIEFS & REPORTS PAGE (`executive-oil-brief-fa`)
 * Styled in the Oil Situation Room Warm-Stone + Terracotta + Charcoal palette
 */
export const ReportsBriefsDeepPage: React.FC<GovernanceReportsProps> = ({
  onInspectLineage,
  onNavigateModule,
}) => {
  const [selectedBrief, setSelectedBrief] = useState<'combined' | 'wpsr' | 'shock' | 'forecast'>('combined');
  const [copied, setCopied] = useState(false);

  const briefContents: Record<
    'combined' | 'wpsr' | 'shock' | 'forecast',
    {
      titleFa: string;
      skillName: string;
      sec5Fa: string;
      sec30Rows: { label: string; value: string; note: string }[];
      min5Points: string[];
      qualityNote: string;
      sourcesNote: string;
    }
  > = {
    combined: {
      titleFa: 'بریف جامع مدیریتی هیئت‌مدیره — ترکیب سه Skill هسته',
      skillName: 'executive-oil-brief-fa + eia-weekly-stocks + oil-shock-decomposition + forecast-benchmark',
      sec5Fa:
        'قیمت نفت برنت در ۸۲٫۷۵ دلار (+۱٫۲۵٪) با شیب بکواردیشن ملایم قرار دارد؛ در حالی که افزایش ۴٫۱ میلیون بشکه‌ای بنزین آمریکا فشار کوتاه‌مدتی بر فرآورده وارد کرده، تقاضای احتیاطی ناشی از ریسک هرمز (۸۲/۱۰۰) و کسری ۱٫۷ میلیون بشکه‌ای نفت خام تجاری آمریکا نسبت به میانگین ۵ ساله از قیمت حمایت می‌کند.',
      sec30Rows: [
        { label: 'الان بازار کجاست؟', value: 'برنت ۸۲٫۷۵$ · WTI ۷۹٫۸۲$ · دبی ۸۰٫۱۲$', note: 'اسپرد برنت/WTI: ۲٫۹۳ دلار' },
        { label: 'موجودی هفتگی آمریکا', value: 'نفت خام ۴۱۵٫۰ mb (۱٫۷− نسبت به ۵ ساله)', note: 'بنزین ۴٫۱+ mb (فشار نزولی)' },
        { label: 'چرا قیمت حرکت کرد؟ (۱۲ ماه)', value: '۱۲٫۹+٪ رشد واقعی', note: 'تقاضای اختصاصی ۱۷٫۲+ · عرضه ۶٫۲+ · اقتصاد ۱۱٫۲−' },
        { label: 'پیش‌بینی تأییدشده (futures)', value: '۱ ماهه: ۷۴٫۶$ · ۳ ماهه: ۷۸٫۲$', note: 'نسبت خطا ۰٫۵۴ (DM p=0.000)' },
      ],
      min5Points: [
        'تطبیق بین‌منبعی تراز جهانی نشان‌دهنده واگرایی ۵۳۰ هزار بشکه در روز بین دیدگاه اوپک (MOMR) و آژانس بین‌المللی انرژی (IEA OMR) است.',
        'از ۱ نوامبر ۲۰۲۶ فرمول قیمت‌گذاری رسمی (OSP) شرکت ادنوک امارات از آتی موربان IFAD به Platts Dubai تغییر یافته و در جدول شکست سری ثبت شده است.',
        'در ماه‌های مارس و جولای ۲۰۲۶ علامت شوک عرضه بین روش Kilian و Baumeister–Hamilton ناهمسو است که ناشی از تفاوت فرض کشش کوتاه‌مدت عرضه است.',
        'پیشنهاد سیاستی برای سازمان: تثبیت پوشش ریسک محموله‌های صادراتی در کریدور ۸۴ تا ۸۸ دلار و پایش روزانه نرخ حمل VLCC (فعلی: WS 74).',
      ],
      qualityNote: 'دروازه کیفیت: eia-weekly-stocks (OK) · oil-shock-decomposition (OK) · forecast-benchmark (WARN: حذف مدل دارای look-ahead)',
      sourcesNote: 'EIA API v2 · FRED (IGREA, CPIAUCSL) · OPEC MOMR · IMF PortWatch · سری Känzig (CC BY 4.0)',
    },
    wpsr: {
      titleFa: 'بریف هفتگی موجودی نفت آمریکا — هفته منتهی به ۲۰۲۶-۱۰-۲۳',
      skillName: 'eia-weekly-stocks (scripts/render_brief_fa.py)',
      sec5Fa:
        'موجودی بنزین آمریکا ۴٫۱ میلیون بشکه افزایش یافت (میانگین پنج‌ساله همین هفته: ۰٫۱− میلیون بشکه)؛ ارزیابی: فشار نزولی. نفت خام تجاری و کاشینگ خنثی.',
      sec30Rows: [
        { label: 'نفت خام تجاری (WCESTUS1)', value: '۴۱۵٫۰ mb (تغییر هفتگی: ۰٫۰)', note: 'میانگین تغییر ۵ ساله: ۰٫۸+ · فاصله: ۱٫۷− mb' },
        { label: 'موجودی کاشینگ', value: '۲۲٫۳ mb (تغییر هفتگی: ۰٫۲+)', note: 'میانگین تغییر ۵ ساله: ۰٫۲+ · فاصله: ۰٫۱− mb' },
        { label: 'موجودی بنزین (WGTSTUS1)', value: '۲۱۴٫۶ mb (تغییر هفتگی: ۴٫۱+)', note: 'میانگین تغییر ۵ ساله: ۰٫۱− · فشار نزولی' },
        { label: 'موجودی تقطیری (WDISTUS1)', value: '۱۱۱٫۰ mb (تغییر هفتگی: ۰٫۹+)', note: 'میانگین تغییر ۵ ساله: ۰٫۲+ · خنثی' },
      ],
      min5Points: [
        'مصرف ضمنی کل فرآورده‌ها (میانگین ۴ هفته): ۱۹٬۶۷۴ هزار بشکه در روز (۰٫۳−٪ نسبت به سال قبل).',
        'مصرف ضمنی بنزین (میانگین ۴ هفته): ۸٬۴۱۷ هزار بشکه در روز (۰٫۲−٪ نسبت به سال قبل).',
        'روزهای پوشش نفت خام تجاری: ۲۶٫۵ روز · روزهای پوشش بنزین: ۲۵٫۵ روز.',
        'ذخایر استراتژیک (SPR): ۴۰۰٫۵ میلیون بشکه (۰٫۹+ میلیون بشکه، تصمیم سیاستی جدا از موجودی تجاری).',
      ],
      qualityNote: 'OK — ۱۵ سری دریافت شد، همه در هفته ۲۰۲۶-۱۰-۲۳؛ بدون جهش غیرعادی و بدون اصلاحیه.',
      sourcesNote: 'EIA Weekly Petroleum Status Report via EIA API v2',
    },
    shock: {
      titleFa: 'چرا قیمت نفت حرکت کرد؟ تجزیه شوک‌ها تا ۲۰۲۶-۰۸',
      skillName: 'oil-shock-decomposition (scripts/decompose.py)',
      sec5Fa:
        'قیمت واقعی نفت در بازه ۲۰۲۵-۰۸ تا ۲۰۲۶-۰۸ حدود ۱۲٫۹٪ افزایش یافت؛ بیشترین سهم تقریبی از «تقاضای اختصاصی نفت (احتیاطی و موجودی)» بود (۱۷٫۲+ واحد لگاریتمی، روش Kilian 2009).',
      sec30Rows: [
        { label: 'بازه ۱ ماهه', value: '۴٫۲+٪ تغییر قیمت واقعی', note: 'تقاضای اختصاصی ۶٫۴+ · عرضه ۰٫۷− · اقتصاد ۱٫۶−' },
        { label: 'بازه ۳ ماهه', value: '۳۰٫۷+٪ تغییر قیمت واقعی', note: 'تقاضای اختصاصی ۲۴٫۲+ · عرضه ۲٫۶+ · اقتصاد ۰٫۰' },
        { label: 'بازه ۱۲ ماهه', value: '۱۲٫۹+٪ تغییر قیمت واقعی', note: 'تقاضای اختصاصی ۱۷٫۲+ · عرضه ۶٫۲+ · اقتصاد ۱۱٫۲−' },
        { label: 'تطبیق سه روش (۲۰۲۶-۰۸)', value: 'همسو (Agree)', note: 'Kilian: ۰٫۳− · BH: ۱٫۲− · Känzig: ۱٫۲−' },
      ],
      min5Points: [
        'مدل: VAR ساختاری بازگشتی با ۲۴ وقفه، ترتیب چولسکی: تولید > فعالیت اقتصادی (IGREA) > قیمت واقعی نفت.',
        'بزرگ‌ترین ریشه ماتریس همراه: ۰٫۹۷۳ (پایدار، کمتر از ۱٫۰۰).',
        'این اعداد برآورد مدل زیر فرض شناسایی Kilian است؛ مقایسه با Baumeister–Hamilton (۲۰۱۹) حساسیت به کشش عرضه را می‌سنجد.',
      ],
      qualityNote: 'OK — VAR پایدار، جمع سهم‌ها با تغییر واقعی برابر؛ داده ماهانه ۲ ماه تأخیر انتشار رسمی دارد.',
      sourcesNote: 'Kilian (2009) SVAR · Baumeister & Hamilton (2019) · Känzig (2021) CC BY 4.0',
    },
    forecast: {
      titleFa: 'محک‌زنی پیش‌بینی‌های قیمت نفت (ارزیابی ۲۰۰۸-۰۱ تا ۲۰۲۶-۰۸)',
      skillName: 'forecast-benchmark (scripts/evaluate.py)',
      sec5Fa:
        'در هر چهار افق بررسی‌شده (۱، ۳، ۶ و ۱۲ ماه) مدل مبتنی بر منحنی آتی (futures) به‌طور معنی‌دار از پیش‌بینی «بدون تغییر» بهتر بود؛ مدل متقلب دارای نشت اطلاعات آینده خودکار حذف شد.',
      sec30Rows: [
        { label: 'افق ۱ ماه · ۲۰۲۶-۱۰', value: 'میانه: ۷۴٫۶ دلار', note: 'بازه ۶۸٪: ۷۱٫۳ تا ۷۷٫۸ · نسبت خطا: ۰٫۵۴ (p=0.000)' },
        { label: 'افق ۳ ماه · ۲۰۲۶-۱۲', value: 'میانه: ۷۸٫۲ دلار', note: 'بازه ۶۸٪: ۷۰٫۸ تا ۸۵٫۳ · بازه ۹۰٪: ۶۷٫۱ تا ۹۱٫۷' },
        { label: 'افق ۶ ماه · ۲۰۲۷-۰۳', value: 'میانه: ۸۲٫۴ دلار', note: 'بازه ۶۸٪: ۶۷٫۵ تا ۹۹٫۱ · بازه ۹۰٪: ۵۸٫۲ تا ۱۰۸٫۳' },
        { label: 'افق ۱۲ ماه · ۲۰۲۷-۰۹', value: 'میانه: ۸۳٫۴ دلار', note: 'بازه ۶۸٪: ۵۵٫۳ تا ۱۲۹٫۲ · نسبت خطا: ۰٫۶۷ (p=0.011)' },
      ],
      min5Points: [
        'روش ارزیابی: آزمون Diebold–Mariano با واریانس HAC Newey-West و اصلاح نمونه کوچک Harvey–Leybourne–Newbold.',
        'دقت جهت (Pesaran–Timmermann): ۸۲٪ در افق ۱ ماهه و ۷۵٪ در افق ۱۲ ماهه برای مدل آتی.',
        'کنترل نشت آینده (Look-ahead Gate): هر مدلی که تاریخ ساخت آن (created_at) پس از تاریخ مبدأ (origin) باشد از جدول کنار گذاشته می‌شود.',
      ],
      qualityNote: 'WARN — ترکیب وزنی معکوس MSPE در ماه‌های ابتدایی خطای مشاهده‌شده کافی نداشت و دیرتر شروع شد.',
      sourcesNote: 'Diebold–Mariano (1995) · HLN (1997) · Pesaran–Timmermann (1992) · Baumeister–Kilian (2015)',
    },
  };

  const active = briefContents[selectedBrief];

  const handleCopyBrief = () => {
    const text = `${active.titleFa}\n\nدر ۵ ثانیه: ${active.sec5Fa}\n\n${active.min5Points.join('\n')}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* Top Selector Bar */}
      <div className="bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-stone-500">
            اصل طراحی لایه ارائه: ۵ ثانیه (وضعیت کلی) · ۳۰ ثانیه (علت‌ها و اعداد کلیدی) · ۵ دقیقه (جزئیات و روش)
          </div>
          <h2 className="text-xl font-extrabold text-[#1E1D1B] mt-1">
            بریف‌های مدیریتی فارسی و خروجی جلسات هیئت‌مدیره
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded-lg text-xs">
            {(
              [
                { id: 'combined', label: 'بریف جامع هیئت‌مدیره' },
                { id: 'wpsr', label: 'بریف موجودی (EIA)' },
                { id: 'shock', label: 'بریف تجزیه شوک‌ها' },
                { id: 'forecast', label: 'بریف محک‌زنی پیش‌بینی' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedBrief(tab.id)}
                className={`px-3 py-1.5 rounded-md font-bold transition-colors whitespace-nowrap shrink-0 ${
                  selectedBrief === tab.id
                    ? 'bg-[#B83E16] text-white'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {onNavigateModule && (
            <button
              type="button"
              onClick={() => onNavigateModule('live_wave1_debate')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#B83E16] text-white text-xs font-bold hover:bg-[#9E3310] transition-colors"
            >
              <span>تولید گزارش زنده هیئت‌مدیره و اتاق مناظره (gpt-6-luna) ←</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyBrief}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1E1D1B] text-white text-xs font-bold hover:bg-stone-800 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-[#F2DA63]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'کپی شد' : 'کپی متن بریف'}</span>
          </button>
        </div>
      </div>

      {/* Rendered Brief Document */}
      <div className="bg-[#FAF9F5] rounded-xl p-6 border border-stone-300/80 shadow-xs space-y-5">
        <div className="border-b border-stone-200 pb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-extrabold text-[#1E1D1B]">{active.titleFa}</h3>
            <p className="font-mono-num text-xs text-stone-500 mt-1">{active.skillName}</p>
          </div>
          <button
            type="button"
            onClick={() => onInspectLineage?.('eia.wpsr.crude_stocks')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2D8A4E]/15 hover:bg-[#2D8A4E]/25 text-[#2D8A4E] text-xs font-extrabold transition-colors"
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>ردیابی ۱۰۰٪ اعداد تا فایل خام (Lineage & Vintage)</span>
          </button>
        </div>

        {/* 5-Second Callout */}
        <div className="p-4 rounded-xl bg-gradient-to-l from-[#B83E16] to-[#CC572B] text-white">
          <div className="text-xs font-extrabold text-[#F2DA63] mb-1.5">
            در ۵ ثانیه (خلاصه اجرایی):
          </div>
          <p className="text-sm leading-relaxed text-white">{active.sec5Fa}</p>
        </div>

        {/* 30-Second Table */}
        <div>
          <h4 className="text-sm font-extrabold text-[#1E1D1B] mb-3">
            در ۳۰ ثانیه: جدول اعداد کلیدی و ارزیابی (روی هر کارت برای ردیابی منبع خام کلیک کنید)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {active.sec30Rows.map((r) => (
              <div
                key={r.label}
                onClick={() => onInspectLineage?.('eia.wpsr.crude_stocks')}
                className="p-3.5 rounded-lg bg-stone-100 hover:bg-stone-200/70 border border-stone-200/80 flex items-center justify-between gap-3 cursor-pointer transition-colors"
              >
                <div>
                  <div className="text-xs font-bold text-stone-800">{r.label}</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">{r.note}</div>
                </div>
                <div className="font-mono-num text-xs font-extrabold text-[#1E1D1B] shrink-0">
                  {r.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5-Minute Details */}
        <div>
          <h4 className="text-sm font-extrabold text-[#1E1D1B] mb-2.5">
            در ۵ دقیقه: جزئیات فنی، روش‌شناسی و نکات حاکمیتی
          </h4>
          <ul className="space-y-2 text-xs text-stone-700 leading-relaxed list-disc pr-5">
            {active.min5Points.map((pt, i) => (
              <li key={i}>{pt}</li>
            ))}
          </ul>
        </div>

        {/* Quality & Sources Footer */}
        <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
          <div>
            <strong className="text-stone-800">کنترل کیفیت داده:</strong> {active.qualityNote}
          </div>
          <div>
            <strong className="text-stone-800">منابع:</strong> {active.sourcesNote}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 7. DATA SOURCES CATALOG (256 SOURCES), WAVE 1 PIPELINE, HITL QUEUE & TEHRAN/NY RELEASE CALENDAR PAGE
 */
export const DataGovernanceDeepPage: React.FC<GovernanceReportsProps> = ({
  onInspectLineage,
  onNavigateModule,
}) => {
  const [activeGovSection, setActiveGovSection] = useState<
    'all' | 'hitl_queue' | 'release_calendar' | 'catalog_256'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [waveFilter, setWaveFilter] = useState<string>('ALL');
  const [tierInput, setTierInput] = useState<1 | 2 | 3>(1);
  const [freshInput, setFreshInput] = useState<number>(15);
  const [consistInput, setConsistInput] = useState<number>(14);
  const [revInput, setRevInput] = useState<number>(9);

  const calculatedQuality = computeDataQualityScore({
    tier: tierInput,
    freshnessScore: freshInput,
    consistencyScore: consistInput,
    revisionStabilityScore: revInput,
  });

  const filteredCategories = DATA_SOURCES_20_CATEGORIES.filter((cat) => {
    const matchesWave = waveFilter === 'ALL' || cat.wave === waveFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      cat.categoryFa.includes(searchQuery) ||
      cat.keySources.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      cat.criticalNoteFa.includes(searchQuery);
    return matchesWave && matchesSearch;
  });

  const mapSourceToSeriesKey = (sourceId: string): string => {
    if (sourceId === 'gulf_osps') return 'adnoc.osp.murban_asia';
    if (sourceId === 'opec_momr') return 'opec.momr.iran_secondary_prod';
    if (sourceId === 'fred_macro') return 'kilian.svar.precautionary_demand_12m';
    return 'eia.wpsr.crude_stocks';
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* Architecture 7-Layer Summary Banner + Sub-Navigation */}
      <div className="bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-stone-500">
              معماری ۷ لایه پلتفرم + لایه حاکمیت · جدول واحد مشاهدات (observation) با تاریخ انتشار (Vintage)
            </div>
            <h2 className="text-xl font-extrabold text-[#1E1D1B] mt-1">
              مرکز حاکمیت داده: صف تأیید انسانی (HITL)، تقویم انتشار تهران/نیویورک و کاتالوگ ۲۵۶ منبع
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onInspectLineage?.('eia.wpsr.crude_stocks')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#22211F] hover:bg-stone-800 text-[#F2DA63] text-xs font-extrabold transition-colors"
            >
              <GitCommit className="w-4 h-4" />
              <span>باز کردن بازرس ردیابی عدد تا منبع خام (Lineage & Vintage)</span>
            </button>
          </div>
        </div>

        {/* Sub-section Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-stone-200/70 p-1 rounded-lg text-xs">
          {(
            [
              { id: 'all', label: 'نمای یکپارچه همه ابزارهای حاکمیت داده', icon: Database },
              { id: 'hitl_queue', label: 'صف تأیید انسانی (OSP / استخراج PDF / هشدار سطح ۳)', icon: FileCheck2 },
              { id: 'release_calendar', label: 'تقویم تعاملی انتشارها (تهران / نیویورک)', icon: Calendar },
              { id: 'catalog_256', label: 'کاتالوگ ۲۵۶ منبع و ۱۲ کانکتور موج ۱', icon: Search },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveGovSection(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold transition-colors ${
                  activeGovSection === tab.id
                    ? 'bg-[#B83E16] text-white'
                    : 'text-stone-700 hover:text-stone-950'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 7 Layers Pipeline Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
          {[
            { num: '۱', title: 'منابع داده', sub: '۲۵۶ منبع (سطح ۱ تا ۳)' },
            { num: '۲', title: 'اتصال و جمع‌آوری', sub: '۴ الگو + هش SHA-256' },
            { num: '۳', title: 'اعتبارسنجی', sub: '۵ لایه کنترل + صف HITL' },
            { num: '۴', title: 'انبار داده', sub: 'Parquet + Vintage Ledger' },
            { num: '۵', title: 'موتور تحلیل', sub: '۸ ماژول P0-P2 + هشدار' },
            { num: '۶', title: 'عامل‌ها و Skillها', sub: '۳ ساخته + ۱۲ در صف + MCP' },
            { num: '۷', title: 'لایه ارائه', sub: 'کاکپیت ۵s / ۳۰s / ۵m' },
          ].map((l) => (
            <div key={l.num} className="p-2.5 rounded-lg bg-stone-100 border border-stone-200/80">
              <div className="font-bold text-stone-900">
                {l.num}. {l.title}
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5">{l.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION A: Human-in-the-Loop Verification Queue */}
      {(activeGovSection === 'all' || activeGovSection === 'hitl_queue') && (
        <HitlVerificationQueuePanel
          onInspectLineage={(seriesKey) => onInspectLineage?.(seriesKey)}
        />
      )}

      {/* SECTION B: Interactive Tehran / New York Release & Catalyst Calendar */}
      {(activeGovSection === 'all' || activeGovSection === 'release_calendar') && (
        <InteractiveReleaseCalendarPanel
          onNavigateModule={onNavigateModule}
          onInspectLineage={(seriesKey) => onInspectLineage?.(seriesKey)}
        />
      )}

      {/* SECTION C-0: 117 Free & No-API Sources Live Connector Hub (from 256 Catalog CSV) */}
      {(activeGovSection === 'all' || activeGovSection === 'catalog_256') && (
        <KeylessCatalogConnectorHub />
      )}

      {/* SECTION C: Wave 1 Connectors Table (12 Free Official Sources) */}
      {(activeGovSection === 'all' || activeGovSection === 'catalog_256') && (
        <div className="bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-sm font-bold text-[#1E1D1B]">
                نقشه اتصال ۱۲ منبع رسمی موج ۱ (زمان‌بندی تقویم‌محور به وقت نیویورک و تهران)
              </h3>
              <p className="text-[11px] text-stone-500">
                چهار الگوی استاندارد اتصال: A (API رسمی) · B (فایل XLSX/CSV) · C (استخراج PDF/وب با کنترل جمع سطرها) · D (خبر + LLM + تأیید انسانی)
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="text-stone-500 border-b border-stone-300">
                  <th className="pb-2">شناسه و نام منبع</th>
                  <th className="pb-2">الگوی اتصال</th>
                  <th className="pb-2">تقویم انتشار (تهران)</th>
                  <th className="pb-2">ماژول مصرف‌کننده</th>
                  <th className="pb-2">جفت تطبیق بین‌منبعی</th>
                  <th className="pb-2">امتیاز کیفیت</th>
                  <th className="pb-2">دروازه / حسابرسی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {WAVE1_CONNECTORS.map((c) => (
                  <tr key={c.sourceId} className="hover:bg-stone-200/40">
                    <td className="py-2.5 font-bold text-stone-900">
                      {c.nameFa}{' '}
                      <span className="font-mono-num text-[10px] text-stone-400">({c.sourceId})</span>
                    </td>
                    <td className="py-2.5 text-stone-700 font-medium">{c.pattern}</td>
                    <td className="py-2.5 text-stone-600">{c.scheduleTehran}</td>
                    <td className="py-2.5 text-stone-700">{c.moduleFa}</td>
                    <td className="py-2.5 text-stone-500">{c.crossCheckPair}</td>
                    <td className="py-2.5 font-mono-num font-bold text-stone-900">
                      {toPersianDigits(c.qualityScore)}/۱۰۰
                    </td>
                    <td className="py-2.5 font-mono-num font-bold">
                      <div className="flex items-center gap-2">
                        <span className={c.gateStatus === 'OK' ? 'text-[#2D8A4E]' : 'text-[#D96B27]'}>
                          {c.gateStatus}
                        </span>
                        <button
                          type="button"
                          onClick={() => onInspectLineage?.(mapSourceToSeriesKey(c.sourceId))}
                          className="px-2 py-0.5 rounded bg-stone-200 hover:bg-stone-300 text-stone-800 text-[10px] font-bold"
                        >
                          Lineage
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interactive 20-Category (256 Sources) Explorer + Data Quality Score Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="text-sm font-bold text-[#1E1D1B]">
              مرورگر ۲۰ خانواده منابع داده جهانی (۲۵۶ منبع یکتا)
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجو در منابع (مثلاً Kpler، شانا، هرمز)..."
                  className="pr-8 pl-3 py-1.5 rounded-lg border border-stone-300 text-xs bg-white focus:outline-none focus:border-[#B83E16] w-56"
                />
              </div>
              <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded-lg text-xs">
                {['ALL', 'موج ۱', 'موج ۲', 'موج ۳'].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWaveFilter(w)}
                    className={`px-2.5 py-1 rounded-md font-medium ${
                      waveFilter === w ? 'bg-[#B83E16] text-white font-bold' : 'text-stone-700'
                    }`}
                  >
                    {w === 'ALL' ? 'همه امواج' : w}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pl-1">
            {filteredCategories.map((cat) => (
              <div
                key={cat.categoryNum}
                className="p-3.5 rounded-lg bg-stone-100 border border-stone-200/80 hover:border-stone-300 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-extrabold text-stone-900">
                    {toPersianDigits(cat.categoryNum)}. {cat.categoryFa}{' '}
                    <span className="text-stone-500 font-normal">
                      ({toPersianDigits(cat.countInDossier)} منبع · {cat.wave} · سطح اعتبار {toPersianDigits(cat.tier)})
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500">{cat.access}</span>
                </div>
                <div className="text-xs text-stone-700 mt-1.5">
                  <strong className="text-stone-900">منابع شاخص:</strong> {cat.keySources.join(' · ')}
                </div>
                <div className="text-[11px] text-stone-500 mt-1">{cat.criticalNoteFa}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Quality Score Calculator & Observation Schema */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#22211F] text-white rounded-xl p-5 border border-stone-800">
            <h3 className="text-sm font-bold text-[#E68A56] mb-1">
              ماشین‌حساب امتیاز کیفیت داده (۰ تا ۱۰۰)
            </h3>
            <p className="text-[11px] text-stone-400 mb-3">
              فرمول بخش ۴-۶ پرونده: پایه سطح منبع (۶۰/۴۵/۳۰) + تازگی (۱۵) + سازگاری (۱۵) + پایداری بازنگری (۱۰)
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-stone-300 block mb-1">سطح اعتبار منبع (Tier):</span>
                <div className="grid grid-cols-3 gap-2">
                  {([1, 2, 3] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTierInput(t)}
                      className={`py-1.5 rounded-lg font-bold ${
                        tierInput === t ? 'bg-[#E68A56] text-stone-950' : 'bg-stone-800 text-stone-300'
                      }`}
                    >
                      سطح {toPersianDigits(t)} ({t === 1 ? '۶۰' : t === 2 ? '۴۵' : '۳۰'})
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-stone-300">امتیاز تازگی (۰ تا ۱۵):</span>
                  <span className="font-mono-num font-bold text-[#E68A56]">{toPersianDigits(freshInput)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={freshInput}
                  onChange={(e) => setFreshInput(Number(e.target.value))}
                  className="w-full accent-[#E68A56] mt-1"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-stone-300">سازگاری بین‌منبعی (۰ تا ۱۵):</span>
                  <span className="font-mono-num font-bold text-[#E68A56]">{toPersianDigits(consistInput)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={consistInput}
                  onChange={(e) => setConsistInput(Number(e.target.value))}
                  className="w-full accent-[#E68A56] mt-1"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-stone-300">پایداری در بازنگری‌ها (۰ تا ۱۰):</span>
                  <span className="font-mono-num font-bold text-[#E68A56]">{toPersianDigits(revInput)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={revInput}
                  onChange={(e) => setRevInput(Number(e.target.value))}
                  className="w-full accent-[#E68A56] mt-1"
                />
              </div>

              <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                <span className="text-stone-300 font-bold">امتیاز نهایی نقطه داده:</span>
                <span className="font-mono-num text-2xl font-extrabold text-[#E68A56]">
                  {toPersianDigits(calculatedQuality)} / ۱۰۰
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#FAF9F5] rounded-xl p-4 border border-stone-300/80 shadow-xs text-xs">
            <h4 className="font-bold text-stone-900 mb-2">قرارداد جدول واحد مشاهدات (observation)</h4>
            <pre
              dir="ltr"
              className="font-mono-num text-[11px] bg-[#22211F] text-stone-200 p-3 rounded-lg overflow-x-auto leading-relaxed"
            >
{`observation (
  series_key    text,      -- eia.wpsr.crude_stocks
  source_id     text,      -- eia_wpsr, opec_momr
  metric        text,      -- stocks | price | prod
  value         numeric,   -- kb/d | mb | usd/bbl
  method        text,      -- reported | secondary
  vintage_ts    timestamptz, -- Point-in-time
  raw_ref       text,      -- SHA-256 lake pointer
  quality_score smallint   -- 0..100
)`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
