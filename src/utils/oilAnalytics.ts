/**
 * Pure analytical functions implementing the platform's core skills:
 * 1. eia-weekly-stocks (seasonal 5-year deviation, consensus surprise, signal evaluation, days of supply)
 * 2. oil-shock-decomposition (Kilian 2009 / Baumeister-Hamilton / Kanzig triangulation & log-point price change)
 * 3. forecast-benchmark (MSPE ratio, Diebold-Mariano HLN verdict, empirical fan chart quantiles)
 * 4. Quality Score (0..100) & Crack Spread 3:2:1 & Scenario Simulation
 */

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export function formatSignedPersian(val: number, decimals = 1): string {
  const sign = val > 0 ? '+' : val < 0 ? '−' : '';
  const absStr = Math.abs(val).toFixed(decimals).replace('.', '٫');
  return `${toPersianDigits(absStr)}${sign}`;
}

export interface EiaSignalResult {
  relativeVs5yChange: number;
  surprise: number | null;
  direction: 'supportive' | 'bearish' | 'neutral';
  directionFa: string;
  strength: 'strong' | 'moderate' | 'weak';
  score: number;
}

/**
 * Evaluates weekly stock change against seasonal 5-year average change or analyst consensus
 * per eia-weekly-stocks/scripts/analyze_wpsr.py rules.
 */
export function evaluateEiaStockSignal(params: {
  wowChangeMb: number;
  avg5yChangeMb: number;
  expectedChangeMb?: number | null;
  threshold5yMb: number;
  thresholdConsensusMb: number;
}): EiaSignalResult {
  const { wowChangeMb, avg5yChangeMb, expectedChangeMb, threshold5yMb, thresholdConsensusMb } = params;
  const relativeVs5yChange = Number((wowChangeMb - avg5yChangeMb).toFixed(2));
  const hasConsensus = expectedChangeMb !== undefined && expectedChangeMb !== null;
  const surprise = hasConsensus ? Number((wowChangeMb - (expectedChangeMb as number)).toFixed(2)) : null;

  const activeVal = hasConsensus ? (surprise as number) : relativeVs5yChange;
  const threshold = hasConsensus ? thresholdConsensusMb : threshold5yMb;

  let direction: 'supportive' | 'bearish' | 'neutral' = 'neutral';
  if (activeVal < -threshold) {
    direction = 'supportive'; // larger draw than seasonal norm/consensus -> price supportive
  } else if (activeVal > threshold) {
    direction = 'bearish'; // larger build than seasonal norm/consensus -> bearish
  }

  const directionFaMap: Record<'supportive' | 'bearish' | 'neutral', string> = {
    supportive: 'حمایتی برای قیمت',
    bearish: 'فشار نزولی',
    neutral: 'خنثی',
  };

  const absVal = Math.abs(activeVal);
  const strength: 'strong' | 'moderate' | 'weak' =
    absVal >= 2 * threshold ? 'strong' : absVal > threshold ? 'moderate' : 'weak';
  const score = Number((absVal / threshold).toFixed(2));

  return {
    relativeVs5yChange,
    surprise,
    direction,
    directionFa: directionFaMap[direction],
    strength,
    score,
  };
}

/**
 * Computes days of supply = stocks (in thousand barrels) / 4-week average flow (in kb/d)
 * or stocks (in million barrels) * 1000 / flow (in kb/d).
 */
export function computeDaysOfSupply(stocksMb: number, flowAvg4wKbd: number): number {
  if (flowAvg4wKbd <= 0) return 0;
  return Number(((stocksMb * 1000) / flowAvg4wKbd).toFixed(1));
}

export type TriangulationAgreement = 'agree' | 'partial' | 'disagree' | 'agree_neutral';

/**
 * Triangulates supply shock signs across Kilian (2009), Baumeister-Hamilton (2019), and Kanzig (2021).
 * Values within [-threshold, +threshold] are treated as neutral (0).
 */
