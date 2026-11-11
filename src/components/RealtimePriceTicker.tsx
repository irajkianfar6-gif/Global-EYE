import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Radio } from 'lucide-react';
import {
  RealtimeBenchmarkQuote,
  computeRealtimeBenchmarkTick,
} from '../utils/oilAnalytics';

const INITIAL_BENCHMARK_QUOTES: RealtimeBenchmarkQuote[] = [
  {
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
    lastTickDelta: 0.08,
  },
  {
    id: 'brent',
    code: 'BRENT',
    nameEn: 'Brent',
    nameFa: 'نفت برنت',
    price: 82.75,
    openPrice: 81.73,
    changeUsd: 1.02,
    changePct: 1.25,
    direction: 'up',
    lastTickDirection: 'up',
    lastTickDelta: 0.11,
  },
  {
    id: 'dubai',
    code: 'DUBAI',
    nameEn: 'Dubai',
    nameFa: 'نفت دوبی',
    price: 80.12,
    openPrice: 80.45,
    changeUsd: -0.33,
    changePct: -0.41,
    direction: 'down',
    lastTickDirection: 'down',
    lastTickDelta: -0.09,
  },
];

// Deterministic realistic micro-tick deltas (USD/bbl) for WTI, Brent, Dubai
const TICK_SEQUENCE: [number, number, number][] = [
  [0.09, 0.12, -0.06],
  [-0.14, -0.11, -0.08],
  [0.18, 0.15, 0.11],
  [-0.07, 0.06, -0.12],
  [0.11, -0.09, 0.14],
  [-0.12, -0.14, 0.05],
];

interface RealtimePriceTickerProps {
  onSelectBenchmark?: (benchmarkId: 'wti' | 'brent' | 'dubai') => void;
  compact?: boolean;
}

export const RealtimePriceTicker: React.FC<RealtimePriceTickerProps> = ({
  onSelectBenchmark,
  compact = false,
}) => {
  const [quotes, setQuotes] = useState<RealtimeBenchmarkQuote[]>(INITIAL_BENCHMARK_QUOTES);
  const [tickStep, setTickStep] = useState<number>(0);
  const [flashActive, setFlashActive] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(true);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setTickStep((prev) => {
        const nextIdx = (prev + 1) % TICK_SEQUENCE.length;
        const deltas = TICK_SEQUENCE[nextIdx];
        setQuotes((curr) =>
          curr.map((q, idx) => computeRealtimeBenchmarkTick(q, deltas[idx] ?? 0))
        );
        setFlashActive(true);
        setTimeout(() => setFlashActive(false), 550);
        return nextIdx;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [isLive]);

  const handleManualStep = () => {
    const nextIdx = (tickStep + 1) % TICK_SEQUENCE.length;
    const deltas = TICK_SEQUENCE[nextIdx];
    setTickStep(nextIdx);
    setQuotes((curr) =>
      curr.map((q, idx) => computeRealtimeBenchmarkTick(q, deltas[idx] ?? 0))
    );
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 550);
  };

  return (
    <div
      dir="ltr"
      role="region"
      aria-label="Real-time oil price ticker (WTI, Brent, Dubai)"
      data-testid="realtime-price-ticker"
      className={`flex items-center gap-1.5 rounded-lg bg-[#FAF9F5]/95 backdrop-blur-md border border-stone-300/90 shadow-xs ${
        compact ? 'px-2 py-1' : 'px-2.5 py-1.5'
      }`}
    >
      {/* Live Feed Status Badge */}
      <button
        type="button"
        onClick={() => setIsLive((v) => !v)}
        onDoubleClick={handleManualStep}
        title={
          isLive
            ? 'نرخ لحظه‌ای بازار فعال است (کلیک برای توقف / دابل‌کلیک برای تیک دستی)'
            : 'تیکر متوقف شده (کلیک برای فعال‌سازی مجدد)'
        }
        aria-label="وضعیت نرخ لحظه‌ای نفت"
        className="flex items-center gap-1.5 pr-2 border-r border-stone-300/80 text-[11px] font-bold text-stone-700 hover:text-stone-950 transition-colors cursor-pointer"
      >
        <span className="relative flex items-center justify-center h-2.5 w-2.5">
          {isLive && (
            <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-[#2D8A4E]/30" />
          )}
          <span
            className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
              isLive ? 'bg-[#2D8A4E]' : 'bg-stone-400'
            }`}
          />
        </span>
        <Radio className="w-3 h-3 text-[#B83E16] hidden sm:inline" />
        <span className="tracking-tight uppercase text-[10px] font-extrabold text-stone-600">
          LIVE
        </span>
      </button>

      {/* Benchmark Items: WTI, Brent, Dubai */}
      <div className="flex items-center divide-x divide-stone-200/90">
        {quotes.map((q) => {
          const isUp = q.direction === 'up';
          const isDown = q.direction === 'down';
          const tickUp = q.lastTickDirection === 'up';
          const tickDown = q.lastTickDirection === 'down';

          return (
            <button
              key={q.id}
              type="button"
              data-testid={`ticker-item-${q.id}`}
              onClick={() => onSelectBenchmark?.(q.id)}
              title={`${q.nameFa} (${q.nameEn}) — تغییر روزانه: ${
                q.changeUsd >= 0 ? `+${q.changeUsd.toFixed(2)}` : q.changeUsd.toFixed(2)
              }$ (${q.changePct >= 0 ? `+${q.changePct.toFixed(2)}%` : `${q.changePct.toFixed(2)}%`})`}
              className={`group flex items-center gap-1.5 px-2.5 py-0.5 rounded-md transition-colors cursor-pointer ${
                flashActive && tickUp
                  ? 'bg-[#2D8A4E]/12'
                  : flashActive && tickDown
                  ? 'bg-[#C84B31]/12'
                  : 'hover:bg-stone-200/60'
              }`}
            >
              {/* Benchmark Label */}
              <span className="text-[11px] font-extrabold tracking-tight text-[#1E1D1B]">
                {q.nameEn}
              </span>

              {/* Current Price */}
              <span className="font-mono-num text-[12px] font-bold text-[#1E1D1B]">
                ${q.price.toFixed(2)}
              </span>

              {/* Up/Down Indicator Badge */}
              <span
                data-testid={`ticker-indicator-${q.id}`}
                className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono-num font-bold leading-none ${
                  isUp
                    ? 'bg-[#2D8A4E]/15 text-[#1F7A3E]'
                    : isDown
                    ? 'bg-[#C84B31]/15 text-[#B83E16]'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {isUp ? (
                  <>
                    <TrendingUp className="w-2.5 h-2.5 stroke-[2.4]" aria-hidden="true" />
                    <span>▲</span>
                  </>
                ) : isDown ? (
                  <>
                    <TrendingDown className="w-2.5 h-2.5 stroke-[2.4]" aria-hidden="true" />
                    <span>▼</span>
                  </>
                ) : (
                  <Minus className="w-2.5 h-2.5" aria-hidden="true" />
                )}
                <span>
                  {q.changePct >= 0 ? `+${q.changePct.toFixed(2)}%` : `${q.changePct.toFixed(2)}%`}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
