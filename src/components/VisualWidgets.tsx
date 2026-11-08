import React, { useState } from 'react';

/**
 * High-contrast 3D-styled Metallic Oil Barrel with Golden Oil Droplet & Orbit Ring
 * Matches Screenshots 1, 2, and 4
 */
export const OilBarrelVisual: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const dims = size === 'sm' ? 'w-14 h-14' : size === 'lg' ? 'w-32 h-32' : 'w-20 h-20';
  return (
    <div className={`relative flex items-center justify-center shrink-0 select-none ${dims}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id="barrelBody" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="30%" stopColor="#475569" />
            <stop offset="55%" stopColor="#0f172a" />
            <stop offset="85%" stopColor="#334155" />
            <stop offset="100%" stopColor="#090d16" />
          </linearGradient>
          <linearGradient id="barrelTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="goldDrop" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>
          <linearGradient id="orbitRing" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(234, 179, 8, 0.1)" />
            <stop offset="50%" stopColor="rgba(250, 204, 21, 0.85)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.2)" />
          </linearGradient>
        </defs>
        {/* Shadow */}
        <ellipse cx="60" cy="106" rx="34" ry="7" fill="rgba(15, 23, 42, 0.22)" />
        {/* Back Orbit */}
        <ellipse
          cx="60"
          cy="66"
          rx="48"
          ry="16"
          fill="none"
          stroke="url(#orbitRing)"
          strokeWidth="2"
          transform="rotate(-14 60 66)"
          strokeDasharray="4 3"
        />
        {/* Barrel Cylinder */}
        <path
          d="M32 28 C32 22, 88 22, 88 28 L88 92 C88 99, 32 99, 32 92 Z"
          fill="url(#barrelBody)"
          stroke="#475569"
          strokeWidth="1"
        />
        {/* Barrel Ribs */}
        <path d="M31 47 Q60 54 89 47" fill="none" stroke="#64748b" strokeWidth="2.5" />
        <path d="M31 73 Q60 80 89 73" fill="none" stroke="#64748b" strokeWidth="2.5" />
        {/* Top Rim */}
        <ellipse cx="60" cy="28" rx="28" ry="8" fill="url(#barrelTop)" stroke="#94a3b8" strokeWidth="1.2" />
        <ellipse cx="48" cy="27" rx="3.5" ry="1.5" fill="#0f172a" />
        <ellipse cx="72" cy="28" rx="2.5" ry="1.1" fill="#0f172a" />
        {/* Golden Oil Drop */}
        <path
          d="M60 49 C60 49, 50 62, 50 68 A10 10 0 1 0 70 68 C70 62, 60 49, 60 49 Z"
          fill="url(#goldDrop)"
        />
        <ellipse cx="57" cy="66" rx="2.2" ry="4" fill="rgba(255,255,255,0.55)" transform="rotate(-15 57 66)" />
        {/* Front Orbit Arc */}
        <path
          d="M14 72 C25 86, 95 78, 106 58"
          fill="none"
          stroke="url(#orbitRing)"
          strokeWidth="2.5"
        />
      </svg>
    </div>
  );
};

/**
 * 3D Connected Oil Trade Globe SVG (Matches Screenshot 5 & Screenshot 3)
 */
export const GlobalOilSphereVisual: React.FC<{ className?: string }> = ({ className = 'w-44 h-44' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <radialGradient id="globeSphere" cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="45%" stopColor="#0f172a" />
            <stop offset="85%" stopColor="#020617" />
            <stop offset="100%" stopColor="#1e293b" />
          </radialGradient>
          <linearGradient id="goldArc" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4f338" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        {/* Outer Halo */}
        <circle cx="100" cy="100" r="86" fill="none" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" />
        <ellipse
          cx="100"
          cy="100"
          rx="94"
          ry="34"
          fill="none"
          stroke="url(#goldArc)"
          strokeWidth="1.5"
          transform="rotate(-22 100 100)"
          opacity="0.7"
        />
        {/* Main Sphere */}
        <circle cx="100" cy="100" r="74" fill="url(#globeSphere)" stroke="#475569" strokeWidth="1.2" />
        {/* Latitude / Longitude Grid */}
        <ellipse cx="100" cy="100" rx="74" ry="26" fill="none" stroke="rgba(148,163,184,0.16)" strokeWidth="1" />
        <ellipse cx="100" cy="100" rx="74" ry="52" fill="none" stroke="rgba(148,163,184,0.14)" strokeWidth="1" />
        <ellipse cx="100" cy="100" rx="28" ry="74" fill="none" stroke="rgba(148,163,184,0.16)" strokeWidth="1" />
        <ellipse cx="100" cy="100" rx="54" ry="74" fill="none" stroke="rgba(148,163,184,0.14)" strokeWidth="1" />
        {/* Stylized Continents & Shipping Hubs */}
        <path
          d="M75 68 Q92 60 112 72 Q125 84 118 98 Q102 104 88 92 Z"
          fill="rgba(234, 179, 8, 0.18)"
          stroke="rgba(250, 204, 21, 0.45)"
          strokeWidth="1"
        />
        <path
          d="M120 75 Q142 70 155 88 Q148 110 130 106 Z"
          fill="rgba(56, 189, 248, 0.15)"
          stroke="rgba(56, 189, 248, 0.4)"
          strokeWidth="1"
        />
        <path
          d="M48 82 Q64 78 68 96 Q60 118 46 110 Z"
          fill="rgba(212, 243, 56, 0.15)"
          stroke="rgba(212, 243, 56, 0.4)"
          strokeWidth="1"
        />
        {/* Active Trade Arcs (Hormuz -> Asia, Hormuz -> Europe, US Gulf -> Europe) */}
        <path
          d="M112 92 Q132 76 150 92"
          fill="none"
          stroke="#d4f338"
          strokeWidth="2"
          strokeDasharray="3 2"
        />
        <path
          d="M112 92 Q96 72 82 76"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
        />
        <path
          d="M58 90 Q72 68 82 76"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.8"
        />
        {/* Glowing Chokepoint Nodes */}
        {/* Hormuz */}
        <circle cx="112" cy="92" r="6" fill="rgba(239, 68, 68, 0.35)" />
        <circle cx="112" cy="92" r="3" fill="#ef4444" />
        {/* Rotterdam / ARA */}
        <circle cx="82" cy="76" r="5" fill="rgba(212, 243, 56, 0.3)" />
        <circle cx="82" cy="76" r="2.5" fill="#d4f338" />
        {/* East Asia / Malacca */}
        <circle cx="150" cy="92" r="5" fill="rgba(245, 158, 11, 0.3)" />
        <circle cx="150" cy="92" r="2.5" fill="#f59e0b" />
        {/* US Gulf / Cushing */}
        <circle cx="58" cy="90" r="5" fill="rgba(56, 189, 248, 0.3)" />
        <circle cx="58" cy="90" r="2.5" fill="#38bdf8" />
      </svg>
    </div>
  );
};

/**
 * Smooth Area Sparkline SVG
 */
export const MiniSparkline: React.FC<{
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}> = ({ data, color = '#10b981', height = 44, width = 120 }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 4;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - pad * 2) + pad;
    const y = height - pad - ((v - min) / range) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `${linePath} L ${width - pad},${height} L ${pad},${height} Z`;
  const gradId = `spark-${color.replace(/[^a-zA-Z0-9]/g, '')}-${data[0]}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible shrink-0">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.32" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export interface MapHotspot {
  id: string;
  nameFa: string;
  x: number;
  y: number;
  level: 'high' | 'medium' | 'low';
  metricFa: string;
  detailFa: string;
}

const DEFAULT_HOTSPOTS: MapHotspot[] = [
  {
    id: 'hormuz',
    nameFa: 'تنگه هرمز و خلیج فارس',
    x: 318,
    y: 112,
    level: 'high',
    metricFa: '۱۹٫۸ mb/d · ریسک ۸۲/۱۰۰',
    detailFa: 'هشدار سطح HIGH؛ افزایش نرخ بیمه جنگ به ۰٫۴۵٪ و نوسان AIS',
  },
  {
    id: 'redsea',
    nameFa: 'باب‌المندب و دریای سرخ',
    x: 296,
    y: 126,
    level: 'high',
    metricFa: '۳٫۴ mb/d · ریسک ۸۶/۱۰۰',
    detailFa: 'انحراف ۶۰٪ نفتکش‌ها به مسیر دماغه امید نیک',
  },
  {
    id: 'usgulf',
    nameFa: 'کاشینگ و خلیج مکزیک (آمریکا)',
    x: 118,
    y: 98,
    level: 'low',
    metricFa: '۴۱۵٫۰ mb موجودی · کم‌ریسک',
    detailFa: 'موجودی کاشینگ ۲۲٫۳ میلیون بشکه؛ تولید ۱۳٫۲۸ میلیون بشکه در روز',
  },
  {
    id: 'ara',
    nameFa: 'هاب ARA (روتردام) و دریای شمال',
    x: 248,
    y: 72,
    level: 'low',
    metricFa: 'برنت ۸۲٫۷۵ $ · پایدار',
    detailFa: 'موجودی گازوئیل و سوخت جت اروپا در محدوده نرمال ۵ ساله',
  },
  {
    id: 'cpc',
    nameFa: 'دریای سیاه، CPC و اورال',
    x: 292,
    y: 82,
    level: 'medium',
    metricFa: '۳٫۶ mb/d · سقف قیمت ۴۴٫۱۰$',
    detailFa: 'نظارت تحریمی اتحادیه اروپا (بسته ۶۷۱ کشتی) و توقف‌های دوره‌ای CPC',
  },
  {
    id: 'malacca',
    nameFa: 'تنگه مالاکا و ذخایر سنگاپور/چین',
    x: 386,
    y: 136,
    level: 'medium',
    metricFa: '۲۳٫۲ mb/d · واردات چین ۱۱٫۱ mb/d',
    detailFa: 'پایش انتقال کشتی‌به‌کشتی (STS) در شرق شبه‌جزیره مالایا',
  },
  {
    id: 'latam',
    nameFa: 'برزیل، گویان و ونزوئلا',
    x: 158,
    y: 158,
    level: 'low',
    metricFa: '۴٫۴ mb/d عرضه دریایی',
    detailFa: 'رشد تولید میدان‌های زیرنمکی برزیل (ANP) و گویان',
  },
];

/**
 * Interactive World Oil Market & Chokepoint Map (Matches Screenshots 1, 2, 4)
 */
export const WorldOilMapSvg: React.FC<{
  onSelectHotspot?: (spot: MapHotspot) => void;
}> = ({ onSelectHotspot }) => {
  const [activeSpot, setActiveSpot] = useState<MapHotspot>(DEFAULT_HOTSPOTS[0]);

  const colorMap = {
    high: { fill: '#ef4444', ring: 'rgba(239, 68, 68, 0.32)', label: 'پرریسک' },
    medium: { fill: '#f59e0b', ring: 'rgba(245, 158, 11, 0.32)', label: 'متوسط' },
    low: { fill: '#10b981', ring: 'rgba(16, 185, 129, 0.32)', label: 'کم‌ریسک' },
  };

  return (
    <div className="relative w-full">
      <svg viewBox="0 0 500 220" className="w-full h-44 select-none">
        {/* Stylized World Continents Silhouette */}
        <g fill="#CBD5E1" opacity="0.78">
          {/* North America */}
          <path d="M42 42 L112 36 L146 68 L130 108 L96 116 L72 92 L48 76 Z" />
          {/* South America */}
          <path d="M132 124 L172 132 L184 166 L160 204 L138 192 L128 152 Z" />
          {/* Europe */}
          <path d="M222 44 L278 38 L294 68 L272 86 L232 84 L218 66 Z" />
          {/* Africa */}
          <path d="M224 94 L278 92 L302 128 L286 184 L254 190 L236 148 L216 120 Z" />
          {/* Middle East & Asia */}
          <path d="M286 52 L428 42 L456 88 L424 138 L374 146 L342 126 L292 122 L282 88 Z" />
          {/* Australia */}
          <path d="M392 158 L446 156 L456 188 L412 196 L388 180 Z" />
        </g>

        {/* Maritime Oil Transit Corridors */}
        <path
          d="M318 112 Q352 134 386 136"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <path
          d="M318 112 Q296 126 276 96 Q256 80 248 72"
          fill="none"
          stroke="#ef4444"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <path
          d="M118 98 Q184 82 248 72"
          fill="none"
          stroke="#10b981"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />

        {/* Interactive Hotspot Pins */}
        {DEFAULT_HOTSPOTS.map((spot) => {
          const c = colorMap[spot.level];
          const isSelected = activeSpot.id === spot.id;
          return (
            <g
              key={spot.id}
              className="cursor-pointer"
              onClick={() => {
                setActiveSpot(spot);
                onSelectHotspot?.(spot);
              }}
            >
              <circle cx={spot.x} cy={spot.y} r={isSelected ? 15 : 11} fill={c.ring} />
              <circle
                cx={spot.x}
                cy={spot.y}
                r={isSelected ? 6.5 : 5}
                fill={c.fill}
                stroke="#ffffff"
                strokeWidth="1.8"
              />
            </g>
          );
        })}
      </svg>

      {/* Active Hotspot Callout Strip */}
      <div className="mt-1 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-100/90 px-3 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
            style={{ backgroundColor: colorMap[activeSpot.level].fill }}
          />
          <span className="font-bold text-slate-800">{activeSpot.nameFa}:</span>
          <span className="text-slate-600">{activeSpot.detailFa}</span>
        </div>
        <span className="font-mono-num font-semibold text-slate-900">{activeSpot.metricFa}</span>
      </div>
    </div>
  );
};

/**
 * Multi-Segment Donut Chart SVG
 */
export const DonutChartSvg: React.FC<{
  centerTop: string;
  centerBottom: string;
  segments: { value: number; color: string; label: string }[];
  size?: number;
}> = ({ centerTop, centerBottom, segments, size = 132 }) => {
  const total = segments.reduce((acc, s) => acc + s.value, 0) || 1;
  const r = 46;
  const c = 2 * Math.PI * r;
  let accumulated = 0;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e2e8f0" strokeWidth="14" />
        {segments.map((seg, idx) => {
          const frac = seg.value / total;
          const dash = frac * c;
          const offset = c - accumulated * c;
          accumulated += frac;
          return (
            <circle
              key={idx}
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="14"
              strokeDasharray={`${Math.max(0, dash - 2)} ${c}`}
              strokeDashoffset={offset}
              strokeLinecap="butt"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="font-mono-num text-lg font-extrabold text-slate-900 leading-tight">{centerTop}</span>
        <span className="text-[11px] font-medium text-slate-500">{centerBottom}</span>
      </div>
    </div>
  );
};
