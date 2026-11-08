import React, { useState } from 'react';
import {
  Plus,
  Minus,
  Globe,
  Search,
  Sparkles,
  Equal,
  MapPin,
  Layers,
  Gauge,
  Compass,
  EyeOff,
  Maximize2,
  Eye,
} from 'lucide-react';
import { DeepPageId } from './CockpitViews';

export interface RegionalCallout {
  id: string;
  nameEn: string;
  nameFa: string;
  changeText: string;
  xPct: number;
  yPct: number;
  dotX: number;
  dotY: number;
  importFlowMbd: string;
  headlineFa: string;
  detailFa: string;
}

export const REGIONAL_CALLOUTS: RegionalCallout[] = [
  {
    id: 'vietnam',
    nameEn: 'Vietnam',
    nameFa: 'ویتنام و جنوب شرق آسیا',
    changeText: '-8.7%',
    xPct: 91.5,
    yPct: 46.5,
    dotX: 985,
    dotY: 332,
    importFlowMbd: '۰٫۵۲ mb/d',
    headlineFa: 'کاهش ۸٫۷٪ واردات ماهانه نفت خام و فرآورده در پی تعمیرات پالایشگاه Nghi Son',
    detailFa: 'حساسیت بالا به تفاضل OSP خلیج فارس و نرخ حمل مسیر مالاکا؛ جایگزینی بخشی از خوراک با نفت سبک غرب آفریقا.',
  },
  {
    id: 'turkey',
    nameEn: 'Turkey',
    nameFa: 'ترکیه و کریدور مدیترانه (جیهان)',
    changeText: '-5.2%',
    xPct: 72.5,
    yPct: 60.0,
    dotX: 734,
    dotY: 288,
    importFlowMbd: '۱٫۰۸ mb/d',
    headlineFa: 'افت ۵٫۲٪ ترانزیت پایانه جیهان و تعدیل واردات دریابرد از دریای سیاه',
    detailFa: 'پایش مستمر خط لوله کرکوک-جیهان و پایانه BTC؛ اثر مستقیم سقف قیمت ۴۴٫۱۰ دلار ائتلاف G7+ بر پالایشگاه‌های مدیترانه.',
  },
  {
    id: 'india',
    nameEn: 'India',
    nameFa: 'هند (آمار رسمی PPAC)',
    changeText: '-3.9%',
    xPct: 83.5,
    yPct: 68.5,
    dotX: 892,
    dotY: 348,
    importFlowMbd: '۴٫۶۵ mb/d',
    headlineFa: 'کاهش ۳٫۹٪ واردات ماهانه نفت خام هند هم‌زمان با فصل تعمیرات پالایشی',
    detailFa: 'تغییر ترکیب سبد وارداتی پالایشگاه‌های دولتی و خصوصی هند به سمت نفت خام خلیج فارس پس از تشدید تحریم‌های ناوگان سایه (بسته ۶۷۱ کشتی).',
  },
];

interface SituationRoomMapProps {
  onNavigateModule: (page: DeepPageId) => void;
  onSelectRegion?: (region: RegionalCallout) => void;
  selectedRegionId: string | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  showOverlays: boolean;
  onToggleOverlays: () => void;
  activeMapLayer: 'trade_shocks' | 'chokepoints' | 'stocks';
  onChangeMapLayer: (layer: 'trade_shocks' | 'chokepoints' | 'stocks') => void;
}

