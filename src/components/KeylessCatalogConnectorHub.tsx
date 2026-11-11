import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Database,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Search,
  Filter,
  Activity,
  Radio,
  Rss,
  Globe,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { toPersianDigits } from '../utils/oilAnalytics';

export interface EnrichedCatalogSource {
  rowNumber: number;
  categoryFa: string;
  subcategoryFa: string;
  sourceName: string;
  publisherOrNoteFa: string;
  websiteUrl: string;
  dataDescriptionFa: string;
  frequencyFa: string;
  accessDetailsFa: string;
  accessTypeFa: string;
  hasApiFa: string;
  credibilityTier: 1 | 2 | 3;
  verificationStatusFa: string;
  isFreeAndNoApi: boolean;
  isFreeAny: boolean;
  isConnectedKeyless: boolean;
  connectionMethodFa: string;
}

interface KeylessNumericStream {
  rowNumber: number;
  code: string;
  sourceName: string;
  titleFa: string;
  categoryFa: string;
  protocol: string;
  unit: string;
  latestValue: number;
  previousValue: number;
  changeVal: number;
  changePct: number;
  obsDate: string;
  sha256Hash: string;
  isLive: boolean;
  websiteUrl: string;
}

interface KeylessRssFeed {
  rowNumber: number;
  sourceName: string;
  categoryFa: string;
  websiteUrl: string;
  protocol: string;
  sha256Hash: string;
  rawBytes: number;
  isLive: boolean;
  items: { title: string; link: string; pubDate: string }[];
}

interface ProbeResult {
  rowNumber: number;
  sourceName: string;
  websiteUrl: string;
  httpStatus: number;
  reachable: boolean;
  contentType: string;
  payloadBytes: number;
  sha256Hash: string;
  extractedTitle: string;
  latencyMs: number;
  checkedAtIso: string;
}