export function evaluateShockTriangulation(
  kilian: number,
  bh: number,
  kaenzig: number,
  threshold = 0.25
): { label: TriangulationAgreement; labelFa: string } {
  const vals = [kilian, bh, kaenzig];
  const signs = vals.map((v) => (Math.abs(v) < threshold ? 0 : v > 0 ? 1 : -1));
  const nonZero = signs.filter((s) => s !== 0);

  if (nonZero.length === 0) {
    return { label: 'agree_neutral', labelFa: 'همه خنثی' };
  }
  const allSame = nonZero.every((s) => s === nonZero[0]);
  if (allSame) {
    if (nonZero.length === signs.length) {
      return { label: 'agree', labelFa: 'همسو' };
    }
    return { label: 'partial', labelFa: 'نیمه‌همسو' };
  }
  return { label: 'disagree', labelFa: 'ناهمسو' };
}

/**
 * Converts structural log-point contributions (supply, aggregate demand, oil-specific demand, base)
 * into total log points and exact percentage change in real oil price.
 */
export function computeShockWindowSummary(contributions: {
  supply: number;
  aggregateDemand: number;
  oilSpecificDemand: number;
  base: number;
}) {
  const totalLogPoints = Number(
    (
      contributions.supply +
      contributions.aggregateDemand +
      contributions.oilSpecificDemand +
      contributions.base
    ).toFixed(2)
  );
  const priceChangePct = Number((100 * (Math.exp(totalLogPoints / 100) - 1)).toFixed(1));
  return {
    totalLogPoints,
    priceChangePct,
  };
}

export type ForecastVerdict =
  | 'significantly_better'
  | 'better_not_significant'
  | 'not_better'
  | 'insufficient_sample'
  | 'benchmark';

/**
 * Evaluates a forecast model against the no-change benchmark per forecast-benchmark/scripts/evaluate.py
 */
export function evaluateForecastModel(params: {
  isBenchmark?: boolean;
  n: number;
  minN?: number;
  mspeRatio: number;
  dmPvalue: number | null;
}): { verdict: ForecastVerdict; verdictFa: string } {
  const { isBenchmark = false, n, minN = 30, mspeRatio, dmPvalue } = params;
  if (isBenchmark) {
    return { verdict: 'benchmark', verdictFa: 'معیار' };
  }
  if (n < minN) {
    return { verdict: 'insufficient_sample', verdictFa: 'نمونه ناکافی' };
  }
  if (mspeRatio < 1 && dmPvalue !== null && dmPvalue < 0.05) {
    return { verdict: 'significantly_better', verdictFa: 'بهتر، معنی‌دار' };
  }
  if (mspeRatio < 1) {
    return { verdict: 'better_not_significant', verdictFa: 'بهتر، غیرمعنی‌دار' };
  }
  return { verdict: 'not_better', verdictFa: 'بهتر نیست' };
}

/**
 * Computes 3:2:1 Crack Spread in USD/bbl:
 * (2 * Gasoline USD/bbl + 1 * ULSD Distillate USD/bbl - 3 * Crude USD/bbl) / 3
 */
export function computeCrackSpread321(
  crudeUsdBbl: number,
  gasolineUsdBbl: number,
  dieselUsdBbl: number
): number {
  return Number(((2 * gasolineUsdBbl + 1 * dieselUsdBbl - 3 * crudeUsdBbl) / 3).toFixed(2));
}

/**
 * Computes Data Quality Score (0..100) from dossier section 1-6 / 4-6:
 * Tier base (Tier 1: 60, Tier 2: 45, Tier 3: 30) + Freshness (0..15) + Consistency (0..15) + Revision Stability (0..10)
 */
export function computeDataQualityScore(params: {
  tier: 1 | 2 | 3;
  freshnessScore: number; // 0..15
  consistencyScore: number; // 0..15
  revisionStabilityScore: number; // 0..10
}): number {
  const baseMap: Record<1 | 2 | 3, number> = { 1: 60, 2: 45, 3: 30 };
  const base = baseMap[params.tier];
  const f = Math.max(0, Math.min(15, params.freshnessScore));
  const c = Math.max(0, Math.min(15, params.consistencyScore));
  const r = Math.max(0, Math.min(10, params.revisionStabilityScore));
  return Math.round(base + f + c + r);
}

/**
 * Interactive What-If Scenario Simulator for oil price, global balance, and organizational revenue impact.
 */
