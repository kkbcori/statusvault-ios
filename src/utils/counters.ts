// ═══════════════════════════════════════════════════════════════
// StatusVault — Immi Counter Templates
// Predefined immigration-related day counters
// ═══════════════════════════════════════════════════════════════

import { ImmigrationCountry } from '../types';

export interface CounterTemplate {
  id: string;
  label: string;
  icon: string;
  maxDays: number;
  description: string;
  warnAt: number;   // days used to turn orange
  critAt: number;   // days used to turn red
  /** Destination country (default 'US' if not set) */
  country?: ImmigrationCountry;
}

export const COUNTER_TEMPLATES: CounterTemplate[] = [
  {
    id: 'opt-unemployment',
    label: 'OPT Unemployment Days',
    icon: '⏱️',
    maxDays: 90,
    description: '90-day unemployment limit during post-completion OPT',
    warnAt: 60,
    critAt: 80,
  },
  {
    id: 'stem-unemployment',
    label: 'STEM OPT Unemployment Days',
    icon: '🔬',
    maxDays: 150,
    description: '150-day cumulative unemployment limit during STEM OPT extension',
    warnAt: 100,
    critAt: 130,
  },
  {
    id: 'h1b-grace',
    label: 'H-1B Grace Period',
    icon: '💼',
    maxDays: 60,
    description: '60-day grace period after H-1B employment ends to find new sponsor or change status',
    warnAt: 40,
    critAt: 52,
  },
  {
    id: 'f1-grace',
    label: 'F-1 Grace Period',
    icon: '🎓',
    maxDays: 60,
    description: '60-day grace period after OPT ends or program completion to depart or change status',
    warnAt: 40,
    critAt: 52,
  },
  {
    id: 'visitor-stay',
    label: 'B-1/B-2 Visitor Stay',
    icon: '🛂',
    maxDays: 180,
    description: 'Track days of authorized stay on B-1/B-2 visitor visa (typically up to 180 days)',
    warnAt: 140,
    critAt: 165,
  },
  {
    id: 'tax-presence',
    label: 'Days in US (Tax Year)',
    icon: '📊',
    maxDays: 183,
    description: 'Substantial Presence Test — 183+ days in current year may make you a tax resident',
    warnAt: 150,
    critAt: 175,
  },
  {
    id: 'j1-grace',
    label: 'J-1 Grace Period',
    icon: '🌐',
    maxDays: 30,
    description: '30-day grace period after J-1 program ends to depart the US',
    warnAt: 20,
    critAt: 26,
  },

  // ═══════════════════════════════════════════════════════════════
  // CANADA — Critical immigration timers (researched 2026)
  // Sources: IRCC, university ISO offices, Canadim. Verify deadlines
  // with IRCC at canada.ca before relying on these for filings.
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'ca-pgwp-application-window',
    label: 'PGWP Application Window',
    icon: '🎯',
    country: 'CA',
    maxDays: 180,
    description: '180 days from completion letter to apply for PGWP (90 days inside Canada with valid permit)',
    warnAt: 90,
    critAt: 150,
  },
  {
    id: 'ca-study-permit-90day',
    label: 'Study Permit Auto-Invalidation',
    icon: '📚',
    country: 'CA',
    maxDays: 90,
    description: 'Study permit auto-invalid 90 days after Letter of Completion regardless of printed expiry',
    warnAt: 60,
    critAt: 80,
  },
  {
    id: 'ca-restoration-window',
    label: 'Restoration of Status',
    icon: '🔄',
    country: 'CA',
    maxDays: 90,
    description: '90-day window to apply to restore status after permit expires',
    warnAt: 60,
    critAt: 80,
  },
  {
    id: 'ca-ita-deadline',
    label: 'Express Entry ITA Response',
    icon: '📩',
    country: 'CA',
    maxDays: 60,
    description: '60-day deadline to submit complete PR application after receiving ITA',
    warnAt: 30,
    critAt: 50,
  },
  {
    id: 'ca-pr-card-renewal',
    label: 'PR Card Renewal Window',
    icon: '🪪',
    country: 'CA',
    maxDays: 180,
    description: 'Apply 6 months before PR card expires to ensure continuous travel ability',
    warnAt: 120,
    critAt: 150,
  },
  {
    id: 'ca-pr-residency-obligation',
    label: 'PR Residency Days (5-yr period)',
    icon: '🏠',
    country: 'CA',
    maxDays: 730,
    description: 'Must be physically in Canada 730 days within any 5-year period to maintain PR',
    warnAt: 600,
    critAt: 700,
  },
  {
    id: 'ca-bowp-window',
    label: 'BOWP Eligibility Window',
    icon: '🌉',
    country: 'CA',
    maxDays: 120,
    description: 'Bridging Open Work Permit available when current permit expires within 4 months',
    warnAt: 90,
    critAt: 110,
  },
  {
    id: 'ca-trv-stay',
    label: 'Visitor Stay (TRV)',
    icon: '🛂',
    country: 'CA',
    maxDays: 180,
    description: '6-month authorized stay per visit on visitor visa (set by border officer)',
    warnAt: 140,
    critAt: 165,
  },

  // ═══════════════════════════════════════════════════════════════
  // AUSTRALIA — Critical immigration timers (researched 2026)
  // Sources: Department of Home Affairs, registered MARA agents.
  // Verify with Home Affairs (immi.homeaffairs.gov.au) before filing.
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'au-485-application-window',
    label: '485 Application Window',
    icon: '🎯',
    country: 'AU',
    maxDays: 180,
    description: '6-month window to apply for Subclass 485 after course completion',
    warnAt: 120,
    critAt: 165,
  },
  {
    id: 'au-english-test-validity',
    label: 'English Test Validity',
    icon: '🗣️',
    country: 'AU',
    maxDays: 365,
    description: 'IELTS/PTE results valid 1 year for 485 visa (changed from 3 years in 2024)',
    warnAt: 270,
    critAt: 330,
  },
  {
    id: 'au-491-to-191',
    label: '491 → 191 PR Window',
    icon: '🌏',
    country: 'AU',
    maxDays: 1825,
    description: 'Hold 491 for 3+ years, meet income requirements, then apply for 191 PR',
    warnAt: 1095,
    critAt: 1500,
  },
  {
    id: 'au-itata-aat-appeal',
    label: 'ART Appeal Window',
    icon: '⚖️',
    country: 'AU',
    maxDays: 21,
    description: '21 days from refusal decision to lodge review with Administrative Review Tribunal',
    warnAt: 14,
    critAt: 19,
  },
  {
    id: 'au-bridging-stay',
    label: 'Bridging Visa A Stay',
    icon: '🌉',
    country: 'AU',
    maxDays: 365,
    description: 'Track time on BVA while substantive visa application is pending',
    warnAt: 270,
    critAt: 330,
  },
  {
    id: 'au-visitor-stay',
    label: 'Visitor Visa Stay',
    icon: '🛂',
    country: 'AU',
    maxDays: 90,
    description: 'Track days on Subclass 600 — stay length set by visa grant (typically 3-12 months)',
    warnAt: 70,
    critAt: 85,
  },
];
