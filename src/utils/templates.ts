// ═══════════════════════════════════════════════════════════════
// StatusVault — Document Templates
// Pre-built types with smart notification windows per category
// Users pick from dropdowns — minimal typing required
//
// Country tagging:
//   Each template has an optional `country` field ('US' | 'CA' | 'AU').
//   Templates without a country default to 'US' (legacy compatibility).
//   The add-modal groups templates by country, with a section banner
//   for each.
//
// Sources / freshness note (last updated April 2026):
//   - US: USCIS form filing instructions, State Department visa pages
//   - Canada: IRCC.gc.ca and Canada.ca processing time pages
//   - Australia: Department of Home Affairs (immi.homeaffairs.gov.au)
//   These are starting templates — immigration rules change frequently.
//   Users should always verify current requirements with the official
//   government source before relying on these for actual filings.
// ═══════════════════════════════════════════════════════════════

import { DocumentTemplate, DocumentCategory, ImmigrationCountry } from '../types';

/**
 * Alert windows are customized per document type based on real-world urgency:
 * - H1B visa renewal: 180, 90, 60, 30, 7 days (long lead time needed)
 * - OPT/EAD: 90, 60, 30, 15, 7 days (unemployment limit pressure)
 * - Passport: 180, 90, 30 days (6-month validity rule for travel)
 * - I-20: 90, 60, 30, 7 days (DSO processing time)
 * - Green Card: 180, 90, 30 days (renewal takes months)
 */