export function simulateMarketScenario(params: {
  baseBrentUsd: number;
  opecSupplyDeltaMbd: number; // e.g., -1.5 to +2.0 mb/d
  chokepointDisruptionMbd: number; // e.g., 0 to 4.0 mb/d (Hormuz / Bab el-Mandeb)
  globalDemandDeltaMbd: number; // e.g., -2.0 to +2.0 mb/d
  dxyChangePct: number; // e.g., -5% to +5%
  orgExportVolumeMbd: number; // Organization daily export volume in mb/d
  orgFiscalBreakevenUsd: number;
}) {
  const {
    baseBrentUsd,
    opecSupplyDeltaMbd,
    chokepointDisruptionMbd,
    globalDemandDeltaMbd,
    dxyChangePct,
    orgExportVolumeMbd,
    orgFiscalBreakevenUsd,
  } = params;

  // Net supply/demand balance change (positive = surplus, negative = deficit)
  const baseBalanceMbd = 0.6; // baseline +0.6 mb/d surplus
  const newBalanceMbd = Number(
    (baseBalanceMbd + opecSupplyDeltaMbd - chokepointDisruptionMbd - globalDemandDeltaMbd).toFixed(2)
  );

  // Structural price sensitivity based on SVAR elasticities:
  // -1 mb/d OPEC supply -> +$6.5/bbl
  // +1 mb/d Chokepoint disruption -> +$9.2/bbl (includes precautionary demand premium)
  // +1 mb/d Demand growth -> +$5.8/bbl
  // +1% DXY -> -$0.75/bbl
  const supplyEffect = -opecSupplyDeltaMbd * 6.5;
  const chokepointEffect = chokepointDisruptionMbd * 9.2;
  const demandEffect = globalDemandDeltaMbd * 5.8;
  const usdEffect = -dxyChangePct * 0.75;

  const projectedBrentUsd = Number(
    Math.max(35, baseBrentUsd + supplyEffect + chokepointEffect + demandEffect + usdEffect).toFixed(2)
  );
  const priceDeltaUsd = Number((projectedBrentUsd - baseBrentUsd).toFixed(2));
  const priceDeltaPct = Number(((priceDeltaUsd / baseBrentUsd) * 100).toFixed(1));

  // Annualized organizational export revenue in Billion USD
  const baseAnnualRevenueB = Number(((baseBrentUsd * orgExportVolumeMbd * 365) / 1000).toFixed(2));
  const projectedAnnualRevenueB = Number(
    ((projectedBrentUsd * orgExportVolumeMbd * 365) / 1000).toFixed(2)
  );
  const revenueDeltaB = Number((projectedAnnualRevenueB - baseAnnualRevenueB).toFixed(2));
  const fiscalMarginUsd = Number((projectedBrentUsd - orgFiscalBreakevenUsd).toFixed(2));

  return {
    newBalanceMbd,
    projectedBrentUsd,
    priceDeltaUsd,
    priceDeltaPct,
    baseAnnualRevenueB,
    projectedAnnualRevenueB,
    revenueDeltaB,
    fiscalMarginUsd,
    drivers: {
      supplyEffect: Number(supplyEffect.toFixed(2)),
      chokepointEffect: Number(chokepointEffect.toFixed(2)),
      demandEffect: Number(demandEffect.toFixed(2)),
      usdEffect: Number(usdEffect.toFixed(2)),
    },
  };
}

export interface RealtimeBenchmarkQuote {
  id: 'wti' | 'brent' | 'dubai';
  code: 'WTI' | 'BRENT' | 'DUBAI';
  nameEn: string;
  nameFa: string;
  price: number;
  openPrice: number;
  changeUsd: number;
  changePct: number;
  direction: 'up' | 'down' | 'flat';
  lastTickDirection: 'up' | 'down' | 'flat';
  lastTickDelta: number;
}

/**
 * Updates a benchmark oil quote with a real-time price tick delta (in USD/bbl)
 * and calculates session change, percentage change, and up/down directional indicators.
 */
