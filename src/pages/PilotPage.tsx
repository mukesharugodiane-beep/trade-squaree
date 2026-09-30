/**
 * Page 6: Pilot Scope, Corridor & Roadmap
 * Strict compliance with MINICOM pilot specifications:
 * - Corridor: Rwanda to Kenya (Kigali to Nairobi via the Northern Corridor, through Gatuna and Malaba border posts).
 * - Products: Beans (HS 0713), Maize flour (1102), Avocado (0804), Honey (0409).
 * - Roadmap as text: later corridors and products, marked "later phases".
 * - Partner institutions as text only: MINICOM, RDB, RSB, RRA, PSF (strictly no logos).
 */

import React from 'react';
import {
  MapPin,
  Package,
  Layers,
  Building,
  CheckCircle2,
  Clock,
  Compass,
  ArrowRight
} from 'lucide-react';
import { PageId } from '../types/publicSite';

interface PilotPageProps {
  onNavigate: (page: PageId) => void;
}

export const PilotPage: React.FC<PilotPageProps> = ({ onNavigate }) => {
  const pilotProducts = [
    {
      name: 'Beans',
      hsCode: 'HS 0713',
      description: 'Dried leguminous vegetables, shelled, whether or not skinned or split. Focus on red kidney and mixed dry beans produced across Eastern and Northern provinces.',
      standards: 'RSB S-Mark, moisture content threshold max 13.5%, aflatoxin <10 ppb.'
    },
    {
      name: 'Maize flour',
      hsCode: 'HS 1102',
      description: 'Cereal flours from maize (corn), fortified and commercial milling quality. Sourced from agro-processing millers in Rwamagana, Nyagatare, and Musanze.',
      standards: 'Fortification compliance with EAS 44/EAS 768 mutual standards.'
    },
    {
      name: 'Avocado',
      hsCode: 'HS 0804',
      description: 'Fresh Hass and Fuerte avocados suitable for cross-border reefer transit and regional redistribution via Nairobi international air freight hubs.',
      standards: 'Phytosanitary inspection certificate, GlobalG.A.P., cold chain protocols.'
    },
    {
      name: 'Honey',
      hsCode: 'HS 0409',
      description: 'Natural pure honey, raw or processed, bulk or packaged for retail distribution across Nairobi and Mombasa specialty food retailers.',
      standards: 'RSB quality mark, chemical residue testing, pure apiculture certification.'
    }
  ];

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2 border-b border-[var(--gray-300)] pb-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-sub)]">
          Pilot Framework &amp; Corridors
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-display)] tracking-tight">
          Trade Square Pilot Scope &amp; Strategic Roadmap
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-body)] leading-relaxed">
          The Ministry of Trade and Industry (MINICOM) is piloting Trade Square along a single defined trade corridor with four priority commodity lines before scaling regionally.
        </p>
      </div>

      {/* Corridor Scope */}
      <section className="bg-white border border-[var(--gray-300)] rounded-[4px] p-6 space-y-4" aria-labelledby="corridor-title">
        <div className="flex items-center gap-2 border-b border-[var(--gray-300)] pb-2">
          <Compass className="w-5 h-5 text-[var(--brand)] flex-shrink-0" aria-hidden="true" />
          <h2 id="corridor-title" className="text-base font-bold text-[var(--text-display)]">
            Pilot Corridor: Rwanda to Kenya (Northern Corridor)
          </h2>
        </div>

        <p className="text-xs text-[var(--text-body)] leading-relaxed">
          The active pilot focuses exclusively on the <strong>Northern Corridor</strong> linking Kigali to Nairobi through Uganda, anchored by two critical transit checkpoints:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[var(--text-display)]">
              <MapPin className="w-4 h-4 text-[var(--brand)]" aria-hidden="true" />
              <span>Gatuna One-Stop Border Post (OSBP)</span>
            </div>
            <p className="text-[11px] text-[var(--text-body)] leading-relaxed">
              Rwanda&apos;s primary northern customs gateway. Consignments undergo automated electronic customs clearance via the Rwanda Electronic Single Window (ReSW) with joint border agency inspections.
            </p>
          </div>

          <div className="p-4 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[var(--text-display)]">
              <MapPin className="w-4 h-4 text-[var(--brand)]" aria-hidden="true" />
              <span>Malaba One-Stop Border Post (OSBP)</span>
            </div>
            <p className="text-[11px] text-[var(--text-body)] leading-relaxed">
              The primary entry point into Kenya. Cargo is tracked using the Regional Electronic Cargo Tracking System (RECTS) and cleared under the EAC Single Customs Territory regime for final delivery to Nairobi.
            </p>
          </div>
        </div>

        <div className="p-3 bg-[var(--brand-light)] border border-[var(--brand)] rounded-[4px] text-xs text-[var(--brand-dark)] leading-relaxed">
          <strong>Average Corridor Transit:</strong> Road haulage between Kigali logistics hubs and Nairobi distribution yards averages 36 to 48 transit hours under normal border clearance conditions.
        </div>
      </section>

      {/* Pilot Commodities */}
      <section className="bg-white border border-[var(--gray-300)] rounded-[4px] p-6 space-y-4" aria-labelledby="products-title">
        <div className="border-b border-[var(--gray-300)] pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[var(--brand)] flex-shrink-0" aria-hidden="true" />
            <h2 id="products-title" className="text-base font-bold text-[var(--text-display)]">
              Four Priority Pilot Commodities
            </h2>
          </div>
          <span className="text-xs text-[var(--text-sub)]">Active Phase 1 Scope</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {pilotProducts.map((p, idx) => (
            <div key={idx} className="p-4 border border-[var(--gray-300)] rounded-[4px] space-y-2 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[var(--text-display)]">
                  {p.name}
                </h3>
                <span className="font-mono text-xs font-bold text-[var(--brand)] bg-[var(--brand-light)] px-2 py-0.5 border border-[var(--brand)] rounded-[4px]">
                  {p.hsCode}
                </span>
              </div>
              <p className="text-[var(--text-body)] text-[11px] leading-relaxed">
                {p.description}
              </p>
              <div className="text-[10px] text-[var(--text-sub)] pt-1 border-t border-[var(--gray-100)]">
                <strong>Quality Mark:</strong> {p.standards}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap as text (Marked 'later phases') */}
      <section className="bg-white border border-[var(--gray-300)] rounded-[4px] p-6 space-y-4" aria-labelledby="roadmap-title">
        <div className="flex items-center gap-2 border-b border-[var(--gray-300)] pb-2">
          <Layers className="w-5 h-5 text-[var(--brand)] flex-shrink-0" aria-hidden="true" />
          <h2 id="roadmap-title" className="text-base font-bold text-[var(--text-display)]">
            Expansion Roadmap as Text
          </h2>
        </div>

        <p className="text-xs text-[var(--text-body)] leading-relaxed">
          Following evaluation of the initial Kigali–Nairobi pilot corridor, MINICOM has established a phased expansion sequence:
        </p>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] space-y-1">
            <div className="flex items-center justify-between">
              <div className="font-bold text-[var(--text-display)]">
                Corridor Expansion: Central Corridor to Tanzania
              </div>
              <span className="text-[10px] font-bold uppercase text-[var(--text-sub)] bg-white px-2 py-0.5 border border-[var(--gray-300)] rounded-[4px]">
                Later phases
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-body)] leading-relaxed">
              Route from Kigali to Dar es Salaam clearing through Rusumo One-Stop Border Post, servicing commercial food distribution networks in northern and central Tanzania.
            </p>
          </div>

          <div className="p-3.5 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] space-y-1">
            <div className="flex items-center justify-between">
              <div className="font-bold text-[var(--text-display)]">
                Cross-Border Corridor: Eastern DR Congo
              </div>
              <span className="text-[10px] font-bold uppercase text-[var(--text-sub)] bg-white px-2 py-0.5 border border-[var(--gray-300)] rounded-[4px]">
                Later phases
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-body)] leading-relaxed">
              Cross-border markets and commercial buyer connections through Rubavu (La Corniche/Grande Barrière) into Goma and through Rusizi into Bukavu under simplified trade mechanisms.
            </p>
          </div>

          <div className="p-3.5 bg-[var(--gray-100)] border border-[var(--gray-300)] rounded-[4px] space-y-1">
            <div className="flex items-center justify-between">
              <div className="font-bold text-[var(--text-display)]">
                Commodity Expansion: Cassava Flour &amp; Processed Horticultural Products
              </div>
              <span className="text-[10px] font-bold uppercase text-[var(--text-sub)] bg-white px-2 py-0.5 border border-[var(--gray-300)] rounded-[4px]">
                Later phases
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-body)] leading-relaxed">
              High Quality Cassava Flour (HS 1106), dried chilli, specialty teas, and specialty washed coffees will be onboarded as dedicated scoring signals are validated.
            </p>
          </div>
        </div>
      </section>

      {/* Partner Institutions as Text Only (Strictly no logos per rule) */}
      <section className="bg-white border border-[var(--gray-300)] rounded-[4px] p-6 space-y-4" aria-labelledby="institutions-title">
        <div className="flex items-center gap-2 border-b border-[var(--gray-300)] pb-2">
          <Building className="w-5 h-5 text-[var(--brand)] flex-shrink-0" aria-hidden="true" />
          <h2 id="institutions-title" className="text-base font-bold text-[var(--text-display)]">
            Partner Institutions (Text Only — No Logos)
          </h2>
        </div>

        <p className="text-xs text-[var(--text-body)] leading-relaxed">
          Trade Square is coordinated through inter-agency collaboration between the Government of Rwanda and the private sector:
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[var(--text-body)]">
          <li className="p-3 border border-[var(--gray-300)] rounded-[4px]">
            <strong>MINICOM</strong> — Ministry of Trade and Industry (Lead policy executing ministry and Trade Desk oversight)
          </li>
          <li className="p-3 border border-[var(--gray-300)] rounded-[4px]">
            <strong>RDB</strong> — Rwanda Development Board (Business registration validation and enterprise investment coordination)
          </li>
          <li className="p-3 border border-[var(--gray-300)] rounded-[4px]">
            <strong>RSB</strong> — Rwanda Standards Board (Standardization marks, S-Mark verification, and laboratory testing protocols)
          </li>
          <li className="p-3 border border-[var(--gray-300)] rounded-[4px]">
            <strong>RRA</strong> — Rwanda Revenue Authority (Tax identification, customs clearance via ReSW, and rules of origin)
          </li>
          <li className="p-3 border border-[var(--gray-300)] rounded-[4px] sm:col-span-2">
            <strong>PSF</strong> — Private Sector Federation (Enterprise outreach, SME mobilization, and cross-border chamber liaison)
          </li>
        </ul>
      </section>
    </div>
  );
};