export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  // ─── Visa Types ──────────────────────────────────────────
  {
    id: 'f1-visa',
    label: 'F-1 Visa Stamp',
    category: 'visa',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '🎓',
    description: 'F-1 student visa stamp in passport',
  },
  {
    id: 'h1b-visa',
    label: 'H-1B Visa',
    category: 'visa',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '💼',
    description: 'H-1B work visa — long renewal lead time',
  },
  {
    id: 'h4-visa',
    label: 'H-4 Dependent Visa',
    category: 'visa',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '👨‍👩‍👧',
    description: 'H-4 dependent visa stamp',
  },
  {
    id: 'j1-visa',
    label: 'J-1 Visa',
    category: 'visa',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '🔬',
    description: 'J-1 exchange visitor visa',
  },
  {
    id: 'l1-visa',
    label: 'L-1 Visa',
    category: 'visa',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '🏢',
    description: 'L-1 intracompany transfer visa',
  },
  {
    id: 'o1-visa',
    label: 'O-1 Visa',
    category: 'visa',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '⭐',
    description: 'O-1 extraordinary ability visa',
  },
  {
    id: 'b1b2-visa',
    label: 'B-1/B-2 Visa',
    category: 'visa',
    alertDays: [90, 30, 7],
    icon: '✈️',
    description: 'Business or tourist visa',
  },

  // ─── Employment Authorization ────────────────────────────
  {
    id: 'opt-ead',
    label: 'OPT EAD Card',
    category: 'employment',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '📋',
    description: 'Optional Practical Training work permit',
  },
  {
    id: 'stem-opt',
    label: 'STEM OPT Extension',
    category: 'employment',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '🔬',
    description: '24-month STEM OPT extension EAD',
  },
  {
    id: 'cpt',
    label: 'CPT Authorization',
    category: 'employment',
    alertDays: [60, 30, 15, 7],
    icon: '📝',
    description: 'Curricular Practical Training',
  },
  {
    id: 'h1b-approval',
    label: 'H-1B Approval Notice (I-797)',
    category: 'employment',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '📄',
    description: 'H-1B approval/petition validity',
  },
  {
    id: 'h4-ead',
    label: 'H-4 EAD',
    category: 'employment',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '💳',
    description: 'H-4 spouse employment authorization',
  },
  {
    id: 'l2-ead',
    label: 'L-2 EAD',
    category: 'employment',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '💳',
    description: 'L-2 dependent work authorization',
  },
  {
    id: 'general-ead',
    label: 'EAD Card (General)',
    category: 'employment',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '💳',
    description: 'Employment Authorization Document',
  },

  // ─── Travel Documents ────────────────────────────────────
  {
    id: 'passport',
    label: 'Passport',
    category: 'travel',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '🛂',
    description: 'Passport — 6-month validity rule for travel',
  },
  {
    id: 'advance-parole',
    label: 'Advance Parole',
    category: 'travel',
    alertDays: [90, 60, 30, 15, 7],
    icon: '🎫',
    description: 'Travel document for pending AOS',
  },
  {
    id: 'travel-signature',
    label: 'I-20 Travel Signature',
    category: 'travel',
    alertDays: [30, 15, 7],
    icon: '✍️',
    description: 'DSO travel endorsement — valid 6 months (F-1) or 1 year',
  },

  // ─── Academic Documents ──────────────────────────────────
  {
    id: 'i20',
    label: 'I-20 Form',
    category: 'academic',
    alertDays: [90, 60, 30, 15, 7],
    icon: '📄',
    description: 'Certificate of Eligibility (F-1)',
  },
  {
    id: 'ds2019',
    label: 'DS-2019 Form',
    category: 'academic',
    alertDays: [90, 60, 30, 15, 7],
    icon: '📄',
    description: 'Certificate of Eligibility (J-1)',
  },
  {
    id: 'program-end',
    label: 'Program End Date',
    category: 'academic',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '🎓',
    description: 'Academic program completion date',
  },
  {
    id: 'sevis',
    label: 'SEVIS Record',
    category: 'academic',
    alertDays: [90, 60, 30, 15, 7],
    icon: '🏛️',
    description: 'SEVIS registration validity',
  },

  // ─── Immigration / Green Card ────────────────────────────
  {
    id: 'green-card',
    label: 'Green Card (I-551)',
    category: 'immigration',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '🟢',
    description: 'Permanent Resident Card — 10yr or 2yr conditional',
  },
  {
    id: 'green-card-conditional',
    label: 'Conditional Green Card',
    category: 'immigration',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '🟡',
    description: '2-year conditional — file I-751 before expiry',
  },
  {
    id: 'combo-card',
    label: 'Combo Card (EAD/AP)',
    category: 'immigration',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '🔗',
    description: 'Combined EAD + Advance Parole',
  },
  {
    id: 'i94',
    label: 'I-94 Arrival Record',
    category: 'immigration',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '📊',
    description: 'Authorized stay expiry date',
  },
  {
    id: 'i-797-receipt',
    label: 'I-797 Receipt Notice',
    category: 'immigration',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '📨',
    description: 'USCIS receipt/approval notice',
  },

  // ─── Other (US) ──────────────────────────────────────────
  {
    id: 'drivers-license',
    label: "Driver's License",
    category: 'other',
    alertDays: [60, 30, 7],
    icon: '🚗',
    description: 'State-issued driver license',
  },

  // ═══════════════════════════════════════════════════════════════
  // CANADA — Indian/expat applicant immigration documents
  // Sources: IRCC (canada.ca), CanadaVisa, Moving2Canada, Canadim — researched
  // 2026. Information may change; users should verify with IRCC before filing.
  // ═══════════════════════════════════════════════════════════════

  // ─── Canada Visa Types ───────────────────────────────────
  {
    id: 'ca-trv-visitor',
    label: 'Canada Visitor Visa (TRV)',
    category: 'visa',
    country: 'CA',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '🇨🇦',
    description: 'Temporary Resident Visa — multiple-entry, up to 10 years',
  },
  {
    id: 'ca-super-visa',
    label: 'Super Visa (Parent/Grandparent)',
    category: 'visa',
    country: 'CA',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '👵',
    description: 'Multi-entry visa for parents/grandparents — 5-year stays',
  },
  {
    id: 'ca-study-permit',
    label: 'Canada Study Permit',
    category: 'visa',
    country: 'CA',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '🎓',
    description: 'Valid for program length + 90 days; auto-invalid 90 days after Letter of Completion',
  },
  {
    id: 'ca-work-permit-employer',
    label: 'Employer-Specific Work Permit',
    category: 'visa',
    country: 'CA',
    alertDays: [180, 120, 90, 60, 30, 15, 7],
    icon: '💼',
    description: 'Closed work permit tied to specific Canadian employer (LMIA-based)',
  },
  {
    id: 'ca-work-permit-open',
    label: 'Open Work Permit',
    category: 'visa',
    country: 'CA',
    alertDays: [180, 120, 90, 60, 30, 15, 7],
    icon: '🔓',
    description: 'Spousal Open Work Permit or other open category',
  },
  {
    id: 'ca-pgwp',
    label: 'Post-Graduation Work Permit (PGWP)',
    category: 'visa',
    country: 'CA',
    alertDays: [180, 120, 90, 60, 30, 15, 7],
    icon: '🎯',
    description: '8 months to 3 years — one-time only, cannot be renewed',
  },
  {
    id: 'ca-bowp',
    label: 'Bridging Open Work Permit (BOWP)',
    category: 'visa',
    country: 'CA',
    alertDays: [120, 90, 60, 30, 15, 7],
    icon: '🌉',
    description: 'For Express Entry applicants; permit must expire within 4 months',
  },

  // ─── Canada Travel & ID Documents ────────────────────────
  {
    id: 'ca-pr-card',
    label: 'PR Card',
    category: 'travel',
    country: 'CA',
    alertDays: [270, 180, 120, 90, 60, 30],
    icon: '🪪',
    description: 'Permanent Resident card — 5-year validity; renew 6 months before expiry',
  },
  {
    id: 'ca-prtd',
    label: 'PR Travel Document (PRTD)',
    category: 'travel',
    country: 'CA',
    alertDays: [60, 30, 15, 7],
    icon: '✈️',
    description: 'Single-use travel doc for PRs without valid PR card abroad',
  },
  {
    id: 'ca-copr',
    label: 'COPR (Confirmation of PR)',
    category: 'immigration',
    country: 'CA',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '📜',
    description: 'Single-entry document for first PR landing — must land before expiry',
  },
  {
    id: 'ca-eta',
    label: 'eTA',
    category: 'travel',
    country: 'CA',
    alertDays: [90, 30, 15, 7],
    icon: '🛂',
    description: 'Electronic Travel Authorization (not for Indian passport holders)',
  },

  // ─── Canada Express Entry & PR Process ───────────────────
  {
    id: 'ca-ee-profile',
    label: 'Express Entry Profile',
    category: 'immigration',
    country: 'CA',
    alertDays: [60, 30, 15, 7],
    icon: '📊',
    description: 'EE profile — 12-month validity in pool',
  },
  {
    id: 'ca-ita',
    label: 'Invitation to Apply (ITA)',
    category: 'immigration',
    country: 'CA',
    alertDays: [45, 30, 14, 7, 3],
    icon: '📩',
    description: '60-day deadline to submit complete PR application after ITA',
  },
  {
    id: 'ca-pn',
    label: 'Provincial Nomination Certificate',
    category: 'immigration',
    country: 'CA',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '🏛️',
    description: 'PNP nomination — adds 600 CRS points',
  },

  // ─── Canada Supporting Documents ─────────────────────────
  {
    id: 'ca-language-test',
    label: 'IELTS / CELPIP / TEF',
    category: 'academic',
    country: 'CA',
    alertDays: [120, 90, 60, 30, 15, 7],
    icon: '🗣️',
    description: 'Language test — 24-month validity for Express Entry',
  },
  {
    id: 'ca-eca',
    label: 'ECA (WES Credential Assessment)',
    category: 'academic',
    country: 'CA',
    alertDays: [180, 90, 30, 7],
    icon: '🎓',
    description: 'Educational Credential Assessment — required for Express Entry',
  },
  {
    id: 'ca-pcc',
    label: 'Police Clearance Certificate',
    category: 'immigration',
    country: 'CA',
    alertDays: [120, 60, 30, 15, 7],
    icon: '👮',
    description: 'PCC from each country lived 6+ months — typically 6-month validity',
  },
  {
    id: 'ca-medical',
    label: 'IRCC Medical Exam',
    category: 'immigration',
    country: 'CA',
    alertDays: [60, 30, 15, 7],
    icon: '🏥',
    description: 'Panel Physician medical — 12-month validity',
  },

  // ═══════════════════════════════════════════════════════════════
  // AUSTRALIA — Indian/expat applicant immigration documents
  // Sources: Department of Home Affairs (immi.homeaffairs.gov.au),
  // Study Australia, AusVisa guides — researched 2026. Information may
  // change; users should verify with Home Affairs before filing.
  // ═══════════════════════════════════════════════════════════════

  // ─── Australia Visa Types ────────────────────────────────
  {
    id: 'au-600-visitor',
    label: 'Visitor Visa (Subclass 600)',
    category: 'visa',
    country: 'AU',
    alertDays: [120, 60, 30, 15, 7],
    icon: '🇦🇺',
    description: 'Tourist/Business/Sponsored Family stream — short stays',
  },
  {
    id: 'au-500-student',
    label: 'Student Visa (Subclass 500)',
    category: 'visa',
    country: 'AU',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '🎓',
    description: 'Full-time study at CRICOS-registered institution',
  },
  {
    id: 'au-485-graduate',
    label: 'Temporary Graduate (Subclass 485)',
    category: 'visa',
    country: 'AU',
    alertDays: [180, 120, 90, 60, 30, 15, 7],
    icon: '🎯',
    description: 'Post-Higher Ed Work / Post-Vocational stream — 18mo to 4yr',
  },
  {
    id: 'au-482-sid',
    label: 'Skills in Demand (Subclass 482)',
    category: 'visa',
    country: 'AU',
    alertDays: [180, 120, 90, 60, 30, 15, 7],
    icon: '💼',
    description: 'Employer-sponsored skilled work visa (replaced TSS Dec 2024)',
  },
  {
    id: 'au-189-skilled',
    label: 'Skilled Independent (Subclass 189)',
    category: 'visa',
    country: 'AU',
    alertDays: [365, 180, 90, 60, 30, 15, 7],
    icon: '⭐',
    description: 'Points-tested permanent residence — no sponsor needed',
  },
  {
    id: 'au-190-nominated',
    label: 'Skilled Nominated (Subclass 190)',
    category: 'visa',
    country: 'AU',
    alertDays: [365, 180, 90, 60, 30, 15, 7],
    icon: '🏛️',
    description: 'State/territory nominated permanent residence',
  },
  {
    id: 'au-491-regional',
    label: 'Skilled Work Regional (Subclass 491)',
    category: 'visa',
    country: 'AU',
    alertDays: [365, 180, 120, 90, 60, 30, 15, 7],
    icon: '🌏',
    description: 'Provisional 5-year regional visa, pathway to 191 PR',
  },
  {
    id: 'au-191-regional-pr',
    label: 'Permanent Residence Regional (Subclass 191)',
    category: 'visa',
    country: 'AU',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '🏆',
    description: 'PR after 3 years on Subclass 491',
  },
  {
    id: 'au-186-ens',
    label: 'Employer Nomination Scheme (Subclass 186)',
    category: 'visa',
    country: 'AU',
    alertDays: [365, 180, 90, 60, 30, 15, 7],
    icon: '🤝',
    description: 'Direct PR via employer sponsorship',
  },
  {
    id: 'au-462-whv',
    label: 'Work and Holiday (Subclass 462)',
    category: 'visa',
    country: 'AU',
    alertDays: [120, 60, 30, 15, 7],
    icon: '🎒',
    description: '12-month working holiday — ballot required for Indian applicants',
  },
  {
    id: 'au-mates',
    label: 'MATES Visa (Indian professionals)',
    category: 'visa',
    country: 'AU',
    alertDays: [120, 60, 30, 15, 7],
    icon: '🤝',
    description: '3,000 places for Indian professionals 18-30 (ballot)',
  },
  {
    id: 'au-820-partner',
    label: 'Partner Visa Onshore (820/801)',
    category: 'visa',
    country: 'AU',
    alertDays: [365, 180, 90, 60, 30, 15, 7],
    icon: '💑',
    description: 'Onshore temporary (820) → permanent (801) partner visa',
  },
  {
    id: 'au-309-partner-off',
    label: 'Partner Visa Offshore (309/100)',
    category: 'visa',
    country: 'AU',
    alertDays: [365, 180, 90, 60, 30, 15, 7],
    icon: '💕',
    description: 'Offshore provisional (309) → permanent (100) partner visa',
  },
  {
    id: 'au-rrv-155',
    label: 'Resident Return Visa (Subclass 155)',
    category: 'travel',
    country: 'AU',
    alertDays: [180, 90, 30, 15, 7],
    icon: '🔁',
    description: 'For PRs returning to Australia after travel facility expires',
  },
  {
    id: 'au-bridging-a',
    label: 'Bridging Visa A (BVA)',
    category: 'visa',
    country: 'AU',
    alertDays: [60, 30, 15, 7, 3],
    icon: '🌉',
    description: 'Auto-granted while substantive visa application is pending',
  },

  // ─── Australia Supporting Documents ──────────────────────
  {
    id: 'au-coe',
    label: 'Confirmation of Enrolment (CoE)',
    category: 'academic',
    country: 'AU',
    alertDays: [180, 90, 60, 30, 15, 7],
    icon: '📋',
    description: 'CRICOS-registered course enrolment confirmation',
  },
  {
    id: 'au-skills-assess',
    label: 'Skills Assessment',
    category: 'academic',
    country: 'AU',
    alertDays: [365, 180, 90, 60, 30],
    icon: '✅',
    description: 'Positive skills assessment from relevant authority — 3-year validity',
  },
  {
    id: 'au-english-test',
    label: 'IELTS / PTE / TOEFL / OET',
    category: 'academic',
    country: 'AU',
    alertDays: [120, 60, 30, 15, 7],
    icon: '🗣️',
    description: 'English test — 1-year validity for Subclass 485 (changed 2024)',
  },
  {
    id: 'au-medical',
    label: 'Australian Health Examination',
    category: 'immigration',
    country: 'AU',
    alertDays: [60, 30, 15, 7],
    icon: '🏥',
    description: 'Bupa/IOM medical — 12-month validity',
  },
  {
    id: 'au-pcc',
    label: 'Police Clearance (AFP / India PCC)',
    category: 'immigration',
    country: 'AU',
    alertDays: [120, 60, 30, 15, 7],
    icon: '👮',
    description: 'PCC from countries lived 12+ months — Passport Seva (India) / AFP (Australia)',
  },
  {
    id: 'au-eoi',
    label: 'SkillSelect EOI',
    category: 'immigration',
    country: 'AU',
    alertDays: [60, 30, 15, 7],
    icon: '📊',
    description: 'Expression of Interest in SkillSelect pool — 2-year validity',
  },
  {
    id: 'au-invitation',
    label: 'Invitation to Apply (Skilled)',
    category: 'immigration',
    country: 'AU',
    alertDays: [30, 14, 7, 3],
    icon: '📩',
    description: '60-day deadline to lodge full visa application after invitation',
  },

  // ─── Generic / Other ─────────────────────────────────────
  {
    id: 'custom',
    label: 'Custom Document',
    category: 'other',
    alertDays: [90, 30, 7],
    icon: '📎',
    description: 'Add any other document',
  },
];

/** Get template by ID */
export const getTemplate = (id: string): DocumentTemplate | undefined =>
  DOCUMENT_TEMPLATES.find((t) => t.id === id);

/** Group templates by category for dropdown sections */
export const getTemplatesByCategory = (): Record<DocumentCategory, DocumentTemplate[]> => {
  const grouped: Record<DocumentCategory, DocumentTemplate[]> = {
    visa: [],
    employment: [],
    travel: [],
    academic: [],
    immigration: [],
    other: [],
  };
  DOCUMENT_TEMPLATES.forEach((t) => {
    grouped[t.category].push(t);
  });
  return grouped;
};

/** Category display labels */
export const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  visa: 'Visa Types',
  employment: 'Employment Authorization',
  travel: 'Travel Documents',
  academic: 'Academic Documents',
  immigration: 'Immigration / Green Card',
  other: 'Other',
};

/** Category colors for visual grouping */
export const CATEGORY_COLORS: Record<DocumentCategory, string> = {
  visa: '#2E5AAC',
  employment: '#2DBE7F',
  travel: '#8B5CF6',
  academic: '#F59E0B',
  immigration: '#EC4899',
  other: '#6B7280',
};
