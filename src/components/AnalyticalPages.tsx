import React, { useState } from 'react';
import {
  Sliders,
  Ship,
  Flame,
  TrendingUp,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  EIA_WPSR_TABLE,
  EIA_26W_TRAJECTORY,
  EIA_12W_HISTORICAL_TREND,
  BALANCE_12W_HISTORICAL_TREND,
  FUTURES_TERM_STRUCTURE,
  COT_12W_POSITIONING,
  SHOCK_WINDOWS_TABLE,
  SHOCK_TRIANGULATION_ROWS,
  MONTHLY_SHOCK_BARS,
  FAN_CHART_TABLE,
  SCOREBOARD_1M,
  SCOREBOARD_12M,
  OPEC_PLUS_MEMBERS,
  OSP_TABLE,
  CHOKEPOINTS_DATA,
  OspRow,
} from '../data/platformData';
import {
  evaluateEiaStockSignal,
  formatSignedPersian,
  toPersianDigits,
  simulateMarketScenario,
  computeCrackSpread321,
} from '../utils/oilAnalytics';

/**
 * 1. EIA WEEKLY STOCKS SKILL PAGE (`eia-weekly-stocks`)
 * Includes Dynamic Recharts 12-Week LineChart + 26W Seasonal Trajectory + WPSR Table
 */
