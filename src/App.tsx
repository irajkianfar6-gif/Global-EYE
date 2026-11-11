import React, { useState } from 'react';
import {
  Home,
  Activity,
  Database,
  Sliders,
  Briefcase,
  Building2,
  Compass,
  FileText,
  AlertTriangle,
  ArrowLeftRight,
  ExternalLink,
  Globe2,
  Table,
  GitBranch,
  MapPin,
  Bell,
  Lock,
  Cpu,
  X,
  ArrowRight,
  Layers,
} from 'lucide-react';
import {
  CockpitScreenshotView1,
  CockpitScreenshotView2,
  CockpitScreenshotView3,
  CockpitScreenshotView4,
  CockpitScreenshotView5,
  DeepPageId,
} from './components/CockpitViews';
import {
  EiaStocksDeepPage,
  ShockDecompositionDeepPage,
  ForecastScenarioDeepPage,
  BalanceOpecDeepPage,
  GeopoliticsChokepointsDeepPage,
  OspCrackMarginsDeepPage,
  CotMacroSentimentDeepPage,
} from './components/AnalyticalPages';
import {
  ReportsBriefsDeepPage,
  DataGovernanceDeepPage,
} from './components/GovernanceAndReportsPages';
import {
  SituationRoomMap,
  REGIONAL_CALLOUTS,
  RegionalCallout,
} from './components/SituationRoomMap';
import { SituationRoomRightPanel } from './components/SituationRoomRightPanel';
import { RealtimePriceTicker } from './components/RealtimePriceTicker';
import {
  INITIAL_ALERTS,
  EXECUTIVE_FOUR_QUESTIONS,
  PlatformAlertItem,
} from './data/platformData';
import { toPersianDigits } from './utils/oilAnalytics';

export type CockpitVariantId = 1 | 2 | 3 | 4 | 5;
export type WorkspaceViewId = DeepPageId | 'classic_cockpits';

