import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { DeepPageId } from './CockpitViews';
import { FAN_CHART_TABLE } from '../data/platformData';
import { toPersianDigits } from '../utils/oilAnalytics';

interface SituationRoomRightPanelProps {
  onNavigateModule: (page: DeepPageId) => void;
  onOpenQuestionModal: (questionId: string) => void;
  onInspectLineage?: (seriesKey?: string) => void;
}

export const SituationRoomRightPanel: React.FC<SituationRoomRightPanelProps> = ({
  onNavigateModule,
  onOpenQuestionModal,
  onInspectLineage,
}) => {
  const [quoteMode, setQuoteMode] = useState<'reference' | 'live'>('reference');
  const [selectedHorizon, setSelectedHorizon] = useState<'1m' | '3m' | '6m' | '12m'>('1m');

  const activeFan =
    FAN_CHART_TABLE.find((f) => f.horizonKey === selectedHorizon) || FAN_CHART_TABLE[0];

  return (
    <aside
      aria-label="پنل اجرایی اتاق وضعیت نفت"
      className="w-full lg:w-[360px] xl:w-[395px] shrink-0 h-full bg-[#FAF9F5] border-r border-stone-300/80 flex flex-col justify-between overflow-y-auto select-none"
    >
      {/* 1. Top Header Strip: اتاق وضعیت نفت */}
      <div className="bg-[#F6F5F0] px-6 py-3.5 border-b border-stone-200/90 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={() => setQuoteMode((m) => (m === 'reference' ? 'live' : 'reference'))}
          className="text-[11px] font-semibold text-stone-500 hover:text-stone-900 bg-stone-200/70 hover:bg-stone-200 px-2.5 py-1 rounded-md transition-colors"
          title="تغییر نمایش ارقام بین حالت تصویر مرجع و داده زنده EIA"
        >
          {quoteMode === 'reference' ? 'نمای ارقام مرجع' : 'نمای ارقام زنده EIA'}
        </button>
        <h2 className="text-[25px] font-black text-[#1E1D1B] tracking-tight">
          اتاق وضعیت نفت
        </h2>
      </div>

      {/* 2. Burnt-Orange / Terracotta Executive Section */}
      <div className="bg-gradient-to-b from-[#B63C14] via-[#C1481D] to-[#CC572B] text-white px-5 py-4 shrink-0">
        {/* Section Title: خلاصه مدیریتی */}
        <div className="text-right mb-3">
          <h3 className="text-[19px] font-bold tracking-tight text-white">
            خلاصه مدیریتی
          </h3>
        </div>

        {/* 3-Column Benchmark Strip (Left: برنت, Middle: WTI, Right: دوبی — matches screenshot) */}
        <div
          dir="ltr"
          className="grid grid-cols-3 divide-x divide-white/25 text-center pb-4 border-b border-white/25"
        >
          {/* Left Column: برنت */}
          <div
            onClick={() => onNavigateModule('eia_stocks')}
            className="px-2 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="text-[16px] font-bold text-white/95 mb-1">برنت</div>
            <div className="font-mono-num text-[24px] font-bold text-white leading-tight">
              {quoteMode === 'reference' ? '415.M' : '$82.75'}
            </div>
            <div className="mt-1 flex items-center justify-center gap-1.5 font-mono-num text-[13px] text-white/90">
              <span>{quoteMode === 'reference' ? '-8.7%' : '+1.25%'}</span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#FF6B5B]" />
            </div>
          </div>

          {/* Middle Column: WTI */}
          <div
            onClick={() => onNavigateModule('balance_opec')}
            className="px-2 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="text-[16px] font-bold text-white/95 mb-1">WTI</div>
            <div className="font-mono-num text-[24px] font-bold text-white leading-tight">
              {quoteMode === 'reference' ? '$22.7' : '$79.82'}
            </div>
            <div className="mt-1 flex items-center justify-center gap-1.5 font-mono-num text-[13px] text-white/90">
              <span>{quoteMode === 'reference' ? '-3.7%' : '+1.18%'}</span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
            </div>
          </div>

          {/* Right Column: دوبی */}
          <div
            onClick={() => onNavigateModule('balance_opec')}
            className="px-2 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="text-[16px] font-bold text-white/95 mb-1">دوبی</div>
            <div className="font-mono-num text-[24px] font-bold text-white leading-tight">
              {quoteMode === 'reference' ? '$23.m' : '$80.12'}
            </div>
            <div className="mt-1 flex items-center justify-center gap-1.5 font-mono-num text-[13px] text-white/90">
              <span>{quoteMode === 'reference' ? '-8.7%' : '+1.10%'}</span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#2ECC71]" />
            </div>
          </div>
        </div>

        {/* Section Title: سه پاسخ در ۵ ثانیه */}
        <div className="text-right mt-3.5 mb-2.5">
          <h3 className="text-[18px] font-bold text-white">سه پاسخ در ۵ ثانیه</h3>
        </div>

        {/* 3 Translucent Executive Answer Cards */}
        <div className="space-y-2.5" dir="rtl">
          {/* Card 1: ۱. الان بازار کجاست؟ */}
          <div
            onClick={() => onOpenQuestionModal('where')}
            className="rounded-xl bg-white/14 hover:bg-white/22 border border-white/15 px-4 py-3 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[16px] font-extrabold text-[#1E1D1B]">
                ۱. الان بازار کجاست؟
              </span>
              <AlertCircle className="w-4 h-4 text-white/85 shrink-0" />
            </div>
            <p className="text-[13px] font-medium text-[#1E1D1B]/95 leading-snug">
              موجودی بنزین آمریکا ۱ میلیون بشکه افزایش یافت؛ فشار نزولی
            </p>
          </div>

          {/* Card 2: ۲. چرا حرکت کرد؟ */}
          <div
            onClick={() => onOpenQuestionModal('why')}
            className="rounded-xl bg-white/14 hover:bg-white/22 border border-white/15 px-4 py-3 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[16px] font-extrabold text-[#1E1D1B]">
                ۲. چرا حرکت کرد؟
              </span>
              <AlertCircle className="w-4 h-4 text-white/85 shrink-0" />
            </div>
            <p className="text-[13px] font-medium text-[#1E1D1B]/95 leading-snug">
              سهم اصلی از تقاضای اختصاصی +۱۷ واحد؛ ریسک احتیاطی
            </p>
          </div>

          {/* Card 3: ۳. به کجا می‌رود؟ */}
          <div
            onClick={() => onOpenQuestionModal('where_to')}
            className="rounded-xl bg-white/14 hover:bg-white/22 border border-white/15 px-4 py-3 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[16px] font-extrabold text-[#1E1D1B]">
                ۳. به کجا می‌رود؟
              </span>
              <span
                dir="ltr"
                className="px-2.5 py-0.5 rounded-full bg-[#2D8A4E] text-white font-mono-num text-[11px] font-bold tracking-wide"
              >
                WARN
              </span>
            </div>
            <p className="text-[13px] font-medium text-[#1E1D1B]/95 leading-snug">
              پیش‌بینی ۳ ماهه ۷۸.۲ دلار؛ مدل تاییدشده
            </p>
          </div>

          {/* Card 4: ۴. برای ما چه معنایی دارد؟ (اثر بر سازمان و خالص صادرات) */}
          <div
            onClick={() => onNavigateModule('org_impact')}
            className="rounded-xl bg-[#1E1D1B]/25 hover:bg-[#1E1D1B]/35 border border-white/25 px-4 py-2.5 cursor-pointer transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-[14px] font-extrabold text-[#F2DA63] block">
                ۴. برای ما چه معنایی دارد؟ (اثر بر سازمان)
              </span>
              <span className="text-[12px] text-white/95">
                خالص دریافتی FOB: ۷۵٫۰$ · مازاد بودجه و پوشش ریسک ←
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#F2DA63] text-[#1E1D1B] text-[10px] font-extrabold shrink-0">
              محاسبه‌گر
            </span>
          </div>
        </div>
      </div>

      {/* 3. Bottom White Section: پیش‌بینی و بازه احتمال (Empirical Fan Chart) */}
      <div className="bg-[#FAF9F5] px-5 py-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2" dir="rtl">
            <h3 className="text-[19px] font-extrabold text-[#1E1D1B]">
              پیش‌بینی و بازه احتمال
            </h3>
            <div className="flex items-center gap-1">
              {(['1m', '3m', '6m', '12m'] as const).map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setSelectedHorizon(h)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-mono-num font-bold transition-colors ${
                    selectedHorizon === h
                      ? 'bg-[#1E1D1B] text-white'
                      : 'text-stone-500 hover:bg-stone-200'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* Split Metrics + Fan Chart SVG matching screenshot */}
          <div dir="ltr" className="grid grid-cols-12 gap-2 items-center pt-1">
            {/* Left Numbers Column */}
            <div className="col-span-5 text-left pl-1">
              <div className="text-[13px] font-semibold text-stone-700 mb-1" dir="rtl">
                میانه ۱ ماهه
              </div>
              <div className="font-mono-num text-[31px] font-bold text-[#1E1D1B] leading-tight tracking-tight">
                {selectedHorizon === '1m' ? 'V4.6' : `$${activeFan.q50}`}
              </div>
              <div className="font-mono-num text-[31px] font-bold text-[#1E1D1B] leading-tight tracking-tight mt-1">
                {selectedHorizon === '1m' ? 'V8.2' : `$${activeFan.q84}`}
              </div>
            </div>

            {/* Right Empirical Fan Chart SVG */}
            <div
              onClick={() => onNavigateModule('forecast_scenario')}
              className="col-span-7 cursor-pointer"
              title="کلیک برای باز کردن جدول کامل آزمون Diebold-Mariano و نمودار بادبزنی"
            >
              <svg viewBox="0 0 210 115" className="w-full h-28 overflow-visible">
                {/* Horizontal Reference Lines & Left Persian Labels */}
                <line x1="34" y1="22" x2="204" y2="22" stroke="#E5E4DF" strokeWidth="1" />
                <text x="28" y="25" textAnchor="end" fill="#57534E" className="font-mono-num text-[11px]">
                  {toPersianDigits(activeFan.q50)}
                </text>

                <line x1="34" y1="62" x2="204" y2="62" stroke="#E5E4DF" strokeWidth="1" />
                <text x="28" y="65" textAnchor="end" fill="#57534E" className="font-mono-num text-[11px]">
                  ۷۸.۲
                </text>

                <line x1="34" y1="98" x2="204" y2="98" stroke="#D6D3CD" strokeWidth="1" />
                <text x="28" y="101" textAnchor="end" fill="#57534E" className="font-mono-num text-[11px]">
                  ۷۸.۰
                </text>

                {/* 90% Confidence Fan Cone (Light Gray) */}
                <path
                  d="M 36 76 Q 95 45 150 26 L 204 12 L 204 94 L 150 86 Q 95 82 36 76 Z"
                  fill="#D6D4CE"
                  opacity="0.7"
                />

                {/* 68% Confidence Fan Cone (Medium Warm Gray) */}
                <path
                  d="M 36 76 Q 95 56 150 42 L 204 32 L 204 78 L 150 74 Q 95 74 36 76 Z"
                  fill="#B8B5AD"
                  opacity="0.75"
                />

                {/* Median Forecast Trajectory Line (Solid Charcoal) */}
                <path
                  d="M 36 76 Q 95 64 150 58 L 204 55"
                  fill="none"
                  stroke="#1E1D1B"
                  strokeWidth="2.2"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar: OK · forecast-benchmark · WARN + Lineage Inspector */}
        <div
          dir="ltr"
          className="pt-3 mt-2 border-t border-stone-200/90 flex items-center justify-between"
        >
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onNavigateModule('forecast_scenario')}
              className="px-3 py-0.5 rounded-full bg-[#2D8A4E] text-white font-mono-num text-[12px] font-bold hover:opacity-90 transition-opacity"
            >
              OK
            </button>
            {onInspectLineage && (
              <button
                type="button"
                onClick={() => onInspectLineage('eia.wpsr.crude_stocks')}
                className="px-2 py-0.5 rounded-full bg-[#22211F] text-[#F2DA63] font-mono-num text-[11px] font-bold hover:opacity-90 transition-opacity"
                title="بازرس ردیابی عدد تا منبع خام و تاریخچه بازنگری‌ها"
              >
                Lineage
              </button>
            )}
            <button
              type="button"
              onClick={() => onNavigateModule('live_wave1_debate')}
              className="px-2.5 py-0.5 rounded-full bg-[#B83E16] text-white font-mono-num text-[11px] font-bold hover:opacity-90 transition-opacity"
              title="اتصال زنده موج ۱ (FRED/CFTC/EIA)، جستجوی وب و اتاق مناظره سناریو (gpt-6-luna)"
            >
              Live AI & Wave-1
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono-num text-[13px] font-medium text-[#1E1D1B]">
              forecast-benchmark
            </span>
            <button
              type="button"
              onClick={() => onNavigateModule('forecast_scenario')}
              className="px-3 py-0.5 rounded-full bg-[#D96B27] text-white font-mono-num text-[12px] font-bold hover:opacity-90 transition-opacity"
            >
              WARN
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