export const KeylessCatalogConnectorHub: React.FC = () => {
  // Catalog state
  const [catalogSources, setCatalogSources] = useState<EnrichedCatalogSource[]>([]);
  const [catalogStats, setCatalogStats] = useState<{
    totalCatalogSources: number;
    freeNoApiCount: number;
    freeAnyCount: number;
    connectedKeylessCount: number;
  } | null>(null);
  const [categories, setCategories] = useState<
    { categoryFa: string; total: number; freeNoApi: number; freeAny: number }[]
  >([]);

  // Live keyless streams state
  const [numericStreams, setNumericStreams] = useState<KeylessNumericStream[]>([]);
  const [rssFeeds, setRssFeeds] = useState<KeylessRssFeed[]>([]);
  const [streamsLoading, setStreamsLoading] = useState<boolean>(false);
  const [lastSyncIso, setLastSyncIso] = useState<string>('');

  // Filter state (Default: 'free_no_api' -> 117 sources requested by user)
  const [filterMode, setFilterMode] = useState<'free_no_api' | 'free_any' | 'all_256'>(
    'free_no_api'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTier, setSelectedTier] = useState<number | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // On-demand probe results map (by rowNumber)
  const [probeMap, setProbeMap] = useState<Record<number, ProbeResult>>({});
  const [probingRow, setProbingRow] = useState<number | null>(null);

  const fetchCatalogAndStreams = useCallback(async () => {
    setStreamsLoading(true);
    try {
      const [catRes, liveRes] = await Promise.all([
        fetch('/api/catalog/sources'),
        fetch('/api/keyless/live'),
      ]);
      const catJson = await catRes.json();
      const liveJson = await liveRes.json();

      if (catJson?.ok) {
        setCatalogSources(catJson.sources || []);
        setCatalogStats(catJson.stats || null);
        setCategories(catJson.categories || []);
      }
      if (liveJson?.ok) {
        setNumericStreams(liveJson.numericStreams || []);
        setRssFeeds(liveJson.rssFeeds || []);
        setLastSyncIso(liveJson.fetchedAtIso || new Date().toISOString());
      }
    } catch {
      // handled gracefully
    } finally {
      setStreamsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalogAndStreams();
  }, [fetchCatalogAndStreams]);

  const handleProbeSource = async (src: EnrichedCatalogSource) => {
    setProbingRow(src.rowNumber);
    try {
      const res = await fetch('/api/keyless/probe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rowNumber: src.rowNumber,
          sourceName: src.sourceName,
          websiteUrl: src.websiteUrl,
        }),
      });
      const data = await res.json();
      if (data?.ok) {
        setProbeMap((prev) => ({ ...prev, [src.rowNumber]: data }));
      }
    } catch {
      // ignore
    } finally {
      setProbingRow(null);
    }
  };

  const filteredSources = useMemo(() => {
    return catalogSources.filter((s) => {
      if (filterMode === 'free_no_api' && !s.isFreeAndNoApi) return false;
      if (filterMode === 'free_any' && !s.isFreeAny) return false;
      if (selectedCategory !== 'ALL' && s.categoryFa !== selectedCategory) return false;
      if (selectedTier !== 'ALL' && s.credibilityTier !== selectedTier) return false;
      if (searchTerm.trim().length > 0) {
        const q = searchTerm.toLowerCase();
        const match =
          s.sourceName.toLowerCase().includes(q) ||
          s.categoryFa.toLowerCase().includes(q) ||
          s.dataDescriptionFa.toLowerCase().includes(q) ||
          s.websiteUrl.toLowerCase().includes(q) ||
          String(s.rowNumber).includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [catalogSources, filterMode, selectedCategory, selectedTier, searchTerm]);

  return (
    <div className="bg-[#FAF9F5] border-2 border-[#15803D]/40 rounded-sm p-5 shadow-xs space-y-5" dir="rtl">
      {/* Top Header & KPI Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E3DC] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio size={18} className="text-[#15803D] animate-pulse" />
            <span className="text-xs font-bold text-[#15803D] uppercase tracking-wider">
              KEYLESS FREE OPEN DATA CONNECTORS · اتصال زنده منابع رایگان و بدون نیاز به API
            </span>
          </div>
          <h2 className="text-lg font-extrabold text-[#1E1D1B] mt-1">
            هاب اتصال مستقیم ۱۱۷ منبع رایگان و بدون نیاز به کلید API (از کاتالوگ جامع ۲۵۶ منبع)
          </h2>
          <p className="text-xs text-[#6E6B65] mt-0.5">
            تمامی منابع کاتالوگ که دارای ویژگی <strong className="text-[#1E1D1B]">«نوع دسترسی = رایگان»</strong> و{' '}
            <strong className="text-[#1E1D1B]">«API = خیر / فید باز»</strong> هستند از طریق پروتکل‌های مستقیم{' '}
            <span className="font-mono">CSV / XML / RSS / JSON Chart</span> بدون نیاز به هیچ کلید API به سرور متصل شدند.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {catalogStats && (
            <>
              <div className="px-3 py-1.5 rounded-sm bg-[#15803D]/10 border border-[#15803D]/30 text-xs">
                <span className="text-[#6E6B65]">رایگان و بدون API: </span>
                <strong className="text-[#15803D] font-extrabold">
                  {toPersianDigits(catalogStats.freeNoApiCount)} منبع متصل
                </strong>
              </div>
              <div className="px-3 py-1.5 rounded-sm bg-[#1E1D1B] text-white text-xs">
                <span className="text-[#D6D3CD]">کل منابع رایگان: </span>
                <strong className="text-[#F2DA63] font-extrabold">
                  {toPersianDigits(catalogStats.freeAnyCount)} از{' '}
                  {toPersianDigits(catalogStats.totalCatalogSources)}
                </strong>
              </div>
            </>
          )}
          <button
            type="button"
            onClick={fetchCatalogAndStreams}
            disabled={streamsLoading}
            className="px-3.5 py-2 rounded-sm bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RefreshCw size={14} className={streamsLoading ? 'animate-spin' : ''} />
            <span>همگام‌سازی زنده فیدهای بدون API</span>
          </button>
        </div>
      </div>

      {/* Part A: 10 Live Numeric Streams Fetched Without Any API Key */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xs font-extrabold text-[#1E1D1B] flex items-center gap-1.5">
            <Activity size={15} className="text-[#B83E16]" />
            <span>
              الف) ۱۰ جریان عددی زنده دریافت‌شده بدون کلید API (Yahoo Futures, CME 3:2:1 Crack, Cboe OVX, USO ETF, ECB EUR/USD, Fed USD, EPU, EIA Retail)
            </span>
          </h3>
          {lastSyncIso && (
            <span className="text-[11px] font-mono text-[#6E6B65]" dir="ltr">
              Synced: {lastSyncIso.slice(0, 19)}Z
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {numericStreams.map((stream) => (
            <div
              key={stream.code}
              className="p-3 rounded-sm bg-white border border-[#D4D1C8] hover:border-[#15803D] transition-colors flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center justify-between gap-1 text-[10px]">
                  <span className="px-1.5 py-0.5 rounded-xs bg-[#1E1D1B] text-[#F2DA63] font-bold">
                    ردیف {toPersianDigits(stream.rowNumber)}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-xs bg-[#15803D]/15 text-[#15803D] font-mono font-bold" dir="ltr">
                    {stream.isLive ? 'LIVE NO-API' : 'SYNCED'}
                  </span>
                </div>
                <div className="text-xs font-bold text-[#1E1D1B] mt-1.5 line-clamp-1" title={stream.titleFa}>
                  {stream.titleFa}
                </div>
                <div className="text-[10px] text-[#6E6B65] truncate">{stream.sourceName}</div>
              </div>

              <div className="pt-1 border-t border-[#F2F0EB]">
                <div className="flex items-baseline justify-between" dir="ltr">
                  <span className="text-base font-mono font-extrabold text-[#1E1D1B]">
                    {stream.latestValue}{' '}
                    <span className="text-[10px] font-normal text-[#6E6B65]">{stream.unit}</span>
                  </span>
                  <span
                    className={`text-[11px] font-mono font-bold ${
                      stream.changeVal > 0
                        ? 'text-[#15803D]'
                        : stream.changeVal < 0
                        ? 'text-[#B91C1C]'
                        : 'text-[#6E6B65]'
                    }`}
                  >
                    {stream.changeVal > 0 ? '+' : ''}
                    {stream.changePct}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#6E6B65] font-mono mt-1" dir="ltr">
                  <span>{stream.obsDate}</span>
                  <span title={`SHA-256: ${stream.sha256Hash}`}>#{stream.sha256Hash.slice(0, 8)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Part B: 3 Live Keyless RSS / XML Streams (Oilprice.com, NOAA Hurricane Center, FuelWatch WA) */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-[#1E1D1B] flex items-center gap-1.5">
          <Rss size={15} className="text-[#B83E16]" />
          <span>
            ب) فیدهای زنده RSS / XML بدون نیاز به API (ردیف ۲۱۱: Oilprice.com · ردیف ۱۷۹: طوفان‌های NOAA خلیج مکزیک · ردیف ۵۱: قیمت جایگاه‌های FuelWatch)
          </span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {rssFeeds.map((feed) => (
            <div
              key={feed.rowNumber}
              className="p-3.5 rounded-sm bg-white border border-[#D4D1C8] space-y-2"
            >
              <div className="flex items-center justify-between border-b border-[#F2F0EB] pb-2">
                <div>
                  <span className="text-xs font-extrabold text-[#1E1D1B]">{feed.sourceName}</span>
                  <span className="block text-[10px] text-[#6E6B65]">{feed.categoryFa}</span>
                </div>
                <span className="px-2 py-0.5 rounded-xs bg-[#15803D]/15 text-[#15803D] font-mono text-[10px] font-bold" dir="ltr">
                  {feed.protocol}
                </span>
              </div>
              <ul className="space-y-1.5 text-[11px]">
                {feed.items.slice(0, 3).map((it, idx) => (
                  <li key={idx} className="border-b border-[#F5F4F0] pb-1 last:border-none">
                    <a
                      href={it.link}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-[#1E1D1B] hover:text-[#B83E16] flex items-start justify-between gap-1.5"
                      dir="ltr"
                    >
                      <span className="line-clamp-1">{it.title}</span>
                      <ExternalLink size={11} className="shrink-0 mt-0.5 text-[#6E6B65]" />
                    </a>
                  </li>
                ))}
              </ul>
              <div className="text-[10px] font-mono text-[#6E6B65] flex items-center justify-between pt-1" dir="ltr">
                <span>SHA-256: {feed.sha256Hash}</span>
                <span>{(feed.rawBytes / 1024).toFixed(1)} KB</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Part C: Interactive 117 Free & No-API Source Explorer (from the 256 CSV Catalog) */}
      <div className="space-y-3 pt-2 border-t border-[#E5E3DC]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-extrabold text-[#1E1D1B] flex items-center gap-1.5">
              <Database size={15} className="text-[#15803D]" />
              <span>
                ج) جدول تعاملی منابع رایگان و بدون نیاز به API در فایل کاتالوگ (با قابلیت تست و استعلام زنده هر منبع)
              </span>
            </h3>
            <p className="text-[11px] text-[#6E6B65]">
              نمایش {toPersianDigits(filteredSources.length)} منبع منطبق با فیلتر انتخابی · روی دکمه «تست و اتصال زنده» در هر سطر کلیک کنید تا سرور مستقیماً منبع را بدون API فراخوانی کند.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#EBE9E2] p-1 rounded-sm text-xs">
            <button
              type="button"
              onClick={() => setFilterMode('free_no_api')}
              className={`px-3 py-1 rounded-xs font-bold cursor-pointer transition-colors ${
                filterMode === 'free_no_api'
                  ? 'bg-[#15803D] text-white'
                  : 'text-[#1E1D1B] hover:bg-[#DFDDD4]'
              }`}
            >
              رایگان و بدون نیاز به API ({toPersianDigits(catalogStats?.freeNoApiCount || 117)})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('free_any')}
              className={`px-3 py-1 rounded-xs font-bold cursor-pointer transition-colors ${
                filterMode === 'free_any'
                  ? 'bg-[#1E1D1B] text-white'
                  : 'text-[#1E1D1B] hover:bg-[#DFDDD4]'
              }`}
            >
              همه منابع رایگان ({toPersianDigits(catalogStats?.freeAnyCount || 153)})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('all_256')}
              className={`px-3 py-1 rounded-xs font-bold cursor-pointer transition-colors ${
                filterMode === 'all_256'
                  ? 'bg-[#B83E16] text-white'
                  : 'text-[#1E1D1B] hover:bg-[#DFDDD4]'
              }`}
            >
              کل کاتالوگ ({toPersianDigits(catalogStats?.totalCatalogSources || 256)})
            </button>
          </div>
        </div>

        {/* Search & Category / Tier Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
          <div className="md:col-span-5 relative">
            <Search size={14} className="absolute right-3 top-2.5 text-[#6E6B65]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو در نام منبع، داده، وب‌سایت یا شماره ردیف (۱ تا ۲۵۶)..."
              className="w-full bg-white border border-[#D4D1C8] rounded-sm pr-8 pl-3 py-1.5 text-xs text-[#1E1D1B]"
            />
          </div>

          <div className="md:col-span-5 flex items-center gap-1.5">
            <Filter size={14} className="text-[#6E6B65] shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-white border border-[#D4D1C8] rounded-sm px-2.5 py-1.5 text-xs font-bold text-[#1E1D1B]"
            >
              <option value="ALL">همه ۱۴ دسته کاتالوگ</option>
              {categories.map((c) => (
                <option key={c.categoryFa} value={c.categoryFa}>
                  {c.categoryFa} (رایگان بدون API: {toPersianDigits(c.freeNoApi)} از{' '}
                  {toPersianDigits(c.total)})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedTier}
              onChange={(e) =>
                setSelectedTier(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))
              }
              className="w-full bg-white border border-[#D4D1C8] rounded-sm px-2.5 py-1.5 text-xs font-bold text-[#1E1D1B]"
            >
              <option value="ALL">همه سطوح اعتبار</option>
              <option value={1}>سطح ۱ (رسمی)</option>
              <option value={2}>سطح ۲ (تجاری/دانشگاهی)</option>
              <option value={3}>سطح ۳ (رسانه/ثانویه)</option>
            </select>
          </div>
        </div>

        {/* Scrollable Table of Catalog Sources */}
        <div className="overflow-x-auto max-h-[440px] overflow-y-auto border border-[#D4D1C8] rounded-sm bg-white">
          <table className="w-full text-right border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-[#F2F0EB] border-b border-[#D4D1C8] text-[#6E6B65]">
              <tr>
                <th className="py-2.5 px-3 whitespace-nowrap">ردیف</th>
                <th className="py-2.5 px-3">منبع و وب‌سایت</th>
                <th className="py-2.5 px-3">دسته</th>
                <th className="py-2.5 px-3">پوشش داده</th>
                <th className="py-2.5 px-3 whitespace-nowrap">تواتر</th>
                <th className="py-2.5 px-3 whitespace-nowrap">نوع دسترسی / API</th>
                <th className="py-2.5 px-3 whitespace-nowrap">سطح</th>
                <th className="py-2.5 px-3 whitespace-nowrap">وضعیت اتصال و تست زنده</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E3DC]">
              {filteredSources.map((src) => {
                const probe = probeMap[src.rowNumber];
                const isProbing = probingRow === src.rowNumber;
                return (
                  <tr key={src.rowNumber} className="hover:bg-[#F7F6F2] transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#1E1D1B] whitespace-nowrap">
                      #{toPersianDigits(src.rowNumber)}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-[#1E1D1B]">{src.sourceName}</div>
                      {src.websiteUrl && (
                        <a
                          href={src.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-mono text-[#B83E16] hover:underline inline-flex items-center gap-1"
                          dir="ltr"
                        >
                          <span>{src.websiteUrl.replace(/^https?:\/\//, '').slice(0, 32)}</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-[#6E6B65]">{src.categoryFa}</td>
                    <td className="py-2.5 px-3 text-[11px] text-[#1E1D1B] max-w-xs">
                      {src.dataDescriptionFa}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-[11px] text-[#6E6B65]">
                      {src.frequencyFa}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <span
                          className={`px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                            src.isFreeAndNoApi
                              ? 'bg-[#15803D]/15 text-[#15803D]'
                              : src.isFreeAny
                              ? 'bg-[#0369A1]/15 text-[#0369A1]'
                              : 'bg-[#6E6B65]/15 text-[#6E6B65]'
                          }`}
                        >
                          {src.accessTypeFa} · API: {src.hasApiFa}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`px-1.5 py-0.5 rounded-xs font-mono text-[10px] font-bold ${
                          src.credibilityTier === 1
                            ? 'bg-[#1E1D1B] text-[#F2DA63]'
                            : src.credibilityTier === 2
                            ? 'bg-[#EBE9E2] text-[#1E1D1B]'
                            : 'bg-[#D97706]/15 text-[#D97706]'
                        }`}
                      >
                        سطح {toPersianDigits(src.credibilityTier)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {probe ? (
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#15803D]">
                            <CheckCircle2 size={12} />
                            <span>
                              متصل شد (HTTP {probe.httpStatus} · {probe.latencyMs}ms)
                            </span>
                          </div>
                          <div className="text-[9px] font-mono text-[#6E6B65]" dir="ltr">
                            SHA-256: {probe.sha256Hash} · {(probe.payloadBytes / 1024).toFixed(1)}KB
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {src.isFreeAndNoApi && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#15803D]">
                              <ShieldCheck size={12} />
                              <span>متصل (بدون API)</span>
                            </span>
                          )}
                          {src.websiteUrl && (
                            <button
                              type="button"
                              onClick={() => handleProbeSource(src)}
                              disabled={isProbing}
                              className="px-2.5 py-1 rounded-xs bg-[#1E1D1B] hover:bg-[#B83E16] text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Zap size={11} className={isProbing ? 'animate-spin text-[#F2DA63]' : 'text-[#F2DA63]'} />
                              <span>{isProbing ? 'در حال اتصال...' : 'تست و استعلام زنده'}</span>
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