export const EiaStocksDeepPage: React.FC = () => {
  const [useConsensus, setUseConsensus] = useState<boolean>(false);
  const [expCrude, setExpCrude] = useState<number>(-1.5);
  const [expGasoline, setExpGasoline] = useState<number>(-0.8);
  const [expDistillate, setExpDistillate] = useState<number>(-0.5);
  const [stockChartSeries, setStockChartSeries] = useState<'crude' | 'gasoline' | 'distillate_cushing' | 'spr'>('crude');

  const crudeSignal = evaluateEiaStockSignal({
    wowChangeMb: 0.0,
    avg5yChangeMb: 0.8,
    expectedChangeMb: useConsensus ? expCrude : null,
    threshold5yMb: 1.5,
    thresholdConsensusMb: 2.0,
  });

  const gasSignal = evaluateEiaStockSignal({
    wowChangeMb: 4.1,
    avg5yChangeMb: -0.1,
    expectedChangeMb: useConsensus ? expGasoline : null,
    threshold5yMb: 1.0,
    thresholdConsensusMb: 1.5,
  });

  const distSignal = evaluateEiaStockSignal({
    wowChangeMb: 0.9,
    avg5yChangeMb: 0.2,
    expectedChangeMb: useConsensus ? expDistillate : null,
    threshold5yMb: 1.0,
    thresholdConsensusMb: 1.5,
  });

  return (
    <div className="space-y-4" dir="rtl">
      {/* Header Banner */}
      <div className="bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-stone-500">
            Skill: eia-weekly-stocks · منبع: EIA Weekly Petroleum Status Report (API v2)
          </div>
          <h2 className="text-xl font-extrabold text-[#1E1D1B] mt-1">
            موجودی هفتگی آمریکا · هفته منتهی به ۲۰۲۶-۱۰-۲۳
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            در ۵ ثانیه: موجودی بنزین آمریکا ۴٫۱ میلیون بشکه افزایش یافت در حالی که الگوی فصلی ۵ ساله ۰٫۱ کاهش است؛ ارزیابی: فشار نزولی. نفت خام تجاری ۱٫۷ میلیون بشکه زیر میانگین ۵ ساله است.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-left">
            <div className="text-xs font-bold text-[#2D8A4E]">دروازه کیفیت: OK (۹۸/۱۰۰)</div>
            <div className="text-[11px] text-stone-500">۱۵ سری دریافت شد · بدون جهش |z|&gt;4</div>
          </div>
        </div>
      </div>

      {/* Dynamic 12-Week Recharts LineChart Section */}
      <div className="bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-[#1E1D1B]">
              روند پویا و تعاملی موجودی‌های نفت آمریکا در ۱۲ هفته گذشته (Recharts LineChart · میلیون بشکه)
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              مقایسه مستقیم مسیر موجودی واقعی با الگوی فصلی ۵ ساله در ۱۲ هفته منتهی به ۲۰۲۶-۱۰-۲۳
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1 bg-stone-200/80 p-1 rounded-lg text-xs">
            {(
              [
                { id: 'crude', label: 'نفت خام تجاری و ۵ ساله' },
                { id: 'gasoline', label: 'بنزین کل و ۵ ساله' },
                { id: 'distillate_cushing', label: 'تقطیری و کاشینگ' },
                { id: 'spr', label: 'ذخایر استراتژیک (SPR)' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStockChartSeries(tab.id)}
                className={`px-3 py-1 rounded-md font-bold transition-colors whitespace-nowrap ${
                  stockChartSeries === tab.id
                    ? 'bg-[#B83E16] text-white'
                    : 'text-stone-700 hover:text-stone-950'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={EIA_12W_HISTORICAL_TREND} margin={{ top: 10, right: 24, left: 8, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D6D3CD" />
              <XAxis
                dataKey="weekLabel"
                tick={{ fill: '#57534E', fontSize: 11 }}
                stroke="#A8A29E"
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fill: '#57534E', fontSize: 11 }}
                stroke="#A8A29E"
                unit=" mb"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#22211F',
                  borderColor: '#44403C',
                  borderRadius: '10px',
                  color: '#FAF9F5',
                  fontSize: '12px',
                  direction: 'rtl',
                  textAlign: 'right',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '6px' }} />
              {stockChartSeries === 'crude' && (
                <>
                  <Line
                    type="monotone"
                    dataKey="crudeCommercialMb"
                    name="نفت خام تجاری ۲۰۲۶ (mb)"
                    stroke="#B83E16"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#B83E16' }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="crude5yAvgMb"
                    name="میانگین ۵ ساله (mb)"
                    stroke="#57534E"
                    strokeWidth={2}
                    strokeDasharray="5 4"
                    dot={{ r: 3, fill: '#57534E' }}
                  />
                </>
              )}
              {stockChartSeries === 'gasoline' && (
                <>
                  <Line
                    type="monotone"
                    dataKey="gasolineMb"
                    name="موجودی بنزین ۲۰۲۶ (mb)"
                    stroke="#2D8A4E"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#2D8A4E' }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gasoline5yAvgMb"
                    name="میانگین ۵ ساله بنزین (mb)"
                    stroke="#57534E"
                    strokeWidth={2}
                    strokeDasharray="5 4"
                    dot={{ r: 3, fill: '#57534E' }}
                  />
                </>
              )}
              {stockChartSeries === 'distillate_cushing' && (
                <>
                  <Line
                    type="monotone"
                    dataKey="distillateMb"
                    name="موجودی تقطیری/گازوئیل (mb)"
                    stroke="#D96B27"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#D96B27' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cushingMb"
                    name="موجودی کاشینگ (mb)"
                    stroke="#1E1D1B"
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: '#1E1D1B' }}
                  />
                </>
              )}
              {stockChartSeries === 'spr' && (
                <Line
                  type="monotone"
                  dataKey="sprMb"
                  name="ذخایر استراتژیک SPR (mb)"
                  stroke="#B83E16"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#B83E16' }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Row: 26-Week Seasonal Trajectory Chart + Signal Cards & Interactive Consensus */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 26-Week Chart */}
        <div className="lg:col-span-7 bg-[#22211F] text-white rounded-xl p-5 border border-stone-800 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-sm font-bold">
                موجودی تجاری نفت خام در برابر میانگین ۵ ساله در افق ۲۶ هفته‌ای (میلیون بشکه)
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                موجودی در ۲۶ هفته از ۴۴۲٫۰ به ۴۱۵٫۰ رسید و اکنون ۱٫۷ میلیون بشکه زیر میانگین ۵ ساله است.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-[#E68A56] rounded" /> ۲۰۲۶ (WCESTUS1)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-stone-400 rounded" /> میانگین ۵ ساله ISO
              </span>
            </div>
          </div>

          <svg viewBox="0 0 560 185" className="w-full h-44 overflow-visible">
            {[410, 420, 430, 440, 450].map((v) => {
              const y = 160 - ((v - 410) / 40) * 130;
              return (
                <g key={v}>
                  <line x1="40" y1={y} x2="540" y2={y} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                  <text x="34" y={y + 4} textAnchor="end" fill="#a8a29e" className="font-mono-num text-[10px]">
                    {v}
                  </text>
                </g>
              );
            })}
            <path
              d={
                'M ' +
                EIA_26W_TRAJECTORY.map((pt, i) => {
                  const x = 45 + (i / (EIA_26W_TRAJECTORY.length - 1)) * 490;
                  const y = 160 - ((pt.avg5y - 410) / 40) * 130;
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                }).join(' L ')
              }
              fill="none"
              stroke="#a8a29e"
              strokeWidth="2"
              strokeDasharray="5 4"
            />
            <path
              d={
                'M ' +
                EIA_26W_TRAJECTORY.map((pt, i) => {
                  const x = 45 + (i / (EIA_26W_TRAJECTORY.length - 1)) * 490;
                  const y = 160 - ((pt.actual2026 - 410) / 40) * 130;
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                }).join(' L ')
              }
              fill="none"
              stroke="#E68A56"
              strokeWidth="3"
            />
            {EIA_26W_TRAJECTORY.map((pt, i) => {
              const x = 45 + (i / (EIA_26W_TRAJECTORY.length - 1)) * 490;
              const y = 160 - ((pt.actual2026 - 410) / 40) * 130;
              return (
                <g key={pt.week}>
                  <circle cx={x} cy={y} r="3.5" fill="#E68A56" />
                  <text x={x} y="178" textAnchor="middle" fill="#a8a29e" className="font-mono-num text-[10px]">
                    {pt.week}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Weekly Signals & Interactive Consensus Toggle */}
        <div className="lg:col-span-5 bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-[#1E1D1B]">سیگنال‌های این هفته و غافلگیری اجماع</h3>
              <p className="text-[11px] text-stone-500">
                قضاوت تغییر هفتگی در برابر الگوی فصلی ۵ ساله یا نظرسنجی تحلیلگران (Consensus)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setUseConsensus(!useConsensus)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                useConsensus ? 'bg-[#B83E16] text-white' : 'bg-stone-200/80 text-stone-800 hover:bg-stone-300'
              }`}
            >
              {useConsensus ? 'حالت: مقایسه با اجماع' : 'حالت: الگوی ۵ ساله'}
            </button>
          </div>

          {useConsensus && (
            <div className="mb-3 p-3 rounded-lg bg-stone-100 border border-stone-200 grid grid-cols-3 gap-2 text-xs">
              <label className="block">
                <span className="text-[11px] text-stone-500 block">انتظار نفت خام (mb)</span>
                <input
                  type="number"
                  step="0.5"
                  value={expCrude}
                  onChange={(e) => setExpCrude(Number(e.target.value))}
                  className="mt-1 w-full rounded border border-stone-300 px-2 py-1 font-mono-num text-stone-900 bg-white"
                />
              </label>
              <label className="block">
                <span className="text-[11px] text-stone-500 block">انتظار بنزین (mb)</span>
                <input
                  type="number"
                  step="0.5"
                  value={expGasoline}
                  onChange={(e) => setExpGasoline(Number(e.target.value))}
                  className="mt-1 w-full rounded border border-stone-300 px-2 py-1 font-mono-num text-stone-900 bg-white"
                />
              </label>
              <label className="block">
                <span className="text-[11px] text-stone-500 block">انتظار تقطیری (mb)</span>
                <input
                  type="number"
                  step="0.5"
                  value={expDistillate}
                  onChange={(e) => setExpDistillate(Number(e.target.value))}
                  className="mt-1 w-full rounded border border-stone-300 px-2 py-1 font-mono-num text-stone-900 bg-white"
                />
              </label>
            </div>
          )}

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-100">
              <div>
                <span className="font-bold text-stone-900">بنزین کل (WGTSTUS1)</span>
                <span className="text-stone-500 mr-2">
                  {useConsensus
                    ? `غافلگیری: ${formatSignedPersian(gasSignal.surprise ?? 0)} mb`
                    : `انحراف فصلی: ${formatSignedPersian(gasSignal.relativeVs5yChange)} mb`}
                </span>
              </div>
              <span
                className={`font-bold ${
                  gasSignal.direction === 'bearish'
                    ? 'text-[#B83E16]'
                    : gasSignal.direction === 'supportive'
                    ? 'text-[#2D8A4E]'
                    : 'text-stone-600'
                }`}
              >
                {gasSignal.directionFa}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-100">
              <div>
                <span className="font-bold text-stone-900">نفت خام تجاری (WCESTUS1)</span>
                <span className="text-stone-500 mr-2">
                  {useConsensus
                    ? `غافلگیری: ${formatSignedPersian(crudeSignal.surprise ?? 0)} mb`
                    : `انحراف فصلی: ${formatSignedPersian(crudeSignal.relativeVs5yChange)} mb`}
                </span>
              </div>
              <span
                className={`font-bold ${
                  crudeSignal.direction === 'bearish'
                    ? 'text-[#B83E16]'
                    : crudeSignal.direction === 'supportive'
                    ? 'text-[#2D8A4E]'
                    : 'text-stone-600'
                }`}
              >
                {crudeSignal.directionFa}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-100">
              <div>
                <span className="font-bold text-stone-900">تقطیری / گازوئیل (WDISTUS1)</span>
                <span className="text-stone-500 mr-2">
                  {useConsensus
                    ? `غافلگیری: ${formatSignedPersian(distSignal.surprise ?? 0)} mb`
                    : `انحراف فصلی: ${formatSignedPersian(distSignal.relativeVs5yChange)} mb`}
                </span>
              </div>
              <span
                className={`font-bold ${
                  distSignal.direction === 'bearish'
                    ? 'text-[#B83E16]'
                    : distSignal.direction === 'supportive'
                    ? 'text-[#2D8A4E]'
                    : 'text-stone-600'
                }`}
              >
                {distSignal.directionFa}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-100">
              <div>
                <span className="font-bold text-stone-900">کاشینگ (W_EPC0_SAX_YCUOK_MBBL)</span>
                <span className="text-stone-500 mr-2">انحراف فصلی: ۰٫۰ mb</span>
              </div>
              <span className="font-bold text-stone-600">خنثی</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full WPSR Key Numbers Table + Derived Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#1E1D1B]">
              در ۳۰ ثانیه: جدول اعداد کلیدی گزارش EIA WPSR
            </h3>
            <span className="text-xs text-stone-500">موجودی: میلیون بشکه · جریان: هزار بشکه در روز</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="text-stone-500 border-b border-stone-300">
                  <th className="pb-2.5">شاخص (شناسه EIA)</th>
                  <th className="pb-2.5">سطح فعلی</th>
                  <th className="pb-2.5">تغییر هفتگی</th>
                  <th className="pb-2.5">تغییر معمول ۵ ساله</th>
                  <th className="pb-2.5">فاصله از میانگین ۵ ساله</th>
                  <th className="pb-2.5">واحد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/80">
                {EIA_WPSR_TABLE.map((r) => (
                  <tr key={r.id} className="hover:bg-stone-200/40">
                    <td className="py-2.5 font-semibold text-stone-900">
                      {r.nameFa}{' '}
                      <span className="font-mono-num text-[10px] text-stone-400">({r.id})</span>
                    </td>
                    <td className="py-2.5 font-mono-num font-bold text-stone-900">
                      {toPersianDigits(r.level.toLocaleString())}
                    </td>
                    <td
                      className={`py-2.5 font-mono-num font-bold ${
                        r.wow > 0 ? 'text-[#2D8A4E]' : r.wow < 0 ? 'text-[#B83E16]' : 'text-stone-600'
                      }`}
                    >
                      {formatSignedPersian(r.wow, r.unit === 'kbd' ? 0 : 1)}
                    </td>
                    <td className="py-2.5 font-mono-num text-stone-600">
                      {formatSignedPersian(r.avg5yChange, r.unit === 'kbd' ? 0 : 1)}
                    </td>
                    <td className="py-2.5 font-mono-num text-stone-700">
                      {formatSignedPersian(r.devVs5y, r.unit === 'kbd' ? 0 : 1)} (
                      {formatSignedPersian(r.devVs5yPct, 1)}٪)
                    </td>
                    <td className="py-2.5 text-stone-500">{r.unitFa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Derived Indicators (5-Minute Details) */}
        <div className="lg:col-span-4 bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1E1D1B] mb-3">
              در ۵ دقیقه: شاخص‌های مشتق‌شده و تقاضای ضمنی
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-lg bg-stone-100 flex items-center justify-between">
                <span className="text-stone-600">مصرف ضمنی کل فرآورده‌ها (میانگین ۴ هفته)</span>
                <span className="font-mono-num font-bold text-stone-900">۱۹٬۶۷۴ kb/d (۰٫۳−٪)</span>
              </div>
              <div className="p-3 rounded-lg bg-stone-100 flex items-center justify-between">
                <span className="text-stone-600">مصرف ضمنی بنزین (میانگین ۴ هفته)</span>
                <span className="font-mono-num font-bold text-stone-900">۸٬۴۱۷ kb/d (۰٫۲−٪)</span>
              </div>
              <div className="p-3 rounded-lg bg-stone-100 flex items-center justify-between">
                <span className="text-stone-600">روزهای پوشش نفت خام تجاری</span>
                <span className="font-mono-num font-bold text-stone-900">۲۶٫۵ روز</span>
              </div>
              <div className="p-3 rounded-lg bg-stone-100 flex items-center justify-between">
                <span className="text-stone-600">روزهای پوشش بنزین</span>
                <span className="font-mono-num font-bold text-stone-900">۲۵٫۵ روز</span>
              </div>
              <div className="p-3 rounded-lg bg-stone-100 flex items-center justify-between">
                <span className="text-stone-600">مجموع تغییر سه موجودی تجاری (Big 3)</span>
                <span className="font-mono-num font-bold text-[#B83E16]">۵٫۰+ میلیون بشکه</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200 text-[11px] text-stone-500 leading-relaxed">
            قواعد تفسیر Skill: تغییرات ذخایر استراتژیک (SPR: ۴۰۰٫۵ mb، ۰٫۹+ mb) ناشی از تصمیم سیاستی است و با موجودی تجاری ترکیب نمی‌شود.
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 2. OIL SHOCK DECOMPOSITION SKILL PAGE (`oil-shock-decomposition`)
 */
export const ShockDecompositionDeepPage: React.FC = () => {
  return (
    <div className="space-y-4" dir="rtl">
      <div className="bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-stone-500">
            Skill: oil-shock-decomposition · روش‌ها: Kilian (2009) SVAR + Baumeister–Hamilton (2019) + Känzig (2021)
          </div>
          <h2 className="text-xl font-extrabold text-[#1E1D1B] mt-1">
            چرا قیمت نفت حرکت کرد؟ · تجزیه ساختاری شوک‌ها تا ۲۰۲۶-۰۸
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            در ۵ ثانیه: از ۱۲٫۹٪ افزایش قیمت واقعی نفت در ۱۲ ماه تا اوت ۲۰۲۶، سهم تقریبی «تقاضای اختصاصی نفت (احتیاطی و موجودی)» ۱۷٫۲+ واحد لگاریتمی و «شوک عرضه» ۶٫۲+ واحد بود؛ در حالی که «تقاضای کل اقتصاد جهانی» ۱۱٫۲− واحد از آن کاست.
          </p>
        </div>
        <div className="text-left">
          <div className="text-xs font-bold text-[#2D8A4E]">وضعیت مدل: OK · VAR پایدار</div>
          <div className="text-[11px] text-stone-500">۲۴ وقفه · بزرگ‌ترین ریشه همراه: ۰٫۹۷۳</div>
        </div>
      </div>

      {/* Monthly Decomposition Chart + Window Contributions Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 bg-[#22211F] text-white rounded-xl p-5 border border-stone-800 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-sm font-bold">
                سهم هر عامل در تغییر ماهانه قیمت واقعی نفت (واحد لگاریتمی)
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                تقاضای اختصاصی نفت (احتیاطی و موجودی) بزرگ‌ترین محرک ماه‌به‌ماه است.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#2E9E5B]" /> تقاضای اختصاصی
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#E67E22]" /> عرضه
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#D9463E]" /> تقاضای اقتصادی
              </span>
            </div>
          </div>

          <div className="grid grid-cols-10 gap-2 items-center h-44 pt-4 px-2">
            {MONTHLY_SHOCK_BARS.map((m) => (
              <div key={m.month} className="flex flex-col items-center justify-between h-full">
                <div className="relative w-full flex-1 flex flex-col items-center justify-center">
                  <div
                    className="w-5 rounded-t bg-[#2E9E5B]"
                    style={{ height: `${Math.min(100, Math.abs(m.oilSpecific) * 4.5)}px` }}
                    title={`تقاضای اختصاصی: ${m.oilSpecific}`}
                  />
                  <div
                    className="w-5 bg-[#E67E22] mt-0.5"
                    style={{ height: `${Math.max(4, Math.abs(m.supply) * 6)}px` }}
                    title={`عرضه: ${m.supply}`}
                  />
                  <div
                    className="w-5 rounded-b bg-[#D9463E] mt-0.5"
                    style={{ height: `${Math.max(4, Math.abs(m.aggDemand) * 6)}px` }}
                    title={`تقاضای اقتصادی: ${m.aggDemand}`}
                  />
                </div>
                <span className="font-mono-num text-[10px] text-stone-400 mt-2">
                  {m.month.slice(5)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Window Contributions Table (1m, 3m, 12m) */}
        <div className="lg:col-span-5 bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1E1D1B] mb-1">
              در ۳۰ ثانیه: سهم عوامل در بازه‌های زمانی (روش Kilian 2009)
            </h3>
            <p className="text-[11px] text-stone-500 mb-3">
              واحد لگاریتمی ≈ درصد · جمع دقیق سه شوک به‌علاوه پایه برابر تغییر قیمت واقعی است
            </p>

            <table className="w-full text-right text-xs">
              <thead>
                <tr className="text-stone-500 border-b border-stone-300">
                  <th className="pb-2">عامل ساختاری</th>
                  <th className="pb-2">۱ ماه</th>
                  <th className="pb-2">۳ ماه</th>
                  <th className="pb-2">۱۲ ماه</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-mono-num">
                {SHOCK_WINDOWS_TABLE.map((row) => (
                  <tr key={row.key}>
                    <td className="py-2.5 font-sans font-semibold text-stone-800">{row.driverFa}</td>
                    <td className="py-2.5 font-bold text-stone-900">{formatSignedPersian(row.m1)}</td>
                    <td className="py-2.5 font-bold text-stone-900">{formatSignedPersian(row.m3)}</td>
                    <td className="py-2.5 font-bold text-stone-900">{formatSignedPersian(row.m12)}</td>
                  </tr>
                ))}
                <tr className="bg-stone-100 font-bold">
                  <td className="py-2.5 font-sans text-stone-900">جمع (لگاریتمی)</td>
                  <td className="py-2.5 text-stone-900">۴٫۱+</td>
                  <td className="py-2.5 text-stone-900">۲۶٫۸+</td>
                  <td className="py-2.5 text-stone-900">۱۲٫۱+</td>
                </tr>
                <tr className="bg-[#2D8A4E]/10 font-extrabold">
                  <td className="py-2.5 font-sans text-[#1E1D1B]">تغییر قیمت واقعی نفت</td>
                  <td className="py-2.5 text-[#2D8A4E]">۴٫۲+٪</td>
                  <td className="py-2.5 text-[#2D8A4E]">۳۰٫۷+٪</td>
                  <td className="py-2.5 text-[#2D8A4E]">۱۲٫۹+٪</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Method Triangulation Table (Kilian vs Baumeister-Hamilton vs Kanzig) + IRF Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-[#1E1D1B]">
                تطبیق سه روش: علامت شوک عرضه (مثبت = افزاینده قیمت / کاهش عرضه)
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                در ماه‌های «ناهمسو» نتیجه به فرض کشش کوتاه‌مدت عرضه وابسته است؛ داشبورد اختلاف روش‌ها را آشکار می‌کند.
              </p>
            </div>
          </div>

          <table className="w-full text-right text-xs">
            <thead>
              <tr className="text-stone-500 border-b border-stone-300">
                <th className="pb-2">ماه</th>
                <th className="pb-2">Kilian (2009)</th>
                <th className="pb-2">Baumeister–Hamilton (2019)</th>
                <th className="pb-2">Känzig (2021) OPEC News</th>
                <th className="pb-2">نتیجه تطبیق</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 font-mono-num">
              {SHOCK_TRIANGULATION_ROWS.map((r) => (
                <tr key={r.month} className="hover:bg-stone-200/40">
                  <td className="py-2.5 font-bold text-stone-900">{toPersianDigits(r.month)}</td>
                  <td className="py-2.5">{formatSignedPersian(r.kilian)}</td>
                  <td className="py-2.5">{formatSignedPersian(r.bh)}</td>
                  <td className="py-2.5">{formatSignedPersian(r.kaenzig)}</td>
                  <td className="py-2.5 font-sans font-bold">
                    <span
                      className={
                        r.label === 'agree'
                          ? 'text-[#2D8A4E]'
                          : r.label === 'disagree'
                          ? 'text-[#B83E16]'
                          : 'text-[#D96B27]'
                      }
                    >
                      {r.labelFa}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:col-span-5 bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1E1D1B] mb-3">
              در ۵ دقیقه: توابع واکنش آنی (IRF) و تفاوت روش‌ها
            </h3>
            <div className="space-y-2.5 text-xs text-stone-700 leading-relaxed">
              <div className="p-3 rounded-lg bg-stone-100">
                <div className="font-bold text-stone-900">واکنش به ۱ انحراف معیار شوک تقاضای اختصاصی نفت:</div>
                <div className="text-stone-600 mt-0.5">
                  اوج واکنش فوری ۶٫۱+٪ در ماه اول و پایداری بالا تا افق ۱۲ ماهه (باند اطمینان ۶۸٪ و ۹۰٪ بوت‌استرپ ۳۰۰ تکرار).
                </div>
              </div>
              <div className="p-3 rounded-lg bg-stone-100">
                <div className="font-bold text-stone-900">تفاوت Kilian و Baumeister–Hamilton:</div>
                <div className="text-stone-600 mt-0.5">
                  مدل Kilian فرض می‌کند عرضه نفت در همان ماه به شوک تقاضا واکنش نمی‌دهد (منحنی عرضه عمودی)، اما Baumeister–Hamilton با پیشین بیزی روی کشش عرضه و تقاضا، سهم بیشتری به شوک عرضه می‌دهند.
                </div>
              </div>
              <div className="p-3 rounded-lg bg-stone-100">
                <div className="font-bold text-stone-900">ابزار خارجی Känzig (2021):</div>
                <div className="text-stone-600 mt-0.5">
                  تغییر قیمت آتی نفت در پنجره زمانی تنگ پیرامون بیانیه‌های رسمی اوپک+ را به‌عنوان شوک خبری عرضه خالص اندازه‌گیری می‌کند.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 3. FORECAST BENCHMARK & WHAT-IF SCENARIO SIMULATOR (`forecast-benchmark`)
 */
export const ForecastScenarioDeepPage: React.FC = () => {
  const [scoreHorizon, setScoreHorizon] = useState<'1m' | '12m'>('1m');
  const [opecDelta, setOpecDelta] = useState<number>(-0.5);
  const [chokepointDisruption, setChokepointDisruption] = useState<number>(1.0);
  const [demandDelta, setDemandDelta] = useState<number>(0.3);
  const [dxyChange, setDxyChange] = useState<number>(-1.0);
  const [orgExportMbd, setOrgExportMbd] = useState<number>(1.65);
  const [orgBreakeven] = useState<number>(74.0);

  const sim = simulateMarketScenario({
    baseBrentUsd: 82.75,
    opecSupplyDeltaMbd: opecDelta,
    chokepointDisruptionMbd: chokepointDisruption,
    globalDemandDeltaMbd: demandDelta,
    dxyChangePct: dxyChange,
    orgExportVolumeMbd: orgExportMbd,
    orgFiscalBreakevenUsd: orgBreakeven,
  });

  const activeScoreboard = scoreHorizon === '1m' ? SCOREBOARD_1M : SCOREBOARD_12M;

  return (
    <div className="space-y-4" dir="rtl">
      <div className="bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-stone-500">
            Skill: forecast-benchmark · ارزیابی خارج از نمونه ۲۰۰۸-۰۱ تا ۲۰۲۶-۰۸ · آزمون Diebold–Mariano (HLN)
          </div>
          <h2 className="text-xl font-extrabold text-[#1E1D1B] mt-1">
            پیش‌بینی قیمت، محک‌زنی مدل‌ها و شبیه‌ساز سناریوی سازمانی
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            قاعده حاکمیتی پلتفرم: هیچ مدلی بدون شکست معنی‌دار پیش‌بینی «بدون تغییر» (no_change) به کاکپیت راه نمی‌یابد. مدل‌های دارای نشت اطلاعات آینده (Look-ahead) خودکار حذف می‌شوند.
          </p>
        </div>
        <div className="text-left">
          <div className="text-xs font-bold text-[#D96B27]">وضعیت ارزیابی: WARN</div>
          <div className="text-[11px] text-stone-500">مدل متقلب (cheater) به دلیل look-ahead حذف شد</div>
        </div>
      </div>

      {/* Row 1: Empirical Fan Chart Table + Diebold-Mariano Scoreboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1E1D1B] mb-1">
              بازه‌های احتمال آخرین پیش‌بینی (نمودار بادبزنی تجربی · مدل برگزیده: futures)
            </h3>
            <p className="text-[11px] text-stone-500 mb-3">
              بازه احتمال در افق ۱۲ ماهه از ۴۶٫۸ تا ۱۶۳٫۶ دلار باز می‌شود و نباید به‌عنوان عدد قطعی ارائه شود.
            </p>

            <table className="w-full text-right text-xs">
              <thead>
                <tr className="text-stone-500 border-b border-stone-300">
                  <th className="pb-2">افق</th>
                  <th className="pb-2">میانه (۵۰٪)</th>
                  <th className="pb-2">بازه ۶۸٪ (۱۶ تا ۸۴)</th>
                  <th className="pb-2">بازه ۹۰٪ (۵ تا ۹۵)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-mono-num">
                {FAN_CHART_TABLE.map((f) => (
                  <tr key={f.horizonKey} className="hover:bg-stone-200/40">
                    <td className="py-2.5 font-sans font-bold text-stone-900">{f.horizonFa}</td>
                    <td className="py-2.5 font-extrabold text-stone-900">${toPersianDigits(f.q50)}</td>
                    <td className="py-2.5 text-stone-700">
                      ${toPersianDigits(f.q16)} – ${toPersianDigits(f.q84)}
                    </td>
                    <td className="py-2.5 text-stone-500">
                      ${toPersianDigits(f.q5)} – ${toPersianDigits(f.q95)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-[#D96B27]/10 border border-[#D96B27]/30 text-[11px] text-stone-800">
            توجه روش‌شناختی: بازه‌های بادبزنی از توزیع خطاهای تاریخی همین مدل ساخته شده‌اند؛ برای رویدادهای کم‌سابقه مانند بسته شدن تنگه‌ها از شبیه‌ساز سناریوی زیر استفاده کنید.
          </div>
        </div>

        {/* Diebold-Mariano Scoreboard */}
        <div className="lg:col-span-7 bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-sm font-bold text-[#1E1D1B]">
                جدول امتیاز مدل‌ها در برابر معیار «بدون تغییر» (no_change)
              </h3>
              <p className="text-[11px] text-stone-500">
                نسبت خطای MSPE کمتر از ۱٫۰۰ به معنای عملکرد بهتر از معیار است
              </p>
            </div>
            <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setScoreHorizon('1m')}
                className={`px-3 py-1 rounded-md font-bold transition-colors ${
                  scoreHorizon === '1m' ? 'bg-[#B83E16] text-white' : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                افق ۱ ماه
              </button>
              <button
                type="button"
                onClick={() => setScoreHorizon('12m')}
                className={`px-3 py-1 rounded-md font-bold transition-colors ${
                  scoreHorizon === '12m' ? 'bg-[#B83E16] text-white' : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                افق ۱۲ ماه
              </button>
            </div>
          </div>

          <table className="w-full text-right text-xs">
            <thead>
              <tr className="text-stone-500 border-b border-stone-300">
                <th className="pb-2">نام مدل</th>
                <th className="pb-2">تعداد (n)</th>
                <th className="pb-2">نسبت خطا (MSPE)</th>
                <th className="pb-2">مقدار p (آزمون DM-HLN)</th>
                <th className="pb-2">دقت جهت (PT)</th>
                <th className="pb-2">حکم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 font-mono-num">
              {activeScoreboard.map((row) => (
                <tr key={row.model} className="hover:bg-stone-200/40">
                  <td className="py-2.5 font-bold text-stone-900">{row.model}</td>
                  <td className="py-2.5 text-stone-600">{toPersianDigits(row.n)}</td>
                  <td className="py-2.5 font-bold text-stone-900">{toPersianDigits(row.mspeRatio.toFixed(2))}</td>
                  <td className="py-2.5 text-stone-600">
                    {row.dmPvalue !== null ? toPersianDigits(row.dmPvalue.toFixed(3)) : '—'}
                  </td>
                  <td className="py-2.5 text-stone-700">
                    {row.hitRatePct !== null ? `${toPersianDigits(row.hitRatePct)}٪` : '—'}
                  </td>
                  <td className="py-2.5 font-sans font-bold">
                    <span
                      className={
                        row.verdict === 'significantly_better'
                          ? 'text-[#2D8A4E]'
                          : row.verdict === 'not_better'
                          ? 'text-[#B83E16]'
                          : 'text-stone-600'
                      }
                    >
                      {row.verdictFa}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 2: Interactive What-If Scenario & Organization Revenue Impact Simulator */}
      <div className="bg-[#22211F] text-white rounded-xl p-6 border border-stone-800">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base font-extrabold flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#E68A56]" />
              <span>شبیه‌ساز سناریوی تعاملی (What-If Oracle) و اثر بر درآمد سازمان</span>
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              ترجمه مستقیم شوک‌های عرضه اوپک+، اختلال تنگه‌ها، رشد تقاضا و شاخص دلار به قیمت برنت و بودجه صادراتی سازمان
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setOpecDelta(0);
              setChokepointDisruption(0);
              setDemandDelta(0);
              setDxyChange(0);
            }}
            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-300 transition-colors"
          >
            بازنشانی به وضعیت پایه
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-stone-300 font-medium">تغییر عرضه اوپک+ (mb/d)</span>
                <span className="font-mono-num font-bold text-[#E68A56]" dir="ltr">
                  {opecDelta > 0 ? `+${opecDelta}` : opecDelta} mb/d
                </span>
              </div>
              <input
                type="range"
                min="-2.0"
                max="2.0"
                step="0.25"
                value={opecDelta}
                onChange={(e) => setOpecDelta(Number(e.target.value))}
                className="w-full accent-[#E68A56]"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>کاهش شدید (-۲٫۰)</span>
                <span>افزایش عرضه (+۲٫۰)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-stone-300 font-medium">اختلال ترانزیت تنگه‌ها (mb/d)</span>
                <span className="font-mono-num font-bold text-[#FF6B5B]" dir="ltr">
                  {chokepointDisruption} mb/d
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="4.0"
                step="0.25"
                value={chokepointDisruption}
                onChange={(e) => setChokepointDisruption(Number(e.target.value))}
                className="w-full accent-[#E68A56]"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>عادی (۰)</span>
                <span>بحران شدید هرمز (۴٫۰)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-stone-300 font-medium">شوک تقاضای جهانی (چین/هند)</span>
                <span className="font-mono-num font-bold text-[#F2DA63]" dir="ltr">
                  {demandDelta > 0 ? `+${demandDelta}` : demandDelta} mb/d
                </span>
              </div>
              <input
                type="range"
                min="-2.0"
                max="2.0"
                step="0.25"
                value={demandDelta}
                onChange={(e) => setDemandDelta(Number(e.target.value))}
                className="w-full accent-[#E68A56]"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>رکود (-۲٫۰)</span>
                <span>رونق (+۲٫۰)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-stone-300 font-medium">حجم صادرات روزانه سازمان (mb/d)</span>
                <span className="font-mono-num font-bold text-[#2ECC71]" dir="ltr">
                  {orgExportMbd} mb/d
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.5"
                step="0.05"
                value={orgExportMbd}
                onChange={(e) => setOrgExportMbd(Number(e.target.value))}
                className="w-full accent-[#E68A56]"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>۰٫۵ mb/d</span>
                <span>۳٫۵ mb/d</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-stone-900 border border-stone-700">
              <div className="text-xs text-stone-400">قیمت برنت شبیه‌سازی‌شده</div>
              <div className="font-mono-num text-3xl font-extrabold text-[#E68A56] mt-1">
                ${sim.projectedBrentUsd}
              </div>
              <div className="font-mono-num text-xs text-stone-300 mt-1" dir="ltr">
                {sim.priceDeltaUsd >= 0 ? `+${sim.priceDeltaUsd}$` : `${sim.priceDeltaUsd}$`} ({sim.priceDeltaPct}%)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-900 border border-stone-700">
              <div className="text-xs text-stone-400">تراز جدید بازار جهانی</div>
              <div className="font-mono-num text-3xl font-extrabold text-white mt-1" dir="ltr">
                {sim.newBalanceMbd > 0 ? `+${sim.newBalanceMbd}` : sim.newBalanceMbd}
              </div>
              <div className="text-xs text-stone-400 mt-1">
                میلیون بشکه در روز ({sim.newBalanceMbd < 0 ? 'کسری عرضه' : 'مازاد عرضه'})
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-900 border border-stone-700">
              <div className="text-xs text-stone-400">درآمد سالانه صادراتی سازمان</div>
              <div className="font-mono-num text-2xl font-extrabold text-[#2ECC71] mt-1">
                ${sim.projectedAnnualRevenueB}B
              </div>
              <div className="font-mono-num text-xs text-stone-300 mt-1" dir="ltr">
                تغییر: {sim.revenueDeltaB >= 0 ? `+$${sim.revenueDeltaB}B` : `-$${Math.abs(sim.revenueDeltaB)}B`} در سال
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-900 border border-stone-700">
              <div className="text-xs text-stone-400">فاصله از سربه‌سر بودجه (${orgBreakeven})</div>
              <div
                className={`font-mono-num text-2xl font-extrabold mt-1 ${
                  sim.fiscalMarginUsd >= 0 ? 'text-[#2ECC71]' : 'text-[#FF6B5B]'
                }`}
                dir="ltr"
              >
                {sim.fiscalMarginUsd >= 0 ? `+$${sim.fiscalMarginUsd}` : `-$${Math.abs(sim.fiscalMarginUsd)}`} / bbl
              </div>
              <div className="text-xs text-stone-400 mt-1">حاشیه امنیت مالی</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 4. SUPPLY/DEMAND BALANCE, OPEC+ TRACKER & OSP PAGE (`oil-balance-builder`, `opec-momr-parser`, `osp-tracker`)
 * Includes Dynamic Recharts 12-Week Supply-Demand Balance LineChart
 */
export const BalanceOpecDeepPage: React.FC = () => {
  const [osps, setOsps] = useState<OspRow[]>(OSP_TABLE);
  const [balanceChartMode, setBalanceChartMode] = useState<'supply_demand' | 'balance_opec'>('supply_demand');
  const crack321 = computeCrackSpread321(79.82, 99.4, 106.2);

  const handleApproveOsp = (gradeFa: string) => {
    setOsps((prev) =>
      prev.map((item) =>
        item.gradeFa === gradeFa
          ? {
              ...item,
              verificationStatus: 'verified',
              noteFa: 'تأیید انسانی انجام شد (Human-in-the-loop)',
            }
          : item
      )
    );
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div className="bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-stone-500">
            Skills: oil-balance-builder · opec-momr-parser · osp-tracker · crack-spread-margins
          </div>
          <h2 className="text-xl font-extrabold text-[#1E1D1B] mt-1">
            تراز عرضه و تقاضا، ردیاب اوپک+ و قیمت‌های رسمی فروش (OSP)
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            نمایش اختلاف برآوردهای IEA، اوپک و EIA به‌عنوان سیگنال تحلیلی · پایش ۸ منبع ثانویه جدید اوپک (فوریه ۲۰۲۵) و فرمول جدید OSP ادنوک (نوامبر ۲۰۲۶)
          </p>
        </div>
        <div className="bg-stone-200/70 px-4 py-2 rounded-xl text-left">
          <div className="text-[11px] text-stone-600">کرک اسپرد ۳:۲:۱ (NY Harbor)</div>
          <div className="font-mono-num text-lg font-extrabold text-[#1E1D1B]">${crack321} / bbl</div>
        </div>
      </div>

      {/* Dynamic 12-Week Recharts LineChart for Supply-Demand Balance & OPEC+ Output */}
      <div className="bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-[#1E1D1B]">
              روند ۱۲ هفته اخیر تراز عرضه و تقاضای جهانی و تولید اوپک+ (Recharts LineChart · میلیون بشکه در روز)
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              پایش هفتگی شکاف عرضه و تقاضای جهانی (مازاد ۰٫۶+ میلیون بشکه در روز در هفته جاری) در کنار جداول پایبندی اعضا
            </p>
          </div>
          <div className="flex items-center gap-1 bg-stone-200/80 p-1 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setBalanceChartMode('supply_demand')}
              className={`px-3 py-1 rounded-md font-bold transition-colors ${
                balanceChartMode === 'supply_demand'
                  ? 'bg-[#B83E16] text-white'
                  : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              عرضه کل در برابر تقاضای جهانی
            </button>
            <button
              type="button"
              onClick={() => setBalanceChartMode('balance_opec')}
              className={`px-3 py-1 rounded-md font-bold transition-colors ${
                balanceChartMode === 'balance_opec'
                  ? 'bg-[#B83E16] text-white'
                  : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              تراز ضمنی (مازاد/کسری) و تولید اوپک+
            </button>
          </div>
        </div>

        <div className="h-64 w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={BALANCE_12W_HISTORICAL_TREND} margin={{ top: 10, right: 24, left: 8, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D6D3CD" />
              <XAxis
                dataKey="weekLabel"
                tick={{ fill: '#57534E', fontSize: 11 }}
                stroke="#A8A29E"
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fill: '#57534E', fontSize: 11 }}
                stroke="#A8A29E"
                unit=" mb/d"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#22211F',
                  borderColor: '#44403C',
                  borderRadius: '10px',
                  color: '#FAF9F5',
                  fontSize: '12px',
                  direction: 'rtl',
                  textAlign: 'right',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '6px' }} />
              {balanceChartMode === 'supply_demand' ? (
                <>
                  <Line
                    type="monotone"
                    dataKey="globalSupplyMbd"
                    name="عرضه جهانی نفت (mb/d)"
                    stroke="#B83E16"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#B83E16' }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="globalDemandMbd"
                    name="تقاضای جهانی نفت (mb/d)"
                    stroke="#2D8A4E"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#2D8A4E' }}
                    activeDot={{ r: 6 }}
                  />
                </>
              ) : (
                <>
                  <ReferenceLine y={0} stroke="#78716C" strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="impliedBalanceMbd"
                    name="تراز ضمنی بازار (مازاد+ / کسری- mb/d)"
                    stroke="#B83E16"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#B83E16' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="opecPlusOutputMbd"
                    name="تولید کل اوپک+ (mb/d)"
                    stroke="#1E1D1B"
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: '#1E1D1B' }}
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* OPEC+ Compliance Table & Multi-Agency Balance Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#1E1D1B]">
              ردیاب تولید و پایبندی اعضای اوپک+ (هزار بشکه در روز · MOMR)
            </h3>
            <span className="text-[11px] text-stone-500">
              منابع ثانویه: Kpler، OilX، ESAI، Platts، Argus، WoodMac، IHS، EI
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="text-stone-500 border-b border-stone-300">
                  <th className="pb-2">کشور عضو</th>
                  <th className="pb-2">سهمیه مصوب</th>
                  <th className="pb-2">منابع ثانویه</th>
                  <th className="pb-2">اعلام مستقیم</th>
                  <th className="pb-2">ظرفیت مازاد</th>
                  <th className="pb-2">پایبندی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-mono-num">
                {OPEC_PLUS_MEMBERS.map((m) => (
                  <tr key={m.countryFa} className="hover:bg-stone-200/40">
                    <td className="py-2.5 font-sans font-bold text-stone-900">
                      <span className="ml-1.5">{m.flag}</span>
                      {m.countryFa}
                    </td>
                    <td className="py-2.5 text-stone-600">
                      {m.quotaKbd ? toPersianDigits(m.quotaKbd.toLocaleString()) : 'معاف'}
                    </td>
                    <td className="py-2.5 font-bold text-stone-900">
                      {toPersianDigits(m.secondarySourcesKbd.toLocaleString())}
                    </td>
                    <td className="py-2.5 text-stone-600">
                      {toPersianDigits(m.directCommKbd.toLocaleString())}
                    </td>
                    <td className="py-2.5 text-[#B83E16] font-semibold">
                      {toPersianDigits(m.spareCapacityKbd.toLocaleString())}
                    </td>
                    <td className="py-2.5 font-bold">
                      {m.compliancePct !== null ? (
                        <span className={m.compliancePct >= 95 ? 'text-[#2D8A4E]' : 'text-[#D96B27]'}>
                          {toPersianDigits(m.compliancePct)}٪
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Multi-Agency Balance Reconciliation */}
        <div className="lg:col-span-5 bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1E1D1B] mb-1">
              تطبیق برآورد تراز جهانی ۲۰۲۶-۲۰۲۷ (میلیون بشکه در روز)
            </h3>
            <p className="text-[11px] text-stone-500 mb-3">
              فاصله ۵۳۰ هزار بشکه‌ای برآورد تقاضای اوپک و IEA یک سیگنال تحلیلی کلیدی است
            </p>

            <table className="w-full text-right text-xs">
              <thead>
                <tr className="text-stone-500 border-b border-stone-300">
                  <th className="pb-2">نهاد مرجع</th>
                  <th className="pb-2">تقاضای جهانی</th>
                  <th className="pb-2">عرضه غیراوپک+</th>
                  <th className="pb-2">فراخوان نفت اوپک+</th>
                  <th className="pb-2">تراز ضمنی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-mono-num">
                <tr>
                  <td className="py-2.5 font-sans font-bold text-stone-900">OPEC MOMR</td>
                  <td className="py-2.5 font-bold">۱۰۴٫۵</td>
                  <td className="py-2.5">۵۳٫۱</td>
                  <td className="py-2.5 text-[#2D8A4E] font-bold">۴۳٫۲</td>
                  <td className="py-2.5 text-[#2D8A4E] font-bold">۰٫۴− (کسری)</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-bold text-stone-900">EIA STEO</td>
                  <td className="py-2.5 font-bold">۱۰۳٫۴</td>
                  <td className="py-2.5">۵۳٫۵</td>
                  <td className="py-2.5 text-stone-800 font-bold">۴۱٫۹</td>
                  <td className="py-2.5 text-[#D96B27] font-bold">۰٫۶+ (مازاد)</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-bold text-stone-900">IEA OMR</td>
                  <td className="py-2.5 font-bold">۱۰۳٫۰</td>
                  <td className="py-2.5">۵۳٫۸</td>
                  <td className="py-2.5 text-stone-800 font-bold">۴۱٫۳</td>
                  <td className="py-2.5 text-[#B83E16] font-bold">۱٫۱+ (مازاد)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-stone-100 text-[11px] text-stone-600 leading-relaxed">
            کنترل سازگاری درونی (لایه ۴ کیفیت): جمع تولید تک‌تک اعضا در جدول PDF گزارش MOMR با سطر مجموع (۴۰٬۹۲۰ kb/d) تطبیق و تأیید شد.
          </div>
        </div>
      </div>

      {/* Official Selling Prices (OSP) Table with Human-in-the-Loop Approval */}
      <div className="bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-bold text-[#1E1D1B]">
              قیمت‌های رسمی فروش خلیج فارس (OSP) · الگوی اتصال D (خبر + LLM + تأیید انسانی)
            </h3>
            <p className="text-[11px] text-stone-500">
              هر استخراج خودکار از تیتر رسانه‌ها پیش از انتشار نهایی روی کاکپیت نیاز به دو منبع مستقل یا تأیید تحلیلگر دارد
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="text-stone-500 border-b border-stone-300">
                <th className="pb-2">نفت خام</th>
                <th className="pb-2">شرکت ملی نفت</th>
                <th className="pb-2">مرجع قیمت‌گذاری آسیا</th>
                <th className="pb-2">تفاضل آسیا ($/bbl)</th>
                <th className="pb-2">تغییر ماهانه</th>
                <th className="pb-2">تفاضل اروپا</th>
                <th className="pb-2">وضعیت حاکمیت داده</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 font-mono-num">
              {osps.map((o) => (
                <tr key={o.gradeFa} className="hover:bg-stone-200/40">
                  <td className="py-2.5 font-sans font-bold text-stone-900">{o.gradeFa}</td>
                  <td className="py-2.5 font-sans text-stone-700">{o.producerFa}</td>
                  <td className="py-2.5 font-sans text-stone-600">{o.benchmark}</td>
                  <td className="py-2.5 font-bold text-stone-900">{formatSignedPersian(o.asiaDiffUsd, 2)}</td>
                  <td className="py-2.5 text-[#2D8A4E] font-bold">{formatSignedPersian(o.momChangeUsd, 2)}</td>
                  <td className="py-2.5 text-stone-700">{formatSignedPersian(o.europeDiffUsd, 2)}</td>
                  <td className="py-2.5 font-sans">
                    {o.verificationStatus === 'verified' ? (
                      <span className="text-[#2D8A4E] font-bold">✓ تأییدشده · {o.noteFa}</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-[#D96B27] font-semibold">{o.noteFa}</span>
                        <button
                          type="button"
                          onClick={() => handleApproveOsp(o.gradeFa)}
                          className="px-2.5 py-1 rounded-md bg-[#B83E16] text-white text-[11px] font-bold hover:bg-[#9E3310] transition-colors"
                        >
                          تأیید انسانی
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/**
 * 5. DEDICATED OSP, FUTURES TERM STRUCTURE & REFINERY CRACK SPREAD PAGE (`osp_crack_margins`)
 * Skills: `osp-tracker`, `crack-spread-margins`, `futures-curve-regime`
 */
export const OspCrackMarginsDeepPage: React.FC = () => {
  const [crudeInput, setCrudeInput] = useState<number>(79.82);
  const [rbobInput, setRbobInput] = useState<number>(99.4);
  const [ulsdInput, setUlsdInput] = useState<number>(106.2);
  const [osps, setOsps] = useState<OspRow[]>(OSP_TABLE);

  const crack321 = computeCrackSpread321(crudeInput, rbobInput, ulsdInput);
  const gasolineCrack = +(rbobInput - crudeInput).toFixed(2);
  const distillateCrack = +(ulsdInput - crudeInput).toFixed(2);

  return (
    <div className="space-y-4" dir="rtl">
      <div className="bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-stone-500">
            Skills: futures-curve-regime · crack-spread-margins · osp-tracker
          </div>
          <h2 className="text-xl font-extrabold text-[#1E1D1B] mt-1">
            ساختار زمانی منحنی آتی، حاشیه پالایش (Crack Spread) و قیمت‌های رسمی خلیج فارس (OSP)
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            تحلیل شیب بکواردیشن منحنی آتی (M1–M12)، ماشین‌حساب زنده کرک اسپرد ۳:۲:۱ و پایش تفاضل قیمت‌های رسمی فروش به آسیا و اروپا
          </p>
        </div>
        <div className="bg-[#2D8A4E]/15 text-[#2D8A4E] px-4 py-2 rounded-xl text-left">
          <div className="text-[11px] font-semibold">رژیم منحنی آتی (برنت و WTI)</div>
          <div className="font-mono-num text-base font-extrabold">Backwardation (+۴٫۱۵$ M1-M12)</div>
        </div>
      </div>

      {/* Row 1: Recharts Futures Term Structure Curve + Interactive 3:2:1 Crack Spread Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs">
          <div className="mb-3">
            <h3 className="text-sm font-extrabold text-[#1E1D1B]">
              منحنی ساختار زمانی بازار آتی (Futures Term Structure · تحویل ماه اول تا دوازدهم)
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              شیب نزولی منحنی (بکواردیشن) نشان‌دهنده کمیابی فیزیکی کوتاه‌مدت و بازده مثبت غلتاندن قراردادها (Roll Yield) است
            </p>
          </div>

          <div className="h-60 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={FUTURES_TERM_STRUCTURE} margin={{ top: 10, right: 20, left: 6, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D6D3CD" />
                <XAxis dataKey="tenor" tick={{ fill: '#57534E', fontSize: 11 }} stroke="#A8A29E" />
                <YAxis domain={[74, 84]} tick={{ fill: '#57534E', fontSize: 11 }} stroke="#A8A29E" unit="$" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#22211F',
                    borderColor: '#44403C',
                    borderRadius: '10px',
                    color: '#FAF9F5',
                    fontSize: '12px',
                    direction: 'rtl',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="brentUsd"
                  name="برنت (ICE Brent $/bbl)"
                  stroke="#B83E16"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#B83E16' }}
                />
                <Line
                  type="monotone"
                  dataKey="dubaiUsd"
                  name="دوبی (Platts Dubai $/bbl)"
                  stroke="#D96B27"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#D96B27' }}
                />
                <Line
                  type="monotone"
                  dataKey="wtiUsd"
                  name="WTI (NYMEX $/bbl)"
                  stroke="#2D8A4E"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#2D8A4E' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interactive Crack Spread 3:2:1 Calculator */}
        <div className="lg:col-span-5 bg-[#22211F] text-white rounded-xl p-5 border border-stone-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#E68A56] flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4" />
              <span>ماشین‌حساب زنده حاشیه پالایش (3:2:1 Crack Spread)</span>
            </h3>
            <p className="text-[11px] text-stone-400 mb-4">
              فرمول استاندارد: (۲ × بنزین + ۱ × گازوئیل − ۳ × نفت خام) تقسیم بر ۳
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-stone-300">قیمت نفت خام خوراک ($/bbl):</span>
                  <span className="font-mono-num font-bold text-white">${crudeInput}</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="110"
                  step="0.5"
                  value={crudeInput}
                  onChange={(e) => setCrudeInput(Number(e.target.value))}
                  className="w-full accent-[#E68A56]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-stone-300">معادل بشکه بنزین RBOB ($/bbl):</span>
                  <span className="font-mono-num font-bold text-[#2ECC71]">${rbobInput}</span>
                </div>
                <input
                  type="range"
                  min="75"
                  max="135"
                  step="0.5"
                  value={rbobInput}
                  onChange={(e) => setRbobInput(Number(e.target.value))}
                  className="w-full accent-[#E68A56]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-stone-300">معادل بشکه گازوئیل ULSD ($/bbl):</span>
                  <span className="font-mono-num font-bold text-[#F2DA63]">${ulsdInput}</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="145"
                  step="0.5"
                  value={ulsdInput}
                  onChange={(e) => setUlsdInput(Number(e.target.value))}
                  className="w-full accent-[#E68A56]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 mt-4 border-t border-stone-800 text-center">
            <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-700">
              <div className="text-[11px] text-stone-400">کرک ۳:۲:۱ کل</div>
              <div className="font-mono-num text-lg font-extrabold text-[#E68A56] mt-0.5">
                ${crack321}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-700">
              <div className="text-[11px] text-stone-400">کرک بنزین</div>
              <div className="font-mono-num text-lg font-extrabold text-[#2ECC71] mt-0.5">
                ${gasolineCrack}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-700">
              <div className="text-[11px] text-stone-400">کرک گازوئیل</div>
              <div className="font-mono-num text-lg font-extrabold text-[#F2DA63] mt-0.5">
                ${distillateCrack}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OSP Table */}
      <div className="bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs">
        <h3 className="text-sm font-bold text-[#1E1D1B] mb-2">
          جدول تفاضل قیمت‌های رسمی فروش خلیج فارس (OSP) و ثبت شکست سری ادنوک (نوامبر ۲۰۲۶)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="text-stone-500 border-b border-stone-300">
                <th className="pb-2">نفت خام</th>
                <th className="pb-2">شرکت ملی نفت</th>
                <th className="pb-2">مرجع قیمت‌گذاری آسیا</th>
                <th className="pb-2">تفاضل آسیا ($/bbl)</th>
                <th className="pb-2">تغییر ماهانه</th>
                <th className="pb-2">تفاضل اروپا</th>
                <th className="pb-2">وضعیت تأیید</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 font-mono-num">
              {osps.map((o) => (
                <tr key={o.gradeFa} className="hover:bg-stone-200/40">
                  <td className="py-2.5 font-sans font-bold text-stone-900">{o.gradeFa}</td>
                  <td className="py-2.5 font-sans text-stone-700">{o.producerFa}</td>
                  <td className="py-2.5 font-sans text-stone-600">{o.benchmark}</td>
                  <td className="py-2.5 font-bold text-stone-900">{formatSignedPersian(o.asiaDiffUsd, 2)}</td>
                  <td className="py-2.5 text-[#2D8A4E] font-bold">{formatSignedPersian(o.momChangeUsd, 2)}</td>
                  <td className="py-2.5 text-stone-700">{formatSignedPersian(o.europeDiffUsd, 2)}</td>
                  <td className="py-2.5 font-sans">
                    {o.verificationStatus === 'verified' ? (
                      <span className="text-[#2D8A4E] font-bold">✓ تأییدشده · {o.noteFa}</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setOsps((prev) =>
                            prev.map((x) =>
                              x.gradeFa === o.gradeFa
                                ? { ...x, verificationStatus: 'verified', noteFa: 'تأیید انسانی انجام شد' }
                                : x
                            )
                          )
                        }
                        className="px-2.5 py-1 rounded-md bg-[#B83E16] text-white text-[11px] font-bold"
                      >
                        تأیید انسانی ({o.noteFa})
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/**
 * 6. DEDICATED CFTC/ICE COT POSITIONING & MACRO SENTIMENT PAGE (`cot_macro_sentiment`)
 * Skills: `cot-positioning` + Financial & Macro Drivers
 */
export const CotMacroSentimentDeepPage: React.FC = () => {
  return (
    <div className="space-y-4" dir="rtl">
      <div className="bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-stone-500">
            Skill: cot-positioning · منابع: CFTC Disaggregated (WTI 067651) · ICE Futures Europe COT · FRED Macro
          </div>
          <h2 className="text-xl font-extrabold text-[#1E1D1B] mt-1">
            موقعیت معامله‌گران (Managed Money COT)، احساسات بازار و متغیرهای کلان
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            پایش خالص موقعیت خرید صندوق‌ها (Net Long)، شاخص ازدحام ۵۲ هفته‌ای (Z-Score) و متغیرهای کلان (شاخص دلار DXY، نوسان ضمنی OVX و RatingDog PMI چین)
          </p>
        </div>
        <div className="bg-[#D96B27]/15 text-[#B83E16] px-4 py-2 rounded-xl text-left">
          <div className="text-[11px] font-semibold">امتیاز Z موقعیت خرید ۵۲ هفته‌ای</div>
          <div className="font-mono-num text-base font-extrabold">+۱٫۹σ (نزدیک به مرز اشباع خرید)</div>
        </div>
      </div>

      {/* Dynamic Recharts 12-Week COT Positioning Chart */}
      <div className="bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs">
        <div className="mb-3">
          <h3 className="text-sm font-extrabold text-[#1E1D1B]">
            روند ۱۲ هفته اخیر خالص موقعیت خرید مدیران سرمایه (Managed Money Net Long · هزار قرارداد)
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            افزایش هم‌زمان خالص خرید در برنت (ICE) و WTI (NYMEX) در ۵ هفته اخیر هم‌راستا با رشد ریسک ژئوپلیتیک
          </p>
        </div>

        <div className="h-60 w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={COT_12W_POSITIONING} margin={{ top: 10, right: 20, left: 6, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D6D3CD" />
              <XAxis dataKey="weekLabel" tick={{ fill: '#57534E', fontSize: 11 }} stroke="#A8A29E" />
              <YAxis tick={{ fill: '#57534E', fontSize: 11 }} stroke="#A8A29E" unit="k" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#22211F',
                  borderColor: '#44403C',
                  borderRadius: '10px',
                  color: '#FAF9F5',
                  fontSize: '12px',
                  direction: 'rtl',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line
                type="monotone"
                dataKey="wtiNetLongK"
                name="خالص خرید WTI (CFTC · هزار قرارداد)"
                stroke="#B83E16"
                strokeWidth={3}
                dot={{ r: 4, fill: '#B83E16' }}
              />
              <Line
                type="monotone"
                dataKey="brentNetLongK"
                name="خالص خرید برنت (ICE · هزار قرارداد)"
                stroke="#2D8A4E"
                strokeWidth={3}
                dot={{ r: 4, fill: '#2D8A4E' }}
              />
              <Line
                type="monotone"
                dataKey="gasoilNetLongK"
                name="خالص خرید گازوئیل (ICE · هزار قرارداد)"
                stroke="#D96B27"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: '#D96B27' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Macro & Financial Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'شاخص دلار آمریکا (DXY / FRED)',
            val: '۱۰۲٫۴',
            change: '-۰٫۸٪ هفتگی',
            note: 'تضعیف ملایم دلار، عامل حمایتی برای تقاضای واردکنندگان نوظهور',
          },
          {
            title: 'شاخص نوسان ضمنی نفت (Cboe OVX)',
            val: '۳۸٫۶٪',
            change: '+۴٫۲ واحد',
            note: 'افزایش تقاضای اختیار خرید (Call Skew) در پی تنش‌های تنگه هرمز',
          },
          {
            title: 'PMI تولیدی چین (RatingDog)',
            val: '۵۰٫۸',
            change: '+۰٫۴ واحد',
            note: 'جایگزین رسمی شاخص Caixin از اوت ۲۰۲۵؛ بازگشت به محدوده انبساطی',
          },
          {
            title: 'سربه‌سر شیل آمریکا (Dallas Fed Survey)',
            val: '$۶۴٫۰ / bbl',
            change: 'چاه‌های جدید پرمین',
            note: 'در قیمت فعلی ۷۹٫۸۲ دلار، حفاری شیل دارای حاشیه سود مثبت ۱۵ دلاری است',
          },
        ].map((m) => (
          <div key={m.title} className="bg-[#FAF9F5] rounded-xl p-4 border border-stone-300/80 shadow-xs">
            <div className="text-xs font-bold text-stone-600">{m.title}</div>
            <div className="font-mono-num text-2xl font-extrabold text-[#1E1D1B] mt-1">{m.val}</div>
            <div className="text-xs font-semibold text-[#B83E16] mt-0.5">{m.change}</div>
            <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">{m.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 7. GEOPOLITICS, CHOKEPOINTS & SHADOW FLEET PAGE (`chokepoint-risk`, `geo-risk-scorer`)
 */
export const GeopoliticsChokepointsDeepPage: React.FC = () => {
  return (
    <div className="space-y-4" dir="rtl">
      <div className="bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-stone-500">
            Skills: chokepoint-risk · geo-risk-scorer · منابع: IMF PortWatch · JMIC/UKMTO · OpenSanctions · GPR Index
          </div>
          <h2 className="text-xl font-extrabold text-[#1E1D1B] mt-1">
            پایش گلوگاه‌های دریایی، ریسک ژئوپلیتیک و ناوگان سایه
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            ترانزیت روزانه نفتکش‌ها، نرخ بیمه جنگ (War Risk Premium)، کرایه حمل VLCC و انطباق با تحریم‌های OFAC / EU Annex XLII / UK Sanctions List
          </p>
        </div>
        <div className="bg-[#B83E16]/10 text-[#B83E16] px-4 py-2 rounded-xl text-left">
          <div className="text-[11px] font-semibold">شاخص کل ریسک ژئوپلیتیک (GPR)</div>
          <div className="font-mono-num text-lg font-extrabold">۶۷ / ۱۰۰ (سطح بالا)</div>
        </div>
      </div>

      {/* Chokepoints Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {CHOKEPOINTS_DATA.map((cp) => (
          <div
            key={cp.id}
            className="bg-[#FAF9F5] rounded-xl p-5 border border-stone-300/80 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-sm font-extrabold text-[#1E1D1B] flex items-center gap-1.5">
                  <Ship className="w-4 h-4 text-[#B83E16]" />
                  <span>{cp.nameFa}</span>
                </h3>
                <span
                  className={`font-mono-num text-xs font-bold ${
                    cp.score >= 80 ? 'text-[#B83E16]' : cp.score >= 55 ? 'text-[#D96B27]' : 'text-[#2D8A4E]'
                  }`}
                >
                  ریسک {toPersianDigits(cp.score)}/۱۰۰ · {cp.jmicThreatLevel}
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed mb-3">{cp.summaryFa}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone-200 text-xs">
              <div>
                <span className="text-stone-500 block text-[11px]">جریان فعلی / عادی</span>
                <span className="font-mono-num font-bold text-stone-900">
                  {toPersianDigits(cp.dailyOilFlowMbd)} / {toPersianDigits(cp.normalFlowMbd)} mb/d
                </span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">ترانزیت روزانه نفتکش</span>
                <span className="font-mono-num font-bold text-stone-900">
                  {toPersianDigits(cp.tankerTransitsDaily)} فروند
                </span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">بیمه ریسک جنگ</span>
                <span className="font-mono-num font-semibold text-[#B83E16]">{cp.warRiskPremiumPct}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">کرایه VLCC (Worldscale)</span>
                <span className="font-mono-num font-bold text-stone-900">WS {toPersianDigits(cp.vlccFreightWs)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sanctions & Shadow Fleet Governance Note */}
      <div className="bg-[#22211F] text-white rounded-xl p-5 border border-stone-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-3.5 rounded-lg bg-stone-800/80">
          <div className="font-bold text-[#E68A56] mb-1">سقف قیمت ائتلاف G7+ و ناوگان سایه</div>
          <p className="text-stone-300 leading-relaxed">
            سقف قیمت نفت خام روسیه از فوریه ۲۰۲۶ به ۴۴٫۱۰ دلار تعدیل شده و فهرست Annex XLII اتحادیه اروپا ۶۷۱ نفتکش را مشمول ممنوعیت خدمات بندری کرده است.
          </p>
        </div>
        <div className="p-3.5 rounded-lg bg-stone-800/80">
          <div className="font-bold text-[#E68A56] mb-1">جایگزینی فهرست تحریم انگلیس (۲۰۲۶)</div>
          <p className="text-stone-300 leading-relaxed">
            فهرست تجمیعی OFSI انگلیس در ۲۸ ژانویه ۲۰۲۶ بسته شد؛ اتصال‌دهنده OpenSanctions (yente) اکنون مستقیماً UK Sanctions List جدید را پایش می‌کند.
          </p>
        </div>
        <div className="p-3.5 rounded-lg bg-stone-800/80">
          <div className="font-bold text-[#E68A56] mb-1">کنترل منابع هم‌مالک و جانبدار</div>
          <p className="text-stone-300 leading-relaxed">
            گزارش‌های KSE، CREA و UANI سطح اعتبار ۳ دارند و فقط پس از تطبیق با داده راداری Sentinel-1 و فهرست‌های رسمی OFAC/EU وارد گراف رویداد می‌شوند.
          </p>
        </div>
      </div>
    </div>
  );
};
