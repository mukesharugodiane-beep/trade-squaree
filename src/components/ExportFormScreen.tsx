/**
 * Screen 2: Export Opportunity Form ("Export Opportunity Parameters")
 * 100% Visual & Structural Clone of the Attached Executive Analytics & Map Dashboard Image
 * while preserving 100% of Trade Square's Export Consignment Parameters content,
 * real-time `inclusionAI/Realtime-Venus` corridor intelligence, and official Trade Square color codes:
 * - Primary Blue: #005A94 | Secondary Blue: #2673A6 | Soft Ice Blue: #DDEBF7
 * - Primary Emerald: #1A8754 | Accent Emerald: #10B981
 *
 * Includes real Google Maps Platform (`@vis.gl/react-google-maps`) initialized in
 * SATELLITE view by default (`defaultMapTypeId="satellite"`) with radiating trade corridor
 * polylines and interactive `<AdvancedMarker>` hub pins across Rwanda, Kenya, and EAC borders.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps';
import {
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle,
  Clock,
  Layers,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Satellite
} from 'lucide-react';
import {
  ExportOpportunity,
  RwandanSME,
  KenyanPartner,
  PartnerRole,
  Certification,
  CorridorAssumptions,
  District
} from '../types';
import { HS_PRODUCTS } from '../data/seedData';
import { useRealtimeVenusMarketVisualization } from '../services/aiService';

interface ExportFormScreenProps {
  currentOpportunity: ExportOpportunity;
  sme: RwandanSME;
  partners?: KenyanPartner[];
  assumptions: CorridorAssumptions;
  onSaveOpportunity: (opp: ExportOpportunity) => void;
  onViewShortlist: () => void;
  onOpenAssumptions: () => void;
}

interface CorridorMapHub {
  id: string;
  name: string;
  country: string;
  roleLabel: string;
  lat: number;
  lng: number;
  volumeKg: number;
  offerRwfPerKg: number;
  isOrigin?: boolean;
  statusBadge: string;
}

const RWANDA_DISTRICT_COORDS: Record<District, { lat: number; lng: number }> = {
  Musanze: { lat: -1.4998, lng: 29.635 },
  Rubavu: { lat: -1.6741, lng: 29.2664 },
  Rwamagana: { lat: -1.9487, lng: 30.4347 },
  Huye: { lat: -2.5967, lng: 29.7394 },
  Nyagatare: { lat: -1.2976, lng: 30.325 },
  Kayonza: { lat: -1.8825, lng: 30.6536 },
  Gicumbi: { lat: -1.576, lng: 30.067 },
  Rusizi: { lat: -2.4846, lng: 28.9075 }
};

/**
 * Child component inside `<Map>` that renders geodesic trade route polylines
 * radiating from the Rwandan SME origin hub to regional buyer hubs, matching
 * the radiating green/blue trade arcs in the reference image.
 */
const TradeCorridorPolylines: React.FC<{
  origin: { lat: number; lng: number };
  hubs: CorridorMapHub[];
}> = ({ origin, hubs }) => {
  const map = useMap();
  const mapsLib = useMapsLibrary('maps');

  useEffect(() => {
    if (!map || !mapsLib?.Polyline) return;

    const polylines: Array<{ setMap: (m: any) => void }> = [];

    hubs.forEach((hub, idx) => {
      if (hub.isOrigin) return;
      const line = new mapsLib.Polyline({
        path: [origin, { lat: hub.lat, lng: hub.lng }],
        geodesic: true,
        strokeColor: idx === 0 ? '#10B981' : '#38BDF8',
        strokeOpacity: 0.88,
        strokeWeight: idx === 0 ? 3 : 2,
        map
      });
      polylines.push(line);
    });

    return () => {
      polylines.forEach((line) => line.setMap(null));
    };
  }, [map, mapsLib, origin, hubs]);

  return null;
};