export function computeRealtimeBenchmarkTick(
  quote: RealtimeBenchmarkQuote,
  deltaUsd: number
): RealtimeBenchmarkQuote {
  const roundedDelta = Number(deltaUsd.toFixed(2));
  const newPrice = Number(Math.max(20, quote.price + roundedDelta).toFixed(2));
  const changeUsd = Number((newPrice - quote.openPrice).toFixed(2));
  const changePct = Number(((changeUsd / quote.openPrice) * 100).toFixed(2));
  const direction: 'up' | 'down' | 'flat' =
    changeUsd > 0 ? 'up' : changeUsd < 0 ? 'down' : 'flat';
  const lastTickDirection: 'up' | 'down' | 'flat' =
    roundedDelta > 0 ? 'up' : roundedDelta < 0 ? 'down' : 'flat';

  return {
    ...quote,
    price: newPrice,
    changeUsd,
    changePct,
    direction,
    lastTickDirection,
    lastTickDelta: roundedDelta,
  };
}

export interface VintagePoint {
  vintageId: string;
  vintageTs: string;
  value: number;
  method: string;
  noteFa: string;
}

/**
 * Computes revision statistics across point-in-time vintages for a given observation series
 * and checks for look-ahead bias relative to a model evaluation origin date.
 */
export function computeVintageRevisionStats(
  vintages: VintagePoint[],
  forecastOriginIso?: string
) {
  if (vintages.length === 0) {
    return {
      initialValue: 0,
      latestValue: 0,
      netRevision: 0,
      netRevisionPct: 0,
      maxAbsRevision: 0,
      revisionStabilityScore: 10,
      lookAheadSafe: true,
    };
  }
  const initialValue = vintages[0].value;
  const latestValue = vintages[vintages.length - 1].value;
  const netRevision = Number((latestValue - initialValue).toFixed(2));
  const netRevisionPct =
    initialValue !== 0 ? Number(((netRevision / Math.abs(initialValue)) * 100).toFixed(2)) : 0;

  let maxAbsRevision = 0;
  for (let i = 1; i < vintages.length; i++) {
    const diff = Math.abs(vintages[i].value - vintages[i - 1].value);
    if (diff > maxAbsRevision) {
      maxAbsRevision = Number(diff.toFixed(2));
    }
  }

  // Stability score out of 10: deducts points for large percentage revisions
  const absPct = Math.abs(netRevisionPct);
  const revisionStabilityScore = Math.max(
    2,
    Math.min(10, Math.round(10 - absPct * 1.5))
  );

  const latestTs = vintages[vintages.length - 1].vintageTs;
  const lookAheadSafe = forecastOriginIso
    ? new Date(latestTs).getTime() <= new Date(forecastOriginIso).getTime()
    : true;

  return {
    initialValue,
    latestValue,
    netRevision,
    netRevisionPct,
    maxAbsRevision,
    revisionStabilityScore,
    lookAheadSafe,
  };
}

/**
 * Evaluates the Human-in-the-Loop (HITL) verification gate for Pattern C (PDF extraction),
 * Pattern D (OSP LLM extraction), and Tier-3 Early Warning Alerts.
 */
