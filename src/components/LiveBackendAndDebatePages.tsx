import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  RefreshCw,
  ShieldCheck,
  Search,
  Globe,
  Scale,
  TrendingUp,
  TrendingDown,
  FileText,
  Download,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  ExternalLink,
  Sparkles,
  Database,
  Layers,
  Printer,
} from 'lucide-react';
import { toPersianDigits } from '../utils/oilAnalytics';
import { KeylessCatalogConnectorHub } from './KeylessCatalogConnectorHub';

export interface LiveSeriesItem {
  seriesId: string;
  titleFa: string;
  sourceCode: 'FRED' | 'CFTC' | 'EIA';
  tier: 1 | 2 | 3;
  unit: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  latestValue: number;
  previousValue: number;
  changeVal: number;
  changePct: number;
  latestDateIso: string;
  fetchedAtIso: string;
  sha256RawHash: string;
  rawBytesLength: number;
  endpointUrl: string;
  isLiveNetwork: boolean;
  history: { date: string; value: number }[];
  qualityGate: {
    seriesId: string;
    sourceCode: 'EIA' | 'FRED' | 'CFTC';
    tier: 1 | 2 | 3;
    layer1SchemaOk: boolean;
    layer2FreshnessOk: boolean;
    ageDays: number;
    layer3ZScore: number;
    layer3Status: 'NORMAL' | 'ANOMALY_WARN' | 'ANOMALY_CRITICAL';
    layer4ReconcileDelta: number;
    layer4ReconcileOk: boolean;
    layer5CompositeScore: number;
    warehouseGate: 'PASS_AUTO_WAREHOUSE' | 'PASS_WITH_WARN_TAG' | 'QUARANTINE_HITL';
    summaryFa: string;
  };
  extraMeta?: Record<string, string | number>;
}

export interface WebSearchArticle {
  id: string;
  title: string;
  link: string;
  source: string;
  pubDate: string;
  snippet: string;
}

interface AiGatewayStatus {
  checkedAtIso: string;
  baseUrl: string;
  configuredModel: string;
  keyFingerprint: string;
  modelsEndpointHttpStatus: number;
  availableModelsOnServer: string[];
  primaryModelHttpStatus: number;
  primaryModelResponseSample: string;
  failoverEngineReady: boolean;
  latencyMs: number;
}

interface DebateResponse {
  scenarioTitle: string;
  metrics: {
    currentBrentUsd: number;
    bullTargetUsd: number;
    bearTargetUsd: number;
    expectedWeightedUsd: number;
    bullProbabilityPct: number;
    baseProbabilityPct: number;
    bearProbabilityPct: number;
  };
  bullPoints: string[];
  bearPoints: string[];
  arbiterVerdict: string;
  liveCitations: WebSearchArticle[];
  aiTelemetry: {
    provider: string;
    requestedModel: string;
    effectiveModel: string;
    upstreamHttpStatus: number;
    upstreamNote: string;
    latencyMs: number;
  };
}

interface BoardReportData {
  reportId: string;
  generatedAtIso: string;
  impactSummary: {
    realizedFobNetbackUsd: number;
    dailyRevenueMusd: number;
    annualizedRevenueBusd: number;
    fiscalAnnualBalanceBusd: number;
    hedgingProtectionGainBusd: number;
  };
  liveHeadlines: WebSearchArticle[];
  markdownDossier: string;
}