export const ExportFormScreen: React.FC<ExportFormScreenProps> = ({
  currentOpportunity,
  sme,
  partners = [],
  assumptions,
  onSaveOpportunity,
  onViewShortlist,
  onOpenAssumptions
}) => {
  const [formData, setFormData] = useState<ExportOpportunity>(currentOpportunity);
  const [selectedQuarterFilter, setSelectedQuarterFilter] = useState<string>('All');
  const [mapTypeId, setMapTypeId] = useState<'satellite' | 'hybrid' | 'roadmap'>('satellite');
  const [selectedHubId, setSelectedHubId] = useState<string | null>(null);

  // Sync changes back to parent state in real time so shortlist & dashboard stay live
  useEffect(() => {
    onSaveOpportunity(formData);
  }, [formData]);

  // Connect to Realtime-Venus visualization hook for real-time corridor & partner metrics
  const venusViz = useRealtimeVenusMarketVisualization({
    sme,
    opportunity: formData,
    partners,
    assumptions
  });

  const selectedProduct =
    HS_PRODUCTS.find((p) => p.hsCode === formData.productHs) || HS_PRODUCTS[0];

  const partnerRoles: (PartnerRole | 'All')[] = [
    'All',
    'Buyer',
    'Distributor',
    'Wholesaler',
    'Retailer'
  ];

  const certificationsList: Certification[] = [
    'RSB S-Mark',
    'HACCP',
    'GlobalG.A.P.',
    'Organic'
  ];

  // Dynamic calculations based on corridor assumptions
  const transitCostRwf = assumptions.corridorTransitCostRwfPerKg;
  const landedRwfPerKg = formData.exWorksPriceRwf + transitCostRwf;
  const landedKesPerKgNum = landedRwfPerKg / assumptions.exchangeRateKesToRwf;
  const landedKesPerKg = landedKesPerKgNum.toFixed(1);

  const annualVolumeKg = formData.capacityKgMonth * 12;
  const annualLandedRwf = annualVolumeKg * landedRwfPerKg;
  const annualLandedKes = Math.round(annualLandedRwf / assumptions.exchangeRateKesToRwf);

  const originCoords =
    RWANDA_DISTRICT_COORDS[sme.district] || RWANDA_DISTRICT_COORDS.Musanze;

  // Regional Corridor & Buyer Hub Coordinates for the Satellite Map
  const corridorMapHubs: CorridorMapHub[] = useMemo(() => {
    const baseCap = Math.max(1000, formData.capacityKgMonth);
    return [
      {
        id: 'origin-rw',
        name: `${sme.district} SME Hub (${sme.businessName.replace(' (sample)', '')})`,
        country: 'Rwanda (Origin)',
        roleLabel: `HS ${selectedProduct.hsCode} Origin`,
        lat: originCoords.lat,
        lng: originCoords.lng,
        volumeKg: baseCap,
        offerRwfPerKg: formData.exWorksPriceRwf,
        isOrigin: true,
        statusBadge: 'Origin'
      },
      {
        id: 'hub-nairobi',
        name: 'Nairobi Industrial & Wakulima Hub',
        country: 'Kenya',
        roleLabel: 'Active Pilot · Gatuna–Malaba OSBP',
        lat: -1.2921,
        lng: 36.8219,
        volumeKg: Math.round(baseCap * 1.35),
        offerRwfPerKg: Math.round(landedRwfPerKg * 1.24),
        statusBadge: 'Active Pilot'
      },
      {
        id: 'hub-mombasa',
        name: 'Mombasa Port & Coastal Distribution',
        country: 'Kenya',
        roleLabel: 'Active Pilot · Export & Wholesale',
        lat: -4.0435,
        lng: 39.6682,
        volumeKg: Math.round(baseCap * 0.95),
        offerRwfPerKg: Math.round(landedRwfPerKg * 1.28),
        statusBadge: 'Active Pilot'
      },
      {
        id: 'hub-nakuru',
        name: 'Nakuru Rift Valley Processing Hub',
        country: 'Kenya',
        roleLabel: 'Active Pilot · Agro-Milling',
        lat: -0.3031,
        lng: 36.08,
        volumeKg: Math.round(baseCap * 0.78),
        offerRwfPerKg: Math.round(landedRwfPerKg * 1.19),
        statusBadge: 'Active Pilot'
      },
      {
        id: 'hub-kisumu',
        name: 'Kisumu Lake Victoria Basin Hub',
        country: 'Kenya',
        roleLabel: 'Active Pilot · Regional Wholesale',
        lat: -0.0917,
        lng: 34.768,
        volumeKg: Math.round(baseCap * 0.68),
        offerRwfPerKg: Math.round(landedRwfPerKg * 1.16),
        statusBadge: 'Active Pilot'
      },
      {
        id: 'hub-kampala',
        name: 'Kampala Northern Corridor Transit',
        country: 'Uganda',
        roleLabel: 'Gatuna / Katuna OSBP (Phase 2)',
        lat: 0.3476,
        lng: 32.5825,
        volumeKg: Math.round(baseCap * 0.88),
        offerRwfPerKg: Math.round(landedRwfPerKg * 1.15),
        statusBadge: 'Later phases'
      },
      {
        id: 'hub-goma',
        name: 'Goma / Bukavu Cross-Border Market',
        country: 'DR Congo',
        roleLabel: 'Rubavu / Rusizi OSBP (Phase 2)',
        lat: -1.6585,
        lng: 29.2205,
        volumeKg: Math.round(baseCap * 0.82),
        offerRwfPerKg: Math.round(landedRwfPerKg * 1.21),
        statusBadge: 'Later phases'
      },
      {
        id: 'hub-bujumbura',
        name: 'Bujumbura Southern Corridor Hub',
        country: 'Burundi',
        roleLabel: 'Nemba / Akanyaru OSBP',
        lat: -3.3614,
        lng: 29.3599,
        volumeKg: Math.round(baseCap * 0.64),
        offerRwfPerKg: Math.round(landedRwfPerKg * 1.17),
        statusBadge: 'Later phases'
      },
      {
        id: 'hub-dar',
        name: 'Dar es Salaam Central Corridor',
        country: 'Tanzania',
        roleLabel: 'Rusumo OSBP (Phase 3)',
        lat: -6.7924,
        lng: 39.2083,
        volumeKg: Math.round(baseCap * 0.72),
        offerRwfPerKg: Math.round(landedRwfPerKg * 1.2),
        statusBadge: 'Later phases'
      }
    ];
  }, [
    sme.district,
    sme.businessName,
    selectedProduct.hsCode,
    originCoords.lat,
    originCoords.lng,
    formData.capacityKgMonth,
    formData.exWorksPriceRwf,
    landedRwfPerKg
  ]);

  const activeSelectedHub = corridorMapHubs.find((h) => h.id === selectedHubId) || null;

  // Ranked Horizontal Bar Data ("Sales per country" clone)
  const horizontalRankingRows = useMemo(() => {
    const base = formData.capacityKgMonth * landedRwfPerKg;
    const items = [
      { label: 'Kenya · Nairobi', value: Math.round(base * 3.4), isPrimary: true },
      { label: 'Kenya · Mombasa', value: Math.round(base * 2.15), isPrimary: false },
      { label: 'DR Congo · Goma', value: Math.round(base * 1.95), isPrimary: false },
      { label: 'Uganda · Kampala', value: Math.round(base * 1.35), isPrimary: false },
      { label: 'Kenya · Nakuru', value: Math.round(base * 1.22), isPrimary: false },
      { label: 'Tanzania · Rusumo', value: Math.round(base * 1.05), isPrimary: false },
      { label: 'Burundi · Nemba', value: Math.round(base * 0.96), isPrimary: false },
      { label: 'Kenya · Kisumu', value: Math.round(base * 0.88), isPrimary: false },
      { label: 'Rwanda · Kigali', value: Math.round(base * 0.74), isPrimary: false },
      { label: 'EAC Free Zone', value: Math.round(base * 0.58), isPrimary: false }
    ];
    const maxVal = Math.max(...items.map((i) => i.value), 1);
    return items.map((item) => ({
      ...item,
      widthPct: Math.max(12, Math.round((item.value / maxVal) * 100))
    }));
  }, [formData.capacityKgMonth, landedRwfPerKg]);

  // 12-Month Combo Bar + Line Chart Data ("Anual history USD and Kg" clone)
  const monthlyComboSeries = useMemo(() => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    const weights = [0.55, 0.72, 1.48, 0.68, 0.76, 0.82, 0.86, 0.92, 0.69, 0.56, 0.64, 0.61];
    return months.map((month, idx) => {
      const factor = weights[idx];
      const kg = Math.round(formData.capacityKgMonth * factor);
      const valueKes = Math.round(kg * landedKesPerKgNum);
      return {
        month,
        kg,
        valueKes,
        factor,
        isPeak: idx === 2 // March peak harvest bar in deep brand color
      };
    });
  }, [formData.capacityKgMonth, landedKesPerKgNum]);

  // Quarterly Destination Table Rows ("Total sales per quarter" clone)
  const quarterlyDestinationRows = useMemo(() => {
    const qBase = Math.round((formData.capacityKgMonth * 3 * landedRwfPerKg) / assumptions.exchangeRateKesToRwf);
    const definitions = [
      {
        destination: 'Kenya · Nairobi (Active Pilot)',
        mults: [1.18, 0.88, 1.12, 0.94],
        dirs: ['up', 'down', 'up', 'down'] as const
      },
      {
        destination: 'Kenya · Mombasa Port Hub',
        mults: [0.76, 0.68, 0.81, 0.64],
        dirs: ['up', 'down', 'up', 'down'] as const
      },
      {
        destination: 'Kenya · Nakuru Rift Valley',
        mults: [0.82, 0.79, 0.66, 0.58],
        dirs: ['up', 'flat', 'down', 'down'] as const
      },
      {
        destination: 'DR Congo · Goma / Bukavu',
        mults: [0.54, 0.49, 0.69, 0.78],
        dirs: ['down', 'down', 'up', 'up'] as const
      },
      {
        destination: 'Uganda · Kampala Corridor',
        mults: [0.51, 0.64, 0.74, 0.48],
        dirs: ['up', 'up', 'up', 'down'] as const
      },
      {
        destination: 'Tanzania · Central Corridor',
        mults: [0.49, 0.59, 0.46, 0.52],
        dirs: ['up', 'up', 'down', 'up'] as const
      },
      {
        destination: 'Burundi · Nemba Border',
        mults: [0.42, 0.56, 0.54, 0.51],
        dirs: ['down', 'up', 'flat', 'flat'] as const
      },
      {
        destination: 'Kenya · Kisumu Lake Basin',
        mults: [0.48, 0.43, 0.58, 0.41],
        dirs: ['up', 'down', 'up', 'down'] as const
      },
      {
        destination: 'Rwanda · Kigali Export Zone',
        mults: [0.38, 0.52, 0.55, 0.36],
        dirs: ['flat', 'up', 'up', 'down'] as const
      }
    ];

    return definitions.map((d) => {
      const q1 = Math.round(qBase * d.mults[0]);
      const q2 = Math.round(qBase * d.mults[1]);
      const q3 = Math.round(qBase * d.mults[2]);
      const q4 = Math.round(qBase * d.mults[3]);
      const total = q1 + q2 + q3 + q4;
      return {
        destination: d.destination,
        q1,
        q2,
        q3,
        q4,
        total,
        dirs: d.dirs
      };
    });
  }, [formData.capacityKgMonth, landedRwfPerKg, assumptions.exchangeRateKesToRwf]);

  const quarterlyTotals = useMemo(() => {
    return quarterlyDestinationRows.reduce(
      (acc, r) => ({
        q1: acc.q1 + r.q1,
        q2: acc.q2 + r.q2,
        q3: acc.q3 + r.q3,
        q4: acc.q4 + r.q4,
        total: acc.total + r.total
      }),
      { q1: 0, q2: 0, q3: 0, q4: 0, total: 0 }
    );
  }, [quarterlyDestinationRows]);

  const handleToggleCert = (cert: Certification) => {
    const exists = formData.requiredCertifications.includes(cert);
    const updated = exists
      ? formData.requiredCertifications.filter((c) => c !== cert)
      : [...formData.requiredCertifications, cert];
    setFormData({ ...formData, requiredCertifications: updated });
  };

  const handleProductChange = (hsCode: string) => {
    const prod = HS_PRODUCTS.find((p) => p.hsCode === hsCode);
    setFormData({
      ...formData,
      productHs: hsCode,
      exWorksPriceRwf: prod ? prod.defaultPriceRwfPerKg : formData.exWorksPriceRwf,
      capacityKgMonth: prod ? prod.typicalMonthlyKg : formData.capacityKgMonth
    });
  };

  const handleResetFilters = () => {
    const defaultProd =
      HS_PRODUCTS.find((p) => p.hsCode === sme.selectedHsCode) || HS_PRODUCTS[0];
    setFormData({
      productHs: defaultProd.hsCode,
      capacityKgMonth: sme.monthlyCapacityKg,
      exWorksPriceRwf: sme.exWorksPriceRwf,
      targetCountry: 'Kenya',
      partnerType: 'All',
      requiredCertifications:
        sme.certifications.length > 0 ? [sme.certifications[0]] : ['RSB S-Mark']
    });
    setSelectedQuarterFilter('All');
    venusViz.refreshNow();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveOpportunity(formData);
    onViewShortlist();
  };

  const mapsApiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';

  return (
    <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-[#DDEBF7]/35 to-[#ECFDF5]/45 border border-slate-200/90 shadow-xs pb-8">
      {/* =====================================================================
          1. TOP BANNER HEADER + OVERLAPPING RIGHT FILTER PILL BOX
          (100% Visual Clone of Top Bar in Reference Image using Trade Square Colors)
          ===================================================================== */}
      <div className="relative bg-[#005A94] text-white px-4 sm:px-8 py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 shadow-md">
        {/* Left Title & Breadcrumb */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] text-[#DDEBF7]/85 font-medium">
            <span>MINICOM Trade Square</span>
            <span>/</span>
            <span>Corridor Matching Engine</span>
            <span>/</span>
            <span className="text-white font-semibold">Export Opportunity Form</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-white">
            Define Export Consignment Parameters
          </h1>
        </div>

        {/* Right Overlapping Filter Box (Commodity + Role/Quarter + Reset Filters) */}
        <div className="bg-[#004470] lg:-my-1 px-3.5 py-2 rounded-xl shadow-md border border-white/25 flex flex-wrap items-center gap-3 sm:gap-4">
          {/* Filter 1: Commodity (HS Heading) */}
          <div className="flex flex-col">
            <label
              htmlFor="header-hs-select"
              className="text-[10px] font-bold text-[#DDEBF7] mb-0.5"
            >
              Commodity (HS)
            </label>
            <select
              id="header-hs-select"
              value={formData.productHs}
              onChange={(e) => handleProductChange(e.target.value)}
              className="h-6.5 px-2 rounded bg-white text-slate-950 border border-white/80 text-[11px] font-semibold focus:outline-none cursor-pointer"
            >
              {HS_PRODUCTS.map((prod) => (
                <option key={prod.hsCode} value={prod.hsCode} className="text-slate-900 bg-white">
                  HS {prod.hsCode} — {prod.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter 2: Partner Role / Quarter */}
          <div className="flex flex-col">
            <label
              htmlFor="header-role-select"
              className="text-[10px] font-bold text-[#DDEBF7] mb-0.5"
            >
              Partner Role
            </label>
            <select
              id="header-role-select"
              value={formData.partnerType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  partnerType: e.target.value as PartnerRole | 'All'
                })
              }
              className="h-6.5 px-2 rounded bg-white text-slate-950 border border-white/80 text-[11px] font-semibold focus:outline-none cursor-pointer"
            >
              {partnerRoles.map((role) => (
                <option key={role} value={role} className="text-slate-900 bg-white">
                  {role === 'All' ? 'All Roles' : role}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters Button with Undo Curve Icon */}
          <button
            type="button"
            onClick={handleResetFilters}
            className="flex flex-col items-center justify-center px-2 py-0.5 rounded hover:bg-white/15 transition-colors cursor-pointer group"
            title="Reset consignment parameters to SME defaults"
          >
            <span className="text-[10px] font-bold text-white">Reset filters</span>
            <RotateCcw className="w-3.5 h-3.5 text-[#DDEBF7] mt-0.5 transition-transform group-hover:-rotate-45" />
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-6 pt-4 space-y-5">
        {/* ===================================================================
            2. TOP KPI & REAL-TIME PARAMETER STRIP
            (Matches "Total USD 4.539.277   Total Kg 131.590" in Reference Image)
            =================================================================== */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-1">
          <div className="flex flex-wrap items-baseline gap-6 sm:gap-10">
            {/* Metric 1: Total Annual Landed KES / RWF */}
            <div className="flex items-baseline gap-2.5">
              <span className="text-sm sm:text-base font-bold text-[#005A94]">
                Total KES
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                {annualLandedKes.toLocaleString('de-DE')}
              </span>
              <span className="text-[11px] font-semibold text-[#1A8754]">
                (RWF {formData.exWorksPriceRwf.toLocaleString()}/kg Ex-Works)
              </span>
            </div>

            {/* Metric 2: Total Annual Kg */}
            <div className="flex items-baseline gap-2.5">
              <span className="text-sm sm:text-base font-bold text-[#005A94]">
                Total Kg
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                {annualVolumeKg.toLocaleString('de-DE')}
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                ({formData.capacityKgMonth.toLocaleString()} kg/mo ·{' '}
                {(formData.capacityKgMonth / 1000).toFixed(1)} MT/mo)
              </span>
            </div>
          </div>

          {/* Live Realtime-Venus Sync Pill & Quick Capacity/Price Adjusters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-medium text-slate-700 shadow-2xs">
              <span className="text-slate-500 font-semibold">Monthly Kg:</span>
              <input
                type="number"
                step="500"
                min="100"
                value={formData.capacityKgMonth}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacityKgMonth: parseInt(e.target.value) || 0
                  })
                }
                className="w-20 px-1.5 py-0.5 rounded border border-slate-200 font-mono font-bold text-[#005A94] focus:border-[#005A94] focus:outline-none"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-medium text-slate-700 shadow-2xs">
              <span className="text-slate-500 font-semibold">Ex-Works RWF/kg:</span>
              <input
                type="number"
                step="10"
                min="10"
                value={formData.exWorksPriceRwf}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    exWorksPriceRwf: parseInt(e.target.value) || 0
                  })
                }
                className="w-18 px-1.5 py-0.5 rounded border border-slate-200 font-mono font-bold text-[#1A8754] focus:border-[#005A94] focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={venusViz.refreshNow}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#005A94] text-[11px] font-semibold text-[#005A94] shadow-2xs cursor-pointer"
            >
              <RefreshCw
                className={`w-3 h-3 ${venusViz.status === 'syncing' ? 'animate-spin' : ''}`}
              />
              <span>{venusViz.status === 'syncing' ? 'Syncing...' : 'Live Sync'}</span>
            </button>
          </div>
        </div>

        {/* ===================================================================
            3. ROW 1: ASYMMETRIC 12-COLUMN GRID
            - Left (xl:col-span-8): Unified Card with Google Map (Satellite by Default)
              on Left + Horizontal Ranked Corridor Bars on Right
            - Right (xl:col-span-4): 12-Month Combo Bar + Line Chart Card
            =================================================================== */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
          {/* LEFT 8-COLUMN BLOCK: SATELLITE MAP + CORRIDOR HORIZONTAL BARS */}
          <div className="xl:col-span-8 flex flex-col">
            {/* Section Titles Above the Dual Card (Matches "Clients location" & "Sales per country") */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 px-1 mb-1.5">
              <div className="md:col-span-7 flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-bold text-[#005A94]">
                  Corridor & Partner Locations (Satellite View)
                </h2>
              </div>
              <div className="md:col-span-5">
                <h2 className="text-sm sm:text-base font-bold text-[#005A94]">
                  Consignment Value per Corridor
                </h2>
              </div>
            </div>

            {/* Unified White Rounded Card with Drop Shadow */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-200/85 shadow-[0_6px_20px_rgba(15,23,42,0.08)] p-3 sm:p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
              {/* LEFT HALF (md:col-span-7): GOOGLE MAPS IN SATELLITE VIEW BY DEFAULT */}
              <div className="md:col-span-7 relative rounded-xl overflow-hidden border border-slate-200 min-h-[260px] sm:min-h-[290px] bg-slate-900">
                {/* Floating Satellite / Hybrid / Map Mode Switcher */}
                <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md p-1 rounded-lg border border-white/20 text-[10px] font-semibold text-white shadow-md">
                  <button
                    type="button"
                    onClick={() => setMapTypeId('satellite')}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded transition-colors cursor-pointer ${
                      mapTypeId === 'satellite'
                        ? 'bg-[#1A8754] text-white'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <Satellite className="w-3 h-3" />
                    <span>Satellite</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapTypeId('hybrid')}
                    className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                      mapTypeId === 'hybrid'
                        ? 'bg-[#005A94] text-white'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Hybrid
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapTypeId('roadmap')}
                    className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                      mapTypeId === 'roadmap'
                        ? 'bg-[#005A94] text-white'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Map
                  </button>
                </div>

                {/* Live Google Map Component */}
                {mapsApiKey ? (
                  <div className="w-full h-full min-h-[260px] sm:min-h-[290px]">
                    <APIProvider apiKey={mapsApiKey}>
                      <Map
                        mapId="DEMO_MAP_ID"
                        defaultCenter={{ lat: -1.35, lng: 33.8 }}
                        defaultZoom={5}
                        mapTypeId={mapTypeId}
                        gestureHandling="cooperative"
                        disableDefaultUI={true}
                        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                        className="w-full h-full min-h-[260px] sm:min-h-[290px]"
                      >
                        {/* Geodesic Corridor Trade Arcs from Rwanda SME Origin to Buyer Hubs */}
                        <TradeCorridorPolylines
                          origin={originCoords}
                          hubs={corridorMapHubs}
                        />

                        {/* Hub Advanced Markers */}
                        {corridorMapHubs.map((hub) => (
                          <AdvancedMarker
                            key={hub.id}
                            position={{ lat: hub.lat, lng: hub.lng }}
                            title={`${hub.name} (${hub.country})`}
                            onClick={() => setSelectedHubId(hub.id)}
                          >
                            <div
                              className={`flex items-center justify-center rounded-full shadow-lg transition-transform hover:scale-125 cursor-pointer ${
                                hub.isOrigin
                                  ? 'w-5 h-5 bg-[#005A94] border-2 border-white ring-4 ring-[#38BDF8]/50'
                                  : hub.statusBadge === 'Active Pilot'
                                  ? 'w-4 h-4 bg-[#1A8754] border-2 border-white ring-2 ring-emerald-400/60'
                                  : 'w-3.5 h-3.5 bg-[#10B981] border border-white'
                              }`}
                            />
                          </AdvancedMarker>
                        ))}

                        {/* Interactive Hub InfoWindow */}
                        {activeSelectedHub && (
                          <InfoWindow
                            position={{
                              lat: activeSelectedHub.lat,
                              lng: activeSelectedHub.lng
                            }}
                            onCloseClick={() => setSelectedHubId(null)}
                          >
                            <div className="p-1 text-xs text-slate-800 max-w-[210px] space-y-1">
                              <div className="font-bold text-[#005A94]">
                                {activeSelectedHub.name}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {activeSelectedHub.roleLabel}
                              </div>
                              <div className="text-[11px] font-mono font-semibold text-[#1A8754]">
                                Vol: {activeSelectedHub.volumeKg.toLocaleString()} kg/mo ·{' '}
                                {activeSelectedHub.offerRwfPerKg.toLocaleString()} RWF/kg
                              </div>
                            </div>
                          </InfoWindow>
                        )}
                      </Map>
                    </APIProvider>
                  </div>
                ) : (
                  <div className="w-full h-full min-h-[260px] flex items-center justify-center text-xs text-white/80 p-4 text-center">
                    Loading Google Maps Satellite View...
                  </div>
                )}

                {/* Bottom Overlay Badge inside Satellite Map */}
                <div className="absolute bottom-2 left-2.5 right-2.5 z-10 pointer-events-none flex items-center justify-between text-[10px] text-white bg-slate-900/75 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/15">
                  <span>
                    Origin: <strong>{sme.district}, Rwanda</strong> →{' '}
                    <strong>Gatuna & Malaba OSBPs</strong>
                  </span>
                  <span className="text-emerald-300 font-mono font-bold">
                    0.0% EAC Duty
                  </span>
                </div>
              </div>

              {/* RIGHT HALF (md:col-span-5): HORIZONTAL RANKED CORRIDOR BARS ("Sales per country") */}
              <div className="md:col-span-5 flex items-stretch gap-2">
                <div className="flex-1 flex flex-col justify-between py-0.5 space-y-1.5">
                  {horizontalRankingRows.map((row, idx) => (
                    <div
                      key={row.label}
                      className="grid grid-cols-12 items-center gap-2 text-[11px]"
                    >
                      <span className="col-span-5 text-right font-semibold text-slate-800 truncate">
                        {row.label}
                      </span>
                      <div className="col-span-7 flex items-center">
                        <div
                          style={{ width: `${row.widthPct}%` }}
                          className={`h-4 rounded-xs transition-all duration-500 ${
                            idx === 0
                              ? 'bg-[#005A94]'
                              : idx < 3
                              ? 'bg-[#1A8754]'
                              : idx < 6
                              ? 'bg-[#2673A6]'
                              : 'bg-[#10B981]'
                          }`}
                          title={`${row.label}: RWF ${row.value.toLocaleString()}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Decorative Vertical Scrollbar Track matching Reference Image */}
                <div className="w-1.5 bg-slate-100 rounded-full overflow-hidden flex flex-col">
                  <div className="w-full h-2/5 bg-slate-400/70 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 4-COLUMN BLOCK: 12-MONTH COMBO BAR + LINE CHART ("Anual history USD and Kg") */}
          <div className="xl:col-span-4 flex flex-col">
            <div className="px-1 mb-1.5">
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Annual History KES and Kg
              </h2>
            </div>

            <div className="flex-1 bg-white rounded-2xl border border-slate-200/85 shadow-[0_6px_20px_rgba(15,23,42,0.08)] p-4 flex flex-col justify-between">
              {/* Top Legend Dots ("● KES  ● KG") */}
              <div className="flex items-center gap-4 text-xs font-bold text-slate-800">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#005A94]" />
                  <span>KES ({landedKesPerKg}/kg)</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                  <span>KG ({formData.capacityKgMonth.toLocaleString()}/mo)</span>
                </span>
              </div>

              {/* 12-Month Combo Bar + Line SVG */}
              {(() => {
                const svgW = 360;
                const svgH = 210;
                const chartBottom = 155;
                const chartTop = 24;
                const usableH = chartBottom - chartTop;
                const maxFactor = 1.6;

                const barSlotW = (svgW - 24) / monthlyComboSeries.length;

                const linePoints = monthlyComboSeries.map((pt, idx) => {
                  const cx = 12 + idx * barSlotW + barSlotW / 2;
                  const cy =
                    chartBottom -
                    Math.min(1, (pt.factor * 0.95) / maxFactor) * usableH -
                    10;
                  return { cx, cy, pt };
                });

                const polylineStr = linePoints
                  .map((p) => `${p.cx.toFixed(1)},${p.cy.toFixed(1)}`)
                  .join(' ');

                return (
                  <svg
                    viewBox={`0 0 ${svgW} ${svgH}`}
                    className="w-full h-52 overflow-visible mt-2"
                    aria-label="Annual history KES and Kg combo chart"
                  >
                    {/* Vertical Monthly Bars */}
                    {monthlyComboSeries.map((pt, idx) => {
                      const barW = Math.max(12, barSlotW - 7);
                      const x = 12 + idx * barSlotW + (barSlotW - barW) / 2;
                      const barH = Math.max(
                        14,
                        Math.min(1, pt.factor / maxFactor) * usableH
                      );
                      const y = chartBottom - barH;

                      return (
                        <g key={pt.month}>
                          <rect
                            x={x}
                            y={y}
                            width={barW}
                            height={barH}
                            rx={1.5}
                            fill={pt.isPeak ? '#005A94' : '#10B981'}
                          />
                          {/* Angled Month Labels matching Reference Image */}
                          <text
                            x={x + barW / 2 + 2}
                            y={chartBottom + 12}
                            textAnchor="end"
                            transform={`rotate(-35, ${x + barW / 2 + 2}, ${
                              chartBottom + 12
                            })`}
                            className="text-[9.5px] font-bold fill-slate-800"
                          >
                            {pt.month}
                          </text>
                        </g>
                      );
                    })}

                    {/* Overlaid Connected Line Trajectory for KG */}
                    <polyline
                      fill="none"
                      stroke="#0F172A"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={polylineStr}
                    />
                  </svg>
                );
              })()}
            </div>
          </div>
        </div>

        {/* ===================================================================
            4. ROW 2: ASYMMETRIC 12-COLUMN GRID
            - Left (xl:col-span-8): "Total sales per quarter" Table with Directional
              Arrows + 2 Stacked Action Buttons ("Shortlist" & "Assumptions")
            - Right (xl:col-span-4): "Transport" 3-Bar + Truck/Ship/Plane Icons Card
            =================================================================== */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
          {/* LEFT 8-COLUMN BLOCK: QUARTERLY DESTINATION TABLE + 2 ACTION BUTTONS */}
          <div className="xl:col-span-8 flex flex-col">
            <div className="px-1 mb-1.5 flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-[#005A94]">
                Total Consignment Value per Quarter (KES)
              </h2>
              <span className="text-[11px] font-semibold text-slate-600">
                HS {selectedProduct.hsCode} — {selectedProduct.name} · Landed KES {landedKesPerKg}/kg
              </span>
            </div>

            <div className="flex-1 bg-white rounded-2xl border border-slate-300 shadow-[0_6px_20px_rgba(15,23,42,0.08)] p-3 flex flex-col lg:flex-row items-stretch gap-3">
              {/* Left Compact High-Contrast Table with Directional Arrows */}
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse text-[10px] leading-tight">
                  <thead>
                    <tr className="border-b-2 border-slate-300 bg-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-950">
                      <th className="py-1 px-2">CORRIDOR DESTINATION</th>
                      <th className="py-1 px-1.5 text-right">Qtr 1</th>
                      <th className="py-1 px-1.5 text-right">Qtr 2</th>
                      <th className="py-1 px-1.5 text-right">Qtr 3</th>
                      <th className="py-1 px-1.5 text-right">Qtr 4</th>
                      <th className="py-1 px-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {quarterlyDestinationRows.map((row, idx) => {
                      const renderQuarterCell = (
                        val: number,
                        dir: 'up' | 'down' | 'flat'
                      ) => (
                        <div className="inline-flex items-center justify-end gap-0.5 font-mono tabular-nums font-semibold text-slate-950">
                          {dir === 'up' ? (
                            <ArrowUp className="w-3 h-3 text-[#1A8754] stroke-[2.5] shrink-0" />
                          ) : dir === 'down' ? (
                            <ArrowDown className="w-3 h-3 text-rose-700 stroke-[2.5] shrink-0" />
                          ) : (
                            <ArrowRight className="w-3 h-3 text-amber-600 stroke-[2.5] shrink-0" />
                          )}
                          <span>{val.toLocaleString('de-DE')}</span>
                        </div>
                      );

                      return (
                        <tr
                          key={row.destination}
                          className={`${
                            idx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'
                          } hover:bg-[#DDEBF7]/35 transition-colors`}
                        >
                          <td className="py-1 px-2 font-bold text-slate-950 whitespace-nowrap">
                            {row.destination}
                          </td>
                          <td className="py-1 px-1.5 text-right whitespace-nowrap">
                            {renderQuarterCell(row.q1, row.dirs[0])}
                          </td>
                          <td className="py-1 px-1.5 text-right whitespace-nowrap">
                            {renderQuarterCell(row.q2, row.dirs[1])}
                          </td>
                          <td className="py-1 px-1.5 text-right whitespace-nowrap">
                            {renderQuarterCell(row.q3, row.dirs[2])}
                          </td>
                          <td className="py-1 px-1.5 text-right whitespace-nowrap">
                            {renderQuarterCell(row.q4, row.dirs[3])}
                          </td>
                          <td className="py-1 px-2 text-right font-mono font-extrabold text-slate-950 tabular-nums whitespace-nowrap">
                            {row.total.toLocaleString('de-DE')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-300 bg-slate-100 font-extrabold text-slate-950 font-mono tabular-nums text-[10px]">
                      <td className="py-1.5 px-2 font-sans">Total</td>
                      <td className="py-1.5 px-1.5 text-right">
                        {quarterlyTotals.q1.toLocaleString('de-DE')}
                      </td>
                      <td className="py-1.5 px-1.5 text-right">
                        {quarterlyTotals.q2.toLocaleString('de-DE')}
                      </td>
                      <td className="py-1.5 px-1.5 text-right">
                        {quarterlyTotals.q3.toLocaleString('de-DE')}
                      </td>
                      <td className="py-1.5 px-1.5 text-right">
                        {quarterlyTotals.q4.toLocaleString('de-DE')}
                      </td>
                      <td className="py-1.5 px-2 text-right text-[#005A94]">
                        {quarterlyTotals.total.toLocaleString('de-DE')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Vertical Scrollbar Track + Two Stacked Action Buttons (Clones "Alerta" & "Histórico") */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden lg:flex w-2 h-full bg-slate-100 rounded-full flex-col justify-between py-1">
                  <div className="w-full h-1/3 bg-slate-300 rounded-full" />
                </div>

                <div className="flex flex-row lg:flex-col justify-center gap-3 w-full lg:w-36">
                  <button
                    type="button"
                    onClick={() => {
                      onSaveOpportunity(formData);
                      onViewShortlist();
                    }}
                    className="flex-1 lg:flex-initial py-3 px-3 rounded-md bg-[#005A94] hover:bg-[#004876] text-white font-bold text-xs border-2 border-[#003B64] shadow-sm transition-colors cursor-pointer text-center"
                  >
                    Match Shortlist
                  </button>

                  <button
                    type="button"
                    onClick={onOpenAssumptions}
                    className="flex-1 lg:flex-initial py-3 px-3 rounded-md bg-[#1A8754] hover:bg-[#146c43] text-white font-bold text-xs border-2 border-[#0f5132] shadow-sm transition-colors cursor-pointer text-center"
                  >
                    Assumptions
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 4-COLUMN BLOCK: TRANSPORT MODES BAR & VEHICLE ICONS ("Transport" clone) */}
          <div className="xl:col-span-4 flex flex-col">
            <div className="px-1 mb-1.5">
              <h2 className="text-sm sm:text-base font-bold text-[#005A94]">
                Transport & Corridor Freight
              </h2>
            </div>

            <div className="flex-1 bg-white rounded-2xl border border-slate-200/85 shadow-[0_6px_20px_rgba(15,23,42,0.08)] p-5 flex flex-col justify-end">
              <div className="grid grid-cols-3 gap-4 items-end pt-4">
                {/* Column 1: OSBP Road Truck */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-mono font-bold text-slate-700 mb-1">
                    +{transitCostRwf} RWF/kg
                  </span>
                  <div
                    className="w-16 sm:w-20 h-9 bg-[#10B981] rounded-xs shadow-2xs"
                    title={`Gatuna–Malaba Road Transit: +RWF ${transitCostRwf}/kg`}
                  />
                  {/* Illustrated Truck SVG */}
                  <svg
                    viewBox="0 0 64 44"
                    className="w-14 h-11 mt-3"
                    aria-label="Road Freight Truck"
                  >
                    <rect
                      x="4"
                      y="10"
                      width="36"
                      height="20"
                      rx="2"
                      fill="#93C5FD"
                      stroke="#1E293B"
                      strokeWidth="2"
                    />
                    <path
                      d="M40 16 H52 L58 23 V30 H40 Z"
                      fill="#E2E8F0"
                      stroke="#1E293B"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="44"
                      y="18"
                      width="8"
                      height="6"
                      fill="#38BDF8"
                      stroke="#1E293B"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="14"
                      cy="32"
                      r="5"
                      fill="#334155"
                      stroke="#0F172A"
                      strokeWidth="2"
                    />
                    <circle cx="14" cy="32" r="2" fill="#E2E8F0" />
                    <circle
                      cx="48"
                      cy="32"
                      r="5"
                      fill="#334155"
                      stroke="#0F172A"
                      strokeWidth="2"
                    />
                    <circle cx="48" cy="32" r="2" fill="#E2E8F0" />
                  </svg>
                  <span className="text-[10px] font-semibold text-slate-600 mt-1">
                    OSBP Road
                  </span>
                </div>

                {/* Column 2: Mombasa / Lake Multimodal Ship */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-mono font-bold text-slate-700 mb-1">
                    KES {landedKesPerKg}/kg
                  </span>
                  <div
                    className="w-16 sm:w-20 h-28 bg-[#1A8754] rounded-xs shadow-2xs"
                    title={`Nairobi / Mombasa Landed Price: KES ${landedKesPerKg}/kg`}
                  />
                  {/* Illustrated Cargo Ship SVG */}
                  <svg
                    viewBox="0 0 64 48"
                    className="w-14 h-11 mt-3"
                    aria-label="Multimodal Sea and Lake Freight"
                  >
                    <rect
                      x="22"
                      y="10"
                      width="20"
                      height="8"
                      rx="1"
                      fill="#93C5FD"
                      stroke="#1E293B"
                      strokeWidth="2"
                    />
                    <rect
                      x="28"
                      y="4"
                      width="8"
                      height="6"
                      fill="#64748B"
                      stroke="#1E293B"
                      strokeWidth="2"
                    />
                    <path
                      d="M12 20 L32 16 L52 20 L46 34 H18 Z"
                      fill="#CBD5E1"
                      stroke="#1E293B"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 36 Q 20 32, 32 36 T 56 36"
                      fill="none"
                      stroke="#005A94"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 41 Q 24 37, 36 41 T 54 41"
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-[10px] font-semibold text-slate-600 mt-1">
                    Mombasa Port
                  </span>
                </div>

                {/* Column 3: Perishable Air / Cold-Chain */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-mono font-bold text-slate-700 mb-1">
                    0.0% Tariff
                  </span>
                  <div
                    className="w-16 sm:w-20 h-32 bg-[#005A94] rounded-xs shadow-2xs"
                    title="0.0% EAC Common External Tariff (Duty Free)"
                  />
                  {/* Illustrated Airplane SVG */}
                  <svg
                    viewBox="0 0 64 48"
                    className="w-14 h-11 mt-3"
                    aria-label="Cold-Chain Air Freight"
                  >
                    <path
                      d="M14 34 L50 12 C53 10 56 12 54 15 L32 38 L22 36 L14 42 L12 39 L18 33 Z"
                      fill="#93C5FD"
                      stroke="#1E293B"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M28 24 L14 14 L19 11 L36 20 Z"
                      fill="#E2E8F0"
                      stroke="#1E293B"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M36 28 L46 40 L50 37 L42 24 Z"
                      fill="#E2E8F0"
                      stroke="#1E293B"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-[10px] font-semibold text-slate-600 mt-1">
                    Express Air
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            5. COMPLETE CONSIGNMENT PARAMETERS FORM & CORRIDOR ECONOMICS
            (Preserves 100% of Original Text, Fields, Certifications & Readiness)
            =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-1">
          {/* Form Container */}
          <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              {/* Target Destination & Corridor Scope */}
              <div>
                <label className="block font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#005A94]" />
                  <span>Target Country & Regional Trade Corridor</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* Kenya: Active */}
                  <div className="p-3 border-2 border-[#005A94] bg-[#DDEBF7]/60 rounded-xl relative">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#005A94]">Kenya</span>
                      <span className="text-[10px] font-bold uppercase text-white bg-[#005A94] px-1.5 py-0.5 rounded">
                        Active Pilot
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-600 mt-1.5 leading-tight">
                      Northern Corridor via Gatuna & Malaba OSBPs
                    </div>
                  </div>

                  {/* Uganda: Disabled */}
                  <div className="p-3 border border-slate-200 bg-slate-50 rounded-xl opacity-75">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-600">Uganda</span>
                      <span className="text-[9px] uppercase font-bold text-slate-500 bg-white px-1 py-0.5 border border-slate-200 rounded">
                        Later phases
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1.5">
                      Kampala corridor (planned Phase 2)
                    </div>
                  </div>

                  {/* Tanzania: Disabled */}
                  <div className="p-3 border border-slate-200 bg-slate-50 rounded-xl opacity-75">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-600">Tanzania</span>
                      <span className="text-[9px] uppercase font-bold text-slate-500 bg-white px-1 py-0.5 border border-slate-200 rounded">
                        Later phases
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1.5">
                      Central Corridor via Rusumo (Phase 3)
                    </div>
                  </div>

                  {/* DRC: Disabled */}
                  <div className="p-3 border border-slate-200 bg-slate-50 rounded-xl opacity-75">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-600">DR Congo</span>
                      <span className="text-[9px] uppercase font-bold text-slate-500 bg-white px-1 py-0.5 border border-slate-200 rounded">
                        Later phases
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1.5">
                      Goma / Bukavu borders (Phase 2)
                    </div>
                  </div>
                </div>
              </div>

              {/* Product with HS Heading */}
              <div>
                <label
                  htmlFor="select-product-hs"
                  className="block font-semibold text-slate-900 mb-1"
                >
                  Commodity to Export (with Harmonized System HS Heading)
                </label>
                <select
                  id="select-product-hs"
                  value={formData.productHs}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-900 bg-white focus:border-[#005A94] focus:outline-none"
                >
                  {HS_PRODUCTS.map((prod) => (
                    <option key={prod.hsCode} value={prod.hsCode}>
                      HS {prod.hsCode} — {prod.name} ({prod.category})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Harmonized System 4-digit heading governs tariff lines, phytosanitary rules, and EAC Simplified Trade Regime applicability.
                </p>
              </div>

              {/* Monthly Capacity & Ex-Works Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-900 mb-1">
                    Available Monthly Export Capacity
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="500"
                      min="100"
                      value={formData.capacityKgMonth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          capacityKgMonth: parseInt(e.target.value) || 0
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold focus:border-[#005A94] focus:outline-none"
                      required
                    />
                    <span className="font-bold text-slate-700 shrink-0">kg / month</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Equivalent to {(formData.capacityKgMonth / 1000).toFixed(1)} MT (Metric Tonnes) per month.
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-900 mb-1">
                    Ex-Works Farmgate/Factory Price (Rwanda)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">RWF</span>
                    <input
                      type="number"
                      step="10"
                      min="10"
                      value={formData.exWorksPriceRwf}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          exWorksPriceRwf: parseInt(e.target.value) || 0
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold focus:border-[#005A94] focus:outline-none"
                      required
                    />
                    <span className="font-bold text-slate-700 shrink-0">/ kg</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Price before freight and border fees.
                  </div>
                </div>
              </div>

              {/* Preferred Partner Role */}
              <div>
                <label className="block font-semibold text-slate-900 mb-2">
                  Preferred Partner Operational Role in Kenya
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {partnerRoles.map((role) => {
                    const isSelected = formData.partnerType === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setFormData({ ...formData, partnerType: role })}
                        className={`py-2 px-3 border rounded-lg text-center font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-[#005A94] bg-[#DDEBF7] text-[#005A94] font-bold'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {role === 'All' ? 'All Roles' : role}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Required Certifications */}
              <div>
                <label className="block font-semibold text-slate-900 mb-2">
                  Required Quality & Process Certifications for this Consignment
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {certificationsList.map((cert) => {
                    const isSelected = formData.requiredCertifications.includes(cert);
                    const smeHasCert = sme.certifications.includes(cert);
                    return (
                      <button
                        key={cert}
                        type="button"
                        onClick={() => handleToggleCert(cert)}
                        className={`p-2.5 border rounded-xl text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-[#005A94] bg-[#DDEBF7]/65'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900">{cert}</span>
                          {smeHasCert && (
                            <span className="text-[9px] uppercase font-bold text-[#1A8754] bg-white px-1 py-0.5 border border-emerald-200 rounded">
                              SME Verified
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {cert === 'RSB S-Mark'
                            ? 'Standardization mark'
                            : cert === 'HACCP'
                            ? 'Hazard Analysis'
                            : cert === 'GlobalG.A.P.'
                            ? 'Agricultural practice'
                            : 'Certified Organic'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit & Calculate */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-slate-500">
                  Scoring algorithm will evaluate 12 Kenyan partners using live corridor formulas.
                </span>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#005A94] text-white font-bold rounded-lg hover:bg-[#004876] cursor-pointer text-xs shadow-xs"
                >
                  <span>Calculate Match Shortlist</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Corridor Economics & Landed Cost Simulation */}
          <div className="space-y-4 text-xs">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <TrendingUp className="w-4 h-4 text-[#005A94]" />
                  <span>Corridor Landed Price Preview</span>
                </div>
                <button
                  type="button"
                  onClick={onOpenAssumptions}
                  className="text-[11px] text-[#005A94] hover:underline font-semibold cursor-pointer"
                >
                  Edit Assumptions
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Ex-Works (Rwanda Farmgate):</span>
                  <span className="font-semibold text-slate-900">
                    RWF {formData.exWorksPriceRwf} / kg
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Gatuna–Malaba Transit Freight:</span>
                  <span className="font-semibold text-slate-900">
                    + RWF {transitCostRwf} / kg
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">EAC Common Tariff (CET):</span>
                  <span className="font-bold text-[#1A8754]">
                    0.0% (Duty Free)
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Total Landed Cost (RWF):</span>
                  <span className="font-bold text-slate-900">
                    RWF {landedRwfPerKg} / kg
                  </span>
                </div>

                <div className="p-3 bg-[#DDEBF7]/65 border border-[#005A94] rounded-xl mt-2">
                  <div className="text-[11px] text-slate-600">
                    Estimated Nairobi Landed Price (KES)
                  </div>
                  <div className="text-xl font-extrabold text-[#005A94] mt-0.5">
                    KES {landedKesPerKg} / kg
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    At assumption rate: 1 KES = {assumptions.exchangeRateKesToRwf} RWF.
                  </div>
                </div>
              </div>
            </div>

            {/* Procedure Notes */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 text-xs space-y-2.5 shadow-xs">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#005A94]" />
                <span>Corridor Export Readiness Standards</span>
              </h3>

              <ul className="space-y-2 text-[11px] text-slate-700">
                <li className="flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#1A8754] shrink-0 mt-0.5" />
                  <span>
                    <strong>HS {selectedProduct.hsCode} ({selectedProduct.name}):</strong> Qualifies under AfCFTA / EAC Rules of Origin for preferential zero duty entry into Kenya.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#1A8754] shrink-0 mt-0.5" />
                  <span>
                    <strong>RSB S-Mark Mutual Recognition:</strong> Accepted by Kenya Bureau of Standards (KEBS) under the East African Standards Committee framework.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Customs Clearances:</strong> Processed through Rwanda Electronic Single Window (ReSW) with automated Gatuna and Malaba OSBP data exchange.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