export function evaluateHitlQueueGate(params: {
  pattern: 'C_PDF' | 'D_OSP' | 'TIER3_ALERT';
  rowSumDelta?: number;
  independentSourcesCount: number;
  analystApproved: boolean;
}): {
  gateStatus: 'APPROVED' | 'PENDING_HUMAN' | 'BLOCKED';
  gateLabelFa: string;
  reasonFa: string;
} {
  const { pattern, rowSumDelta = 0, independentSourcesCount, analystApproved } = params;

  if (pattern === 'C_PDF') {
    const sumOk = Math.abs(rowSumDelta) <= 5;
    if (!sumOk && !analystApproved) {
      return {
        gateStatus: 'BLOCKED',
        gateLabelFa: 'مسدود (عدم تطابق جمع سطرها)',
        reasonFa: `اختلاف جمع سطرها با سرجمع جدول (${rowSumDelta} واحد) خارج از تلرانس است و نیاز به بازبینی انسانی دارد.`,
      };
    }
    if (analystApproved || (sumOk && independentSourcesCount >= 1)) {
      return {
        gateStatus: 'APPROVED',
        gateLabelFa: 'تأییدشده در انبار داده',
        reasonFa: 'کنترل جمع سطرها و ساختار جدول PDF با موفقیت تأیید شد.',
      };
    }
    return {
      gateStatus: 'PENDING_HUMAN',
      gateLabelFa: 'در انتظار تأیید تحلیلگر',
      reasonFa: 'استخراج جدول نیازمند تأیید نهایی تحلیلگر است.',
    };
  }

  if (pattern === 'D_OSP') {
    if (analystApproved) {
      return {
        gateStatus: 'APPROVED',
        gateLabelFa: 'تأیید نهایی تحلیلگر و ثبت در انبار',
        reasonFa: 'تفاضل OSP پس از تطبیق رسانه‌ای توسط تحلیلگر تأیید شد.',
      };
    }
    if (independentSourcesCount < 2) {
      return {
        gateStatus: 'PENDING_HUMAN',
        gateLabelFa: 'در انتظار منبع دوم و تأیید انسانی',
        reasonFa: 'طبق الگوی D، استخراج LLM از یک رسانه تا زمان تأیید منبع دوم یا تحلیلگر وارد محاسبه رسمی نمی‌شود.',
      };
    }
    return {
      gateStatus: 'PENDING_HUMAN',
      gateLabelFa: 'آماده تأیید نهایی (۲ منبع منطبق)',
      reasonFa: 'دو منبع خبری مستقل عدد را گزارش کرده‌اند؛ منتظر کلیک تأیید تحلیلگر.',
    };
  }

  // TIER3_ALERT
  if (independentSourcesCount < 2) {
    return {
      gateStatus: 'BLOCKED',
      gateLabelFa: 'مسدود (منبع سطح ۳ بدون پشتیبان)',
      reasonFa: 'منابع سطح ۳ به تنهایی مجاز به تولید هشدار P0/P1 نیستند؛ حداقل یک منبع مستقل دیگر الزامی است.',
    };
  }
  if (!analystApproved) {
    return {
      gateStatus: 'PENDING_HUMAN',
      gateLabelFa: 'هم‌سنجی دوگانه انجام شد · منتظر انتشار',
      reasonFa: 'تأیید متقابل انجام شده؛ منتظر مجوز انتشار در مرکز هشدار.',
    };
  }
  return {
    gateStatus: 'APPROVED',
    gateLabelFa: 'تأیید و منتشرشده',
    reasonFa: 'هشدار سطح ۳ پس از تأیید منبع مستقل و تحلیلگر منتشر شد.',
  };
}

/**
 * Converts New York (ET) release schedule to Tehran (IRST, permanent UTC+3:30 since Sept 2022).
 * EDT (US Summer): UTC-4 -> offset to Tehran is +7 hours 30 minutes.
 * EST (US Winter): UTC-5 -> offset to Tehran is +8 hours 30 minutes.
 */
export function convertNyReleaseToTehran(params: {
  nyHour24: number;
  nyMinute: number;
  isUsDst: boolean;
  isUsHolidayWeek?: boolean;
  holidayShiftHours?: number;
  dayOfWeekFa: string;
}) {
  const {
    nyHour24,
    nyMinute,
    isUsDst,
    isUsHolidayWeek = false,
    holidayShiftHours = 0.5,
    dayOfWeekFa,
  } = params;

  const effectiveNyMinutes =
    nyHour24 * 60 + nyMinute + (isUsHolidayWeek ? Math.round(holidayShiftHours * 60) : 0);
  const effectiveNyH = Math.floor(effectiveNyMinutes / 60) % 24;
  const effectiveNyM = effectiveNyMinutes % 60;

  // Offset in minutes: EDT -> +450 mins (+7:30), EST -> +510 mins (+8:30)
  const offsetMinutes = isUsDst ? 450 : 510;
  const totalTehranMinutes = effectiveNyMinutes + offsetMinutes;
  const dayOverflow = Math.floor(totalTehranMinutes / (24 * 60));
  const tehranH = Math.floor((totalTehranMinutes % (24 * 60)) / 60);
  const tehranM = totalTehranMinutes % 60;

  const pad = (n: number) => String(n).padStart(2, '0');
  const nyFormatted = `${pad(effectiveNyH)}:${pad(effectiveNyM)} ${isUsDst ? 'EDT' : 'EST'}`;
  const tehranFormatted = `${pad(tehranH)}:${pad(tehranM)} تهران`;

  const dayMapNext: Record<string, string> = {
    'دوشنبه': 'سه‌شنبه',
    'سه‌شنبه': 'چهارشنبه',
    'چهارشنبه': 'پنج‌شنبه',
    'پنج‌شنبه': 'جمعه',
    'جمعه': 'شنبه',
  };

  let effectiveDayFa = dayOfWeekFa;
  if (isUsHolidayWeek && dayMapNext[effectiveDayFa]) {
    effectiveDayFa = dayMapNext[effectiveDayFa];
  }

  return {
    nyFormatted,
    tehranFormatted,
    tehranHour24: tehranH,
    tehranMinute: tehranM,
    effectiveDayFa,
    dayOverflow,
    offsetLabelFa: isUsDst ? '+۷:۳۰ ساعت (تابستانی آمریکا EDT)' : '+۸:۳۰ ساعت (زمستانی آمریکا EST)',
  };
}