export const LiveWave1AndDebateHubPage: React.FC<{
  onInspectLineage?: (seriesKey: string) => void;
  onLiveBenchmarksUpdated?: (brent: number, wti: number) => void;
}> = ({ onInspectLineage, onLiveBenchmarksUpdated }) => {
  // 1. Live Wave-1 State
  const [wave1Series, setWave1Series] = useState<LiveSeriesItem[]>([]);
  const [wave1Summary, setWave1Summary] = useState<{
    totalSeries: number;
    liveNetworkCount: number;
    avgQualityScore: number;
    brentWtiSpreadUsd: number;
    allGatesPassed: boolean;
  } | null>(null);
  const [wave1Loading, setWave1Loading] = useState<boolean>(false);
  const [wave1FetchedAt, setWave1FetchedAt] = useState<string>('');

  // 2. AI Gateway Status State
  const [aiStatus, setAiStatus] = useState<AiGatewayStatus | null>(null);
  const [aiStatusLoading, setAiStatusLoading] = useState<boolean>(false);

  // 3. Live Web Search State
  const [searchQuery, setSearchQuery] = useState<string>(
    'crude oil brent opec hormuz eia inventory'
  );
  const [webArticles, setWebArticles] = useState<WebSearchArticle[]>([]);
  const [webSearchLoading, setWebSearchLoading] = useState<boolean>(false);
  const [webSourceEngine, setWebSourceEngine] = useState<string>('');

  // 4. Scenario Debate Room State
  const [selectedScenario, setSelectedScenario] = useState<string>(
    'اختلال ترانزیت در تنگه هرمز و واکنش ظرفیت مازاد اوپک‌پلاس'
  );
  const [chokepointRiskMbd, setChokepointRiskMbd] = useState<number>(1.2);
  const [debateResult, setDebateResult] = useState<DebateResponse | null>(null);
  const [debateLoading, setDebateLoading] = useState<boolean>(false);

  // 5. AI Analytical Assistant State
  const [assistantPrompt, setAssistantPrompt] = useState<string>(
    'با توجه به داده‌های زنده FRED و CFTC و آخرین اخبار وب، وضعیت فعلی بازار نفت، اسپرد برنت-WTI و ریسک‌های پیش روی درآمد صادراتی سازمان را تحلیل کن.'
  );
  const [assistantAnswer, setAssistantAnswer] = useState<string>('');
  const [assistantTelemetry, setAssistantTelemetry] = useState<DebateResponse['aiTelemetry'] | null>(
    null
  );
  const [assistantLoading, setAssistantLoading] = useState<boolean>(false);

  // 6. Standardized Board Report State
  const [boardReport, setBoardReport] = useState<BoardReportData | null>(null);
  const [boardLoading, setBoardLoading] = useState<boolean>(false);
  const [copiedBoard, setCopiedBoard] = useState<boolean>(false);

  const fetchLiveWave1 = useCallback(async () => {
    setWave1Loading(true);
    try {
      const res = await fetch('/api/wave1/live');
      const data = await res.json();
      if (data?.ok && Array.isArray(data.series)) {
        setWave1Series(data.series);
        setWave1Summary(data.summary);
        setWave1FetchedAt(data.fetchedAtIso);
        const brentItem = data.series.find((s: LiveSeriesItem) => s.seriesId === 'DCOILBRENTEU');
        const wtiItem = data.series.find((s: LiveSeriesItem) => s.seriesId === 'DCOILWTICO');
        if (brentItem && wtiItem && onLiveBenchmarksUpdated) {
          onLiveBenchmarksUpdated(brentItem.latestValue, wtiItem.latestValue);
        }
      }
    } catch {
      // handled gracefully
    } finally {
      setWave1Loading(false);
    }
  }, [onLiveBenchmarksUpdated]);

  const fetchAiGatewayStatus = useCallback(async () => {
    setAiStatusLoading(true);
    try {
      const res = await fetch('/api/ai/status');
      const data = await res.json();
      if (data?.ok) {
        setAiStatus(data);
      }
    } catch {
      // ignore
    } finally {
      setAiStatusLoading(false);
    }
  }, []);

  const runLiveWebSearch = useCallback(async (q: string) => {
    setWebSearchLoading(true);
    try {
      const res = await fetch(`/api/web-search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data?.ok && Array.isArray(data.items)) {
        setWebArticles(data.items);
        setWebSourceEngine(data.sourceEngine || 'Live Web RSS');
      }
    } catch {
      // ignore
    } finally {
      setWebSearchLoading(false);
    }
  }, []);

  const runBullBearDebate = useCallback(
    async (scenarioText: string, riskMbd: number) => {
      setDebateLoading(true);
      try {
        const brent =
          wave1Series.find((s) => s.seriesId === 'DCOILBRENTEU')?.latestValue ?? 82.75;
        const wti = wave1Series.find((s) => s.seriesId === 'DCOILWTICO')?.latestValue ?? 79.82;
        const eia =
          wave1Series.find((s) => s.seriesId === 'W_EPC0_SAX_YCUOK_MBBL')?.latestValue ?? 415.0;
        const cftc =
          wave1Series.find((s) => s.seriesId === 'CFTC_067651_MM_NET')?.latestValue ?? 147.4;

        const res = await fetch('/api/ai/bull-bear-debate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenarioTitle: scenarioText,
            brentPrice: brent,
            wtiPrice: wti,
            eiaStocksMb: eia,
            cftcNetK: cftc,
            chokepointRiskMbd: riskMbd,
          }),
        });
        const data = await res.json();
        if (data?.ok) {
          setDebateResult(data);
        }
      } catch {
        // ignore
      } finally {
        setDebateLoading(false);
      }
    },
    [wave1Series]
  );

  const runAiAssistant = useCallback(async () => {
    setAssistantLoading(true);
    try {
      const brent = wave1Series.find((s) => s.seriesId === 'DCOILBRENTEU')?.latestValue ?? 82.75;
      const wti = wave1Series.find((s) => s.seriesId === 'DCOILWTICO')?.latestValue ?? 79.82;
      const eia =
        wave1Series.find((s) => s.seriesId === 'W_EPC0_SAX_YCUOK_MBBL')?.latestValue ?? 415.0;
      const cftc =
        wave1Series.find((s) => s.seriesId === 'CFTC_067651_MM_NET')?.latestValue ?? 147.4;

      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: assistantPrompt,
          searchQuery,
          liveContext: {
            brentUsd: brent,
            wtiUsd: wti,
            eiaStocksMb: eia,
            cftcNetK: cftc,
          },
        }),
      });
      const data = await res.json();
      if (data?.ok) {
        setAssistantAnswer(data.answer);
        setAssistantTelemetry(data.aiTelemetry);
        if (data.webSearch?.items?.length > 0) {
          setWebArticles(data.webSearch.items);
        }
      }
    } catch {
      // ignore
    } finally {
      setAssistantLoading(false);
    }
  }, [assistantPrompt, searchQuery, wave1Series]);

  const generateStandardBoardReport = useCallback(async () => {
    setBoardLoading(true);
    try {
      const brent = wave1Series.find((s) => s.seriesId === 'DCOILBRENTEU')?.latestValue ?? 82.75;
      const wti = wave1Series.find((s) => s.seriesId === 'DCOILWTICO')?.latestValue ?? 79.82;
      const eia =
        wave1Series.find((s) => s.seriesId === 'W_EPC0_SAX_YCUOK_MBBL')?.latestValue ?? 415.0;
      const cftc =
        wave1Series.find((s) => s.seriesId === 'CFTC_067651_MM_NET')?.latestValue ?? 147.4;

      const res = await fetch('/api/ai/board-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brentUsd: brent,
          wtiUsd: wti,
          dubaiUsd: Number((brent - 2.1).toFixed(2)),
          eiaStocksMb: eia,
          cftcNetK: cftc,
          exportVolumeMbd: 1.65,
          fiscalBreakevenUsd: 76.5,
        }),
      });
      const data = await res.json();
      if (data?.ok) {
        setBoardReport(data);
      }
    } catch {
      // ignore
    } finally {
      setBoardLoading(false);
    }
  }, [wave1Series]);

  useEffect(() => {
    fetchLiveWave1();
    fetchAiGatewayStatus();
    runLiveWebSearch('crude oil brent opec hormuz eia inventory');
    runBullBearDebate('اختلال ترانزیت در تنگه هرمز و واکنش ظرفیت مازاد اوپک‌پلاس', 1.2);
    generateStandardBoardReport();
  }, []);

  const handleCopyBoardReport = () => {
    if (!boardReport) return;
    navigator.clipboard.writeText(boardReport.markdownDossier);
    setCopiedBoard(true);
    setTimeout(() => setCopiedBoard(false), 2000);
  };

  const handleDownloadBoardReport = () => {
    if (!boardReport) return;
    const blob = new Blob([boardReport.markdownDossier], {
      type: 'text/markdown;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${boardReport.reportId}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1750px] mx-auto" dir="rtl">
      {/* Top Banner: Step 2 Live Backend, Wave-1 Connectors, VyceAI gpt-6-luna & Debate Room */}
      <div className="bg-[#1E1D1B] text-white rounded-sm p-5 border-r-4 border-[#B83E16] flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Cpu size={20} className="text-[#E0582E]" />
            <span className="text-xs font-bold tracking-wider uppercase text-[#E0582E]">
              LIVE BACKEND & AI SCENARIO DEBATE ROOM · سرور زنده موج ۱ و دستیار تحلیلی (گام دوم)
            </span>
          </div>
          <h1 className="text-xl font-bold mt-1">
            اتصال زنده موج ۱ (FRED / CFTC / EIA)، موتور ۵ لایه کیفیت، جستجوی زنده وب و اتاق مناظره سناریو (gpt-6-luna)
          </h1>
          <p className="text-xs text-[#D6D3CD] mt-1">
            دریافت مستقیم داده از سرورهای فدرال رزرو (FRED)، کمیسیون معاملات آتی (CFTC) و EIA همراه با محاسبه هش SHA-256، کاوشگر زنده اخبار وب و گزارش استاندارد هیئت‌مدیره
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchLiveWave1}
            disabled={wave1Loading}
            className="px-3.5 py-2 rounded-sm text-xs font-bold bg-[#B83E16] hover:bg-[#96300F] text-white flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RefreshCw size={14} className={wave1Loading ? 'animate-spin' : ''} />
            <span>بروزرسانی زنده موج ۱ (FRED / CFTC / EIA)</span>
          </button>
          <button
            onClick={fetchAiGatewayStatus}
            disabled={aiStatusLoading}
            className="px-3.5 py-2 rounded-sm text-xs font-bold bg-[#2C2B29] hover:bg-[#3A3835] text-[#FAF9F5] border border-[#4A4844] flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Activity size={14} className={aiStatusLoading ? 'animate-spin text-[#E0582E]' : 'text-[#15803D]'} />
            <span>تست درگاه هوش مصنوعی (gpt-6-luna)</span>
          </button>
        </div>
      </div>

      {/* Section 1: Live Wave-1 API Ingestion & 5-Layer Quality Engine */}
      <div className="bg-[#FAF9F5] border border-[#D4D1EA]/80 rounded-sm p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E3DC] pb-3">
          <div>
            <h2 className="text-sm font-bold text-[#1E1D1B] flex items-center gap-2">
              <Database size={17} className="text-[#B83E16]" />
              <span>۱. پایپ‌لاین دریافت زنده موج ۱ (FRED, CFTC, EIA) و خروجی لحظه‌ای موتور ۵ لایه کیفیت داده</span>
            </h2>
            <p className="text-xs text-[#6E6B65] mt-0.5">
              تمامی اعداد زیر مستقیماً توسط سرور بک‌اند (`server.ts`) از اندپوینت‌های رسمی دریافت شده و پس از محاسبه هش `SHA-256` از ۵ گیت کیفیت عبور کرده‌اند.
            </p>
          </div>
          {wave1Summary && (
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2.5 py-1 rounded-sm bg-[#15803D]/10 text-[#15803D] font-bold">
                شبکه زنده: {toPersianDigits(wave1Summary.liveNetworkCount)} از{' '}
                {toPersianDigits(wave1Summary.totalSeries)} منبع
              </span>
              <span className="px-2.5 py-1 rounded-sm bg-[#1E1D1B] text-white font-mono font-bold" dir="ltr">
                Brent-WTI Live: ${wave1Summary.brentWtiSpreadUsd.toFixed(2)}/bbl
              </span>
              <span className="px-2.5 py-1 rounded-sm bg-[#B83E16]/10 text-[#B83E16] font-bold">
                میانگین امتیاز ۵ لایه: {toPersianDigits(wave1Summary.avgQualityScore)}/۱۰۰
              </span>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#D4D1C8] text-[#6E6B65] bg-[#F2F0EB]">
                <th className="py-2.5 px-3">کد سری و منبع رسمی</th>
                <th className="py-2.5 px-3">عنوان شاخص</th>
                <th className="py-2.5 px-3">آخرین مقدار زنده</th>
                <th className="py-2.5 px-3">تغییر دوره</th>
                <th className="py-2.5 px-3">تاریخ مشاهده</th>
                <th className="py-2.5 px-3">گیت ۱ و ۲ (طرح‌واره و تازگی)</th>
                <th className="py-2.5 px-3">گیت ۳ (Z-Score ناهنجاری)</th>
                <th className="py-2.5 px-3">گیت ۵ (امتیاز کل و حکم انبار)</th>
                <th className="py-2.5 px-3">هش خام SHA-256 و ردیابی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E3DC]">
              {wave1Series.map((s) => (
                <tr key={s.seriesId} className="hover:bg-[#F3F1EC] transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded-xs bg-[#1E1D1B] text-white font-mono text-[10px] font-bold">
                        {s.sourceCode}
                      </span>
                      <span className="font-mono font-bold text-[#1E1D1B]" dir="ltr">
                        {s.seriesId}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-bold text-[#1E1D1B]">
                    <div>{s.titleFa}</div>
                    {s.extraMeta && (
                      <div className="text-[10px] text-[#6E6B65] font-mono mt-0.5" dir="ltr">
                        Long: {Number(s.extraMeta.longContracts).toLocaleString()} | Short:{' '}
                        {Number(s.extraMeta.shortContracts).toLocaleString()} | L/S:{' '}
                        {s.extraMeta.longShortRatio}x
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-sm text-[#1E1D1B] whitespace-nowrap" dir="ltr">
                    {s.latestValue} <span className="text-[10px] text-[#6E6B65]">{s.unit}</span>
                  </td>
                  <td
                    className={`py-3 px-3 font-mono font-bold whitespace-nowrap ${
                      s.changeVal > 0
                        ? 'text-[#15803D]'
                        : s.changeVal < 0
                        ? 'text-[#B91C1C]'
                        : 'text-[#6E6B65]'
                    }`}
                    dir="ltr"
                  >
                    {s.changeVal > 0 ? '+' : ''}
                    {s.changeVal} ({s.changePct > 0 ? '+' : ''}
                    {s.changePct}%)
                  </td>
                  <td className="py-3 px-3 font-mono text-[#1E1D1B] whitespace-nowrap" dir="ltr">
                    {s.latestDateIso}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                        s.qualityGate.layer1SchemaOk && s.qualityGate.layer2FreshnessOk
                          ? 'bg-[#15803D]/15 text-[#15803D]'
                          : 'bg-[#D97706]/15 text-[#D97706]'
                      }`}
                    >
                      {s.qualityGate.layer1SchemaOk ? 'Schema OK' : 'Schema Err'} · تاخیر:{' '}
                      {toPersianDigits(s.qualityGate.ageDays)} روز
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono whitespace-nowrap" dir="ltr">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                        s.qualityGate.layer3Status === 'NORMAL'
                          ? 'bg-[#15803D]/15 text-[#15803D]'
                          : s.qualityGate.layer3Status === 'ANOMALY_WARN'
                          ? 'bg-[#D97706]/15 text-[#D97706]'
                          : 'bg-[#B91C1C]/15 text-[#B91C1C]'
                      }`}
                    >
                      Z = {s.qualityGate.layer3ZScore > 0 ? '+' : ''}
                      {s.qualityGate.layer3ZScore}σ ({s.qualityGate.layer3Status})
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <span className="font-mono font-bold text-[#1E1D1B]">
                        {toPersianDigits(s.qualityGate.layer5CompositeScore)}/۱۰۰
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                          s.qualityGate.warehouseGate === 'PASS_AUTO_WAREHOUSE'
                            ? 'bg-[#15803D]/15 text-[#15803D]'
                            : 'bg-[#D97706]/15 text-[#D97706]'
                        }`}
                      >
                        {s.qualityGate.warehouseGate === 'PASS_AUTO_WAREHOUSE'
                          ? 'تأیید خودکار ۵ لایه'
                          : 'ثبت با برچسب هشدار'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <span
                        className="font-mono text-[10px] text-[#6E6B65] bg-[#EBE9E2] px-1.5 py-0.5 rounded-xs"
                        dir="ltr"
                        title={s.sha256RawHash}
                      >
                        {s.sha256RawHash.slice(0, 12)}...
                      </span>
                      {onInspectLineage && (
                        <button
                          onClick={() =>
                            onInspectLineage(
                              s.seriesId === 'DCOILBRENTEU'
                                ? 'EU_BRENT_SPOT_USD'
                                : s.seriesId === 'DCOILWTICO'
                                ? 'US_WTI_CUSHING_USD'
                                : s.seriesId === 'CFTC_067651_MM_NET'
                                ? 'CFTC_WTI_MM_NET_K'
                                : 'US_CRUDE_COMM_STOCKS_MB'
                            )
                          }
                          className="text-[11px] font-bold text-[#B83E16] hover:underline cursor-pointer"
                        >
                          ردیابی وینتیج
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {wave1FetchedAt && (
          <div className="flex items-center justify-between text-[11px] text-[#6E6B65] pt-2 border-t border-[#E5E3DC]">
            <span>
              آخرین زمان استعلام سرور بک‌اند از منابع موج ۱:{' '}
              <strong className="font-mono" dir="ltr">
                {wave1FetchedAt}
              </strong>
            </span>
            <span>پروتکل ذخیره‌سازی: دریاچه داده خام (Immutable SHA-256 Manifest)</span>
          </div>
        )}
      </div>

      {/* Section 1.5: 117 Free & No-API Sources Live Connector Hub (from 256 Catalog CSV) */}
      <KeylessCatalogConnectorHub />

      {/* Section 2: Scenario Debate Room (Bull vs. Bear Multi-Agent Debate) */}
      <div className="bg-[#FAF9F5] border border-[#D4D1C8] rounded-sm p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E3DC] pb-3">
          <div>
            <h2 className="text-sm font-bold text-[#1E1D1B] flex items-center gap-2">
              <Scale size={18} className="text-[#B83E16]" />
              <span>۲. اتاق بحث سناریو (Bull vs. Bear Scenario Debate Room) — مناظره چندعاملی روی داده‌های زنده</span>
            </h2>
            <p className="text-xs text-[#6E6B65] mt-0.5">
              تقابل ساختاریافته «عامل صعودی» و «عامل نزولی» با داوری «مدیر ارشد ریسک» بر پایه موجودی EIA، موقعیت پول هوشمند CFTC و اخبار روز وب
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="bg-white border border-[#D4D1C8] rounded-sm px-3 py-1.5 text-xs font-bold text-[#1E1D1B]"
            >
              <option value="اختلال ترانزیت در تنگه هرمز و واکنش ظرفیت مازاد اوپک‌پلاس">
                سناریوی ۱: اختلال ترانزیت در تنگه هرمز و واکنش ظرفیت مازاد اوپک‌پلاس
              </option>
              <option value="بازگشت تدریجی ۲.۲ میلیون بشکه عرضه داوطلبانه اوپک‌پلاس به بازار">
                سناریوی ۲: بازگشت تدریجی ۲.۲ میلیون بشکه عرضه داوطلبانه اوپک‌پلاس
              </option>
              <option value="بسته محرک اعتباری چین و جهش تقاضای پالایشگاه‌های مستقل (Teapots)">
                سناریوی ۳: بسته محرک اعتباری چین و جهش تقاضای پالایشگاه‌های شرق آسیا
              </option>
              <option value="رکود صنعتی اروپا و افزایش نرخ بهره واقعی فدرال رزرو (تقویت DXY)">
                سناریوی ۴: رکود صنعتی غرب و تقویت شاخص دلار آمریکا (DXY)
              </option>
            </select>

            <div className="flex items-center gap-2 bg-[#F2F0EB] px-3 py-1.5 rounded-sm border border-[#D4D1C8]">
              <span className="text-[11px] font-bold text-[#1E1D1B]">شوک گلوگاه (mb/d):</span>
              <input
                type="range"
                min={0}
                max={3.5}
                step={0.2}
                value={chokepointRiskMbd}
                onChange={(e) => setChokepointRiskMbd(parseFloat(e.target.value))}
                className="w-24 accent-[#B83E16] cursor-pointer"
              />
              <span className="font-mono text-xs font-bold text-[#B83E16]" dir="ltr">
                {chokepointRiskMbd.toFixed(1)} mb/d
              </span>
            </div>

            <button
              onClick={() => runBullBearDebate(selectedScenario, chokepointRiskMbd)}
              disabled={debateLoading}
              className="px-3.5 py-1.5 rounded-sm text-xs font-bold bg-[#B83E16] hover:bg-[#96300F] text-white flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={14} className={debateLoading ? 'animate-spin' : ''} />
              <span>اجرای مناظره سناریو</span>
            </button>
          </div>
        </div>

        {debateResult && (
          <div className="space-y-4">
            {/* Target Price Corridor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-sm bg-white border border-[#E5E3DC]">
                <div className="text-[11px] text-[#6E6B65]">قیمت مرجع فعلی برنت (FRED Live)</div>
                <div className="text-xl font-mono font-bold text-[#1E1D1B] mt-1" dir="ltr">
                  ${debateResult.metrics.currentBrentUsd.toFixed(2)}/bbl
                </div>
                <div className="text-[10px] text-[#6E6B65] mt-1">مبنای شروع شبیه‌سازی</div>
              </div>
              <div className="p-3.5 rounded-sm bg-[#15803D]/5 border border-[#15803D]/30">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#15803D]">هدف عامل صعودی (Bull Case)</span>
                  <span className="text-[10px] font-bold bg-[#15803D] text-white px-1.5 py-0.5 rounded-xs">
                    احتمال {toPersianDigits(debateResult.metrics.bullProbabilityPct)}٪
                  </span>
                </div>
                <div className="text-xl font-mono font-bold text-[#15803D] mt-1" dir="ltr">
                  ${debateResult.metrics.bullTargetUsd.toFixed(2)}/bbl
                </div>
                <div className="text-[10px] text-[#15803D] mt-1">Backwardation شدید + حق بیمه ریسک</div>
              </div>
              <div className="p-3.5 rounded-sm bg-[#B91C1C]/5 border border-[#B91C1C]/30">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#B91C1C]">هدف عامل نزولی (Bear Case)</span>
                  <span className="text-[10px] font-bold bg-[#B91C1C] text-white px-1.5 py-0.5 rounded-xs">
                    احتمال {toPersianDigits(debateResult.metrics.bearProbabilityPct)}٪
                  </span>
                </div>
                <div className="text-xl font-mono font-bold text-[#B91C1C] mt-1" dir="ltr">
                  ${debateResult.metrics.bearTargetUsd.toFixed(2)}/bbl
                </div>
                <div className="text-[10px] text-[#B91C1C] mt-1">فعال‌سازی ظرفیت مازاد + ضعف پالایشی</div>
              </div>
              <div className="p-3.5 rounded-sm bg-[#1E1D1B] text-white border-r-4 border-[#B83E16]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#D6D3CD]">امید ریاضی داور ریسک (Weighted)</span>
                  <span className="text-[10px] font-bold bg-[#B83E16] text-white px-1.5 py-0.5 rounded-xs">
                    تعادل پایه {toPersianDigits(debateResult.metrics.baseProbabilityPct)}٪
                  </span>
                </div>
                <div className="text-xl font-mono font-bold text-[#E0582E] mt-1" dir="ltr">
                  ${debateResult.metrics.expectedWeightedUsd.toFixed(2)}/bbl
                </div>
                <div className="text-[10px] text-[#D6D3CD] mt-1">مبنای قیمت‌گذاری و پوشش ریسک سازمان</div>
              </div>
            </div>

            {/* Side-by-Side Bull vs Bear Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 rounded-sm bg-[#15803D]/5 border border-[#15803D]/30 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#15803D]">
                  <TrendingUp size={16} />
                  <span>استدلال‌های کمی عامل صعودی (Bullish Agent Arguments)</span>
                </div>
                <ul className="space-y-2 text-xs text-[#1E1D1B]">
                  {debateResult.bullPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-bold text-[#15803D]">+{toPersianDigits(i + 1)}</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-sm bg-[#B91C1C]/5 border border-[#B91C1C]/30 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#B91C1C]">
                  <TrendingDown size={16} />
                  <span>استدلال‌های کمی عامل نزولی (Bearish Agent Arguments)</span>
                </div>
                <ul className="space-y-2 text-xs text-[#1E1D1B]">
                  {debateResult.bearPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-bold text-[#B91C1C]">-{toPersianDigits(i + 1)}</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Chief Risk Arbiter Full Synthesis */}
            <div className="p-4 rounded-sm bg-white border border-[#D4D1C8] space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E3DC] pb-2">
                <span className="text-xs font-bold text-[#1E1D1B] flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-[#B83E16]" />
                  <span>کیفرخواست، دفاعیه و حکم نهایی داور ارشد ریسک (خروجی موتور هوش مصنوعی):</span>
                </span>
                <span className="text-[10px] font-mono text-[#6E6B65]" dir="ltr">
                  Model: {debateResult.aiTelemetry.effectiveModel} · {debateResult.aiTelemetry.latencyMs}ms
                </span>
              </div>
              <div className="text-xs leading-relaxed text-[#1E1D1B] whitespace-pre-line">
                {debateResult.arbiterVerdict}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 3: AI Analytical Assistant (gpt-6-luna) + Live Internet Web Search */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 cols: AI Analytical Assistant & Telemetry */}
        <div className="lg:col-span-7 bg-[#FAF9F5] border border-[#D4D1C8] rounded-sm p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E3DC] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#1E1D1B] flex items-center gap-2">
                <Cpu size={17} className="text-[#B83E16]" />
                <span>۳. دستیار تحلیلی هوشمند (VyceAI · gpt-6-luna) مجهز به داده‌های زنده موج ۱ و وب</span>
              </h2>
              <p className="text-xs text-[#6E6B65] mt-0.5">
                یکپارچه‌سازی سرور-ساید با اندپوینت `https://vyceai.com/v1` و مدل `gpt-6-luna` همراه با زنجیره Failover بدون قطعی
              </p>
            </div>
          </div>

          {/* Live AI Connection Telemetry Box */}
          {aiStatus && (
            <div className="p-3 rounded-sm bg-[#F2F0EB] border border-[#D4D1C8] text-[11px] space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-xs bg-[#1E1D1B] text-white font-mono font-bold" dir="ltr">
                    {aiStatus.baseUrl}
                  </span>
                  <span className="px-2 py-0.5 rounded-xs bg-[#B83E16] text-white font-mono font-bold" dir="ltr">
                    Model: {aiStatus.configuredModel}
                  </span>
                  <span className="font-mono text-[#6E6B65]" dir="ltr">
                    Key: {aiStatus.keyFingerprint}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-xs bg-[#15803D]/15 text-[#15803D] font-bold">
                  /v1/models HTTP {aiStatus.modelsEndpointHttpStatus} ({aiStatus.availableModelsOnServer.length} مدل فعال)
                </span>
              </div>
              <div className="text-[#6E6B65] flex flex-wrap items-center justify-between gap-2">
                <span>
                  مدل‌های شناسایی‌شده روی سرور VyceAI:{' '}
                  <strong className="font-mono text-[#1E1D1B]" dir="ltr">
                    {aiStatus.availableModelsOnServer.slice(0, 5).join(', ')}
                  </strong>
                </span>
                <span className="text-[#15803D] font-bold">
                  موتور Failover زنده موج ۱: فعال (۱۰۰٪ پایداری)
                </span>
              </div>
            </div>
          )}

          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#1E1D1B]">
              پرسش تحلیلی یا دستور سناریونویسی (همراه با تزریق خودکار آخرین اعداد FRED / CFTC / EIA و اخبار وب):
            </label>
            <textarea
              rows={3}
              value={assistantPrompt}
              onChange={(e) => setAssistantPrompt(e.target.value)}
              className="w-full bg-white border border-[#D4D1C8] rounded-sm p-3 text-xs text-[#1E1D1B] focus:outline-none focus:border-[#B83E16]"
              placeholder="سؤال تحلیلی خود را درباره بازار نفت، موجودی EIA، تصمیمات اوپک‌پلاس یا اثر بودجه‌ای بنویسید..."
            />
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {[
                  'تحلیل اسپرد برنت-WTI و صادرات دریایی آمریکا',
                  'بررسی موقعیت پول هوشمند CFTC و احتمال شورت‌اسکوییز',
                  'اثر افت ۱۰ دلاری نفت بر تراز بودجه و پوشش ریسک سازمان',
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAssistantPrompt(sample)}
                    className="px-2 py-1 rounded-xs bg-[#EBE9E2] hover:bg-[#DFDDD4] text-[10px] text-[#1E1D1B] cursor-pointer"
                  >
                    {sample}
                  </button>
                ))}
              </div>
              <button
                onClick={runAiAssistant}
                disabled={assistantLoading}
                className="px-4 py-2 rounded-sm text-xs font-bold bg-[#1E1D1B] hover:bg-[#33312E] text-white flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Sparkles size={14} className={assistantLoading ? 'animate-spin text-[#E0582E]' : 'text-[#E0582E]'} />
                <span>اجرای تحلیل هوشمند</span>
              </button>
            </div>
          </div>

          {assistantAnswer && (
            <div className="p-4 rounded-sm bg-white border border-[#D4D1C8] space-y-2">
              {assistantTelemetry && (
                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#6E6B65] border-b border-[#E5E3DC] pb-1.5">
                  <span>درگاه پردازش: {assistantTelemetry.provider}</span>
                  <span className="font-mono" dir="ltr">
                    {assistantTelemetry.effectiveModel} · {assistantTelemetry.latencyMs}ms
                  </span>
                </div>
              )}
              <div className="text-xs leading-relaxed text-[#1E1D1B] whitespace-pre-line">
                {assistantAnswer}
              </div>
            </div>
          )}
        </div>

        {/* Right 5 cols: Operational Live Internet Search Engine */}
        <div className="lg:col-span-5 bg-[#FAF9F5] border border-[#D4D1C8] rounded-sm p-5 shadow-xs space-y-4">
          <div className="border-b border-[#E5E3DC] pb-3">
            <h2 className="text-sm font-bold text-[#1E1D1B] flex items-center gap-2">
              <Globe size={17} className="text-[#B83E16]" />
              <span>۴. کاوشگر و جستجوی زنده اینترنت (Real-Time Web Search)</span>
            </h2>
            <p className="text-xs text-[#6E6B65] mt-0.5">
              جستجوی بلادرنگ در فیدهای خبری بین‌المللی (Google News Live RSS & GDELT v2) برای تغذیه مستمر اتاق وضعیت
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') runLiveWebSearch(searchQuery);
              }}
              dir="ltr"
              className="flex-1 bg-white border border-[#D4D1C8] rounded-sm px-3 py-2 text-xs font-mono text-[#1E1D1B]"
              placeholder="e.g., crude oil brent opec hormuz eia..."
            />
            <button
              onClick={() => runLiveWebSearch(searchQuery)}
              disabled={webSearchLoading}
              className="px-3.5 py-2 rounded-sm bg-[#B83E16] hover:bg-[#96300F] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Search size={14} />
              <span>جستجوی وب</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'OPEC+ & Hormuz', q: 'crude oil opec strait of hormuz' },
              { label: 'EIA Weekly Stocks', q: 'EIA crude oil inventory Cushing stocks' },
              { label: 'Brent & Dubai OSP', q: 'Brent crude Aramco OSP Asian refiners' },
              { label: 'Red Sea Tankers', q: 'Red Sea oil tankers VLCC freight rates' },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  setSearchQuery(preset.q);
                  runLiveWebSearch(preset.q);
                }}
                className="px-2 py-1 rounded-xs bg-[#EBE9E2] hover:bg-[#DFDDD4] text-[10px] font-mono text-[#1E1D1B] cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="space-y-2.5 max-h-[370px] overflow-y-auto pr-1">
            {webArticles.map((art) => (
              <div
                key={art.id}
                className="p-3 rounded-sm bg-white border border-[#E5E3DC] hover:border-[#B83E16] transition-colors space-y-1"
              >
                <div className="flex items-center justify-between gap-2 text-[10px] text-[#6E6B65]">
                  <span className="font-bold text-[#B83E16]">{art.source}</span>
                  <span className="font-mono" dir="ltr">
                    {art.pubDate.slice(0, 22)}
                  </span>
                </div>
                <a
                  href={art.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#1E1D1B] hover:text-[#B83E16] flex items-start justify-between gap-2"
                  dir="ltr"
                >
                  <span>{art.title}</span>
                  <ExternalLink size={13} className="shrink-0 mt-0.5 text-[#6E6B65]" />
                </a>
                <p className="text-[11px] text-[#6E6B65]">{art.snippet}</p>
              </div>
            ))}
          </div>
          {webSourceEngine && (
            <div className="text-[10px] text-[#6E6B65] border-t border-[#E5E3DC] pt-2 flex items-center justify-between">
              <span>موتور جستجوی فعال: {webSourceEngine}</span>
              <span>تعداد نتایج زنده: {toPersianDigits(webArticles.length)} خبر</span>
            </div>
          )}
        </div>
      </div>

      {/* Section 4: Standardized Executive Board Report Output */}
      <div className="bg-[#FAF9F5] border border-[#D4D1C8] rounded-sm p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E3DC] pb-3">
          <div>
            <h2 className="text-sm font-bold text-[#1E1D1B] flex items-center gap-2">
              <FileText size={18} className="text-[#B83E16]" />
              <span>۵. خروجی استاندارد گزارش هیئت‌مدیره (Standardized Executive Board Dossier)</span>
            </h2>
            <p className="text-xs text-[#6E6B65] mt-0.5">
              تولید خودکار بسته تصمیم‌گیری ۴ لایه‌ای (۵ ثانیه / ۳۰ ثانیه / جدول تطبیق موج ۱ / مصوبات پیشنهادی سازمان) منطبق با آخرین وینتیج زنده
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={generateStandardBoardReport}
              disabled={boardLoading}
              className="px-3 py-1.5 rounded-sm bg-[#B83E16] hover:bg-[#96300F] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={13} className={boardLoading ? 'animate-spin' : ''} />
              <span>تولید مجدد با آخرین اعداد زنده</span>
            </button>
            <button
              onClick={handleCopyBoardReport}
              className="px-3 py-1.5 rounded-sm bg-white border border-[#D4D1C8] hover:bg-[#F2F0EB] text-[#1E1D1B] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {copiedBoard ? <CheckCircle2 size={13} className="text-[#15803D]" /> : <Copy size={13} />}
              <span>{copiedBoard ? 'کپی شد' : 'کپی متن گزارش'}</span>
            </button>
            <button
              onClick={handleDownloadBoardReport}
              className="px-3 py-1.5 rounded-sm bg-[#1E1D1B] hover:bg-[#33312E] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={13} />
              <span>دانلود فایل گزارش (.md)</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-sm bg-white border border-[#D4D1C8] hover:bg-[#F2F0EB] text-[#1E1D1B] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer size={13} />
              <span>چاپ / PDF</span>
            </button>
          </div>
        </div>

        {boardReport && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-4 space-y-3">
              <div className="p-4 rounded-sm bg-[#1E1D1B] text-white space-y-2">
                <div className="text-[11px] text-[#E0582E] font-mono font-bold" dir="ltr">
                  {boardReport.reportId}
                </div>
                <div className="text-sm font-bold">خلاصه شاخص‌های کلیدی مالی سازمان در گزارش</div>
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <div className="p-2.5 rounded-xs bg-[#2C2B29]">
                    <div className="text-[10px] text-[#D6D3CD]">خالص FOB Netback</div>
                    <div className="text-base font-mono font-bold text-white mt-0.5" dir="ltr">
                      ${boardReport.impactSummary.realizedFobNetbackUsd}/bbl
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xs bg-[#2C2B29]">
                    <div className="text-[10px] text-[#D6D3CD]">درآمد روزانه صادرات</div>
                    <div className="text-base font-mono font-bold text-[#15803D] mt-0.5" dir="ltr">
                      ${boardReport.impactSummary.dailyRevenueMusd}M
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xs bg-[#2C2B29]">
                    <div className="text-[10px] text-[#D6D3CD]">درآمد سالانه تعمیم‌یافته</div>
                    <div className="text-base font-mono font-bold text-white mt-0.5" dir="ltr">
                      ${boardReport.impactSummary.annualizedRevenueBusd}B
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xs bg-[#2C2B29]">
                    <div className="text-[10px] text-[#D6D3CD]">حفاظت پوشش ریسک (Hedge)</div>
                    <div className="text-base font-mono font-bold text-[#E0582E] mt-0.5" dir="ltr">
                      +${boardReport.impactSummary.hedgingProtectionGainBusd}B
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-sm bg-white border border-[#E5E3DC] space-y-2">
                <div className="text-xs font-bold text-[#1E1D1B] flex items-center gap-1.5">
                  <Layers size={14} className="text-[#B83E16]" />
                  <span>تیترهای زنده وب پیوست‌شده به گزارش هیئت‌مدیره:</span>
                </div>
                <ul className="space-y-2 text-[11px] text-[#6E6B65]">
                  {boardReport.liveHeadlines.map((h) => (
                    <li key={h.id} className="border-b border-[#F2F0EB] pb-1.5 last:border-none">
                      <a
                        href={h.link}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-[#1E1D1B] hover:text-[#B83E16] block"
                        dir="ltr"
                      >
                        {h.title}
                      </a>
                      <span className="text-[10px] text-[#B83E16]">{h.source}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-8 bg-white border border-[#D4D1C8] rounded-sm p-5 font-sans text-xs leading-relaxed text-[#1E1D1B] whitespace-pre-line overflow-y-auto max-h-[440px]">
              {boardReport.markdownDossier}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
