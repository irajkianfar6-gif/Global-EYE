import React, { useRef, useState } from 'react';
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
import { RealtimePriceTicker } from './RealtimePriceTicker';
import {
  HormuzGlobeSankey,
  HormuzGlobeApi,
  SeaNodePoint,
} from './HormuzGlobeSankey';

export interface RegionalCallout {
  id: string;
  nameEn: string;
  nameFa: string;
  changeText: string;
  xPct: number;
  yPct: number;
  longitude: number;
  latitude: number;
  importFlowMbd: string;
  headlineFa: string;
  detailFa: string;
}

export const REGIONAL_CALLOUTS: RegionalCallout[] = [
  {
    id: 'vietnam',
    nameEn: 'Vietnam',
    nameFa: 'ویتنام و جنوب شرق آسیا (بندر نگی‌سون)',
    changeText: '-8.7%',
    xPct: 81.5,
    yPct: 49.0,
    longitude: 105.8,
    latitude: 19.31,
    importFlowMbd: '۰٫۵۲ mb/d',
    headlineFa: 'کاهش ۸٫۷٪ واردات ماهانه نفت خام و فرآورده در پی تعمیرات پالایشگاه Nghi Son',
    detailFa: 'حساسیت بالا به تفاضل OSP خلیج فارس و نرخ حمل مسیر تنگه هرمز ← مالاکا؛ جایگزینی بخشی از خوراک با نفت سبک.',
  },
  {
    id: 'turkey',
    nameEn: 'Turkey',
    nameFa: 'ترکیه و کریدور مدیترانه (بندر جیهان و ایزمیت)',
    changeText: '-5.2%',
    xPct: 37.5,
    yPct: 34.5,
    longitude: 35.93,
    latitude: 36.88,
    importFlowMbd: '۱٫۰۸ mb/d',
    headlineFa: 'افت ۵٫۲٪ ترانزیت پایانه جیهان و تعدیل واردات دریابرد از مسیر دریای سرخ و سوئز',
    detailFa: 'پایش مستمر خط لوله کرکوک-جیهان و جریان تنگه هرمز ← باب‌المندب ← کانال سوئز به پالایشگاه‌های مدیترانه.',
  },
  {
    id: 'india',
    nameEn: 'India',
    nameFa: 'هند (بندر جام‌نگر و سیکا · آمار PPAC)',
    changeText: '-3.9%',
    xPct: 60.0,
    yPct: 52.5,
    longitude: 69.85,
    latitude: 22.47,
    importFlowMbd: '۲٫۵۵ mb/d از هرمز (۴٫۶۵ mb/d کل)',
    headlineFa: 'کاهش ۳٫۹٪ واردات ماهانه نفت خام هند هم‌زمان با فصل تعمیرات پالایشی',
    detailFa: 'شاهراه مستقیم دریایی از پایانه‌های راس تنوره، البصره و خارگ از طریق تنگه هرمز به مجتمع پالایشی جام‌نگر.',
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
  const globeApiRef = useRef<HormuzGlobeApi | null>(null);
  const [showArcs, setShowArcs] = useState<boolean>(true);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [selectedSeaNode, setSelectedSeaNode] = useState<SeaNodePoint | null>(null);

  const selectedRegion = REGIONAL_CALLOUTS.find((r) => r.id === selectedRegionId) || null;

  const handleRegionClick = (rc: RegionalCallout) => {
    onSelectRegion?.(rc);
    globeApiRef.current?.focusGeoPoint(rc.longitude, rc.latitude, 1.35);
  };

  return (
    <div className="relative w-full h-full bg-[#E3E1DC] overflow-hidden select-none">
      {/* Subtle Cartographic Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 54% 46%, rgba(244,242,238,0.55) 0%, rgba(221,218,211,0.85) 75%, rgba(206,203,195,0.95) 100%)',
        }}
      />

      {/* Real Interactive 3D Globe & Map Sankey of Strait of Hormuz Crude Exports (amCharts 5 + Responsive Theme) */}
      <div className="relative w-full h-full z-0">
        <HormuzGlobeSankey
          showFlows={showArcs}
          showHeatmap={showHeatmap}
          activeMapLayer={activeMapLayer}
          onReadyApi={(api) => {
            globeApiRef.current = api;
          }}
          onSelectTerminalOrPort={(node) => {
            setSelectedSeaNode(node);
            globeApiRef.current?.focusGeoPoint(node.longitude, node.latitude, 1.5);
          }}
        />
      </div>

      {/* Main Top Navigation Bar Overlay (Left Search + Top-Right Real-Time Price Ticker & Globe Controls) */}
      <header
        aria-label="نوار ناوبری بالای اتاق وضعیت نفت"
        className="absolute top-3 left-6 right-3 z-20 flex items-center justify-between gap-3 pointer-events-none"
        dir="ltr"
      >
        {/* Top-Left Search Input */}
        <div className="flex items-center gap-3 text-stone-600 pointer-events-auto bg-[#FAF9F5]/85 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-stone-300/70 shadow-xs">
          <Search className="w-4 h-4 text-stone-500" />
          <input
            type="text"
            dir="rtl"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="جستجو..."
            aria-label="جستجو در اتاق وضعیت نفت"
            className="bg-transparent text-xs font-medium text-stone-700 placeholder:text-stone-500 focus:outline-none w-36"
          />
        </div>

        {/* Top-Right Real-Time Price Ticker (WTI, Brent, Dubai) + Globe Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <RealtimePriceTicker
            onSelectBenchmark={() => onNavigateModule('osp_crack_margins')}
          />

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => globeApiRef.current?.zoomIn()}
              aria-label="بزرگ‌نمایی نقشه"
              title="بزرگ‌نمایی کره جغرافیایی"
              className="w-8 h-8 rounded-md bg-[#F5F4F0]/95 hover:bg-white border border-stone-300/80 flex items-center justify-center text-stone-700 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => globeApiRef.current?.zoomOut()}
              aria-label="کوچک‌نمایی نقشه"
              title="کوچک‌نمایی کره جغرافیایی"
              className="w-8 h-8 rounded-md bg-[#F5F4F0]/95 hover:bg-white border border-stone-300/80 flex items-center justify-center text-stone-700 shadow-xs transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                globeApiRef.current?.resetView();
                onChangeMapLayer(
                  activeMapLayer === 'trade_shocks'
                    ? 'chokepoints'
                    : activeMapLayer === 'chokepoints'
                    ? 'stocks'
                    : 'trade_shocks'
                );
              }}
              aria-label="تغییر لایه نقشه جهانی"
              title="بازنشانی زاویه کره به تنگه هرمز (Strait of Hormuz)"
              className="w-8 h-8 rounded-md bg-[#F5F4F0]/95 hover:bg-white border border-stone-300/80 flex items-center justify-center text-stone-700 shadow-xs transition-colors cursor-pointer"
            >
              <Globe className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Top-Left Editorial Title Overlay ("Oil Situation Room") */}
      <div className="absolute top-14 left-6 z-10 pointer-events-none" dir="ltr">
        {/* Subtitle: اجرا: ۳۰ اکتبر ۲۰۲۶ - داده شبیه‌سازی‌شده */}
        <div
          dir="rtl"
          className="text-[12px] font-medium text-stone-700 mb-1.5 tracking-normal text-right"
        >
          اجرا: ۳۰ اکتبر ۲۰۲۶ - داده شبیه‌سازی‌شده
        </div>

        {/* Giant Editorial Title: Oil Situation Room */}
        <h1 className="text-[42px] xl:text-[48px] font-bold tracking-tight text-[#1E1D1B] leading-[1.05] select-text">
          Oil Situation
          <br />
          Room
        </h1>
      </div>

      {/* Floating Regional Callouts on Globe (Vietnam -8.7%, Turkey -5.2%, India -3.9%) */}
      {REGIONAL_CALLOUTS.map((rc) => {
        const isSelected = selectedRegionId === rc.id;
        return (
          <button
            key={rc.id}
            type="button"
            dir="ltr"
            onClick={() => handleRegionClick(rc)}
            style={{ left: `${rc.xPct}%`, top: `${rc.yPct}%` }}
            className={`absolute z-10 -translate-x-1/2 -translate-y-full px-3 py-1.5 rounded-lg bg-[#FAF9F5]/95 backdrop-blur-xs border transition-all shadow-md text-left cursor-pointer ${
              isSelected
                ? 'border-[#B83E16] ring-2 ring-[#B83E16]/30 scale-105'
                : 'border-stone-200/90 hover:border-stone-400'
            }`}
          >
            <div className="text-[11px] font-medium text-stone-700 leading-tight">
              {rc.nameEn}
            </div>
            <div className="font-mono-num text-[13px] font-semibold text-stone-900 leading-tight mt-0.5">
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

      {/* Selected Terminal / Chokepoint / Port Popover (when clicking a node on the amCharts 5 Globe) */}
      {selectedSeaNode && !selectedRegion && (
        <div
          dir="rtl"
          className="absolute top-16 right-4 z-30 w-76 rounded-xl bg-[#FAF9F5]/96 backdrop-blur-md border border-[#B83E16]/50 shadow-xl p-3.5 text-xs"
        >
          <div className="flex items-center justify-between border-b border-stone-200 pb-2 mb-2">
            <span className="font-extrabold text-[#1E1D1B]">
              {selectedSeaNode.nameFa || selectedSeaNode.nameEn}
            </span>
            <button
              type="button"
              onClick={() => setSelectedSeaNode(null)}
              className="text-stone-400 hover:text-stone-700 font-bold px-1"
            >
              ✕
            </button>
          </div>
          <div className="space-y-1 text-stone-700">
            <div>
              کشور / حوزه: <strong className="text-stone-900">{selectedSeaNode.countryFa}</strong>
            </div>
            <div>
              حجم جریان نفت خام:{' '}
              <strong className="font-mono-num text-[#B83E16]">{selectedSeaNode.volumeMbd}</strong>
            </div>
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

      {/* OVERLAY CARD 2 (Bottom-Left): «اعداد کلیدی» */}
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

              <line x1="36" y1="96" x2="250" y2="96" stroke="#9E9A91" strokeWidth="1.1" />
              <text x="30" y="99" textAnchor="end" fill="#6E6A63" className="font-mono-num text-[10px]">
                0
              </text>

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

      {/* Floating Bottom-Center Dark Map Dock */}
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
          onClick={() => {
            globeApiRef.current?.focusGeoPoint(56.25, 26.56, 1.55);
          }}
          title="تمرکز روی تنگه هرمز (Strait of Hormuz)"
          aria-label="کانون‌های منطقه‌ای"
          className="hover:text-white transition-colors p-1"
        >
          <MapPin className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setShowHeatmap((h) => !h)}
          title="نمایش/پنهان لایه حرارتی کشورها"
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
          title="نمایش/پنهان جریان سنکی و قطرات متحرک نفت"
          aria-label="خطوط جریان تجارت"
          className={`transition-colors p-1 ${showArcs ? 'text-[#F2DA63]' : 'text-stone-400 hover:text-white'}`}
        >
          <Compass className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onToggleOverlays}
          title={showOverlays ? 'خلوت‌سازی نقشه (پنهان کردن کارت‌ها روی کره سه‌بعدی)' : 'نمایش کارت‌های تحلیلی روی کره سه‌بعدی'}
          aria-label="تغییر وضعیت کارت‌های روی نقشه"
          className="hover:text-white transition-colors p-1"
        >
          {showOverlays ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[#F2DA63]" />}
        </button>
        <button
          type="button"
          onClick={() => globeApiRef.current?.resetView()}
          title="تنظیم مجدد قاب کره جغرافیایی"
          aria-label="تنظیم مجدد قاب نقشه"
          className="hover:text-white transition-colors p-1"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
