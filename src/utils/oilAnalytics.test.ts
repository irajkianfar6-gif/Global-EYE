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
  computeVintageRevisionStats,
  evaluateHitlQueueGate,
  convertNyReleaseToTehran,
  computeOrganizationalImpact,
  evaluateFiveLayerQualityGate,
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

test('computeVintageRevisionStats tracks point-in-time revisions and prevents look-ahead bias', () => {
  const vintages = [
    { vintageId: 'v1', vintageTs: '2026-10-16T14:30:00Z', value: 416.2, method: 'reported', noteFa: 'انتشار اولیه' },
    { vintageId: 'v2', vintageTs: '2026-10-23T14:30:00Z', value: 415.4, method: 'reported', noteFa: 'بازنگری هفتگی' },
    { vintageId: 'v3', vintageTs: '2026-10-28T14:30:00Z', value: 415.0, method: 'reported', noteFa: 'تثبیت ماهانه PSM' },
  ];
  const statsSafe = computeVintageRevisionStats(vintages, '2026-10-30T00:00:00Z');
  assert.equal(statsSafe.initialValue, 416.2);
  assert.equal(statsSafe.latestValue, 415.0);
  assert.equal(statsSafe.netRevision, -1.2);
  assert.equal(statsSafe.lookAheadSafe, true);

  const statsLookAhead = computeVintageRevisionStats(vintages, '2026-10-20T00:00:00Z');
  assert.equal(statsLookAhead.lookAheadSafe, false);
});

test('evaluateHitlQueueGate enforces Pattern C row-sum, Pattern D dual-media, and Tier-3 corroboration', () => {
  // Pattern C with row-sum mismatch and not approved -> BLOCKED
  assert.equal(
    evaluateHitlQueueGate({
      pattern: 'C_PDF',
      rowSumDelta: 18,
      independentSourcesCount: 1,
      analystApproved: false,
    }).gateStatus,
    'BLOCKED'
  );
  // Pattern D with 1 source and not approved -> PENDING_HUMAN
  assert.equal(
    evaluateHitlQueueGate({
      pattern: 'D_OSP',
      independentSourcesCount: 1,
      analystApproved: false,
    }).gateStatus,
    'PENDING_HUMAN'
  );
  // Pattern D approved by analyst -> APPROVED
  assert.equal(
    evaluateHitlQueueGate({
      pattern: 'D_OSP',
      independentSourcesCount: 2,
      analystApproved: true,
    }).gateStatus,
    'APPROVED'
  );
  // Tier 3 with only 1 source -> BLOCKED even if analystApproved is true
  assert.equal(
    evaluateHitlQueueGate({
      pattern: 'TIER3_ALERT',
      independentSourcesCount: 1,
      analystApproved: true,
    }).gateStatus,
    'BLOCKED'
  );
});

test('convertNyReleaseToTehran converts EIA WPSR 10:30 ET to 18:00 (EDT) and 19:00 (EST) Tehran time', () => {
  const summerEdt = convertNyReleaseToTehran({
    nyHour24: 10,
    nyMinute: 30,
    isUsDst: true,
    dayOfWeekFa: 'چهارشنبه',
  });
  assert.equal(summerEdt.tehranFormatted, '18:00 تهران');
  assert.equal(summerEdt.effectiveDayFa, 'چهارشنبه');

  const winterEst = convertNyReleaseToTehran({
    nyHour24: 10,
    nyMinute: 30,
    isUsDst: false,
    isUsHolidayWeek: true,
    holidayShiftHours: 0.5,
    dayOfWeekFa: 'چهارشنبه',
  });
  assert.equal(winterEst.tehranFormatted, '19:30 تهران');
  assert.equal(winterEst.effectiveDayFa, 'پنج‌شنبه');
});

test('computeOrganizationalImpact computes FOB netback, annual export revenue, and hedging floor', () => {
  const impact = computeOrganizationalImpact({
    benchmarkDubaiUsd: 80.12,
    ospDiffUsd: 1.85,
    vlccFreightUsdBbl: 2.45,
    warRiskInsuranceUsdBbl: 0.55,
    commercialDiscountUsdBbl: 3.97,
    exportVolumeMbd: 1.6,
    budgetTargetVolumeMbd: 1.5,
    fiscalBreakevenUsd: 72.0,
    hedgeCoverageRatioPct: 50,
    hedgeFloorUsd: 78.0,
    downsideBenchmarkDubaiUsd: 64.0,
  });
  // 80.12 + 1.85 - 2.45 - 0.55 - 3.97 = 75.00 USD/bbl
  assert.equal(impact.realizedFobNetbackUsd, 75.0);
  assert.equal(impact.netbackMarginVsBreakevenUsd, 3.0);
  assert.ok(impact.hedgingProtectionGainBusd > 0);
});

test('evaluateFiveLayerQualityGate validates 5-layer quality and anomaly engine for Wave-1 series', () => {
  const passGate = evaluateFiveLayerQualityGate({
    seriesId: 'DCOILBRENTEU',
    sourceCode: 'FRED',
    tier: 1,
    latestValue: 82.75,
    latestDateIso: '2026-11-10',
    referenceNowIso: '2026-11-11T10:00:00Z',
    slaMaxAgeDays: 5,
    rollingMean: 80.5,
    rollingStdDev: 2.5,
    sha256RawHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    crossSourceDelta: 2.93,
    crossSourceMaxTolerance: 8.0,
  });
  assert.equal(passGate.layer1SchemaOk, true);
  assert.equal(passGate.layer2FreshnessOk, true);
  assert.equal(passGate.layer3Status, 'NORMAL');
  assert.equal(passGate.warehouseGate, 'PASS_AUTO_WAREHOUSE');
  assert.ok(passGate.layer5CompositeScore >= 95);

  const quarantineGate = evaluateFiveLayerQualityGate({
    seriesId: 'W_EPC0_SAX_YCUOK_MBBL',
    sourceCode: 'EIA',
    tier: 1,
    latestValue: 465.0,
    latestDateIso: '2026-11-06',
    referenceNowIso: '2026-11-11T10:00:00Z',
    slaMaxAgeDays: 7,
    rollingMean: 415.0,
    rollingStdDev: 10.0, // Z = +5.0 -> ANOMALY_CRITICAL
    sha256RawHash: 'a3f1c94081d4a7901b9204c188f0e49b12093a4bc827162534189a0c12345678',
    crossSourceDelta: 0.4,
    crossSourceMaxTolerance: 5.0,
  });
  assert.equal(quarantineGate.layer3Status, 'ANOMALY_CRITICAL');
  assert.equal(quarantineGate.warehouseGate, 'QUARANTINE_HITL');
});



