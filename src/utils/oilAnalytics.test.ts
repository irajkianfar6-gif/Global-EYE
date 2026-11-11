import test from 'node:test';
import assert from 'node:assert/strict';
import {
  toPersianDigits,
  evaluateEiaStockSignal,
  computeDaysOfSupply,
  evaluateShockTriangulation,
  computeShockWindowSummary,
  evaluateForecastModel,
  computeCrackSpread321,
  computeDataQualityScore,
  simulateMarketScenario,
  computeRealtimeBenchmarkTick,
  RealtimeBenchmarkQuote,
} from './oilAnalytics';

test('toPersianDigits converts ASCII digits to Persian numerals', () => {
  assert.equal(toPersianDigits('2026-10-30'), '۲۰۲۶-۱۰-۳۰');
  assert.equal(toPersianDigits(82.75), '۸۲.۷۵');
});

test('evaluateEiaStockSignal detects bearish build vs 5-year seasonal norm (Gasoline in dossier)', () => {
  // Dossier section 8: Gasoline wow = +4.1 mb, avg5yChange = -0.1 mb -> rel_vs_5y = +4.2 mb -> bearish
  const res = evaluateEiaStockSignal({
    wowChangeMb: 4.1,
    avg5yChangeMb: -0.1,
    threshold5yMb: 1.0,
    thresholdConsensusMb: 1.5,
  });
  assert.equal(res.relativeVs5yChange, 4.2);
  assert.equal(res.direction, 'bearish');
  assert.equal(res.directionFa, 'فشار نزولی');
  assert.equal(res.strength, 'strong');
});

test('evaluateEiaStockSignal detects supportive draw when consensus surprise is negative beyond threshold', () => {
  const res = evaluateEiaStockSignal({
    wowChangeMb: -3.8,
    avg5yChangeMb: -1.0,
    expectedChangeMb: -1.2,
    threshold5yMb: 1.5,
    thresholdConsensusMb: 2.0,
  });
  assert.equal(res.surprise, -2.6);
  assert.equal(res.direction, 'supportive');
  assert.equal(res.directionFa, 'حمایتی برای قیمت');
});

test('computeDaysOfSupply calculates stock coverage accurately', () => {
  // 415.0 mb crude stocks / 15,660 kb/d refinery runs = 26.5 days
  assert.equal(computeDaysOfSupply(415.0, 15660), 26.5);
});

test('evaluateShockTriangulation identifies agree, partial, and disagree across Kilian, BH, and Kanzig', () => {
  // 2026-05 in dossier: +1.4, +1.5, +1.5 -> agree
  assert.deepEqual(evaluateShockTriangulation(1.4, 1.5, 1.5), {
    label: 'agree',
    labelFa: 'همسو',
  });
  // 2026-06 in dossier: 0.0, -0.7, 0.0 -> partial
  assert.deepEqual(evaluateShockTriangulation(0.0, -0.7, 0.0), {
    label: 'partial',
    labelFa: 'نیمه‌همسو',
  });
  // 2026-07 in dossier: +0.4, +1.1, -0.4 -> disagree
  assert.deepEqual(evaluateShockTriangulation(0.4, 1.1, -0.4), {
    label: 'disagree',
    labelFa: 'ناهمسو',
  });
});

test('computeShockWindowSummary matches 12-month log points and percent change in dossier', () => {
  // Dossier 12m: oilSpecific +17.2, supply +6.2, aggDemand -11.2, base 0.0 -> sum +12.2 log pts -> ~13.0%
  const res = computeShockWindowSummary({
    oilSpecificDemand: 17.2,
    supply: 6.2,
    aggregateDemand: -11.3,
    base: 0.0,
  });
  assert.equal(res.totalLogPoints, 12.1);
  assert.equal(res.priceChangePct, 12.9);
});

test('evaluateForecastModel enforces Diebold-Mariano significance and sample size', () => {
  assert.equal(
    evaluateForecastModel({ n: 224, mspeRatio: 0.54, dmPvalue: 0.0001 }).verdict,
    'significantly_better'
  );
  assert.equal(
    evaluateForecastModel({ n: 199, mspeRatio: 0.88, dmPvalue: 0.16 }).verdict,
    'better_not_significant'
  );
  assert.equal(
    evaluateForecastModel({ n: 213, mspeRatio: 1.09, dmPvalue: 0.781 }).verdict,
    'not_better'
  );
  assert.equal(
    evaluateForecastModel({ n: 15, minN: 30, mspeRatio: 0.7, dmPvalue: 0.01 }).verdict,
    'insufficient_sample'
  );
});

test('computeCrackSpread321 and computeDataQualityScore return expected values', () => {
  // 3:2:1 crack: crude $80, gasoline $98, diesel $104 -> (196 + 104 - 240)/3 = $20.00/bbl
  assert.equal(computeCrackSpread321(80, 98, 104), 20);
  // Tier 1 (60) + freshness 15 + consistency 14 + revision 9 = 98
  assert.equal(
    computeDataQualityScore({
      tier: 1,
      freshnessScore: 15,
      consistencyScore: 14,
      revisionStabilityScore: 9,
    }),
    98
  );
});

test('simulateMarketScenario calculates price, balance, and revenue impact', () => {
  const sim = simulateMarketScenario({
    baseBrentUsd: 82.75,
    opecSupplyDeltaMbd: -1.0, // 1 mb/d cut -> +$6.5
    chokepointDisruptionMbd: 1.0, // 1 mb/d disruption -> +$9.2
    globalDemandDeltaMbd: 0,
    dxyChangePct: 0,
    orgExportVolumeMbd: 1.6,
    orgFiscalBreakevenUsd: 75,
  });
  assert.equal(sim.projectedBrentUsd, 98.45);
  assert.equal(sim.newBalanceMbd, -1.4);
  assert.ok(sim.revenueDeltaB > 0);
});

test('computeRealtimeBenchmarkTick updates price, changePct, and up/down directional indicators', () => {
  const baseQuote: RealtimeBenchmarkQuote = {
    id: 'wti',
    code: 'WTI',
    nameEn: 'WTI',
    nameFa: 'نفت WTI',
    price: 79.82,
    openPrice: 78.89,
    changeUsd: 0.93,
    changePct: 1.18,
    direction: 'up',
    lastTickDirection: 'up',
    lastTickDelta: 0.05,
  };

  const tickedUp = computeRealtimeBenchmarkTick(baseQuote, 0.18);
  assert.equal(tickedUp.price, 80.0);
  assert.equal(tickedUp.changeUsd, 1.11);
  assert.equal(tickedUp.direction, 'up');
  assert.equal(tickedUp.lastTickDirection, 'up');

  const tickedDown = computeRealtimeBenchmarkTick(tickedUp, -1.5);
  assert.equal(tickedDown.price, 78.5);
  assert.equal(tickedDown.changeUsd, -0.39);
  assert.equal(tickedDown.direction, 'down');
  assert.equal(tickedDown.lastTickDirection, 'down');
});