export default function App() {
  // Default view is the full-screen Oil Situation Room map ('cockpit')
  const [activePage, setActivePage] = useState<WorkspaceViewId>('cockpit');
  const [cockpitVariant, setCockpitVariant] = useState<CockpitVariantId>(1);
  const [alerts, setAlerts] = useState<PlatformAlertItem[]>(INITIAL_ALERTS);
  const [showAlertsModal, setShowAlertsModal] = useState<boolean>(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [showReferenceModal, setShowReferenceModal] = useState<boolean>(false);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('جالس');
  const [showMapOverlays, setShowMapOverlays] = useState<boolean>(true);
  const [activeMapLayer, setActiveMapLayer] = useState<'trade_shocks' | 'chokepoints' | 'stocks'>(
    'trade_shocks'
  );

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const handleSelectRegion = (region: RegionalCallout) => {
    setSelectedRegionId((prev) => (prev === region.id ? null : region.id));
  };

  // 15 Left-Rail Icons matching the exact vertical sequence in the uploaded screenshot
  const leftRailButtons: {
    id: string;
    labelFa: string;
    icon: React.FC<{ className?: string }>;
    isActive: boolean;
    onClick: () => void;
  }[] = [
    {
      id: 'rail-home',
      labelFa: 'نمای اصلی: اتاق وضعیت نفت (Oil Situation Room)',
      icon: Home,
      isActive: activePage === 'cockpit' && showMapOverlays,
      onClick: () => {
        setActivePage('cockpit');
        setShowMapOverlays(true);
      },
    },
    {
      id: 'rail-shocks',
      labelFa: 'تجزیه شوک‌های قیمت نفت (SVAR: Kilian / BH / Känzig)',
      icon: Activity,
      isActive: activePage === 'shock_decomposition',
      onClick: () => setActivePage('shock_decomposition'),
    },
    {
      id: 'rail-eia',
      labelFa: 'موجودی هفتگی آمریکا (EIA WPSR)',
      icon: Database,
      isActive: activePage === 'eia_stocks',
      onClick: () => setActivePage('eia_stocks'),
    },
    {
      id: 'rail-forecast',
      labelFa: 'محک‌زنی پیش‌بینی و شبیه‌ساز سناریو (forecast-benchmark)',
      icon: Sliders,
      isActive: activePage === 'forecast_scenario',
      onClick: () => setActivePage('forecast_scenario'),
    },
    {
      id: 'rail-balance',
      labelFa: 'تراز عرضه و تقاضا و پایبندی اعضای اوپک+',
      icon: Briefcase,
      isActive: activePage === 'balance_opec',
      onClick: () => setActivePage('balance_opec'),
    },
    {
      id: 'rail-osp',
      labelFa: 'منحنی آتی، قیمت‌های رسمی فروش خلیج فارس (OSP) و حاشیه پالایش',
      icon: Building2,
      isActive: activePage === 'osp_crack_margins',
      onClick: () => setActivePage('osp_crack_margins'),
    },
    {
      id: 'rail-geo',
      labelFa: 'گلوگاه‌های دریایی، ریسک ژئوپلیتیک و ناوگان سایه',
      icon: Compass,
      isActive: activePage === 'geopolitics',
      onClick: () => setActivePage('geopolitics'),
    },
    {
      id: 'rail-briefs',
      labelFa: 'بریف‌های مدیریتی فارسی (۵ ثانیه / ۳۰ ثانیه / ۵ دقیقه)',
      icon: FileText,
      isActive: activePage === 'reports_briefs',
      onClick: () => setActivePage('reports_briefs'),
    },
    {
      id: 'rail-alerts',
      labelFa: `موتور هشدار زودهنگام (${toPersianDigits(unacknowledgedCount)})`,
      icon: AlertTriangle,
      isActive: showAlertsModal,
      onClick: () => setShowAlertsModal(true),
    },
    {
      id: 'rail-reconcile',
      labelFa: 'پوزیشن‌گیری پول هوشمند (COT) و متغیرهای کلان مالی',
      icon: ArrowLeftRight,
      isActive: activePage === 'cot_macro_sentiment',
      onClick: () => setActivePage('cot_macro_sentiment'),
    },
    {
      id: 'rail-sources',
      labelFa: 'کاتالوگ ۲۵۶ منبع داده و ۱۲ کانکتور موج ۱',
      icon: ExternalLink,
      isActive: activePage === 'data_governance',
      onClick: () => setActivePage('data_governance'),
    },
    {
      id: 'rail-globe',
      labelFa: 'تغییر لایه نقشه (جریان تجارت / گلوگاه‌ها / ذخایر)',
      icon: Globe2,
      isActive: activePage === 'cockpit' && activeMapLayer !== 'trade_shocks',
      onClick: () => {
        setActivePage('cockpit');
        setActiveMapLayer((prev) =>
          prev === 'trade_shocks'
            ? 'chokepoints'
            : prev === 'chokepoints'
            ? 'stocks'
            : 'trade_shocks'
        );
      },
    },
    {
      id: 'rail-table',
      labelFa: 'جدول کامل اعداد کلیدی WPSR',
      icon: Table,
      isActive: false,
      onClick: () => setActivePage('eia_stocks'),
    },
    {
      id: 'rail-triangulation',
      labelFa: 'مثلث‌سازی سه روش شوک عرضه (همسو / ناهمسو)',
      icon: GitBranch,
      isActive: false,
      onClick: () => setActivePage('shock_decomposition'),
    },
    {
      id: 'rail-regions',
      labelFa: 'تمرکز بر کانون‌های منطقه‌ای (ویتنام، ترکیه، هند)',
      icon: MapPin,
      isActive: selectedRegionId !== null,
      onClick: () => {
        setActivePage('cockpit');
        setSelectedRegionId((prev) =>
          prev === 'vietnam' ? 'turkey' : prev === 'turkey' ? 'india' : 'vietnam'
        );
      },
    },
  ];

  const selectedQuestion = EXECUTIVE_FOUR_QUESTIONS.find((q) => q.id === activeQuestionId);

  return (
    <div
      dir="ltr"
      className="h-screen w-screen overflow-hidden bg-[#E3E1DC] text-[#1E1D1B] flex flex-row"
    >
      {/* 1. LEFTMOST SLIM VERTICAL ICON RAIL (Matches exact screenshot left edge) */}
      <nav
        aria-label="نوار ابزار اتاق وضعیت نفت"
        className="w-12 sm:w-13 shrink-0 h-full bg-[#F3F2ED] border-r border-stone-300/80 flex flex-col justify-between items-center z-30 select-none"
      >
        {/* Top Yellow Processor Square Badge */}
        <button
          type="button"
          onClick={() => {
            setActivePage('cockpit');
            setShowMapOverlays(true);
          }}
          title="Oil Situation Room — بازگشت به نمای اصلی اتاق وضعیت نفت"
          aria-label="بازگشت به نمای اصلی اتاق وضعیت نفت"
          className="w-full h-12 bg-[#F2DA63] hover:bg-[#ebd04f] border-b border-stone-300/70 flex items-center justify-center text-[#1E1D1B] transition-colors shrink-0"
        >
          <Cpu className="w-5 h-5 stroke-[1.8]" />
        </button>

        {/* Center 15 Vertical Module Icons */}
        <div className="flex-1 w-full py-2 flex flex-col items-center justify-between overflow-y-auto">
          {leftRailButtons.map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.id}
                type="button"
                onClick={btn.onClick}
                title={btn.labelFa}
                aria-label={btn.labelFa}
                className={`w-9 h-8 rounded-md flex items-center justify-center transition-all ${
                  btn.isActive
                    ? 'bg-[#B83E16]/15 text-[#B83E16]'
                    : 'text-stone-600 hover:bg-stone-200/80 hover:text-stone-950'
                }`}
              >
                <Icon className="w-[17px] h-[17px] stroke-[1.7]" />
              </button>
            );
          })}
        </div>

        {/* Bottom 2 Icons (Alerts Bell + Reference & Classic Layouts Switcher) */}
        <div className="w-full py-2.5 border-t border-stone-300/60 flex flex-col items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowAlertsModal(true)}
            title={`مرکز هشدارهای زودهنگام (${toPersianDigits(unacknowledgedCount)})`}
            aria-label="مرکز هشدارهای زودهنگام"
            className="relative w-9 h-8 rounded-md flex items-center justify-center text-stone-600 hover:bg-stone-200/80 hover:text-stone-950 transition-colors"
          >
            <Bell className="w-[17px] h-[17px] stroke-[1.7]" />
            {unacknowledgedCount > 0 && (
              <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-[#B83E16]" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowReferenceModal(true)}
            title="گالری تصاویر مرجع و نماهای ۵گانه کلاسیک"
            aria-label="گالری تصاویر مرجع و نماهای کلاسیک"
            className="w-9 h-8 rounded-md flex items-center justify-center text-stone-600 hover:bg-stone-200/80 hover:text-stone-950 transition-colors"
          >
            <Lock className="w-[17px] h-[17px] stroke-[1.7]" />
          </button>
        </div>
      </nav>

      {/* 2. CENTER FULL-HEIGHT INTERACTIVE WORKSPACE (Map Canvas OR Deep-Dive Analytical Module) */}
      <main className="flex-1 h-full min-w-0 relative overflow-hidden bg-[#E3E1DC]">
        {activePage === 'cockpit' ? (
          <SituationRoomMap
            onNavigateModule={(page) => setActivePage(page)}
            onSelectRegion={handleSelectRegion}
            selectedRegionId={selectedRegionId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showOverlays={showMapOverlays}
            onToggleOverlays={() => setShowMapOverlays((v) => !v)}
            activeMapLayer={activeMapLayer}
            onChangeMapLayer={setActiveMapLayer}
          />
        ) : (
          /* Full-Screen Scrollable Deep-Dive View in the same Warm-Stone & Terracotta aesthetic */
          <div className="w-full h-full overflow-y-auto p-5 space-y-4" dir="rtl">
            {/* Sticky Deep-Dive Main Navigation Bar */}
            <header className="sticky top-0 z-20 bg-[#FAF9F5]/95 backdrop-blur-md rounded-xl px-4 py-3 border border-stone-300/90 shadow-sm space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActivePage('cockpit')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B83E16] hover:bg-[#9E3310] text-white text-xs font-bold transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>بازگشت به نقشه تمام‌صفحه (Oil Situation Room)</span>
                  </button>
                  <span className="text-stone-300">|</span>
                  <span className="text-sm font-extrabold text-[#1E1D1B]">
                    میز کار تخصصی اتاق وضعیت نفت
                  </span>
                </div>

                {/* Top-Right Real-Time Price Ticker (WTI, Brent, Dubai) */}
                <RealtimePriceTicker
                  compact
                  onSelectBenchmark={() => setActivePage('osp_crack_margins')}
                />
              </div>

              {/* Module Quick Switcher Tabs */}
              <div className="flex flex-wrap items-center gap-1 bg-stone-200/70 p-1 rounded-lg text-xs">
                {(
                  [
                    { id: 'eia_stocks', label: 'موجودی EIA' },
                    { id: 'shock_decomposition', label: 'تجزیه شوک‌ها' },
                    { id: 'forecast_scenario', label: 'پیش‌بینی و سناریو' },
                    { id: 'balance_opec', label: 'تراز و اوپک+' },
                    { id: 'osp_crack_margins', label: 'منحنی آتی، OSP و کرک' },
                    { id: 'cot_macro_sentiment', label: 'COT و کلان مالی' },
                    { id: 'geopolitics', label: 'ریسک و گلوگاه‌ها' },
                    { id: 'reports_briefs', label: 'بریف‌های فارسی' },
                    { id: 'data_governance', label: '۲۵۶ منبع داده' },
                    { id: 'classic_cockpits', label: '۵ نمای کلاسیک' },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActivePage(t.id)}
                    className={`px-2.5 py-1 rounded-md font-bold transition-colors whitespace-nowrap ${
                      activePage === t.id
                        ? 'bg-[#1E1D1B] text-white'
                        : 'text-stone-700 hover:text-stone-950'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </header>

            {/* Active Deep-Dive Content */}
            {activePage === 'eia_stocks' && <EiaStocksDeepPage />}
            {activePage === 'shock_decomposition' && <ShockDecompositionDeepPage />}
            {activePage === 'forecast_scenario' && <ForecastScenarioDeepPage />}
            {activePage === 'balance_opec' && <BalanceOpecDeepPage />}
            {activePage === 'osp_crack_margins' && <OspCrackMarginsDeepPage />}
            {activePage === 'cot_macro_sentiment' && <CotMacroSentimentDeepPage />}
            {activePage === 'geopolitics' && <GeopoliticsChokepointsDeepPage />}
            {activePage === 'reports_briefs' && <ReportsBriefsDeepPage />}
            {activePage === 'data_governance' && <DataGovernanceDeepPage />}

            {/* Classic 5 Cockpit Screenshots Switcher (preserved for complete access) */}
            {activePage === 'classic_cockpits' && (
              <div className="space-y-4">
                <div className="bg-[#22211F] text-white rounded-xl px-4 py-3 border border-stone-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-200">
                    <Layers className="w-4 h-4 text-[#E68A56]" />
                    <span>آرشیو ۵ چیدمان کاکپیت کلاسیک:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(
                      [
                        { id: 1, label: 'نمای ۱: OilSense' },
                        { id: 2, label: 'نمای ۲: ASANA' },
                        { id: 3, label: 'نمای ۳: KRD' },
                        { id: 4, label: 'نمای ۴: OilInsight' },
                        { id: 5, label: 'نمای ۵: اتاق وضعیت' },
                      ] as const
                    ).map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setCockpitVariant(v.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                          cockpitVariant === v.id
                            ? 'bg-[#B83E16] text-white'
                            : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                {cockpitVariant === 1 && (
                  <CockpitScreenshotView1
                    onNavigateModule={(p) => setActivePage(p)}
                    onOpenQuestionModal={setActiveQuestionId}
                  />
                )}
                {cockpitVariant === 2 && (
                  <CockpitScreenshotView2
                    onNavigateModule={(p) => setActivePage(p)}
                    onOpenQuestionModal={setActiveQuestionId}
                  />
                )}
                {cockpitVariant === 3 && (
                  <CockpitScreenshotView3
                    onNavigateModule={(p) => setActivePage(p)}
                    onOpenQuestionModal={setActiveQuestionId}
                  />
                )}
                {cockpitVariant === 4 && (
                  <CockpitScreenshotView4
                    onNavigateModule={(p) => setActivePage(p)}
                    onOpenQuestionModal={setActiveQuestionId}
                  />
                )}
                {cockpitVariant === 5 && (
                  <CockpitScreenshotView5
                    onNavigateModule={(p) => setActivePage(p)}
                    onOpenQuestionModal={setActiveQuestionId}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* 3. RIGHT-HAND FULL-HEIGHT EXECUTIVE COLUMN (اتاق وضعیت نفت · خلاصه مدیریتی · پیش‌بینی و بازه احتمال) */}
      <SituationRoomRightPanel
        onNavigateModule={(page) => setActivePage(page)}
        onOpenQuestionModal={setActiveQuestionId}
      />

      {/* MODAL 1: Early-Warning Alerts Center */}
      {showAlertsModal && (
        <div
          dir="rtl"
          role="dialog"
          aria-modal="true"
          aria-label="مرکز هشدارهای زودهنگام بازار نفت"
          className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-[#FAF9F5] rounded-2xl max-w-2xl w-full p-6 border border-stone-300 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h2 className="text-lg font-extrabold text-[#1E1D1B]">
                  موتور هشدار زودهنگام اتاق وضعیت نفت (چه شد · چرا مهم است · منبع)
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  هشدارهای مبتنی بر منابع سطح ۳ فقط پس از تأیید یک منبع مستقل دیگر منتشر می‌شوند
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAlertsModal(false)}
                aria-label="بستن پنجره هشدارها"
                className="p-2 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {alerts.map((al) => (
                <div
                  key={al.id}
                  className={`p-4 rounded-xl border ${
                    al.acknowledged
                      ? 'bg-stone-100 border-stone-200 opacity-75'
                      : 'bg-white border-stone-300'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="text-sm font-extrabold text-[#1E1D1B]">
                      <span
                        className={`ml-2 font-mono-num text-xs font-extrabold ${
                          al.priority === 'P0'
                            ? 'text-[#B83E16]'
                            : al.priority === 'P1'
                            ? 'text-[#D96B27]'
                            : 'text-[#2D8A4E]'
                        }`}
                      >
                        [{al.priority}]
                      </span>
                      {al.titleFa}
                    </div>
                    <span className="text-[11px] text-stone-500">
                      {al.categoryFa} · {al.timeAgoFa}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-stone-700 leading-relaxed">
                    <div>
                      <strong className="text-stone-900">چه اتفاقی افتاد:</strong> {al.whatHappenedFa}
                    </div>
                    <div>
                      <strong className="text-stone-900">چرا برای تصمیم‌گیر مهم است:</strong>{' '}
                      {al.whyItMattersFa}
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                      <span>منبع قابل ردیابی: {al.sourceFa}</span>
                      {!al.acknowledged ? (
                        <button
                          type="button"
                          onClick={() => handleAcknowledgeAlert(al.id)}
                          className="px-3 py-1 rounded-md bg-[#B83E16] text-white font-bold hover:bg-[#9E3310] transition-colors"
                        >
                          ثبت رؤیت مدیر
                        </button>
                      ) : (
                        <span className="text-[#2D8A4E] font-bold">✓ رؤیت شد</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Executive Questions Deep-Dive Modal */}
      {selectedQuestion && (
        <div
          dir="rtl"
          role="dialog"
          aria-modal="true"
          aria-label={selectedQuestion.questionFa}
          className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-[#22211F] text-white rounded-2xl max-w-xl w-full p-6 border border-stone-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-xs font-bold text-[#E68A56]">
                  پاسخ‌های کلیدی اتاق وضعیت نفت · {selectedQuestion.badgeFa}
                </span>
                <h2 className="text-lg font-extrabold text-white mt-1">
                  {selectedQuestion.questionFa}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveQuestionId(null)}
                aria-label="بستن جزئیات پرسش"
                className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3.5 rounded-xl bg-[#B83E16]/25 border border-[#B83E16]/50">
                <div className="font-bold text-[#F2DA63] mb-1">پاسخ در ۵ ثانیه:</div>
                <p className="text-stone-100 text-sm">{selectedQuestion.shortAnswerFa}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800">
                <div className="font-bold text-stone-300 mb-1">
                  پاسخ تحلیلی در ۳۰ ثانیه (مبتنی بر خروجی Skill):
                </div>
                <p className="text-stone-300">{selectedQuestion.detailedAnswerFa}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2">
                <span>موتور تولیدکننده: {selectedQuestion.skillSource}</span>
                <button
                  type="button"
                  onClick={() => {
                    const target: DeepPageId =
                      selectedQuestion.id === 'where'
                        ? 'eia_stocks'
                        : selectedQuestion.id === 'why'
                        ? 'shock_decomposition'
                        : selectedQuestion.id === 'where_to'
                        ? 'forecast_scenario'
                        : 'balance_opec';
                    setActiveQuestionId(null);
                    setActivePage(target);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#B83E16] text-white font-bold hover:bg-[#9E3310]"
                >
                  باز کردن ماژول تخصصی ←
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Reference Design & Classic Layouts Gallery */}
      {showReferenceModal && (
        <div
          dir="rtl"
          role="dialog"
          aria-modal="true"
          aria-label="گالری طرح مرجع اتاق وضعیت نفت"
          className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-[#FAF9F5] rounded-2xl max-w-4xl w-full p-6 border border-stone-300 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h2 className="text-lg font-extrabold text-[#1E1D1B]">
                  طرح مرجع تمام‌صفحه «اتاق وضعیت نفت (Oil Situation Room)» و آرشیو نماها
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  امکان جابه‌جایی سریع بین نمای جدید تمام‌صفحه نقشه و ۵ نمای کاکپیت قبلی
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowReferenceModal(false)}
                aria-label="بستن گالری"
                className="p-2 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl border-2 border-[#B83E16] bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-[#1E1D1B]">
                  نمای اصلی فعلی: Oil Situation Room — اتاق وضعیت نفت (تمام‌صفحه)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActivePage('cockpit');
                    setShowMapOverlays(true);
                    setShowReferenceModal(false);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#B83E16] text-white text-xs font-bold hover:bg-[#9E3310]"
                >
                  فعال‌سازی نمای تمام‌صفحه اتاق وضعیت نفت
                </button>
              </div>
              <img
                src="/assets/aistudio/Gemini_Generated_Image_y2zzxay2zzxay2zz_d6319fae.jpg"
                alt="Oil Situation Room Reference"
                referrerPolicy="no-referrer"
                className="w-full h-64 object-cover rounded-lg border border-stone-200"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-stone-700">
                دسترسی به ۵ چیدمان اسکرین‌شات قبلی:
              </span>
              <button
                type="button"
                onClick={() => {
                  setActivePage('classic_cockpits');
                  setShowReferenceModal(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#1E1D1B] text-white text-xs font-bold hover:bg-stone-800"
              >
                مشاهده ۵ چیدمان کلاسیک ←
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