/**
 * Calculates Organizational Impact: Realized FOB Netback, Daily/Annual Export Revenue,
 * Fiscal Budget Surplus/Deficit, Breakeven Volume, and Hedging Downside Protection.
 */
export function computeOrganizationalImpact(params: {
  benchmarkDubaiUsd: number;
  ospDiffUsd: number; // e.g., +1.85 or -0.40
  vlccFreightUsdBbl: number; // e.g., 2.45 USD/bbl
  warRiskInsuranceUsdBbl: number; // e.g., 0.55 USD/bbl
  commercialDiscountUsdBbl: number; // e.g., 4.20 USD/bbl
  exportVolumeMbd: number; // e.g., 1.65 mb/d
  budgetTargetVolumeMbd: number; // e.g., 1.50 mb/d
  fiscalBreakevenUsd: number; // e.g., 76.50 USD/bbl
  hedgeCoverageRatioPct: number; // 0..100
  hedgeFloorUsd: number; // e.g., 78.00 USD/bbl
  downsideBenchmarkDubaiUsd: number; // e.g., 64.00 USD/bbl (Fan chart q5 tail scenario)
}) {
  const {
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
    downsideBenchmarkDubaiUsd,
  } = params;

  const realizedFobNetbackUsd = Number(
    Math.max(
      15,
      benchmarkDubaiUsd +
        ospDiffUsd -
        vlccFreightUsdBbl -
        warRiskInsuranceUsdBbl -
        commercialDiscountUsdBbl
    ).toFixed(2)
  );

  const totalDeductionsUsd = Number(
    (
      vlccFreightUsdBbl +
      warRiskInsuranceUsdBbl +
      commercialDiscountUsdBbl -
      ospDiffUsd
    ).toFixed(2)
  );

  const dailyRevenueMusd = Number((realizedFobNetbackUsd * exportVolumeMbd).toFixed(2));
  const annualizedRevenueBusd = Number(
    ((realizedFobNetbackUsd * exportVolumeMbd * 365) / 1000).toFixed(2)
  );
  const budgetAnnualTargetBusd = Number(
    ((fiscalBreakevenUsd * budgetTargetVolumeMbd * 365) / 1000).toFixed(2)
  );
  const fiscalAnnualBalanceBusd = Number(
    (annualizedRevenueBusd - budgetAnnualTargetBusd).toFixed(2)
  );
  const netbackMarginVsBreakevenUsd = Number(
    (realizedFobNetbackUsd - fiscalBreakevenUsd).toFixed(2)
  );
  const requiredBreakevenVolumeMbd =
    realizedFobNetbackUsd > 0
      ? Number(((budgetAnnualTargetBusd * 1000) / (realizedFobNetbackUsd * 365)).toFixed(2))
      : 0;

  // Downside tail stress test (e.g., price drop to downsideBenchmarkDubaiUsd)
  const downsideUnhedgedNetbackUsd = Number(
    Math.max(10, downsideBenchmarkDubaiUsd - totalDeductionsUsd).toFixed(2)
  );
  const hedgeRatio = Math.max(0, Math.min(100, hedgeCoverageRatioPct)) / 100;
  const hedgedPortionNetbackUsd = Math.max(
    downsideUnhedgedNetbackUsd,
    hedgeFloorUsd - totalDeductionsUsd
  );
  const effectiveDownsideNetbackUsd = Number(
    (
      hedgeRatio * hedgedPortionNetbackUsd +
      (1 - hedgeRatio) * downsideUnhedgedNetbackUsd
    ).toFixed(2)
  );

  const downsideUnhedgedAnnualBusd = Number(
    ((downsideUnhedgedNetbackUsd * exportVolumeMbd * 365) / 1000).toFixed(2)
  );
  const downsideHedgedAnnualBusd = Number(
    ((effectiveDownsideNetbackUsd * exportVolumeMbd * 365) / 1000).toFixed(2)
  );
  const hedgingProtectionGainBusd = Number(
    (downsideHedgedAnnualBusd - downsideUnhedgedAnnualBusd).toFixed(2)
  );

  return {
    realizedFobNetbackUsd,
    totalDeductionsUsd,
    dailyRevenueMusd,
    annualizedRevenueBusd,
    budgetAnnualTargetBusd,
    fiscalAnnualBalanceBusd,
    netbackMarginVsBreakevenUsd,
    requiredBreakevenVolumeMbd,
    downsideUnhedgedNetbackUsd,
    effectiveDownsideNetbackUsd,
    downsideUnhedgedAnnualBusd,
    downsideHedgedAnnualBusd,
    hedgingProtectionGainBusd,
  };
}

