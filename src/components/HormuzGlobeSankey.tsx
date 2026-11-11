import React, { useEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5themes_Responsive from '@amcharts/amcharts5/themes/Responsive';

export interface HormuzFlowRoute {
  id: string;
  nameFa: string;
  nameEn: string;
  volumeMbd: number;
  strokeWidth: number;
  colorHex: number;
  opacity: number;
  pointIds: string[];
  dropsCount: number;
  durationMs: number;
}

export interface SeaNodePoint {
  id: string;
  latitude: number;
  longitude: number;
  kind: 'terminal' | 'chokepoint' | 'port' | 'waypoint';
  nameEn?: string;
  nameFa?: string;
  volumeMbd?: string;
  countryFa?: string;
}

/**
 * Sea nodes:
 * 1) Persian Gulf Export Terminals (Origins)
 * 2) Strait of Hormuz & Sea Waypoints (keeping all routes strictly at sea)
 * 3) Receiving Ports in Asia and Europe (Destinations)
 */
export const HORMUZ_SEA_NODES: SeaNodePoint[] = [
  // --- 1. Persian Gulf Crude Export Terminals ---
  {
    id: 'term_ras_tanura',
    latitude: 26.64,
    longitude: 50.16,
    kind: 'terminal',
    nameEn: 'Ras Tanura',
    nameFa: 'پایانه راس تنوره (عربستان)',
    volumeMbd: '۶٫۲۰ mb/d',
    countryFa: 'عربستان سعودی',
  },
  {
    id: 'term_basra',
    latitude: 29.68,
    longitude: 48.81,
    kind: 'terminal',
    nameEn: 'Basra (Al-Basra)',
    nameFa: 'پایانه البصره (عراق)',
    volumeMbd: '۳٫۴۵ mb/d',
    countryFa: 'عراق',
  },
  {
    id: 'term_kharg',
    latitude: 29.23,
    longitude: 50.32,
    kind: 'terminal',
    nameEn: 'Kharg Island',
    nameFa: 'پایانه جزیره خارگ (ایران)',
    volumeMbd: '۱٫۶۵ mb/d',
    countryFa: 'ایران',
  },
  {
    id: 'term_mina_ahmadi',
    latitude: 29.07,
    longitude: 48.16,
    kind: 'terminal',
    nameEn: 'Mina Al-Ahmadi',
    nameFa: 'پایانه مینا الاحمدی (کویت)',
    volumeMbd: '۱٫۹۵ mb/d',
    countryFa: 'کویت',
  },
  {
    id: 'term_jebel_dhanna',
    latitude: 24.19,
    longitude: 52.61,
    kind: 'terminal',
    nameEn: 'Jebel Dhanna / Das',
    nameFa: 'پایانه جبل الظنه و داس (امارات)',
    volumeMbd: '۲٫۸۵ mb/d',
    countryFa: 'امارات متحده عربی',
  },

  // --- 2. Sea Waypoints & Maritime Chokepoints (Keeping routes strictly at sea) ---
  { id: 'wp_gulf_north', latitude: 28.1, longitude: 50.4, kind: 'waypoint' },
  { id: 'wp_gulf_central', latitude: 26.2, longitude: 52.8, kind: 'waypoint' },
  { id: 'wp_hormuz_west', latitude: 26.25, longitude: 55.15, kind: 'waypoint' },
  {
    id: 'choke_hormuz',
    latitude: 26.56,
    longitude: 56.25,
    kind: 'chokepoint',
    nameEn: 'Strait of Hormuz',
    nameFa: 'تنگه هرمز (گلوگاه اصلی صادرات نفت)',
    volumeMbd: '۲۰٫۹ mb/d',
    countryFa: 'خلیج فارس / دریای عمان',
  },
  { id: 'wp_gulf_of_oman', latitude: 24.8, longitude: 58.2, kind: 'waypoint' },
  { id: 'wp_arabian_sea_north', latitude: 22.2, longitude: 62.0, kind: 'waypoint' },
  { id: 'wp_arabian_sea_east', latitude: 18.0, longitude: 66.5, kind: 'waypoint' },
  { id: 'wp_laccadive_sea', latitude: 7.2, longitude: 75.8, kind: 'waypoint' },
  { id: 'wp_sri_lanka_south', latitude: 5.2, longitude: 81.8, kind: 'waypoint' },
  { id: 'wp_bay_of_bengal_south', latitude: 5.8, longitude: 92.5, kind: 'waypoint' },
  { id: 'wp_malacca_entry', latitude: 5.5, longitude: 97.6, kind: 'waypoint' },
  {
    id: 'choke_malacca',
    latitude: 2.3,
    longitude: 101.6,
    kind: 'chokepoint',
    nameEn: 'Strait of Malacca',
    nameFa: 'تنگه مالاکا (مسیر شرق آسیا)',
    volumeMbd: '۱۶٫۰ mb/d',
    countryFa: 'جنوب شرق آسیا',
  },
  { id: 'wp_singapore_strait', latitude: 1.2, longitude: 104.4, kind: 'waypoint' },
  { id: 'wp_scs_south', latitude: 7.5, longitude: 108.5, kind: 'waypoint' },
  { id: 'wp_scs_mid', latitude: 14.5, longitude: 113.2, kind: 'waypoint' },
  { id: 'wp_scs_north', latitude: 20.5, longitude: 117.8, kind: 'waypoint' },
  { id: 'wp_taiwan_east', latitude: 24.2, longitude: 123.0, kind: 'waypoint' },
  { id: 'wp_ecs_mid', latitude: 29.8, longitude: 126.2, kind: 'waypoint' },
  { id: 'wp_korea_south', latitude: 33.2, longitude: 128.8, kind: 'waypoint' },
  { id: 'wp_japan_south', latitude: 32.8, longitude: 136.0, kind: 'waypoint' },

  // Westbound Sea Waypoints (Arabian Sea -> Bab el-Mandeb -> Red Sea -> Suez -> Med -> Atlantic -> Europe)
  { id: 'wp_arabian_sea_west', latitude: 16.5, longitude: 56.0, kind: 'waypoint' },
  { id: 'wp_socotra_north', latitude: 13.4, longitude: 51.2, kind: 'waypoint' },
  { id: 'wp_gulf_of_aden', latitude: 12.1, longitude: 46.2, kind: 'waypoint' },
  {
    id: 'choke_bab_el_mandeb',
    latitude: 12.65,
    longitude: 43.35,
    kind: 'chokepoint',
    nameEn: 'Bab el-Mandeb',
    nameFa: 'تنگه باب‌المندب (ورودی دریای سرخ)',
    volumeMbd: '۴٫۲ mb/d',
    countryFa: 'دریای سرخ',
  },
  { id: 'wp_red_sea_south', latitude: 16.8, longitude: 40.6, kind: 'waypoint' },
  { id: 'wp_red_sea_north', latitude: 24.2, longitude: 36.2, kind: 'waypoint' },
  { id: 'wp_gulf_of_suez', latitude: 28.4, longitude: 33.2, kind: 'waypoint' },
  {
    id: 'choke_suez',
    latitude: 31.26,
    longitude: 32.31,
    kind: 'chokepoint',
    nameEn: 'Suez / SUMED',
    nameFa: 'کانال سوئز و خط لوله سومد',
    volumeMbd: '۳٫۸ mb/d',
    countryFa: 'مصر / مدیترانه',
  },
  { id: 'wp_med_east', latitude: 33.8, longitude: 29.5, kind: 'waypoint' },
  { id: 'wp_med_crete', latitude: 34.6, longitude: 23.2, kind: 'waypoint' },
  { id: 'wp_med_ionian', latitude: 36.8, longitude: 17.5, kind: 'waypoint' },
  { id: 'wp_adriatic_south', latitude: 40.2, longitude: 18.9, kind: 'waypoint' },
  { id: 'wp_med_sicily', latitude: 37.4, longitude: 11.2, kind: 'waypoint' },
  { id: 'wp_med_west', latitude: 36.8, longitude: 2.5, kind: 'waypoint' },
  { id: 'wp_gibraltar', latitude: 35.95, longitude: -5.6, kind: 'waypoint' },
  { id: 'wp_iberia_west', latitude: 40.5, longitude: -10.2, kind: 'waypoint' },
  { id: 'wp_biscay_west', latitude: 46.5, longitude: -7.5, kind: 'waypoint' },
  { id: 'wp_english_channel', latitude: 50.2, longitude: -1.2, kind: 'waypoint' },

  // --- 3. Destination Ports in Asia and Europe ---
  {
    id: 'port_jamnagar',
    latitude: 22.47,
    longitude: 69.85,
    kind: 'port',
    nameEn: 'Jamnagar (India)',
    nameFa: 'بندر جام‌نگر و سیکا (هند)',
    volumeMbd: '۲٫۵۵ mb/d',
    countryFa: 'هند',
  },
  {
    id: 'port_singapore',
    latitude: 1.26,
    longitude: 103.82,
    kind: 'port',
    nameEn: 'Singapore Hub',
    nameFa: 'بندر جورونگ سنگاپور',
    volumeMbd: '۱٫۴۵ mb/d',
    countryFa: 'سنگاپور',
  },
  {
    id: 'port_nghi_son',
    latitude: 19.31,
    longitude: 105.8,
    kind: 'port',
    nameEn: 'Nghi Son (Vietnam)',
    nameFa: 'بندر پالایشی نگی‌سون (ویتنام)',
    volumeMbd: '۰٫۵۲ mb/d',
    countryFa: 'ویتنام',
  },
  {
    id: 'port_ningbo',
    latitude: 29.87,
    longitude: 121.85,
    kind: 'port',
    nameEn: 'Ningbo-Zhoushan (China)',
    nameFa: 'بندر نینگبو-ژوشان (چین)',
    volumeMbd: '۵٫۴۰ mb/d',
    countryFa: 'چین',
  },
  {
    id: 'port_ulsan',
    latitude: 35.5,
    longitude: 129.38,
    kind: 'port',
    nameEn: 'Ulsan (South Korea)',
    nameFa: 'بندر اولسان (کره جنوبی)',
    volumeMbd: '۱٫۸۵ mb/d',
    countryFa: 'کره جنوبی',
  },
  {
    id: 'port_yokohama',
    latitude: 35.45,
    longitude: 139.75,
    kind: 'port',
    nameEn: 'Yokohama / Chiba (Japan)',
    nameFa: 'بندر یوکوهاما و چیبا (ژاپن)',
    volumeMbd: '۱٫۶۵ mb/d',
    countryFa: 'ژاپن',
  },
  {
    id: 'port_ceyhan',
    latitude: 36.88,
    longitude: 35.93,
    kind: 'port',
    nameEn: 'Ceyhan / İzmit (Turkey)',
    nameFa: 'پایانه جیهان و ایزمیت (ترکیه)',
    volumeMbd: '۱٫۰۸ mb/d',
    countryFa: 'ترکیه',
  },
  {
    id: 'port_trieste',
    latitude: 45.64,
    longitude: 13.76,
    kind: 'port',
    nameEn: 'Trieste (Italy / Central EU)',
    nameFa: 'بندر تریسته (ایتالیا و خط لوله TAL اروپا)',
    volumeMbd: '۰٫۹۵ mb/d',
    countryFa: 'ایتالیا / اتحادیه اروپا',
  },
  {
    id: 'port_rotterdam',
    latitude: 51.95,
    longitude: 4.14,
    kind: 'port',
    nameEn: 'Rotterdam (NW Europe)',
    nameFa: 'بندر روتردام (هلند / شمال غرب اروپا)',
    volumeMbd: '۱٫۳۵ mb/d',
    countryFa: 'هلند / اروپا',
  },
];

/**
 * Sankey Flow Bands from Persian Gulf Terminals -> Strait of Hormuz -> Ports in Asia & Europe.
 * Stroke widths are scaled proportionally to flow volume (mb/d) to form a true Map Sankey.
 */
export const HORMUZ_SANKEY_FLOWS: HormuzFlowRoute[] = [
  // Feeder 1: Basra + Mina Al-Ahmadi + Kharg -> Northern Gulf -> Central Gulf -> Hormuz
  {
    id: 'flow_basra_hormuz',
    nameFa: 'البصره (عراق) ← تنگه هرمز',
    nameEn: 'Basra Terminal → Strait of Hormuz',
    volumeMbd: 3.45,
    strokeWidth: 6.0,
    colorHex: 0xc84b20,
    opacity: 0.78,
    pointIds: [
      'term_basra',
      'wp_gulf_north',
      'wp_gulf_central',
      'wp_hormuz_west',
      'choke_hormuz',
    ],
    dropsCount: 3,
    durationMs: 6400,
  },
  {
    id: 'flow_kuwait_hormuz',
    nameFa: 'مینا الاحمدی (کویت) ← تنگه هرمز',
    nameEn: 'Mina Al-Ahmadi → Strait of Hormuz',
    volumeMbd: 1.95,
    strokeWidth: 4.2,
    colorHex: 0xd96b27,
    opacity: 0.75,
    pointIds: [
      'term_mina_ahmadi',
      'wp_gulf_north',
      'wp_gulf_central',
      'wp_hormuz_west',
      'choke_hormuz',
    ],
    dropsCount: 2,
    durationMs: 6800,
  },
  {
    id: 'flow_kharg_hormuz',
    nameFa: 'جزیره خارگ (ایران) ← تنگه هرمز',
    nameEn: 'Kharg Island → Strait of Hormuz',
    volumeMbd: 1.65,
    strokeWidth: 3.8,
    colorHex: 0xb83e16,
    opacity: 0.82,
    pointIds: ['term_kharg', 'wp_gulf_central', 'wp_hormuz_west', 'choke_hormuz'],
    dropsCount: 2,
    durationMs: 5900,
  },
  {
    id: 'flow_rastanura_hormuz',
    nameFa: 'راس تنوره (عربستان) ← تنگه هرمز',
    nameEn: 'Ras Tanura → Strait of Hormuz',
    volumeMbd: 6.2,
    strokeWidth: 9.2,
    colorHex: 0xb83e16,
    opacity: 0.85,
    pointIds: ['term_ras_tanura', 'wp_gulf_central', 'wp_hormuz_west', 'choke_hormuz'],
    dropsCount: 4,
    durationMs: 5400,
  },
  {
    id: 'flow_uae_hormuz',
    nameFa: 'جبل الظنه و داس (امارات) ← تنگه هرمز',
    nameEn: 'Jebel Dhanna (UAE) → Strait of Hormuz',
    volumeMbd: 2.85,
    strokeWidth: 5.2,
    colorHex: 0xe07a3c,
    opacity: 0.8,
    pointIds: ['term_jebel_dhanna', 'wp_hormuz_west', 'choke_hormuz'],
    dropsCount: 2,
    durationMs: 4800,
  },

  // Main Trunk through Strait of Hormuz into Gulf of Oman & Northern Arabian Sea (Sankey Spine)
  {
    id: 'flow_hormuz_spine',
    nameFa: 'شاهراه اصلی تنگه هرمز ← دریای عمان و دریای عرب (۱۶٫۸ mb/d)',
    nameEn: 'Strait of Hormuz Main Trunk (16.8 mb/d)',
    volumeMbd: 16.8,
    strokeWidth: 16.5,
    colorHex: 0xb83e16,
    opacity: 0.42,
    pointIds: ['choke_hormuz', 'wp_gulf_of_oman', 'wp_arabian_sea_north'],
    dropsCount: 4,
    durationMs: 4200,
  },

  // Eastbound Branch 1: Hormuz -> Jamnagar / Sikka (India)
  {
    id: 'flow_hormuz_india',
    nameFa: 'تنگه هرمز ← جام‌نگر و سیکا (هند · ۲٫۵۵ mb/d)',
    nameEn: 'Strait of Hormuz → Jamnagar (India · 2.55 mb/d)',
    volumeMbd: 2.55,
    strokeWidth: 5.5,
    colorHex: 0xd95f25,
    opacity: 0.82,
    pointIds: [
      'choke_hormuz',
      'wp_gulf_of_oman',
      'wp_arabian_sea_north',
      'port_jamnagar',
    ],
    dropsCount: 3,
    durationMs: 6500,
  },

  // Eastbound Trunk 2: Hormuz -> Malacca -> Ningbo-Zhoushan (China — Largest Asian Sankey Band)
  {
    id: 'flow_hormuz_china',
    nameFa: 'تنگه هرمز ← تنگه مالاکا ← نینگبو-ژوشان (چین · ۵٫۴۰ mb/d)',
    nameEn: 'Strait of Hormuz → Malacca → Ningbo-Zhoushan (China · 5.40 mb/d)',
    volumeMbd: 5.4,
    strokeWidth: 9.8,
    colorHex: 0xb83e16,
    opacity: 0.84,
    pointIds: [
      'choke_hormuz',
      'wp_gulf_of_oman',
      'wp_arabian_sea_north',
      'wp_arabian_sea_east',
      'wp_laccadive_sea',
      'wp_sri_lanka_south',
      'wp_bay_of_bengal_south',
      'wp_malacca_entry',
      'choke_malacca',
      'wp_singapore_strait',
      'wp_scs_south',
      'wp_scs_mid',
      'wp_scs_north',
      'wp_taiwan_east',
      'port_ningbo',
    ],
    dropsCount: 6,
    durationMs: 13500,
  },

  // Eastbound Branch 3: Hormuz -> Malacca -> Singapore Hub
  {
    id: 'flow_hormuz_singapore',
    nameFa: 'تنگه هرمز ← پالایشگاه‌های سنگاپور (۱٫۴۵ mb/d)',
    nameEn: 'Strait of Hormuz → Singapore Refining Hub (1.45 mb/d)',
    volumeMbd: 1.45,
    strokeWidth: 3.8,
    colorHex: 0xe68a56,
    opacity: 0.78,
    pointIds: [
      'choke_hormuz',
      'wp_gulf_of_oman',
      'wp_arabian_sea_north',
      'wp_arabian_sea_east',
      'wp_laccadive_sea',
      'wp_sri_lanka_south',
      'wp_bay_of_bengal_south',
      'wp_malacca_entry',
      'choke_malacca',
      'port_singapore',
    ],
    dropsCount: 4,
    durationMs: 10500,
  },

  // Eastbound Branch 4: Hormuz -> Malacca -> Nghi Son (Vietnam)
  {
    id: 'flow_hormuz_vietnam',
    nameFa: 'تنگه هرمز ← نگی‌سون (ویتنام · ۰٫۵۲ mb/d)',
    nameEn: 'Strait of Hormuz → Nghi Son (Vietnam · 0.52 mb/d)',
    volumeMbd: 0.52,
    strokeWidth: 2.5,
    colorHex: 0xd96b27,
    opacity: 0.76,
    pointIds: [
      'choke_hormuz',
      'wp_gulf_of_oman',
      'wp_arabian_sea_north',
      'wp_arabian_sea_east',
      'wp_laccadive_sea',
      'wp_sri_lanka_south',
      'wp_bay_of_bengal_south',
      'wp_malacca_entry',
      'choke_malacca',
      'wp_singapore_strait',
      'wp_scs_south',
      'wp_scs_mid',
      'port_nghi_son',
    ],
    dropsCount: 3,
    durationMs: 11800,
  },

  // Eastbound Branch 5: Hormuz -> Malacca -> Ulsan (South Korea)
  {
    id: 'flow_hormuz_korea',
    nameFa: 'تنگه هرمز ← اولسان (کره جنوبی · ۱٫۸۵ mb/d)',
    nameEn: 'Strait of Hormuz → Ulsan (South Korea · 1.85 mb/d)',
    volumeMbd: 1.85,
    strokeWidth: 4.5,
    colorHex: 0xc85220,
    opacity: 0.78,
    pointIds: [
      'choke_hormuz',
      'wp_gulf_of_oman',
      'wp_arabian_sea_north',
      'wp_arabian_sea_east',
      'wp_laccadive_sea',
      'wp_sri_lanka_south',
      'wp_bay_of_bengal_south',
      'wp_malacca_entry',
      'choke_malacca',
      'wp_singapore_strait',
      'wp_scs_south',
      'wp_scs_mid',
      'wp_scs_north',
      'wp_taiwan_east',
      'wp_ecs_mid',
      'wp_korea_south',
      'port_ulsan',
    ],
    dropsCount: 5,
    durationMs: 14800,
  },

  // Eastbound Branch 6: Hormuz -> Malacca -> Yokohama / Chiba (Japan)
  {
    id: 'flow_hormuz_japan',
    nameFa: 'تنگه هرمز ← یوکوهاما و چیبا (ژاپن · ۱٫۶۵ mb/d)',
    nameEn: 'Strait of Hormuz → Yokohama (Japan · 1.65 mb/d)',
    volumeMbd: 1.65,
    strokeWidth: 4.2,
    colorHex: 0xd66832,
    opacity: 0.76,
    pointIds: [
      'choke_hormuz',
      'wp_gulf_of_oman',
      'wp_arabian_sea_north',
      'wp_arabian_sea_east',
      'wp_laccadive_sea',
      'wp_sri_lanka_south',
      'wp_bay_of_bengal_south',
      'wp_malacca_entry',
      'choke_malacca',
      'wp_singapore_strait',
      'wp_scs_south',
      'wp_scs_mid',
      'wp_scs_north',
      'wp_taiwan_east',
      'wp_japan_south',
      'port_yokohama',
    ],
    dropsCount: 5,
    durationMs: 15500,
  },

  // Westbound Branch 1: Hormuz -> Bab el-Mandeb -> Suez -> Ceyhan (Turkey / E. Med)
  {
    id: 'flow_hormuz_turkey',
    nameFa: 'تنگه هرمز ← باب‌المندب ← سوئز ← جیهان (ترکیه · ۱٫۰۸ mb/d)',
    nameEn: 'Strait of Hormuz → Red Sea → Ceyhan (Turkey · 1.08 mb/d)',
    volumeMbd: 1.08,
    strokeWidth: 3.4,
    colorHex: 0xb83e16,
    opacity: 0.8,
    pointIds: [
      'choke_hormuz',
      'wp_gulf_of_oman',
      'wp_arabian_sea_west',
      'wp_socotra_north',
      'wp_gulf_of_aden',
      'choke_bab_el_mandeb',
      'wp_red_sea_south',
      'wp_red_sea_north',
      'wp_gulf_of_suez',
      'choke_suez',
      'wp_med_east',
      'port_ceyhan',
    ],
    dropsCount: 4,
    durationMs: 11200,
  },

  // Westbound Branch 2: Hormuz -> Bab el-Mandeb -> Suez -> Trieste (Italy / Central Europe)
  {
    id: 'flow_hormuz_italy',
    nameFa: 'تنگه هرمز ← دریای سرخ ← سوئز ← تریسته (ایتالیا و اروپای مرکزی · ۰٫۹۵ mb/d)',
    nameEn: 'Strait of Hormuz → Suez → Port of Trieste (Italy · 0.95 mb/d)',
    volumeMbd: 0.95,
    strokeWidth: 3.2,
    colorHex: 0xc85220,
    opacity: 0.78,
    pointIds: [
      'choke_hormuz',
      'wp_gulf_of_oman',
      'wp_arabian_sea_west',
      'wp_socotra_north',
      'wp_gulf_of_aden',
      'choke_bab_el_mandeb',
      'wp_red_sea_south',
      'wp_red_sea_north',
      'wp_gulf_of_suez',
      'choke_suez',
      'wp_med_east',
      'wp_med_crete',
      'wp_med_ionian',
      'wp_adriatic_south',
      'port_trieste',
    ],
    dropsCount: 4,
    durationMs: 12600,
  },

  // Westbound Branch 3: Hormuz -> Bab el-Mandeb -> Suez -> Gibraltar -> Rotterdam (NW Europe)
  {
    id: 'flow_hormuz_rotterdam',
    nameFa: 'تنگه هرمز ← سوئز ← جبل‌الطارق ← روتردام (هلند و شمال غرب اروپا · ۱٫۳۵ mb/d)',
    nameEn: 'Strait of Hormuz → Suez → Gibraltar → Rotterdam (1.35 mb/d)',
    volumeMbd: 1.35,
    strokeWidth: 4.0,
    colorHex: 0xb83e16,
    opacity: 0.82,
    pointIds: [
      'choke_hormuz',
      'wp_gulf_of_oman',
      'wp_arabian_sea_west',
      'wp_socotra_north',
      'wp_gulf_of_aden',
      'choke_bab_el_mandeb',
      'wp_red_sea_south',
      'wp_red_sea_north',
      'wp_gulf_of_suez',
      'choke_suez',
      'wp_med_east',
      'wp_med_crete',
      'wp_med_ionian',
      'wp_med_sicily',
      'wp_med_west',
      'wp_gibraltar',
      'wp_iberia_west',
      'wp_biscay_west',
      'wp_english_channel',
      'port_rotterdam',
    ],
    dropsCount: 5,
    durationMs: 15200,
  },
];

// Key oil exporting/importing countries highlighted on the globe
const HIGHLIGHTED_ISO_COUNTRIES: Record<
  string,
  { fillHex: number; nameFa: string; roleFa: string }
> = {
  IR: { fillHex: 0xd96b38, nameFa: 'ایران', roleFa: 'صادرکننده خلیج فارس (جزیره خارگ)' },
  SA: { fillHex: 0xe07b42, nameFa: 'عربستان سعودی', roleFa: 'صادرکننده خلیج فارس (راس تنوره)' },
  IQ: { fillHex: 0xdc713b, nameFa: 'عراق', roleFa: 'صادرکننده خلیج فارس (البصره)' },
  AE: { fillHex: 0xe2824b, nameFa: 'امارات متحده عربی', roleFa: 'صادرکننده خلیج فارس (جبل الظنه / فجیره)' },
  KW: { fillHex: 0xd86834, nameFa: 'کویت', roleFa: 'صادرکننده خلیج فارس (مینا الاحمدی)' },
  QA: { fillHex: 0xde7844, nameFa: 'قطر', roleFa: 'صادرکننده میعانات و LNG خلیج فارس' },
  OM: { fillHex: 0xe69568, nameFa: 'عمان', roleFa: 'حاشیه جنوبی تنگه هرمز' },
  TR: { fillHex: 0xe27d48, nameFa: 'ترکیه', roleFa: 'مقصد مدیترانه (جیهان · -5.2%)' },
  IN: { fillHex: 0xdf7640, nameFa: 'هند', roleFa: 'مقصد اصلی جنوب آسیا (جام‌نگر · -3.9%)' },
  CN: { fillHex: 0xe48450, nameFa: 'چین', roleFa: 'بزرگ‌ترین مقصد نفت تنگه هرمز (نینگبو-ژوشان)' },
  VN: { fillHex: 0xde743e, nameFa: 'ویتنام', roleFa: 'مقصد جنوب شرق آسیا (نگی‌سون · -8.7%)' },
  KR: { fillHex: 0xe58d5c, nameFa: 'کره جنوبی', roleFa: 'مقصد شرق آسیا (اولسان)' },
  JP: { fillHex: 0xe58d5c, nameFa: 'ژاپن', roleFa: 'مقصد شرق آسیا (یوکوهاما و چیبا)' },
  NL: { fillHex: 0xe28654, nameFa: 'هلند', roleFa: 'قطب پالایشی شمال غرب اروپا (روتردام)' },
  IT: { fillHex: 0xe59062, nameFa: 'ایتالیا', roleFa: 'پایانه ورودی اروپای مرکزی (تریسته)' },
};

export interface HormuzGlobeApi {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  focusGeoPoint: (longitude: number, latitude: number, zoom?: number) => void;
}

interface HormuzGlobeSankeyProps {
  showFlows?: boolean;
  showHeatmap?: boolean;
  activeMapLayer?: 'trade_shocks' | 'chokepoints' | 'stocks';
  onReadyApi?: (api: HormuzGlobeApi) => void;
  onSelectTerminalOrPort?: (node: SeaNodePoint) => void;
}

export const HormuzGlobeSankey: React.FC<HormuzGlobeSankeyProps> = ({
  showFlows = true,
  showHeatmap = true,
  onReadyApi,
  onSelectTerminalOrPort,
}) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<am5map.MapChart | null>(null);
  const flowSeriesRef = useRef<am5map.MapLineSeries | null>(null);
  const dropSeriesRef = useRef<am5map.MapPointSeries | null>(null);
  const polygonSeriesRef = useRef<am5map.MapPolygonSeries | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 1. Initialize amCharts 5 Root with Responsive and Animated themes
    const root = am5.Root.new(chartContainerRef.current);
    root.setThemes([am5themes_Animated.new(root), am5themes_Responsive.new(root)]);

    // 2. Create 3D Orthographic Globe MapChart centered on Hormuz, Asia & Europe
    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: 'rotateX',
        panY: 'rotateY',
        wheelY: 'none',
        projection: am5map.geoOrthographic(),
        rotationX: -58,
        rotationY: -22,
        homeZoomLevel: 1.06,
        homeGeoPoint: { longitude: 58, latitude: 22 },
        paddingTop: 28,
        paddingBottom: 55,
        paddingLeft: 28,
        paddingRight: 24,
      })
    );
    chartRef.current = chart;

    // 3. Ocean Sphere Background Series (Warm Cartographic Stone Sphere)
    const backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
    backgroundSeries.mapPolygons.template.setAll({
      fill: am5.color(0xd8d5cc),
      fillOpacity: 0.96,
      stroke: am5.color(0xbab5aa),
      strokeWidth: 1.2,
      strokeOpacity: 0.85,
    });
    backgroundSeries.data.push({
      geometry: am5map.getGeoCircle({ latitude: 0, longitude: 0 }, 180),
    });

    // 4. Subtle Graticule Grid Lines across the Globe
    const graticuleSeries = chart.series.push(
      am5map.GraticuleSeries.new(root, {
        step: 15,
        clipBack: true,
      })
    );
    graticuleSeries.mapLines.template.setAll({
      stroke: am5.color(0xc5c1b7),
      strokeOpacity: 0.55,
      strokeWidth: 0.6,
    });

    // 5. World Countries Polygon Series
    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ['AQ'],
      })
    );
    polygonSeriesRef.current = polygonSeries;

    polygonSeries.mapPolygons.template.setAll({
      fill: am5.color(0xc8c5bc),
      stroke: am5.color(0xe4e2dc),
      strokeWidth: 0.75,
      fillOpacity: 0.95,
    });

    // Adapter to highlight Persian Gulf exporters & Asian/European importers in Terracotta tones
    polygonSeries.mapPolygons.template.adapters.add('fill', (fill, target) => {
      const dataContext = target.dataItem?.dataContext as { id?: string } | undefined;
      const iso = dataContext?.id;
      if (iso && HIGHLIGHTED_ISO_COUNTRIES[iso]) {
        return am5.color(HIGHLIGHTED_ISO_COUNTRIES[iso].fillHex);
      }
      return fill;
    });

    polygonSeries.mapPolygons.template.adapters.add('tooltipText', (text, target) => {
      const dataContext = target.dataItem?.dataContext as
        | { id?: string; name?: string }
        | undefined;
      const iso = dataContext?.id;
      if (iso && HIGHLIGHTED_ISO_COUNTRIES[iso]) {
        const info = HIGHLIGHTED_ISO_COUNTRIES[iso];
        return `${info.nameFa} (${dataContext?.name})\n${info.roleFa}`;
      }
      return text;
    });

    // 6. Sea Waypoint & Terminal/Port Series (Referenced by `pointIds` in MapLineSeries)
    const nodeSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {
        clipBack: true,
        latitudeField: 'latitude',
        longitudeField: 'longitude',
      })
    );

    nodeSeries.bullets.push((_root, _series, dataItem) => {
      const ctx = dataItem.dataContext as SeaNodePoint | undefined;
      if (!ctx || ctx.kind === 'waypoint') {
        // Sea waypoints are invisible routing anchors that keep Sankey flows strictly at sea
        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: 0,
            fillOpacity: 0,
            strokeOpacity: 0,
          }),
        });
      }

      const container = am5.Container.new(root, {
        cursorOverStyle: 'pointer',
      });

      if (ctx.kind === 'chokepoint') {
        // Pulsing ring for Strait of Hormuz, Malacca, Bab el-Mandeb, Suez
        const outerPulse = container.children.push(
          am5.Circle.new(root, {
            radius: ctx.id === 'choke_hormuz' ? 14 : 9,
            fill: am5.color(0xb83e16),
            fillOpacity: 0.28,
            stroke: am5.color(0xb83e16),
            strokeWidth: 1.2,
            strokeOpacity: 0.65,
          })
        );
        outerPulse.animate({
          key: 'scale',
          from: 0.85,
          to: 1.45,
          duration: 1800,
          loops: Infinity,
          easing: am5.ease.yoyo(am5.ease.inOut(am5.ease.cubic)),
        });
      }

      const radius =
        ctx.kind === 'chokepoint'
          ? ctx.id === 'choke_hormuz'
            ? 6.2
            : 4.8
          : ctx.kind === 'terminal'
          ? 4.6
          : 4.4;

      const fillColor =
        ctx.kind === 'chokepoint'
          ? am5.color(0xb83e16)
          : ctx.kind === 'terminal'
          ? am5.color(0x1e1d1b)
          : am5.color(0x2b2927);

      const coreCircle = container.children.push(
        am5.Circle.new(root, {
          radius,
          fill: fillColor,
          stroke: am5.color(0xfaf9f5),
          strokeWidth: 1.6,
          tooltipText: `${ctx.nameFa || ctx.nameEn}\nحجم جریان: ${ctx.volumeMbd || '—'}`,
        })
      );

      coreCircle.events.on('click', () => {
        if (onSelectTerminalOrPort) {
          onSelectTerminalOrPort(ctx);
        }
      });

      // Compact port/terminal label on key hubs with directional offset to prevent overlap
      const labelConfigMap: Record<
        string,
        { text: string; dx: number; dy: number }
      > = {
        choke_hormuz: { text: 'Strait of Hormuz (20.9 mb/d)', dx: 10, dy: 2 },
        term_ras_tanura: { text: 'Ras Tanura', dx: -68, dy: 8 },
        term_kharg: { text: 'Kharg Island', dx: -6, dy: -14 },
        port_ningbo: { text: 'Ningbo-Zhoushan (China)', dx: 9, dy: -4 },
        port_rotterdam: { text: 'Rotterdam (NW Europe)', dx: 9, dy: -6 },
        port_yokohama: { text: 'Yokohama (Japan)', dx: 9, dy: -2 },
      };

      const labelCfg = labelConfigMap[ctx.id];
      if (labelCfg) {
        container.children.push(
          am5.Label.new(root, {
            text: labelCfg.text,
            fontSize: 10,
            fontWeight: '700',
            fill: am5.color(0x1e1d1b),
            centerY: am5.p50,
            dx: labelCfg.dx,
            dy: labelCfg.dy,
            background: am5.RoundedRectangle.new(root, {
              fill: am5.color(0xfaf9f5),
              fillOpacity: 0.88,
              cornerRadiusTL: 3,
              cornerRadiusTR: 3,
              cornerRadiusBL: 3,
              cornerRadiusBR: 3,
            }),
            paddingTop: 1,
            paddingBottom: 1,
            paddingLeft: 4,
            paddingRight: 4,
          })
        );
      }

      return am5.Bullet.new(root, {
        sprite: container,
      });
    });

    // Populate nodeSeries BEFORE flowSeries so `pointIds` resolve immediately
    nodeSeries.data.setAll(HORMUZ_SEA_NODES);

    // 7. Map Sankey Flow Series (MapLineSeries referencing `nodeSeries` via `pointIds`)
    const flowSeries = chart.series.push(
      am5map.MapLineSeries.new(root, {
        pointSeries: nodeSeries,
        pointIdsField: 'pointIds',
        clipBack: true,
        lineType: 'curved',
      })
    );
    flowSeriesRef.current = flowSeries;

    flowSeries.mapLines.template.setAll({
      stroke: am5.color(0xb83e16),
      strokeWidth: 4,
      strokeOpacity: 0.8,
      interactive: true,
      cursorOverStyle: 'pointer',
    });

    flowSeries.mapLines.template.adapters.add('strokeWidth', (width, target) => {
      const ctx = target.dataItem?.dataContext as HormuzFlowRoute | undefined;
      return ctx ? ctx.strokeWidth : width;
    });

    flowSeries.mapLines.template.adapters.add('stroke', (stroke, target) => {
      const ctx = target.dataItem?.dataContext as HormuzFlowRoute | undefined;
      return ctx ? am5.color(ctx.colorHex) : stroke;
    });

    flowSeries.mapLines.template.adapters.add('strokeOpacity', (opacity, target) => {
      const ctx = target.dataItem?.dataContext as HormuzFlowRoute | undefined;
      return ctx ? ctx.opacity : opacity;
    });

    flowSeries.mapLines.template.adapters.add('tooltipText', (_text, target) => {
      const ctx = target.dataItem?.dataContext as HormuzFlowRoute | undefined;
      if (!ctx) return '';
      return `${ctx.nameFa}\n(${ctx.nameEn})\nحجم جریان صادراتی: ${ctx.volumeMbd.toFixed(2)} mb/d`;
    });

    // 8. Animated Oil Drops Series (`MapPointSeries` traveling along each Sankey band via `positionOnLine`)
    const oilDropSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {
        clipBack: true,
      })
    );
    dropSeriesRef.current = oilDropSeries;

    oilDropSeries.bullets.push(() => {
      // Small oil drop shape (teardrop / droplet pointing in direction of travel + bright amber core)
      const dropContainer = am5.Container.new(root, {});

      // Outer subtle amber halo
      dropContainer.children.push(
        am5.Circle.new(root, {
          radius: 4.2,
          fill: am5.color(0xf2da63),
          fillOpacity: 0.42,
        })
      );

      // Teardrop / Oil Drop SVG Path pointing along the line (+X direction)
      dropContainer.children.push(
        am5.Graphics.new(root, {
          fill: am5.color(0x1e1d1b),
          stroke: am5.color(0xf2da63),
          strokeWidth: 1.1,
          svgPath: 'M 5 0 C 1.5 -3.2 -3.8 -3.4 -4.5 0 C -3.8 3.4 1.5 3.2 5 0 Z',
        })
      );

      return am5.Bullet.new(root, {
        sprite: dropContainer,
        autoRotate: true,
      });
    });

    // Push each Sankey route and spawn animated oil drops along it
    HORMUZ_SANKEY_FLOWS.forEach((route) => {
      const lineDataItem = flowSeries.pushDataItem({
        id: route.id,
        pointIds: route.pointIds,
        lineType: 'curved',
      } as any);
      // Attach route metadata to dataContext for adapters & tooltips
      (lineDataItem as any).dataContext = route;

      // Spawn small oil drops spaced evenly along each band
      for (let i = 0; i < route.dropsCount; i++) {
        const startPos = i / route.dropsCount;
        const dropDataItem = oilDropSeries.pushDataItem({
          lineDataItem,
          positionOnLine: startPos,
          autoRotate: true,
        });

        // Continuous seamless loop along [0, 1]
        const remainingRatio = 1 - startPos;
        const firstLegDuration = Math.max(400, Math.round(route.durationMs * remainingRatio));

        const runLoop = () => {
          const anim = dropDataItem.animate({
            key: 'positionOnLine',
            from: 0,
            to: 1,
            duration: route.durationMs,
            loops: Infinity,
          });
          return anim;
        };

        const initialAnim = dropDataItem.animate({
          key: 'positionOnLine',
          from: startPos,
          to: 1,
          duration: firstLegDuration,
        });

        initialAnim.events.on('stopped', () => {
          runLoop();
        });
      }
    });

    // Expose imperative globe API to parent map toolbar
    if (onReadyApi) {
      onReadyApi({
        zoomIn: () => {
          chart.zoomIn();
        },
        zoomOut: () => {
          chart.zoomOut();
        },
        resetView: () => {
          chart.goHome(600);
          chart.animate({
            key: 'rotationX',
            to: -58,
            duration: 600,
            easing: am5.ease.out(am5.ease.cubic),
          });
          chart.animate({
            key: 'rotationY',
            to: -22,
            duration: 600,
            easing: am5.ease.out(am5.ease.cubic),
          });
        },
        focusGeoPoint: (longitude: number, latitude: number, zoom = 1.45) => {
          chart.animate({
            key: 'rotationX',
            to: -longitude,
            duration: 750,
            easing: am5.ease.out(am5.ease.cubic),
          });
          chart.animate({
            key: 'rotationY',
            to: -latitude,
            duration: 750,
            easing: am5.ease.out(am5.ease.cubic),
          });
          chart.zoomToGeoPoint({ longitude, latitude }, zoom, true, 750);
        },
      });
    }

    chart.appear(800, 100);

    return () => {
      root.dispose();
    };
  }, []);

  // Toggle visibility of Sankey flow lines & oil drops when toolbar buttons change
  useEffect(() => {
    if (flowSeriesRef.current) {
      flowSeriesRef.current.set('visible', showFlows);
    }
    if (dropSeriesRef.current) {
      dropSeriesRef.current.set('visible', showFlows);
    }
  }, [showFlows]);

  useEffect(() => {
    if (polygonSeriesRef.current) {
      polygonSeriesRef.current.mapPolygons.each((poly) => {
        const dataContext = poly.dataItem?.dataContext as { id?: string } | undefined;
        const iso = dataContext?.id;
        if (iso && HIGHLIGHTED_ISO_COUNTRIES[iso]) {
          poly.set(
            'fill',
            showHeatmap
              ? am5.color(HIGHLIGHTED_ISO_COUNTRIES[iso].fillHex)
              : am5.color(0xc8c5bc)
          );
        }
      });
    }
  }, [showHeatmap]);

  return (
    <div
      ref={chartContainerRef}
      data-testid="amcharts-hormuz-globe"
      aria-label="کره سه‌بعدی صادرات نفت خام از تنگه هرمز به آسیا و اروپا (amCharts 5 Map Sankey)"
      className="w-full h-full"
    />
  );
};
