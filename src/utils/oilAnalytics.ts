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