export interface FiveLayerQualityResult {
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
}

/**
 * Runs the 5-Layer Data Quality & Anomaly Engine on a live Wave-1 observation series.
 */
export function evaluateFiveLayerQualityGate(params: {
  seriesId: string;
  sourceCode: 'EIA' | 'FRED' | 'CFTC';
  tier: 1 | 2 | 3;
  latestValue: number;
  latestDateIso: string;
  referenceNowIso?: string;
  slaMaxAgeDays: number;
  rollingMean: number;
  rollingStdDev: number;
  sha256RawHash: string;
  crossSourceDelta?: number;
  crossSourceMaxTolerance?: number;
}): FiveLayerQualityResult {
  const {
    seriesId,
    sourceCode,
    tier,
    latestValue,
    latestDateIso,
    referenceNowIso,
    slaMaxAgeDays,
    rollingMean,
    rollingStdDev,
    sha256RawHash,
    crossSourceDelta = 0,
    crossSourceMaxTolerance = 10,
  } = params;

  // Layer 1: Schema & SHA-256 Lineage check
  const parsedObsTs = Date.parse(latestDateIso);
  const layer1SchemaOk =
    Number.isFinite(latestValue) &&
    !Number.isNaN(parsedObsTs) &&
    typeof sha256RawHash === 'string' &&
    sha256RawHash.length >= 16;

  // Layer 2: Freshness SLA
  const nowTs = referenceNowIso ? Date.parse(referenceNowIso) : Date.now();
  const ageDays = Number.isNaN(parsedObsTs)
    ? 999
    : Math.max(0, Number(((nowTs - parsedObsTs) / (1000 * 60 * 60 * 24)).toFixed(1)));
  const layer2FreshnessOk = ageDays <= slaMaxAgeDays;

  // Layer 3: Statistical Z-Score Anomaly Detection
  const safeStd = rollingStdDev > 0 ? rollingStdDev : 1;
  const layer3ZScore = Number(((latestValue - rollingMean) / safeStd).toFixed(2));
  const absZ = Math.abs(layer3ZScore);
  const layer3Status: 'NORMAL' | 'ANOMALY_WARN' | 'ANOMALY_CRITICAL' =
    absZ >= 3.0 ? 'ANOMALY_CRITICAL' : absZ >= 2.0 ? 'ANOMALY_WARN' : 'NORMAL';

  // Layer 4: Cross-Source Reconciliation
  const layer4ReconcileDelta = Number(crossSourceDelta.toFixed(2));
  const layer4ReconcileOk = Math.abs(layer4ReconcileDelta) <= crossSourceMaxTolerance;

  // Layer 5: Composite Quality Score (0..100) & Gate Decision
  const freshnessScore = layer2FreshnessOk
    ? 15
    : Math.max(3, Math.round(15 - (ageDays - slaMaxAgeDays) * 2));
  const consistencyScore =
    layer4ReconcileOk && layer3Status === 'NORMAL'
      ? 15
      : layer3Status === 'ANOMALY_WARN'
      ? 11
      : 6;
  const revisionStabilityScore = layer1SchemaOk ? 9 : 3;

  const layer5CompositeScore = computeDataQualityScore({
    tier,
    freshnessScore,
    consistencyScore,
    revisionStabilityScore,
  });

  let warehouseGate: 'PASS_AUTO_WAREHOUSE' | 'PASS_WITH_WARN_TAG' | 'QUARANTINE_HITL' =
    'PASS_AUTO_WAREHOUSE';
  if (!layer1SchemaOk || layer3Status === 'ANOMALY_CRITICAL') {
    warehouseGate = 'QUARANTINE_HITL';
  } else if (!layer2FreshnessOk || !layer4ReconcileOk || layer3Status === 'ANOMALY_WARN') {
    warehouseGate = 'PASS_WITH_WARN_TAG';
  }

  const summaryFa =
    warehouseGate === 'PASS_AUTO_WAREHOUSE'
      ? `تأیید خودکار ۵ لایه (امتیاز ${layer5CompositeScore}/100 · Z=${layer3ZScore})`
      : warehouseGate === 'PASS_WITH_WARN_TAG'
      ? `ثبت با برچسب هشدار (امتیاز ${layer5CompositeScore}/100 · Z=${layer3ZScore})`
      : `قرنطینه در صف تأیید انسانی (امتیاز ${layer5CompositeScore}/100 · Z=${layer3ZScore})`;

  return {
    seriesId,
    sourceCode,
    tier,
    layer1SchemaOk,
    layer2FreshnessOk,
    ageDays,
    layer3ZScore,
    layer3Status,
    layer4ReconcileDelta,
    layer4ReconcileOk,
    layer5CompositeScore,
    warehouseGate,
    summaryFa,
  };
}

