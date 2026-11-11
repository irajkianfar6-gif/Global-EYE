import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowLeft,
  ChevronLeft,
  HelpCircle,
  Target,
  Lightbulb,
  Flame,
  Database,
  Scale,
  Globe,
  Newspaper,
  Bell,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  BarChart3,
} from 'lucide-react';
import {
  GLOBAL_BENCHMARKS,
  TWELVE_MONTH_PRICE_SERIES,
  EXECUTIVE_FOUR_QUESTIONS,
  INITIAL_ALERTS,
  FAN_CHART_TABLE,
} from '../data/platformData';
import {
  OilBarrelVisual,
  GlobalOilSphereVisual,
  MiniSparkline,
  WorldOilMapSvg,
  DonutChartSvg,
} from './VisualWidgets';
import { toPersianDigits } from '../utils/oilAnalytics';

export type DeepPageId =
  | 'cockpit'
  | 'eia_stocks'
  | 'shock_decomposition'
  | 'forecast_scenario'
  | 'balance_opec'
  | 'osp_crack_margins'
  | 'cot_macro_sentiment'
  | 'geopolitics'
  | 'org_impact'
  | 'live_wave1_debate'
  | 'reports_briefs'
  | 'data_governance';

interface CockpitProps {
  onNavigateModule: (module: DeepPageId) => void;
  onOpenQuestionModal: (questionId: string) => void;
}

/**
 * Interactive Price Trend Chart (Supports Dark Theme like Screenshot 1/5 and Light Dual-Line like Screenshot 2/3/4)
 */