export const SituationRoomMap: React.FC<SituationRoomMapProps> = ({
  onNavigateModule,
  onSelectRegion,
  selectedRegionId,
  searchQuery,
  onSearchChange,
  showOverlays,
  onToggleOverlays,
  activeMapLayer,
  onChangeMapLayer,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [showArcs, setShowArcs] = useState<boolean>(true);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);

  const selectedRegion = REGIONAL_CALLOUTS.find((r) => r.id === selectedRegionId) || null;

  return (
    <div className="relative w-full h-full bg-[#E3E1DC] overflow-hidden select-none">
      {/* Subtle Cartographic Vignette & Paper Grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 52% 44%, rgba(244,242,238,0.55) 0%, rgba(221,218,211,0.85) 75%, rgba(206,203,195,0.95) 100%)',
        }}
      />

      {/* Full-Bleed High-Detail World Map SVG */}
      <div
        className="w-full h-full transition-transform duration-200 ease-out"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: '58% 48%',
        }}
      >
        <svg
          viewBox="0 0 1100 680"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
        >
          <defs>
            {/* Stipple / Dot Pattern for Highlighted Terracotta Regions (matches screenshot texture) */}
            <pattern id="terracottaDots" width="5" height="5" patternUnits="userSpaceOnUse">
              <rect width="5" height="5" fill="#DF7B47" fillOpacity="0.82" />
              <circle cx="1.5" cy="1.5" r="0.9" fill="#B84118" fillOpacity="0.45" />
              <circle cx="4" cy="4" r="0.7" fill="#F6B48E" fillOpacity="0.45" />
            </pattern>
            <linearGradient id="terracottaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E68A56" stopOpacity="0.92" />
              <stop offset="55%" stopColor="#DC6E3A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#C44D1E" stopOpacity="0.94" />
            </linearGradient>
            <filter id="landShadow" x="-2%" y="-2%" width="104%" height="104%">
              <feDropShadow dx="0" dy="0.6" stdDeviation="0.6" floodColor="#9A968E" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* Subtle Graticule / Latitude Lines */}
          <g stroke="#D4D1C9" strokeWidth="0.6" opacity="0.65">
            <line x1="0" y1="140" x2="1100" y2="140" />
            <line x1="0" y1="260" x2="1100" y2="260" />
            <line x1="0" y1="380" x2="1100" y2="380" />
            <line x1="0" y1="500" x2="1100" y2="500" />
            <line x1="220" y1="0" x2="220" y2="680" />
            <line x1="460" y1="0" x2="460" y2="680" />
            <line x1="700" y1="0" x2="700" y2="680" />
            <line x1="920" y1="0" x2="920" y2="680" />
          </g>

          {/* World Continents Base Layer shifted to match exact screenshot framing */}
          <g transform="translate(125, 16)">
            <g fill="#CECCC6" stroke="#B6B3AC" strokeWidth="0.75" filter="url(#landShadow)">
              {/* Greenland (prominent in top center-left of screenshot) */}
              <path d="M235 8 L295 2 L358 10 L386 42 L370 92 L342 138 L308 168 L276 152 L258 110 L228 64 Z" />
              <path d="M376 114 L402 118 L398 132 L374 128 Z" />

              {/* Canadian Arctic Archipelago & North America */}
              <path d="M110 22 L175 16 L222 42 L236 76 L204 98 L156 90 L118 60 Z" />
              <path d="M-85 72 L12 60 L95 82 L168 114 L218 146 L236 178 L196 212 L162 238 L140 278 L108 298 L82 324 L56 316 L28 282 L0 242 L-30 194 L-64 140 Z" />
              {/* Central America & Caribbean */}
              <path d="M56 316 L88 332 L112 358 L132 374 L110 380 L78 354 L52 330 Z" />
              <path d="M122 318 L158 322 L172 334 L138 334 Z" />

              {/* South America */}
              <path d="M128 374 L182 372 L228 402 L272 444 L262 502 L228 566 L192 628 L164 656 L144 618 L134 542 L118 474 L108 418 Z" />

              {/* Europe & Scandinavia & UK */}
              <path d="M426 168 L446 160 L454 186 L432 194 Z" />
              <path d="M468 78 L522 58 L558 72 L548 120 L524 148 L498 150 L476 126 Z" />
              <path d="M436 196 L490 172 L546 162 L596 170 L614 208 L582 244 L544 252 L514 242 L490 254 L456 248 L430 226 Z" />

              {/* Russia / Northern Eurasia */}
              <path d="M558 72 L668 52 L796 54 L924 68 L998 92 L1026 128 L978 172 L918 192 L868 218 L782 226 L696 222 L632 218 L596 170 L546 162 Z" />

              {/* Central Asia & Kazakhstan */}
              <path d="M618 208 L714 206 L760 232 L734 268 L666 270 L624 248 Z" />

              {/* Africa & Madagascar */}
              <path d="M428 260 L506 254 L558 270 L598 284 L626 338 L648 376 L630 436 L600 502 L574 558 L534 576 L504 538 L490 476 L468 418 L426 394 L398 352 L402 300 Z" />
              <path d="M636 486 L654 480 L658 530 L638 538 Z" />

              {/* Arabian Peninsula & Levant */}
              <path d="M590 278 L642 280 L674 318 L660 356 L618 366 L596 324 Z" />

              {/* Japan, Taiwan, Philippines, Indonesia */}
              <path d="M936 232 L958 220 L966 254 L946 282 L928 272 Z" />
              <path d="M854 362 L876 358 L886 400 L864 408 Z" />
              <path d="M774 422 L824 432 L874 440 L920 448 L912 470 L848 464 L782 450 Z" />
            </g>

            {/* Country Boundary Hairlines on Eurasia & Africa */}
            <g fill="none" stroke="#DFDDD7" strokeWidth="0.7" opacity="0.8">
              <path d="M468 202 L516 210 L544 196 L574 218" />
              <path d="M452 298 L514 302 L558 298 L588 334" />
              <path d="M506 254 L512 362 L558 394 L600 390" />
              <path d="M512 362 L462 376" />
              <path d="M664 218 L678 266 L734 268" />
            </g>

            {/* Highlighted Terracotta / Burnt-Orange Oil Impact Regions (Matches Screenshot) */}
            {showHeatmap && (
              <g stroke="#B84118" strokeWidth="0.9">
                {/* 1. Turkey & Eastern Mediterranean Corridor */}
                <path
                  d="M550 246 L608 242 L620 258 L602 270 L554 266 Z"
                  fill="url(#terracottaGrad)"
                  className="cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => onSelectRegion?.(REGIONAL_CALLOUTS[1])}
                />
                {/* 2. Iran, Iraq & Persian Gulf Core Hub */}
                <path
                  d="M614 256 L666 258 L692 282 L684 312 L646 310 L620 286 Z"
                  fill="url(#terracottaDots)"
                  className="cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => onNavigateModule('geopolitics')}
                />
                {/* 3. India & South Asia */}
                <path
                  d="M684 278 L738 276 L766 308 L742 362 L716 404 L696 358 L678 314 Z"
                  fill="url(#terracottaGrad)"
                  className="cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => onSelectRegion?.(REGIONAL_CALLOUTS[2])}
                />
                {/* 4. China / East Asia Demand Basin */}
                <path
                  d="M738 222 L846 208 L908 232 L918 282 L888 328 L834 340 L778 324 L750 278 Z"
                  fill="url(#terracottaDots)"
                  className="cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => onNavigateModule('balance_opec')}
                />
                {/* 5. Vietnam & Southeast Asia */}
                <path
                  d="M766 318 L818 324 L832 364 L804 406 L780 384 L768 348 Z"
                  fill="url(#terracottaGrad)"
                  className="cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => onSelectRegion?.(REGIONAL_CALLOUTS[0])}
                />
              </g>
            )}

            {/* Curved Supply & Shock Trajectory Arcs (Matches Screenshot) */}
            {showArcs && (
              <g fill="none">
                {/* Arc 1: Persian Gulf / Middle East -> US / North Atlantic */}
                <path
                  d="M 650 292 Q 390 185 115 315"
                  stroke="#8E877E"
                  strokeWidth="1.2"
                  opacity="0.75"
                />
                {/* Arc 2: Persian Gulf -> Southern Europe / Med */}
                <path
                  d="M 650 292 Q 510 215 280 305"
                  stroke="#8E877E"
                  strokeWidth="1.1"
                  opacity="0.65"
                />
                {/* Arc 3: Persian Gulf -> Turkey (Ceyhan) */}
                <path
                  d="M 650 292 Q 618 256 590 258"
                  stroke="#57524B"
                  strokeWidth="1.4"
                />
                {/* Arc 4: Persian Gulf -> India */}
                <path
                  d="M 650 292 Q 684 300 706 332"
                  stroke="#57524B"
                  strokeWidth="1.4"
                />
                {/* Arc 5: Persian Gulf -> Vietnam / Malacca */}
                <path
                  d="M 650 292 Q 740 284 794 338"
                  stroke="#57524B"
                  strokeWidth="1.4"
                />
                {/* Arc 6: Persian Gulf -> East Asia / China */}
                <path
                  d="M 650 292 Q 765 234 864 282"
                  stroke="#7A736A"
                  strokeWidth="1.2"
                />
                {/* Arc 7: Persian Gulf -> Horn of Africa / Bab el-Mandeb */}
                <path
                  d="M 650 292 Q 626 336 608 368"
                  stroke="#8E877E"
                  strokeWidth="1.1"
                />
              </g>
            )}

            {/* Node Dots on Key Chokepoints & Destinations */}
            <g>
              <circle cx="590" cy="258" r="4.5" fill="#2B2927" stroke="#F7F6F2" strokeWidth="1.5" />
              <circle cx="650" cy="292" r="5" fill="#2B2927" stroke="#F7F6F2" strokeWidth="1.5" />
              <circle cx="706" cy="332" r="4.5" fill="#2B2927" stroke="#F7F6F2" strokeWidth="1.5" />
              <circle cx="794" cy="338" r="4.5" fill="#2B2927" stroke="#F7F6F2" strokeWidth="1.5" />
              <circle cx="864" cy="282" r="4" fill="#4A4640" stroke="#F7F6F2" strokeWidth="1.2" />
            </g>

            {/* Extra Layer Markers when Chokepoints or Stocks Layer is active */}
            {activeMapLayer === 'chokepoints' && (
              <g>
                <circle cx="650" cy="292" r="16" fill="rgba(184, 62, 22, 0.28)" />
                <circle cx="608" cy="354" r="14" fill="rgba(184, 62, 22, 0.28)" />
                <circle cx="794" cy="396" r="14" fill="rgba(217, 107, 39, 0.25)" />
              </g>
            )}
            {activeMapLayer === 'stocks' && (
              <g>
                <circle cx="115" cy="225" r="18" fill="rgba(45, 138, 78, 0.25)" />
                <circle cx="115" cy="225" r="5" fill="#2D8A4E" stroke="#fff" strokeWidth="1.5" />
                <circle cx="480" cy="195" r="14" fill="rgba(45, 138, 78, 0.25)" />
                <circle cx="480" cy="195" r="4.5" fill="#2D8A4E" stroke="#fff" strokeWidth="1.5" />
              </g>
            )}
          </g>
        </svg>
      </div>

      {/* Top-Left Search & Editorial Title Overlay ("Oil Situation Room") */}
      <div className="absolute top-3.5 left-6 z-10 pointer-events-auto" dir="ltr">
        {/* Top Search Bar Row */}
        <div className="flex items-center gap-3 text-stone-600 mb-2.5">
          <Search className="w-4 h-4 text-stone-500" />
          <input
            type="text"
            dir="rtl"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="جستجو..."
            aria-label="جستجو در اتاق وضعیت نفت"
            className="bg-transparent text-xs font-medium text-stone-700 placeholder:text-stone-500 focus:outline-none w-36 border-b border-transparent focus:border-stone-400 pb-0.5"
          />
        </div>

        {/* Subtitle: اجرا: ۳۰ اکتبر ۲۰۲۶ - داده شبیه‌سازی‌شده */}
        <div
          dir="rtl"
          className="text-[12px] font-medium text-stone-700 mb-2.5 tracking-normal text-right"
        >
          اجرا: ۳۰ اکتبر ۲۰۲۶ - داده شبیه‌سازی‌شده
        </div>

        {/* Giant Editorial Title: Oil Situation Room */}
        <h1 className="text-[44px] xl:text-[50px] font-bold tracking-tight text-[#1E1D1B] leading-[1.06] select-text">
          Oil Situation
          <br />
          Room
        </h1>
      </div>

      {/* Top-Right Floating Map Controls (+ / - / Globe) */}
      <div
        className="absolute top-3 right-3 z-20 flex items-center gap-1.5"
        dir="ltr"
      >
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(1.5, +(z + 0.15).toFixed(2)))}
          aria-label="بزرگ‌نمایی نقشه"
          className="w-9 h-9 rounded-md bg-[#F5F4F0]/95 hover:bg-white border border-stone-300/80 flex items-center justify-center text-stone-700 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(0.85, +(z - 0.15).toFixed(2)))}
          aria-label="کوچک‌نمایی نقشه"
          className="w-9 h-9 rounded-md bg-[#F5F4F0]/95 hover:bg-white border border-stone-300/80 flex items-center justify-center text-stone-700 shadow-xs transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setZoom(1);
            onChangeMapLayer(
              activeMapLayer === 'trade_shocks'
                ? 'chokepoints'
                : activeMapLayer === 'chokepoints'
                ? 'stocks'
                : 'trade_shocks'
            );
          }}
          aria-label="تغییر لایه نقشه جهانی"
          title="تغییر لایه نقشه (جریان تجارت / گلوگاه‌ها / ذخایر)"
          className="w-9 h-9 rounded-md bg-[#F5F4F0]/95 hover:bg-white border border-stone-300/80 flex items-center justify-center text-stone-700 shadow-xs transition-colors"
        >
          <Globe className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Regional Callouts on Map (Vietnam -8.7%, Turkey -5.2%, India -3.9%) */}
      {REGIONAL_CALLOUTS.map((rc) => {
        const isSelected = selectedRegionId === rc.id;
        return (
          <button
            key={rc.id}
            type="button"
            dir="ltr"
            onClick={() => onSelectRegion?.(rc)}
            style={{ left: `${rc.xPct}%`, top: `${rc.yPct}%` }}
            className={`absolute z-10 -translate-x-1/2 -translate-y-full px-3 py-2 rounded-lg bg-[#FAF9F5]/95 backdrop-blur-xs border transition-all shadow-md text-left cursor-pointer ${
              isSelected
                ? 'border-[#B83E16] ring-2 ring-[#B83E16]/30 scale-105'
                : 'border-stone-200/90 hover:border-stone-400'
            }`}
          >
            <div className="text-[12px] font-medium text-stone-700 leading-tight">
              {rc.nameEn}
            </div>
            <div className="font-mono-num text-[14px] font-semibold text-stone-900 leading-tight mt-0.5">
              {rc.changeText}
            </div>
          </button>
        );
      })}

      {/* Active Region Detail Popover (if user clicks Vietnam, Turkey, or India) */}
      {selectedRegion && (
        <div
          dir="rtl"
          className="absolute top-16 right-4 z-30 w-80 rounded-xl bg-white/95 backdrop-blur-md border border-stone-300 shadow-xl p-3.5 text-xs"
        >
          <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-2">
            <div>
              <span className="font-extrabold text-stone-900">{selectedRegion.nameFa}</span>
              <span className="font-mono-num text-[#B83E16] font-bold mr-2" dir="ltr">
                ({selectedRegion.changeText})
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSelectRegion?.(selectedRegion)}
              className="text-stone-400 hover:text-stone-700 font-bold px-1"
            >
              ✕
            </button>
          </div>
          <p className="font-bold text-stone-800 leading-relaxed">{selectedRegion.headlineFa}</p>
          <p className="text-stone-600 mt-1 leading-relaxed">{selectedRegion.detailFa}</p>
          <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
            <span className="text-stone-500">جریان وارداتی: {selectedRegion.importFlowMbd}</span>
            <button
              type="button"
              onClick={() => onNavigateModule('geopolitics')}
              className="font-bold text-[#B83E16] hover:underline"
            >
              تحلیل کامل کریدور ←
            </button>
          </div>
        </div>
      )}

      {/* OVERLAY CARD 1 (Middle-Left): «موجودی هفتگی آمریکا» (2026-10-23 · ۴15.0 mb) */}
      {showOverlays && (
        <div
          dir="rtl"
          onClick={() => onNavigateModule('eia_stocks')}
          className="absolute left-6 top-[53.5%] -translate-y-1/2 z-20 w-[238px] rounded-xl bg-[#FAF9F5]/96 backdrop-blur-md border border-stone-200/90 shadow-lg p-4 cursor-pointer hover:border-stone-400 transition-all"
        >
          <div className="text-right">
            <h2 className="text-[19px] font-extrabold text-[#1E1D1B] leading-snug">
              موجودی هفتگی آمریکا
            </h2>
            <div className="font-mono-num text-[12px] text-stone-600 mt-0.5">
              ۲۰۲۶-۱۰-۲۳
            </div>
          </div>

          <hr className="my-2.5 border-stone-200/90" />

          <div className="text-right">
            <div
              dir="ltr"
              className="font-mono-num text-[32px] font-bold text-[#1E1D1B] leading-none inline-block"
            >
              ۴15.0 <span className="text-[22px] font-normal">mb</span>
            </div>
            <div className="text-[13px] font-medium text-stone-700 mt-1.5">
              کاهش نسبی به الگوی ۵ ساله
            </div>
          </div>

          {/* Sparklines Row */}
          <div className="mt-3 pt-1.5 flex items-center justify-between gap-2" dir="ltr">
            <span className="text-[12px] text-stone-600 font-medium">Sparklines</span>
            <svg width="110" height="26" viewBox="0 0 110 26" className="overflow-visible">
              <path
                d="M 2 17 L 12 13 L 20 14 L 28 7 L 38 13 L 46 10 L 56 16 L 64 13 L 74 19 L 84 14 L 94 20 L 102 16 L 108 24"
                fill="none"
                stroke="#1E1D1B"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}

      {/* OVERLAY CARD 2 (Bottom-Left): «اعداد کلیدی» (Key Numbers Table matching left-to-right column layout of reference image) */}
      {showOverlays && (
        <div
          dir="ltr"
          className="absolute left-6 bottom-0 z-20 w-[59%] max-w-[605px] rounded-t-xl bg-[#FAF9F5]/95 backdrop-blur-md border-t border-x border-stone-200/90 shadow-lg px-5 pt-3.5 pb-12"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[20px] font-extrabold text-[#1E1D1B]">اعداد کلیدی</h2>
            <button
              type="button"
              onClick={() => onNavigateModule('eia_stocks')}
              className="text-[11px] font-bold text-[#B83E16] hover:underline"
            >
              WPSR مشاهده گزارش کامل →
            </button>
          </div>

          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="text-stone-600 border-b border-stone-300/80 font-medium">
                <th className="pb-1.5 font-medium text-left">شاخص</th>
                <th className="pb-1.5 font-medium text-center">سطح</th>
                <th className="pb-1.5 font-medium text-center">تغییر هفتگی</th>
                <th className="pb-1.5 font-medium text-center">تغییر ۵ ساله</th>
                <th className="pb-1.5 font-medium text-right">فاصله از میانگین</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/80 text-[#1E1D1B]">
              <tr className="hover:bg-stone-200/40 transition-colors">
                <td className="py-1.5 font-semibold">نفت خام تجاری</td>
                <td className="py-1.5 text-center font-mono-num font-semibold">۴۱۵.۰</td>
                <td className="py-1.5 text-center font-mono-num text-[#2D8A4E] font-medium">
                  +2.9%
                </td>
                <td className="py-1.5 text-center font-mono-num text-stone-700">
                  ساله -0.4%
                </td>
                <td className="py-1.5 text-right font-mono-num text-stone-800">
                  -1.3 mb
                </td>
              </tr>
              <tr className="hover:bg-stone-200/40 transition-colors">
                <td className="py-1.5 font-semibold">کاشینگ</td>
                <td className="py-1.5 text-center font-mono-num font-semibold">۲۲.۳</td>
                <td className="py-1.5 text-center font-mono-num text-stone-400">
                  +0.2%
                </td>
                <td className="py-1.5 text-center font-mono-num text-stone-700">
                  ساله -0.3%
                </td>
                <td className="py-1.5 text-right font-mono-num text-stone-800">
                  -0.7 mb
                </td>
              </tr>
              <tr className="hover:bg-stone-200/40 transition-colors">
                <td className="py-1.5 font-semibold">بنزین</td>
                <td className="py-1.5 text-center font-mono-num font-semibold">۲۱۴.۶</td>
                <td className="py-1.5 text-center font-mono-num text-[#2D8A4E] font-medium">
                  +17.6%
                </td>
                <td className="py-1.5 text-center font-mono-num text-[#C84B31]">
                  -0.6%
                </td>
                <td className="py-1.5 text-right font-mono-num text-stone-800">
                  1.0 mb
                </td>
              </tr>
              <tr className="hover:bg-stone-200/40 transition-colors">
                <td className="py-1.5 font-semibold">تقطیری</td>
                <td className="py-1.5 text-center font-mono-num font-semibold">۱۱۱.۰</td>
                <td className="py-1.5 text-center font-mono-num text-[#2D8A4E] font-medium">
                  +3.4%
                </td>
                <td className="py-1.5 text-center font-mono-num text-[#C84B31]">
                  -0.9%
                </td>
                <td className="py-1.5 text-right font-mono-num text-stone-800">
                  -1.1 mb
                </td>
              </tr>
              <tr className="hover:bg-stone-200/40 transition-colors">
                <td className="py-1.5 font-semibold">ذخایر استراتژیک SPR</td>
                <td className="py-1.5 text-center font-mono-num font-semibold">۴۰۰.5</td>
                <td className="py-1.5 text-center font-mono-num text-[#2D8A4E] font-medium">
                  +1.0%
                </td>
                <td className="py-1.5 text-center font-mono-num text-stone-400">—</td>
                <td className="py-1.5 text-right font-mono-num text-stone-700">
                  +0.1 mb
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* OVERLAY CARD 3 (Bottom-Right on Map): «چرا قیمت حرکت کرد؟» (داده تا ۲۰۲۶-۱۰) */}
      {showOverlays && (
        <div
          dir="rtl"
          onClick={() => onNavigateModule('shock_decomposition')}
          className="absolute right-3 bottom-0 z-20 w-[33%] max-w-[325px] rounded-t-xl bg-[#FAF9F5]/96 backdrop-blur-md border-t border-x border-stone-200/90 shadow-lg px-4 pt-3.5 pb-4 cursor-pointer hover:border-stone-400 transition-all"
        >
          <div className="text-right mb-1">
            <h2 className="text-[19px] font-extrabold text-[#1E1D1B] leading-tight">
              چرا قیمت حرکت کرد؟
            </h2>
            <div className="text-[12px] text-stone-600 mt-0.5">داده تا ۲۰۲۶-۱۰</div>
          </div>

          {/* Diverging Bar Chart SVG matching exact screenshot */}
          <div className="relative pt-1" dir="ltr">
            <svg viewBox="0 0 260 140" className="w-full h-34 overflow-visible">
              {/* Horizontal Grid Lines & Left Axis Labels */}
              <line x1="36" y1="18" x2="250" y2="18" stroke="#E2E0D8" strokeWidth="1" />
              <text x="30" y="21" textAnchor="end" fill="#6E6A63" className="font-mono-num text-[10px]">
                +1.00
              </text>

              <line x1="36" y1="46" x2="250" y2="46" stroke="#E2E0D8" strokeWidth="1" />
              <text x="30" y="49" textAnchor="end" fill="#6E6A63" className="font-mono-num text-[10px]">
                +6.0
              </text>

              <line x1="36" y1="74" x2="250" y2="74" stroke="#E2E0D8" strokeWidth="1" />
              <text x="30" y="77" textAnchor="end" fill="#6E6A63" className="font-mono-num text-[10px]">
                +.0
              </text>

              {/* Zero Baseline */}
              <line x1="36" y1="96" x2="250" y2="96" stroke="#9E9A91" strokeWidth="1.1" />
              <text x="30" y="99" textAnchor="end" fill="#6E6A63" className="font-mono-num text-[10px]">
                0
              </text>

              {/* Bar 1: تقاضای اختصاصی (Green, +4.4) */}
              <text
                x="78"
                y="24"
                textAnchor="middle"
                fill="#2E9E5B"
                className="font-mono-num text-[11px] font-bold"
              >
                +۴.۴
              </text>
              <rect x="56" y="30" width="44" height="66" fill="#2E9E5B" rx="1" />
              <text x="78" y="113" textAnchor="middle" fill="#1E1D1B" className="text-[11px] font-medium">
                تقاضای
              </text>
              <text x="78" y="126" textAnchor="middle" fill="#1E1D1B" className="text-[11px] font-medium">
                اختصاصی
              </text>

              {/* Bar 2: عرضه (Orange, -0.7) */}
              <rect x="124" y="46" width="44" height="28" fill="#E67E22" rx="1" />
              <text
                x="146"
                y="88"
                textAnchor="middle"
                fill="#B83E16"
                className="font-mono-num text-[11px] font-semibold"
              >
                -0.7
              </text>
              <text x="146" y="113" textAnchor="middle" fill="#1E1D1B" className="text-[11px] font-medium">
                عرضه
              </text>

              {/* Bar 3: تقاضای اقتصادی (Red, -1.6) */}
              <rect x="192" y="78" width="44" height="18" fill="#D9463E" rx="1" />
              <text
                x="214"
                y="109"
                textAnchor="middle"
                fill="#B83E16"
                className="font-mono-num text-[11px] font-semibold"
              >
                -۱.۶
              </text>
              <text x="214" y="122" textAnchor="middle" fill="#1E1D1B" className="text-[11px] font-medium">
                تقاضای
              </text>
              <text x="214" y="135" textAnchor="middle" fill="#1E1D1B" className="text-[11px] font-medium">
                اقتصادی
              </text>
            </svg>
          </div>

          <div className="text-right text-[13px] font-semibold text-[#1E1D1B] mt-0.5">
            سهم عوامل
          </div>
        </div>
      )}

      {/* Floating Bottom-Center Dark Map Dock (Matches exact dark toolbar in screenshot) */}
      <div
        dir="ltr"
        className="absolute bottom-2 left-[47%] -translate-x-1/2 z-30 bg-[#22211F]/95 backdrop-blur-md text-stone-300 rounded-lg px-4 py-1.5 shadow-2xl border border-stone-700/70 flex items-center gap-5"
      >
        <button
          type="button"
          onClick={() => onNavigateModule('forecast_scenario')}
          title="شبیه‌ساز سناریوی هوش مصنوعی و اثر درآمدی"
          aria-label="شبیه‌ساز سناریو"
          className="hover:text-[#F2DA63] transition-colors p-1"
        >
          <Sparkles className="w-4 h-4 text-[#E68A56]" />
        </button>
        <button
          type="button"
          onClick={() => onNavigateModule('balance_opec')}
          title="تراز عرضه و تقاضا و اوپک+"
          aria-label="تراز عرضه و تقاضا"
          className="hover:text-white transition-colors p-1"
        >
          <Equal className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onSelectRegion?.(REGIONAL_CALLOUTS[0])}
          title="تمرکز بر کانون‌های منطقه‌ای"
          aria-label="کانون‌های منطقه‌ای"
          className="hover:text-white transition-colors p-1"
        >
          <MapPin className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setShowHeatmap((h) => !h)}
          title="نمایش/پنهان لایه حرارتی مناطق"
          aria-label="لایه حرارتی مناطق"
          className={`transition-colors p-1 ${showHeatmap ? 'text-[#E68A56]' : 'text-stone-400 hover:text-white'}`}
        >
          <Layers className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onNavigateModule('shock_decomposition')}
          title="موتور تجزیه شوک‌های قیمت (SVAR)"
          aria-label="موتور تجزیه شوک‌ها"
          className="hover:text-white transition-colors p-1"
        >
          <Gauge className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setShowArcs((a) => !a)}
          title="نمایش/پنهان خطوط جریان تجارت"
          aria-label="خطوط جریان تجارت"
          className={`transition-colors p-1 ${showArcs ? 'text-[#F2DA63]' : 'text-stone-400 hover:text-white'}`}
        >
          <Compass className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onToggleOverlays}
          title={showOverlays ? 'خلوت‌سازی نقشه (پنهان کردن کارت‌ها)' : 'نمایش کارت‌های تحلیلی روی نقشه'}
          aria-label="تغییر وضعیت کارت‌های روی نقشه"
          className="hover:text-white transition-colors p-1"
        >
          {showOverlays ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[#F2DA63]" />}
        </button>
        <button
          type="button"
          onClick={() => setZoom(1)}
          title="تنظیم مجدد قاب نقشه"
          aria-label="تنظیم مجدد قاب نقشه"
          className="hover:text-white transition-colors p-1"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