export interface CatalogSourceRecord {
  rowNumber: number;
  categoryFa: string;
  subcategoryFa: string;
  sourceName: string;
  publisherOrNoteFa: string;
  websiteUrl: string;
  dataDescriptionFa: string;
  frequencyFa: string;
  accessDetailsFa: string;
  accessTypeFa: string; // 'رایگان' | 'پولی' | 'ترکیبی' | 'ثبت‌نام' | 'سایر'
  hasApiFa: string; // 'بله' | 'خیر'
  credibilityTier: 1 | 2 | 3;
  verificationStatusFa: string;
  isFreeAndNoApi: boolean;
  isFreeAny: boolean;
}

export function parseCsvLineFields(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

/**
 * Parses the 256-source Oil Market Platform CSV catalog into structured records
 * and flags sources that are Free (`نوع دسترسی === 'رایگان'`) and require no API (`API === 'خیر'`).
 */
export function parseCatalogCsvText(csvText: string): CatalogSourceRecord[] {
  const lines = csvText.split(/\r?\n/);
  const records: CatalogSourceRecord[] = [];

  for (const rawLine of lines) {
    if (!/^\d+(\.0)?,/.test(rawLine.trim())) continue;
    const cols = parseCsvLineFields(rawLine);
    if (cols.length < 13) continue;

    const rowNumber = Math.round(parseFloat(cols[0]) || 0);
    if (rowNumber <= 0) continue;

    const accessTypeFa = cols[9] || '';
    const hasApiFa = cols[10] || '';
    const rawTier = Math.round(parseFloat(cols[11]) || 2);
    const credibilityTier: 1 | 2 | 3 =
      rawTier === 1 ? 1 : rawTier === 3 ? 3 : 2;

    const isFreeAny = accessTypeFa === 'رایگان';
    const isFreeAndNoApi = accessTypeFa === 'رایگان' && hasApiFa === 'خیر';

    records.push({
      rowNumber,
      categoryFa: cols[1] || '',
      subcategoryFa: cols[2] || '',
      sourceName: cols[3] || '',
      publisherOrNoteFa: cols[4] || '',
      websiteUrl: cols[5] || '',
      dataDescriptionFa: cols[6] || '',
      frequencyFa: cols[7] || '',
      accessDetailsFa: cols[8] || '',
      accessTypeFa,
      hasApiFa,
      credibilityTier,
      verificationStatusFa: cols[12] || '',
      isFreeAndNoApi,
      isFreeAny,
    });
  }

  return records;
}