const InteractivePriceChart: React.FC<{
  variant: 'dark-single' | 'light-dual' | 'dark-dual';
  titleFa: string;
}> = ({ variant, titleFa }) => {
  const [range, setRange] = useState<'1m' | '3m' | '6m' | '1y'>('1y');
  const [hoverIdx, setHoverIdx] = useState<number>(TWELVE_MONTH_PRICE_SERIES.length - 1);

  const sliceCount = range === '1m' ? 4 : range === '3m' ? 6 : range === '6m' ? 8 : 12;
  const series = TWELVE_MONTH_PRICE_SERIES.slice(-sliceCount);
  const activePoint = series[Math.min(hoverIdx, series.length - 1)] || series[series.length - 1];

  const isDark = variant === 'dark-single' || variant === 'dark-dual';
  const width = 560;
  const height = 195;
  const padL = 36;
  const padR = 20;
  const padT = 26;
  const padB = 30;
  const minVal = 60;
  const maxVal = 100;

  const toX = (idx: number) =>
    padL + (idx / Math.max(1, series.length - 1)) * (width - padL - padR);
  const toY = (val: number) =>
    height - padB - ((val - minVal) / (maxVal - minVal)) * (height - padT - padB);

  const brentPts = series.map((d, i) => `${toX(i).toFixed(1)},${toY(d.brent).toFixed(1)}`);
  const wtiPts = series.map((d, i) => `${toX(i).toFixed(1)},${toY(d.wti).toFixed(1)}`);

  const brentLine = `M ${brentPts.join(' L ')}`;
  const brentArea = `${brentLine} L ${toX(series.length - 1)},${height - padB} L ${toX(0)},${height - padB} Z`;
  const wtiLine = `M ${wtiPts.join(' L ')}`;

  const activeIndex = Math.min(hoverIdx, series.length - 1);
  const activeX = toX(activeIndex);
  const activeY = toY(activePoint.brent);

  return (
    <div
      className={`rounded-2xl p-5 flex flex-col justify-between transition-colors ${
        isDark
          ? 'bg-[#1B1E26] text-white border border-slate-800'
          : 'bg-white text-slate-900 border border-slate-200/80 shadow-xs'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className={`w-4 h-4 ${isDark ? 'text-[#D4F338]' : 'text-slate-700'}`} />
          <h3 className="text-sm font-bold">{titleFa}</h3>
        </div>

        <div className="flex items-center gap-3">
          {variant !== 'dark-single' && (
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-[#D4F338]' : 'bg-slate-900'}`} />
                <span>Brent</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-slate-300' : 'bg-blue-500'}`} />
                <span>WTI</span>
              </span>
            </div>
          )}

          <div
            className={`flex items-center gap-1 rounded-xl p-1 text-xs ${
              isDark ? 'bg-slate-800/90' : 'bg-slate-100'
            }`}
          >
            {(
              [
                { id: '1m', label: '۱ ماه' },
                { id: '3m', label: '۳ ماه' },
                { id: '6m', label: '۶ ماه' },
                { id: '1y', label: '۱ سال' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setRange(t.id);
                  setHoverIdx(11);
                }}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                  range === t.id
                    ? isDark
                      ? 'bg-[#D4F338] text-slate-950 font-bold'
                      : 'bg-slate-900 text-white font-bold'
                    : isDark
                    ? 'text-slate-300 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40 overflow-visible">
          <defs>
            <linearGradient id={`chartGrad-${variant}`} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={isDark ? '#D4F338' : '#3B82F6'}
                stopOpacity={isDark ? 0.36 : 0.2}
              />
              <stop offset="100%" stopColor={isDark ? '#D4F338' : '#3B82F6'} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines */}
          {[60, 70, 80, 90, 100].map((gv) => {
            const y = toY(gv);
            return (
              <g key={gv}>
                <line
                  x1={padL}
                  y1={y}
                  x2={width - padR}
                  y2={y}
                  stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.07)'}
                  strokeDasharray="3 3"
                />
                <text
                  x={padL - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="font-mono-num text-[10px]"
                  fill={isDark ? '#94a3b8' : '#64748b'}
                >
                  ${gv}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={brentArea} fill={`url(#chartGrad-${variant})`} />

          {/* Secondary WTI Line */}
          {variant !== 'dark-single' && (
            <path
              d={wtiLine}
              fill="none"
              stroke={isDark ? '#e2e8f0' : '#3b82f6'}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          )}

          {/* Primary Brent Line */}
          <path
            d={brentLine}
            fill="none"
            stroke={isDark ? '#D4F338' : '#0f172a'}
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Interactive Vertical Cursor & Points */}
          <line
            x1={activeX}
            y1={padT}
            x2={activeX}
            y2={height - padB}
            stroke={isDark ? '#D4F338' : '#64748b'}
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <circle
            cx={activeX}
            cy={activeY}
            r="6"
            fill={isDark ? '#D4F338' : '#0f172a'}
            stroke="#ffffff"
            strokeWidth="2"
          />

          {/* Callout Tooltip Box */}
          <g transform={`translate(${Math.min(width - 115, Math.max(40, activeX - 42))}, ${Math.max(4, activeY - 38)})`}>
            <rect
              x="0"
              y="0"
              width="86"
              height="26"
              rx="8"
              fill={isDark ? '#ffffff' : '#0f172a'}
            />
            <text
              x="43"
              y="17"
              textAnchor="middle"
              className="font-mono-num text-xs font-extrabold"
              fill={isDark ? '#0f172a' : '#ffffff'}
            >
              ${activePoint.brent.toFixed(2)}
            </text>
          </g>

          {/* X-Axis Month Labels & Click Targets */}
          {series.map((d, i) => {
            const x = toX(i);
            return (
              <g
                key={d.monthIso}
                className="cursor-pointer"
                onMouseEnter={() => setHoverIdx(i)}
                onClick={() => setHoverIdx(i)}
              >
                <rect x={x - 18} y={padT} width="36" height={height - padB} fill="transparent" />
                <text
                  x={x}
                  y={height - 8}
                  textAnchor="middle"
                  className="text-[11px]"
                  fill={i === activeIndex ? (isDark ? '#D4F338' : '#0f172a') : isDark ? '#94a3b8' : '#64748b'}
                  fontWeight={i === activeIndex ? '700' : '400'}
                >
                  {d.monthFa}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

/**
 * VIEW 1: Matches Screenshot 1 (`Persian_Oil_Market_Intelligence_Dashboard-1_8b6878da.png`)
 * OilSense — وضعیت بازار جهانی نفت
 */
export const CockpitScreenshotView1: React.FC<CockpitProps> = ({
  onNavigateModule,
  onOpenQuestionModal,
}) => {
  return (
    <div className="space-y-4">
      {/* Row 1: 4 Hero KPI Cards matching Screenshot 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {/* Card 1: Brent */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5">
              <Flame className="w-4 h-4 text-slate-800" />
              <span>قیمت نفت برنت</span>
            </div>
            <div className="font-mono-num text-2xl font-extrabold text-slate-900 tracking-tight" dir="ltr">
              $ ۸۲.۷۵
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-emerald-600 font-mono-num">
              <span dir="ltr">▲ +1.25%</span>
              <span className="text-slate-400 font-normal">· ICE</span>
            </div>
          </div>
          <MiniSparkline data={[78.2, 79.4, 79.0, 80.5, 81.2, 81.9, 82.75]} color="#84cc16" />
        </div>

        {/* Card 2: WTI */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5">
              <Flame className="w-4 h-4 text-slate-800" />
              <span>قیمت نفت WTI</span>
            </div>
            <div className="font-mono-num text-2xl font-extrabold text-slate-900 tracking-tight" dir="ltr">
              $ ۷۹.۸۲
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-emerald-600 font-mono-num">
              <span dir="ltr">▲ +1.18%</span>
              <span className="text-slate-400 font-normal">· NYMEX</span>
            </div>
          </div>
          <MiniSparkline data={[75.1, 76.0, 76.8, 77.4, 78.5, 79.1, 79.82]} color="#10b981" />
        </div>

        {/* Card 3: EIA US Stocks */}
        <div
          onClick={() => onNavigateModule('eia_stocks')}
          className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5">
              <Database className="w-4 h-4 text-slate-800" />
              <span>مخازن آمریکا (EIA)</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono-num text-2xl font-extrabold text-slate-900">۴۲۰.۳M</span>
              <span className="text-xs text-slate-500">بشکه</span>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-blue-600 font-mono-num">
              <span dir="ltr">▼ -0.7%</span>
              <span className="text-slate-400 font-normal">· هفتگی WPSR</span>
            </div>
          </div>
          <MiniSparkline data={[428, 426, 425, 423, 422, 421, 420.3]} color="#3b82f6" />
        </div>

        {/* Card 4: Supply & Demand Balance with 3D Oil Barrel */}
        <div
          onClick={() => onNavigateModule('balance_opec')}
          className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5">
              <Scale className="w-4 h-4 text-slate-800" />
              <span>تراز عرضه و تقاضا</span>
            </div>
            <div className="font-mono-num text-2xl font-extrabold text-slate-900 tracking-tight" dir="ltr">
              + ۰.۸ M bpd
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <span>متعادل</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 font-normal">برآورد STEO/MOMR</span>
            </div>
          </div>
          <OilBarrelVisual size="md" />
        </div>
      </div>

      {/* Row 2: 12-Month Dark Price Chart + Global Markets Table + Market Status Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5">
          <InteractivePriceChart
            variant="dark-single"
            titleFa="روند قیمت نفت در ۱۲ ماه گذشته"
          />
        </div>

        {/* Global Markets Table */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900">بازارهای جهانی</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateModule('balance_opec')}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              همه بازارها
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100">
                  <th className="pb-2 font-medium">بازار</th>
                  <th className="pb-2 font-medium">قیمت</th>
                  <th className="pb-2 font-medium">تغییر روزانه</th>
                  <th className="pb-2 font-medium text-left">روند</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {GLOBAL_BENCHMARKS.slice(0, 4).map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 font-semibold text-slate-800 whitespace-nowrap">
                      <span className="ml-1.5">{b.countryFlag}</span>
                      {b.nameFa}
                    </td>
                    <td className="py-2.5 font-mono-num font-bold text-slate-900">
                      ${b.price.toFixed(2)}
                    </td>
                    <td className="py-2.5 font-mono-num font-semibold text-emerald-600" dir="ltr">
                      ▲ +{b.changePct.toFixed(2)}%
                    </td>
                    <td className="py-2.5">
                      <div className="flex justify-end">
                        <MiniSparkline data={b.sparkline} width={58} height={22} color="#10b981" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Market Status Summary (خلاصه وضعیت بازار) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">خلاصه وضعیت بازار</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <div>
                <div className="text-xs font-bold text-slate-900">رشد قیمت‌ها</div>
                <div className="text-[11px] text-slate-500">بازار در روند صعودی ملایم است</div>
              </div>
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                ↗
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <div>
                <div className="text-xs font-bold text-slate-900">ریسک ژئوپلیتیک</div>
                <div className="text-[11px] text-slate-500">در سطح متوسط رو به بالا</div>
              </div>
              <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                !
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <div>
                <div className="text-xs font-bold text-slate-900">عرضه اوپک+</div>
                <div className="text-[11px] text-slate-500">بدون تغییر قابل توجه</div>
              </div>
              <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                —
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <div>
                <div className="text-xs font-bold text-slate-900">موجودی‌های آمریکا</div>
                <div className="text-[11px] text-slate-500">کاهش جزئی ۱٫۷mb زیر میانگین</div>
              </div>
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                ↓
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Dark 4-Questions Card (تحلیل سریع) + Global Map with Risk Rings + Important News */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Dark Card: تحلیل سریع (The 4 Executive Questions from Dossier Section 1-1) */}
        <div className="lg:col-span-4 bg-[#1B1E26] text-white rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4F338]" />
              <h3 className="text-sm font-bold">تحلیل سریع (چهار پرسش مدیر ارشد)</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateModule('reports_briefs')}
              aria-label="مشاهده بریف کامل"
              className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5">
            {EXECUTIVE_FOUR_QUESTIONS.map((q, idx) => {
              const colors = [
                'bg-blue-500/20 text-blue-400',
                'bg-purple-500/20 text-purple-400',
                'bg-orange-500/20 text-orange-400',
                'bg-amber-500/20 text-amber-300',
              ];
              const icons = [TrendingUp, HelpCircle, Target, Lightbulb];
              const Icon = icons[idx % icons.length];
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => onOpenQuestionModal(q.id)}
                  className="w-full text-right p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white group-hover:text-[#D4F338] transition-colors">
                      {q.questionFa}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {q.shortAnswerFa}
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${colors[idx]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* World Oil Map + Regional Risk Rings */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900">نقشه بازار جهانی و گلوگاه‌ها</h3>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> کم‌ریسک
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> متوسط
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500" /> پرریسک
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-8">
              <WorldOilMapSvg />
            </div>
            <div className="sm:col-span-4 space-y-2.5 border-r border-slate-100 pr-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">جهانی</div>
                  <div className="text-[11px] text-amber-600 font-semibold">متوسط ریسک</div>
                </div>
                <div className="w-9 h-9 rounded-full border-4 border-amber-400 flex items-center justify-center font-mono-num text-[11px] font-bold">
                  ۶۷
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">خاورمیانه</div>
                  <div className="text-[11px] text-red-600 font-semibold">پرریسک</div>
                </div>
                <div className="w-9 h-9 rounded-full border-4 border-red-500 flex items-center justify-center font-mono-num text-[11px] font-bold">
                  ۸۲
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">آمریکا</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">کم‌ریسک</div>
                </div>
                <div className="w-9 h-9 rounded-full border-4 border-emerald-500 flex items-center justify-center font-mono-num text-[11px] font-bold">
                  ۲۴
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important News & Events */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900">اخبار و رویدادهای مهم</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateModule('geopolitics')}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0"
            >
              مشاهده همه
            </button>
          </div>

          <div className="space-y-3">
            <div
              onClick={() => onNavigateModule('eia_stocks')}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="text-xs font-bold text-slate-900">
                کاهش ذخایر تجاری نفت آمریکا نسبت به میانگین ۵ ساله
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                ۲ ساعت پیش · EIA WPSR · سطح اعتبار ۱
              </div>
            </div>
            <div
              onClick={() => onNavigateModule('geopolitics')}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="text-xs font-bold text-slate-900">
                افزایش نرخ بیمه جنگ نفتکش‌ها در تنگه هرمز و دریای سرخ
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                ۳ ساعت پیش · JMIC / PortWatch · سطح اعتبار ۱
              </div>
            </div>
            <div
              onClick={() => onNavigateModule('balance_opec')}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="text-xs font-bold text-slate-900">
                تغییر فرمول OSP ادنوک به Platts Dubai از نوامبر ۲۰۲۶
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                ۴ ساعت پیش · ADNOC / OPEC · سطح اعتبار ۱
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * VIEW 2: Matches Screenshot 2 (`Persian_Oil_Market_Analytics_Dashboard-2_ce2f827e.png`)
 * ASANA / OilSense — شب بخیر، مدیر عزیز (همراه با سناریوهای پیش‌رو و توزیع عرضه جهانی)
 */
export const CockpitScreenshotView2: React.FC<CockpitProps> = ({ onNavigateModule }) => {
  const [selectedScenario, setSelectedScenario] = useState<'bull' | 'base' | 'bear'>('base');

  return (
    <div className="space-y-4">
      {/* Greeting Banner with 3D Oil Barrel */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <OilBarrelVisual size="md" />
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">شب بخیر، مدیر عزیز</h2>
            <p className="text-xs text-slate-500 mt-1">
              خلاصه‌ای از آخرین وضعیت بازار جهانی نفت · شنبه ۲۵ اکتبر ۲۰۲۶ · 10:24 (UTC)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl font-semibold">
          <span>آنلاین · اتصال موج ۱ برقرار</span>
          <span>·</span>
          <span className="text-slate-500 font-normal">آخرین بروزرسانی: ۲ دقیقه پیش</span>
        </div>
      </div>

      {/* 4 KPI Cards matching Screenshot 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">قیمت نفت برنت</span>
            <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </span>
          </div>
          <div className="font-mono-num text-2xl font-extrabold text-slate-900">$ 86.72</div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-mono-num text-xs font-bold text-emerald-600" dir="ltr">
              ↑ +1.24%
            </span>
            <MiniSparkline data={[82.1, 83.4, 83.0, 84.8, 85.5, 86.1, 86.72]} color="#10b981" width={95} height={32} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">قیمت نفت WTI</span>
            <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </span>
          </div>
          <div className="font-mono-num text-2xl font-extrabold text-slate-900">$ 84.15</div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-mono-num text-xs font-bold text-emerald-600" dir="ltr">
              ↑ +1.12%
            </span>
            <MiniSparkline data={[79.8, 80.5, 81.2, 82.0, 83.1, 83.7, 84.15]} color="#3b82f6" width={95} height={32} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">موجودی‌های آمریکا (EIA)</span>
            <span className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </span>
          </div>
          <div className="font-mono-num text-2xl font-extrabold text-slate-900">423.6M bbl</div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-mono-num text-xs font-bold text-red-600" dir="ltr">
              ↓ -0.8%
            </span>
            <MiniSparkline data={[429, 428, 426, 425, 424.5, 424.0, 423.6]} color="#8b5cf6" width={95} height={32} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">عرضه جهانی (پیش‌بینی)</span>
            <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </span>
          </div>
          <div className="font-mono-num text-2xl font-extrabold text-slate-900">103.2M bpd</div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-mono-num text-xs font-bold text-amber-600" dir="ltr">
              ↑ +0.4%
            </span>
            <MiniSparkline data={[101.8, 102.0, 102.4, 102.6, 102.9, 103.0, 103.2]} color="#f59e0b" width={95} height={32} />
          </div>
        </div>
      </div>

      {/* Middle Row: 6-Month Dual Price Chart + Fast Market Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7">
          <InteractivePriceChart
            variant="light-dual"
            titleFa="روند قیمت‌ها در ۶ ماه گذشته (Brent vs WTI)"
          />
        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-800" />
              <h3 className="text-sm font-bold text-slate-900">تحلیل سریع بازار</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateModule('reports_briefs')}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-lg whitespace-nowrap shrink-0"
            >
              مشاهده گزارش کامل ←
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            <div className="py-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-900">رشد ۱.۲۴٪ قیمت نفت برنت</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  به دلیل کاهش ذخایر آمریکا و تنش‌های ژئوپلیتیک
                </div>
              </div>
              <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-900">افزایش ریسک ژئوپلیتیک</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  در پی تحولات جدید در خاورمیانه و تنگه هرمز
                </div>
              </div>
              <span className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-900">پیش‌بینی کوتاه‌مدت (مدل آتی)</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  احتمال تثبیت قیمت در محدوده ۸۲ تا ۸۶ دلار (DM p&lt;0.01)
                </div>
              </div>
              <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Target className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: World Map + Global Supply Distribution Donut + 3 Upcoming Scenarios */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900">نقشه جهانی بازار نفت</h3>
            <button
              type="button"
              onClick={() => onNavigateModule('geopolitics')}
              className="text-xs text-slate-500 hover:text-slate-900"
            >
              جزئیات گلوگاه‌ها ←
            </button>
          </div>
          <WorldOilMapSvg />
        </div>

        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900 mb-3">توزیع عرضه جهانی</h3>
          <div className="flex items-center justify-around gap-4">
            <DonutChartSvg
              centerTop="103.2"
              centerBottom="M bpd"
              segments={[
                { label: 'خاورمیانه', value: 33.1, color: '#2563eb' },
                { label: 'آمریکا', value: 29.7, color: '#3b82f6' },
                { label: 'روسیه', value: 12.6, color: '#60a5fa' },
                { label: 'سایر مناطق', value: 24.6, color: '#cbd5e1' },
              ]}
            />
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-600">خاورمیانه</span>
                <span className="font-mono-num font-bold text-slate-900">33.1%</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-600">آمریکا</span>
                <span className="font-mono-num font-bold text-slate-900">29.7%</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-600">روسیه</span>
                <span className="font-mono-num font-bold text-slate-900">12.6%</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-600">سایر مناطق</span>
                <span className="font-mono-num font-bold text-slate-900">24.6%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Scenario Cards matching Screenshot 2 */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">سناریوهای پیش‌رو</h3>
            <button
              type="button"
              onClick={() => onNavigateModule('forecast_scenario')}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 whitespace-nowrap shrink-0"
            >
              شبیه‌ساز سناریو ←
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedScenario('bull')}
              className={`p-3 rounded-xl border text-center transition-all ${
                selectedScenario === 'bull'
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
              }`}
            >
              <div className="text-[11px] font-semibold text-slate-600">سناریوی خوش‌بینانه</div>
              <div className="font-mono-num text-sm font-extrabold text-slate-900 mt-1.5" dir="ltr">
                $88 - 92
              </div>
              <div className="text-[10px] text-slate-500 mt-1">احتمال: ۲۰٪</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedScenario('base')}
              className={`relative p-3 rounded-xl border text-center transition-all ${
                selectedScenario === 'base'
                  ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
              }`}
            >
              <span className="block text-[10px] font-bold text-blue-700 mb-0.5">پیشنهادی</span>
              <div className="text-[11px] font-semibold text-slate-800">سناریوی پایه</div>
              <div className="font-mono-num text-sm font-extrabold text-slate-900 mt-1" dir="ltr">
                $82 - 86
              </div>
              <div className="text-[10px] text-slate-600 mt-1">احتمال: ۶۰٪</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedScenario('bear')}
              className={`p-3 rounded-xl border text-center transition-all ${
                selectedScenario === 'bear'
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
              }`}
            >
              <div className="text-[11px] font-semibold text-slate-600">سناریوی بدبینانه</div>
              <div className="font-mono-num text-sm font-extrabold text-slate-900 mt-1.5" dir="ltr">
                $74 - 78
              </div>
              <div className="text-[10px] text-slate-500 mt-1">احتمال: ۲۰٪</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * VIEW 3: Matches Screenshot 3 (`OilSense_Global_Oil_Analytics_Dashboard-3_c5309644.png`)
 * Good Evening, KRD. — با نمودار بادبزنی (Fan Chart) پیش‌بینی قیمت برنت و ماتریس ۲×۲ تحلیل سریع
 */
export const CockpitScreenshotView3: React.FC<CockpitProps> = ({ onNavigateModule }) => {
  const [fanHorizon, setFanHorizon] = useState<'1m' | '3m' | '6m' | '12m'>('3m');
  const activeFan = FAN_CHART_TABLE.find((f) => f.horizonKey === fanHorizon) || FAN_CHART_TABLE[1];

  return (
    <div className="space-y-4">
      {/* Header Strip matching Screenshot 3 */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <GlobalOilSphereVisual className="w-14 h-14" />
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight" dir="ltr">
              Good Evening, KRD.
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              وضعیت کنونی بازار جهانی نفت در یک نگاه · خروجی محک‌زنی پیش‌بینی (forecast-benchmark)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
          {['۱ روز', '۷ روز', '۳۰ روز', '۹۰ روز', '۱ سال'].map((t, i) => (
            <button
              key={t}
              type="button"
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap shrink-0 ${
                i === 2
                  ? 'bg-[#D4F338] text-slate-950 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 4 KPI Cards matching Screenshot 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-1">قیمت نفت برنت</div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono-num text-2xl font-extrabold text-slate-900">$82.47</span>
              <span className="font-mono-num text-xs font-bold text-emerald-600" dir="ltr">
                ▲ +1.24%
              </span>
            </div>
            <div className="mt-2">
              <MiniSparkline data={[79.2, 80.1, 80.8, 81.4, 81.9, 82.47]} color="#a3e635" width={120} height={28} />
            </div>
          </div>
          <OilBarrelVisual size="sm" />
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-1">قیمت نفت WTI</div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono-num text-2xl font-extrabold text-slate-900">$79.12</span>
              <span className="font-mono-num text-xs font-bold text-emerald-600" dir="ltr">
                ▲ +1.17%
              </span>
            </div>
            <div className="mt-2">
              <MiniSparkline data={[76.1, 76.9, 77.5, 78.2, 78.8, 79.12]} color="#60a5fa" width={120} height={28} />
            </div>
          </div>
          <OilBarrelVisual size="sm" />
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-1">تغییرات هفتگی</div>
            <div className="font-mono-num text-2xl font-extrabold text-slate-900" dir="ltr">
              +2.32%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">برآیند ۵ روز معاملاتی</div>
          </div>
          {/* Mini Bar Chart */}
          <div className="flex items-end gap-1.5 h-12">
            {[25, 38, 52, 68, 92, 76].map((h, idx) => (
              <div
                key={idx}
                className={`w-2.5 rounded-t ${idx === 4 ? 'bg-[#D4F338]' : 'bg-slate-200'}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-1">موجودی نفت آمریکا</div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono-num text-2xl font-extrabold text-slate-900">423.7M</span>
              <span className="font-mono-num text-xs font-bold text-emerald-600" dir="ltr">
                ▲ +0.8%
              </span>
            </div>
            <div className="mt-2">
              <MiniSparkline data={[418, 419, 421, 422, 423, 423.7]} color="#94a3b8" width={120} height={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Dual Price Chart + Dark 2x2 Quick Analysis Matrix + Latest News */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5">
          <InteractivePriceChart variant="light-dual" titleFa="روند قیمت نفت (برنت و WTI)" />
        </div>

        {/* Dark 2x2 Matrix Card: تحلیل سریع بازار */}
        <div className="lg:col-span-4 bg-[#1B1E26] text-white rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#D4F338]" />
              <span>تحلیل سریع بازار</span>
            </h3>
            <span className="text-[11px] text-slate-400">۴ شاخص کلیدی</span>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-1">
            <div className="rounded-xl bg-slate-800/70 p-3.5 flex flex-col justify-between border border-slate-700/60">
              <TrendingUp className="w-5 h-5 text-[#D4F338]" />
              <div className="mt-2">
                <div className="text-[11px] text-slate-400">جهت حرکت بازار</div>
                <div className="text-xs font-bold text-white mt-0.5">
                  <span className="text-[#D4F338]">صعودی</span> محتمل
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-800/70 p-3.5 flex flex-col justify-between border border-slate-700/60">
              <Scale className="w-5 h-5 text-slate-300" />
              <div className="mt-2">
                <div className="text-[11px] text-slate-400">تراز عرضه و تقاضا</div>
                <div className="text-xs font-bold text-white mt-0.5">متوازن با تمایل به کمبود</div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-800/70 p-3.5 flex flex-col justify-between border border-slate-700/60">
              <Lightbulb className="w-5 h-5 text-[#D4F338]" />
              <div className="mt-2">
                <div className="text-[11px] text-slate-400">پیش‌بینی کوتاه‌مدت</div>
                <div className="text-xs font-bold text-white mt-0.5">۸۳ – ۸۶ دلار</div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-800/70 p-3.5 flex flex-col justify-between border border-slate-700/60">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <div className="mt-2">
                <div className="text-[11px] text-slate-400">ریسک ژئوپلیتیک</div>
                <div className="text-xs font-bold text-white mt-0.5">در سطح بالا (هرمز)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Latest News */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">آخرین اخبار</h3>
            <button
              type="button"
              onClick={() => onNavigateModule('geopolitics')}
              className="text-xs text-slate-500 hover:text-slate-900"
            >
              مشاهده همه ←
            </button>
          </div>
          <div className="space-y-3">
            <div className="p-2.5 rounded-xl bg-slate-50">
              <div className="text-xs font-bold text-slate-900">افزایش تنش‌ها در خاورمیانه</div>
              <div className="text-[11px] text-slate-500 mt-0.5">۲۶ دقیقه پیش · JMIC</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50">
              <div className="text-xs font-bold text-slate-900">کاهش ذخایر نفت آمریکا</div>
              <div className="text-[11px] text-slate-500 mt-0.5">۲ ساعت پیش · EIA WPSR</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50">
              <div className="text-xs font-bold text-slate-900">نشست اوپک+ بدون تغییر تولید</div>
              <div className="text-[11px] text-slate-500 mt-0.5">۲ ساعت پیش · OPEC Secretariat</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Global Stocks Donut (744M) + Dark Fan Chart (سناریوهای پیش‌بینی قیمت برنت) + Market at a Glance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900">توزیع موجودی‌های جهانی</h3>
            <span className="text-[11px] text-slate-500">به تفکیک منطقه</span>
          </div>
          <div className="flex items-center justify-around gap-3">
            <DonutChartSvg
              centerTop="744M"
              centerBottom="بشکه"
              size={118}
              segments={[
                { label: 'آسیا', value: 32, color: '#a3e635' },
                { label: 'آمریکا', value: 28, color: '#1e293b' },
                { label: 'اروپا', value: 24, color: '#3b82f6' },
                { label: 'سایر مناطق', value: 16, color: '#cbd5e1' },
              ]}
            />
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-600">آمریکا</span>
                <span className="font-mono-num font-bold">28%</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-600">اروپا</span>
                <span className="font-mono-num font-bold">24%</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-600">آسیا</span>
                <span className="font-mono-num font-bold">32%</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-600">سایر مناطق</span>
                <span className="font-mono-num font-bold">16%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dark Fan Chart Card matching Screenshot 3 & Dossier forecast-benchmark */}
        <div className="lg:col-span-6 bg-[#1B1E26] text-white rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#D4F338]" />
              <h3 className="text-sm font-bold">سناریوهای پیش‌بینی قیمت برنت (نمودار بادبزنی تجربی)</h3>
            </div>
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-xs">
              {(
                [
                  { id: '1m', label: '۱ ماه' },
                  { id: '3m', label: '۳ ماه' },
                  { id: '6m', label: '۶ ماه' },
                  { id: '12m', label: '۱۲ ماه' },
                ] as const
              ).map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setFanHorizon(h.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap shrink-0 ${
                    fanHorizon === h.id
                      ? 'bg-[#D4F338] text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          <svg viewBox="0 0 520 155" className="w-full h-36 overflow-visible">
            {/* 90% Fan Polygon */}
            <polygon
              points="220,82 320,56 420,38 500,22 500,136 420,122 320,106 220,82"
              fill="rgba(212, 243, 56, 0.12)"
            />
            {/* 68% Fan Polygon */}
            <polygon
              points="220,82 320,66 420,52 500,42 500,112 420,104 320,94 220,82"
              fill="rgba(212, 243, 56, 0.24)"
            />
            {/* Historical + Median Path */}
            <path
              d="M 30,96 L 95,91 L 160,86 L 220,82 L 320,76 L 420,70 L 500,66"
              fill="none"
              stroke="#D4F338"
              strokeWidth="2.8"
            />
            <circle cx="220" cy="82" r="5" fill="#D4F338" stroke="#1B1E26" strokeWidth="2" />
            {/* Callout Box */}
            <g transform="translate(260, 16)">
              <rect x="0" y="0" width="148" height="40" rx="8" fill="#0f172a" stroke="#334155" />
              <text x="74" y="16" textAnchor="middle" fill="#cbd5e1" className="text-[10px]">
                {activeFan.horizonFa} (میانه: ${activeFan.q50})
              </text>
              <text x="74" y="32" textAnchor="middle" fill="#D4F338" className="font-mono-num text-xs font-bold">
                بازه ۶۸٪: ${activeFan.q16} – ${activeFan.q84}
              </text>
            </g>
            <text x="40" y="146" fill="#94a3b8" className="text-[10px]">اکنون</text>
            <text x="205" y="146" fill="#94a3b8" className="text-[10px]">۱ ماه آینده</text>
            <text x="345" y="146" fill="#94a3b8" className="text-[10px]">۲ ماه آینده</text>
            <text x="465" y="146" fill="#94a3b8" className="text-[10px]">۳ ماه آینده</text>
          </svg>
        </div>

        {/* Market Status at a Glance */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900 mb-2">وضعیت بازار در یک نگاه</h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">قیمت‌ها</span>
              <span className="text-emerald-600 font-bold">▲ صعودی</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">عرضه جهانی</span>
              <span className="text-slate-700 font-bold">پایدار (۱۰۳٫۲M)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">تقاضای آسیا</span>
              <span className="text-blue-600 font-bold">← افزایشی</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">ریسک ژئوپلیتیک</span>
              <span className="text-amber-600 font-bold">متوسط رو به بالا</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * VIEW 4: Matches Screenshot 4 (`OilSense__Global_Oil_Market_Dashboard-4_2fdcb2a5.png`)
 * OilInsight — شبتان بخیر، مدیر ارشد (همراه با کارت سه بعدی بشکه، جدول مهم‌ترین شاخص‌ها و هشدارهای مهم)
 */
export const CockpitScreenshotView4: React.FC<CockpitProps> = ({
  onNavigateModule,
  onOpenQuestionModal,
}) => {
  return (
    <div className="space-y-4">
      {/* Greeting Header matching Screenshot 4 */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/70 flex items-center justify-center text-amber-600 font-bold">
            💧
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">شبتان بخیر، مدیر ارشد</h2>
            <p className="text-xs text-slate-500 mt-0.5">وضعیت کنونی بازار جهانی نفت در یک نگاه</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span>آخرین بروزرسانی: ۱۴۰۴/۰۸/۰۸</span>
          <span>·</span>
          <span>بازه زمانی: ۳۰ روز اخیر</span>
        </div>
      </div>

      {/* 4 KPI Cards with Range Sublabels */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <MiniSparkline data={[81.2, 82.0, 82.8, 83.5, 84.1, 84.72]} color="#10b981" width={84} height={36} />
          <div className="text-right">
            <div className="text-xs text-slate-500">قیمت نفت خام برنت</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono-num text-2xl font-extrabold text-slate-900">$84.72</span>
              <span className="font-mono-num text-xs font-bold text-emerald-600">▲ +1.28%</span>
            </div>
            <div className="font-mono-num text-[11px] text-slate-400 mt-0.5">$83.65 – $85.21</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <MiniSparkline data={[78.4, 79.1, 79.8, 80.2, 80.8, 81.24]} color="#10b981" width={84} height={36} />
          <div className="text-right">
            <div className="text-xs text-slate-500">قیمت نفت خام WTI</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono-num text-2xl font-extrabold text-slate-900">$81.24</span>
              <span className="font-mono-num text-xs font-bold text-emerald-600">▲ +1.15%</span>
            </div>
            <div className="font-mono-num text-[11px] text-slate-400 mt-0.5">$79.98 – $81.77</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <MiniSparkline data={[4.18, 4.19, 4.2, 4.21, 4.22, 4.23]} color="#10b981" width={84} height={36} />
          <div className="text-right">
            <div className="text-xs text-slate-500">موجودی جهانی نفت (OECD)</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono-num text-2xl font-extrabold text-slate-900">4.23B</span>
              <span className="font-mono-num text-xs font-bold text-emerald-600">▲ +0.12%</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">بشکه ذخایر تجاری و استراتژیک</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <MiniSparkline data={[0.2, 0.25, 0.3, 0.32, 0.35, 0.38]} color="#10b981" width={84} height={36} />
          <div className="text-right">
            <div className="text-xs text-slate-500">تراز عرضه و تقاضا</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono-num text-2xl font-extrabold text-slate-900" dir="ltr">+0.38</span>
              <span className="font-mono-num text-xs font-bold text-emerald-600">▲ +0.05</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">میلیون بشکه در روز</div>
          </div>
        </div>
      </div>

      {/* Middle Row: 6-Month Chart + 4 Questions Light List + Dark 3D Barrel Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-6">
          <InteractivePriceChart variant="light-dual" titleFa="روند قیمت نفت در ۶ ماه اخیر" />
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>تحلیل سریع بازار</span>
          </h3>
          <div className="space-y-2.5">
            {EXECUTIVE_FOUR_QUESTIONS.map((q) => (
              <button
                key={q.id}
                type="button"
                onClick={() => onOpenQuestionModal(q.id)}
                className="w-full text-right p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between gap-2 transition-colors border border-slate-100"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900">{q.questionFa}</div>
                  <div className="text-[11px] text-slate-500 truncate">{q.shortAnswerFa}</div>
                </div>
                <ArrowLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Dark 3D Barrel Card: وضعیت بازار */}
        <div className="lg:col-span-3 bg-[#1B1E26] text-white rounded-2xl p-5 border border-slate-800 flex flex-col items-center justify-between text-center">
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400">وضعیت: مثبت</span>
            <span className="text-xs text-slate-400">وضعیت بازار</span>
          </div>
          <OilBarrelVisual size="lg" />
          <div>
            <div className="text-sm font-extrabold text-white">بازار در مسیر رشد ملایم</div>
            <div className="text-xs text-slate-400 mt-1">با ریسک‌های ژئوپلیتیک بالا در تنگه‌ها</div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateModule('shock_decomposition')}
            className="mt-3 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
          >
            مشاهده جزئیات ←
          </button>
        </div>
      </div>

      {/* Bottom Row: Map + Key Indicators Table + News + Important Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-2">نقشه جهانی بازار نفت</h3>
          <WorldOilMapSvg />
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3">جدول مهم‌ترین شاخص‌ها</h3>
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100">
                <th className="pb-2">شاخص</th>
                <th className="pb-2">مقدار</th>
                <th className="pb-2">تغییرات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono-num">
              <tr>
                <td className="py-2 font-sans font-medium text-slate-700">برنت (دلار/بشکه)</td>
                <td className="py-2 font-bold">۸۴.۷۲</td>
                <td className="py-2 text-emerald-600" dir="ltr">▲ +1.24%</td>
              </tr>
              <tr>
                <td className="py-2 font-sans font-medium text-slate-700">WTI (دلار/بشکه)</td>
                <td className="py-2 font-bold">۸۱.۲۴</td>
                <td className="py-2 text-emerald-600" dir="ltr">▲ +1.15%</td>
              </tr>
              <tr>
                <td className="py-2 font-sans font-medium text-slate-700">موجودی نفت آمریکا</td>
                <td className="py-2 font-bold">426.6M</td>
                <td className="py-2 text-red-600" dir="ltr">▼ -0.3%</td>
              </tr>
              <tr>
                <td className="py-2 font-sans font-medium text-slate-700">تراز عرضه و تقاضا</td>
                <td className="py-2 font-bold" dir="ltr">+0.48M</td>
                <td className="py-2 text-emerald-600" dir="ltr">▲ +0.05%</td>
              </tr>
              <tr>
                <td className="py-2 font-sans font-medium text-slate-700">شاخص ریسک ژئوپلیتیک</td>
                <td className="py-2 font-bold">۷۶.۵</td>
                <td className="py-2 text-emerald-600" dir="ltr">▲ +2.1%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900">آخرین اخبار و رویدادها</h3>
            <span className="text-xs text-blue-600">مشاهده همه</span>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">کاهش ذخایر نفت آمریکا بیش از انتظار</div>
                <div className="text-[11px] text-slate-500 mt-0.5">۳ ساعت پیش · رویترز</div>
              </div>
              <span className="text-lg">🇺🇸</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">تشدید تنش‌ها در خاورمیانه</div>
                <div className="text-[11px] text-slate-500 mt-0.5">۴ ساعت پیش · بلومبرگ</div>
              </div>
              <span className="text-lg">🚢</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">افزایش تقاضای نفت چین در ماه آینده</div>
                <div className="text-[11px] text-slate-500 mt-0.5">۵ ساعت پیش · فایننشال تایمز</div>
              </div>
              <span className="text-lg">🇨🇳</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-red-500" />
              <span>هشدارهای مهم (۳)</span>
            </h3>
          </div>
          <div className="space-y-2.5 text-xs">
            {INITIAL_ALERTS.slice(0, 3).map((al) => (
              <div key={al.id} className="p-2.5 rounded-xl bg-slate-50">
                <div className="font-bold text-slate-900">{al.titleFa}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {al.timeAgoFa} · {al.priority}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * VIEW 5: Matches Screenshot 5 (`Persian_Oil_Market_Intelligence_Dashboard-5_44f42ad4.png`)
 * اتاق وضعیت بازار جهانی نفت (تحلیل عمیق، دید شفاف، تصمیم هوشمند)
 */
export const CockpitScreenshotView5: React.FC<CockpitProps> = ({ onNavigateModule }) => {
  return (
    <div className="space-y-4">
      {/* Header Strip matching Screenshot 5 */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-[#D4F338] flex items-center justify-center font-bold text-xl">
            💧
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">اتاق وضعیت بازار جهانی نفت</h2>
            <p className="text-xs text-slate-500 mt-0.5">تحلیل عمیق، دید شفاف، تصمیم هوشمند</p>
          </div>
        </div>
        <div className="text-xs font-medium text-slate-600 bg-slate-100 px-3.5 py-2 rounded-xl">
          چهارشنبه ۳۰ اکتبر ۲۰۲۶ · UTC
        </div>
      </div>

      {/* 4 KPI Cards matching Screenshot 5 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-600">قیمت نفت خام برنت</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono-num text-2xl font-extrabold text-slate-900">$ 81.24</span>
              <span className="font-mono-num text-xs font-bold text-emerald-600" dir="ltr">
                ▲ +1.32%
              </span>
            </div>
            <div className="mt-2">
              <MiniSparkline data={[77.8, 78.6, 79.1, 80.0, 80.6, 81.24]} color="#84cc16" width={110} height={30} />
            </div>
          </div>
          <OilBarrelVisual size="sm" />
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-600">قیمت نفت خام WTI</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono-num text-2xl font-extrabold text-slate-900">$ 77.18</span>
              <span className="font-mono-num text-xs font-bold text-emerald-600" dir="ltr">
                ▲ +1.21%
              </span>
            </div>
            <div className="mt-2">
              <MiniSparkline data={[74.2, 75.0, 75.8, 76.2, 76.8, 77.18]} color="#3b82f6" width={110} height={30} />
            </div>
          </div>
          <OilBarrelVisual size="sm" />
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-600">موجودی‌های آمریکا (EIA)</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono-num text-2xl font-extrabold text-slate-900">423.7M</span>
              <span className="font-mono-num text-xs font-bold text-red-600" dir="ltr">
                ▼ -0.8%
              </span>
            </div>
            <div className="mt-2">
              <MiniSparkline data={[428, 427, 426, 425, 424.2, 423.7]} color="#8b5cf6" width={110} height={30} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-600">عرضه جهانی (پیش‌بینی)</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono-num text-2xl font-extrabold text-slate-900">103.4M bpd</span>
              <span className="font-mono-num text-xs font-bold text-emerald-600" dir="ltr">
                ▲ +0.2%
              </span>
            </div>
            <div className="mt-2">
              <MiniSparkline data={[102.2, 102.5, 102.8, 103.0, 103.2, 103.4]} color="#14b8a6" width={110} height={30} />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Dark Dual Chart + Centerpiece 3D Globe & Market Status + Dark Alerts (P0/P1/P2) & Executive Brief */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5">
          <InteractivePriceChart variant="dark-dual" titleFa="روند قیمت‌ها (Brent 81.24 / WTI 77.18)" />
        </div>

        {/* Centerpiece 3D Globe + وضعیت بازار */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <GlobalOilSphereVisual className="w-40 h-40 shrink-0" />
          <div className="text-right space-y-3">
            <div className="text-xs font-bold text-slate-500">وضعیت بازار</div>
            <div className="inline-block bg-[#D4F338] text-slate-950 font-extrabold text-xs px-3 py-1.5 rounded-xl">
              ↗ متعادل با تمایل صعودی
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              بازار نفت تحت تأثیر کاهش ذخایر آمریکا و تداوم ریسک‌های ژئوپلیتیک، روندی صعودی را تجربه می‌کند.
            </p>
            <button
              type="button"
              onClick={() => onNavigateModule('shock_decomposition')}
              className="text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
            >
              مشاهده تحلیل کامل ←
            </button>
          </div>
        </div>

        {/* Right Stack: P0/P1/P2 Alerts + Executive Brief */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <div className="bg-[#1B1E26] text-white rounded-2xl p-4 border border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <span className="text-[#D4F338]">⚡</span> هشدارهای مهم
              </span>
              <span className="text-[11px] text-slate-400">مشاهده همه ←</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-slate-200">کاهش غیرمنتظره ذخایر نفت آمریکا</span>
                <span className="font-mono-num text-[10px] font-bold text-red-400 shrink-0">P0 · 2m</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-slate-200">افزایش ریسک در تنگه هرمز</span>
                <span className="font-mono-num text-[10px] font-bold text-amber-400 shrink-0">P1 · 12m</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-slate-200">تغییر سیاست تولید اوپک+</span>
                <span className="font-mono-num text-[10px] font-bold text-blue-400 shrink-0">P2 · 1h</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex-1">
            <div className="text-xs font-bold text-slate-900 mb-1">خلاصه مدیریتی (بریف ۵ ثانیه‌ای)</div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              بازار نفت در کوتاه‌مدت با فشار افزایشی مواجه است. کاهش ذخایر تجاری آمریکا و تداوم تنش‌های تنگه هرمز احتمال افزایش قیمت‌ها را تقویت کرده است.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Row: Supply/Demand Balance (102.8M) + Global Inventories Grouped Bar + Geopolitical Risk (67/100) + Latest News */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* Supply & Demand Balance Donut */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3">تراز عرضه و تقاضا</h3>
          <div className="flex items-center justify-around gap-2">
            <DonutChartSvg
              centerTop="102.8"
              centerBottom="M bpd"
              size={112}
              segments={[
                { label: 'عرضه جهانی', value: 51, color: '#a3e635' },
                { label: 'تقاضای جهانی', value: 49, color: '#2563eb' },
              ]}
            />
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-600">عرضه جهانی</span>
                <span className="font-mono-num font-bold">103.4</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-600">تقاضای جهانی</span>
                <span className="font-mono-num font-bold">102.8</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-600">توازن بازار</span>
                <span className="font-mono-num font-bold text-emerald-600" dir="ltr">+0.6</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grouped Bar Chart: موجودی‌های جهانی */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900">موجودی‌های جهانی</h3>
            <span className="text-[11px] text-slate-500">آمریکا · اروپا · آسیا</span>
          </div>
          <div className="flex items-end justify-around h-28 pt-4 border-b border-slate-100">
            {[
              { region: 'آمریکا', bars: [85, 65, 55] },
              { region: 'اروپا', bars: [78, 60, 52] },
              { region: 'آسیا', bars: [74, 48, 54] },
            ].map((grp) => (
              <div key={grp.region} className="flex flex-col items-center gap-1.5">
                <div className="flex items-end gap-1 h-20">
                  <div className="w-3 rounded-t bg-slate-800" style={{ height: `${grp.bars[0]}%` }} />
                  <div className="w-3 rounded-t bg-blue-500" style={{ height: `${grp.bars[1]}%` }} />
                  <div className="w-3 rounded-t bg-purple-500" style={{ height: `${grp.bars[2]}%` }} />
                </div>
                <span className="text-[11px] text-slate-600 font-medium">{grp.region}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Geopolitical Risk Gauge (67 / 100) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900 mb-2">ریسک ژئوپلیتیک</h3>
          <div className="flex items-center justify-around gap-3">
            <DonutChartSvg
              centerTop="67"
              centerBottom="از 100"
              size={108}
              segments={[
                { label: 'ریسک', value: 67, color: '#f59e0b' },
                { label: 'باقی', value: 33, color: '#f1f5f9' },
              ]}
            />
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-700 font-medium">خاورمیانه</span>
                <span className="font-mono-num font-bold text-red-600">78 ▲</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-700 font-medium">تنگه هرمز</span>
                <span className="font-mono-num font-bold text-red-600">82 ▲</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-700 font-medium">اوکراین / دریای سیاه</span>
                <span className="font-mono-num font-bold text-slate-600">45 ▼</span>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Market News */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900">آخرین اخبار بازار</h3>
            <span className="text-[11px] text-slate-500">مشاهده همه ←</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-xl bg-slate-50">
              <div className="font-bold text-slate-900">کاهش ذخایر نفت آمریکا فراتر از انتظار</div>
              <div className="text-[10px] text-slate-500">2h ago · Reuters</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50">
              <div className="font-bold text-slate-900">اوپک+ بر ادامه سیاست فعلی تأکید کرد</div>
              <div className="text-[10px] text-slate-500">3h ago · Bloomberg</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50">
              <div className="font-bold text-slate-900">افزایش تنش‌ها در خاورمیانه</div>
              <div className="text-[10px] text-slate-500">4h ago · Financial Times</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
