// ═══════════════════════════════════════════════════════════════
// StatusVault — Checklist Templates
// Sourced from USCIS, State Dept, university ISSS offices
// Each template includes all real required steps/documents
// ═══════════════════════════════════════════════════════════════

import { ChecklistItem, ImmigrationCountry } from '../types';

export interface ChecklistTemplate {
  id: string;
  label: string;
  icon: string;
  description: string;
  items: Omit<ChecklistItem, 'done'>[];
  /** Destination country (default 'US' if not set) */
  country?: ImmigrationCountry;
}

export const CHECKLIST_TEMPLATES: ChecklistTemplate[] = [
  // ─── OPT Application ──────────────────────────────────────
  {
    id: 'opt-application',
    label: 'OPT Application',
    icon: '📋',
    description: 'Post-Completion Optional Practical Training (I-765)',
    items: [
      { id: 'opt-01', text: 'Confirm graduation eligibility with academic department', category: 'OPT' },
      { id: 'opt-02', text: 'Request OPT recommendation from DSO (I-20 endorsement)', category: 'OPT' },
      { id: 'opt-03', text: 'Receive OPT-endorsed I-20 from international office', category: 'OPT' },
      { id: 'opt-04', text: 'Sign I-20 Student Attestation section (page 1)', category: 'OPT' },
      { id: 'opt-05', text: 'Complete Form I-765 (online or paper)', category: 'OPT' },
      { id: 'opt-06', text: 'Prepare two U.S. passport-style photos (white background, <30 days old)', category: 'OPT' },
      { id: 'opt-07', text: 'Copy of passport identity page (all correction/extension pages)', category: 'OPT' },
      { id: 'opt-08', text: 'Copy of most recent F-1 visa stamp (or change of status notice)', category: 'OPT' },
      { id: 'opt-09', text: 'Copy of most recent I-94 arrival record (electronic printout)', category: 'OPT' },
      { id: 'opt-10', text: 'Copies of all previous I-20s for current degree level', category: 'OPT' },
      { id: 'opt-11', text: 'Copy of previous EAD card (front and back) — if applicable', category: 'OPT' },
      { id: 'opt-12', text: 'Pay I-765 filing fee ($470 — check USCIS for current amount)', category: 'OPT' },
      { id: 'opt-13', text: 'File I-765 within 30 days of OPT I-20 issuance date', category: 'OPT' },
      { id: 'opt-14', text: 'File no later than 60 days after program end date', category: 'OPT' },
      { id: 'opt-15', text: 'Receive USCIS receipt notice (I-797C)', category: 'OPT' },
      { id: 'opt-16', text: 'Receive EAD card from USCIS', category: 'OPT' },
      { id: 'opt-17', text: 'Report employment details to DSO within 10 days of start', category: 'OPT' },
      { id: 'opt-18', text: 'Update SEVP Portal with employer information', category: 'OPT' },
    ],
  },

  // ─── STEM OPT Extension ────────────────────────────────────
  {
    id: 'stem-opt',
    label: 'STEM OPT Extension',
    icon: '🔬',
    description: '24-month STEM OPT extension (I-765 + I-983)',
    items: [
      { id: 'stem-01', text: 'Confirm STEM degree is on DHS STEM Designated Degree List', category: 'STEM OPT' },
      { id: 'stem-02', text: 'Verify employer is enrolled in E-Verify', category: 'STEM OPT' },
      { id: 'stem-03', text: 'Complete Form I-983 Training Plan with employer', category: 'STEM OPT' },
      { id: 'stem-04', text: 'Get I-983 signed by employer and student', category: 'STEM OPT' },
      { id: 'stem-05', text: 'Submit I-983 to DSO for review and approval', category: 'STEM OPT' },
      { id: 'stem-06', text: 'Request STEM OPT I-20 endorsement from DSO', category: 'STEM OPT' },
      { id: 'stem-07', text: 'Receive STEM OPT endorsed I-20', category: 'STEM OPT' },
      { id: 'stem-08', text: 'File I-765 for STEM extension (up to 90 days before OPT expires)', category: 'STEM OPT' },
      { id: 'stem-09', text: 'Include copy of STEM OPT I-20 with application', category: 'STEM OPT' },
      { id: 'stem-10', text: 'Include copy of previous EAD card', category: 'STEM OPT' },
      { id: 'stem-11', text: 'Include copy of degree and transcripts', category: 'STEM OPT' },
      { id: 'stem-12', text: 'Pay I-765 filing fee', category: 'STEM OPT' },
      { id: 'stem-13', text: 'Receive 180-day automatic extension while pending', category: 'STEM OPT' },
      { id: 'stem-14', text: 'Receive STEM OPT EAD card', category: 'STEM OPT' },
      { id: 'stem-15', text: 'Report to DSO every 6 months (self-evaluation on I-983)', category: 'STEM OPT' },
      { id: 'stem-16', text: 'Submit 12-month I-983 evaluation to DSO', category: 'STEM OPT' },
      { id: 'stem-17', text: 'Submit final I-983 evaluation at end of STEM OPT', category: 'STEM OPT' },
    ],
  },

  // ─── H-1B Visa Petition ────────────────────────────────────
  {
    id: 'h1b-petition',
    label: 'H-1B Visa Petition',
    icon: '💼',
    description: 'H-1B specialty occupation visa (employer-sponsored)',
    items: [
      { id: 'h1b-01', text: 'Employer creates USCIS online account', category: 'H-1B' },
      { id: 'h1b-02', text: 'Employer submits H-1B electronic registration (March)', category: 'H-1B' },
      { id: 'h1b-03', text: 'Pay H-1B registration fee ($215 per beneficiary)', category: 'H-1B' },
      { id: 'h1b-04', text: 'Wait for lottery selection notification', category: 'H-1B' },
      { id: 'h1b-05', text: 'Employer files Labor Condition Application (LCA) with DOL', category: 'H-1B' },
      { id: 'h1b-06', text: 'Receive LCA certification from DOL', category: 'H-1B' },
      { id: 'h1b-07', text: 'Prepare copy of passport (bio page + all stamps)', category: 'H-1B' },
      { id: 'h1b-08', text: 'Prepare copy of all degree diplomas and transcripts', category: 'H-1B' },
      { id: 'h1b-09', text: 'Credential evaluation report (for foreign degrees)', category: 'H-1B' },
      { id: 'h1b-10', text: 'Updated resume/CV with current job details', category: 'H-1B' },
      { id: 'h1b-11', text: 'Copy of current I-94 arrival record', category: 'H-1B' },
      { id: 'h1b-12', text: 'Copy of all previous I-797 approval notices', category: 'H-1B' },
      { id: 'h1b-13', text: 'Copy of all previous I-20s / DS-2019s (if former student)', category: 'H-1B' },
      { id: 'h1b-14', text: 'Copy of OPT/STEM OPT EAD cards (if applicable)', category: 'H-1B' },
      { id: 'h1b-15', text: 'Three most recent pay stubs', category: 'H-1B' },
      { id: 'h1b-16', text: 'Employer files Form I-129 with USCIS (within 90 days)', category: 'H-1B' },
      { id: 'h1b-17', text: 'Pay I-129 filing fees (base + fraud prevention + ACWIA)', category: 'H-1B' },
      { id: 'h1b-18', text: 'Receive I-797 receipt notice from USCIS', category: 'H-1B' },
      { id: 'h1b-19', text: 'Receive I-797 approval notice', category: 'H-1B' },
      { id: 'h1b-20', text: 'Schedule visa stamping interview (if consular processing)', category: 'H-1B' },
    ],
  },

  // ─── H-1B Visa Stamping ───────────────────────────────────
  {
    id: 'h1b-stamping',
    label: 'H-1B Visa Stamping',
    icon: '🛂',
    description: 'Documents for H-1B visa interview at U.S. consulate',
    items: [
      { id: 'h1bs-01', text: 'Complete DS-160 online visa application', category: 'H-1B Stamping' },
      { id: 'h1bs-02', text: 'Pay MRV visa application fee ($205)', category: 'H-1B Stamping' },
      { id: 'h1bs-03', text: 'Schedule visa interview appointment', category: 'H-1B Stamping' },
      { id: 'h1bs-04', text: 'DS-160 confirmation page (printed)', category: 'H-1B Stamping' },
      { id: 'h1bs-05', text: 'Passport (current — valid 6+ months)', category: 'H-1B Stamping' },
      { id: 'h1bs-06', text: 'Old passport(s) with previous visa stamps', category: 'H-1B Stamping' },
      { id: 'h1bs-07', text: 'I-797 approval notice (original)', category: 'H-1B Stamping' },
      { id: 'h1bs-08', text: 'Approved petition (Form I-129 copy)', category: 'H-1B Stamping' },
      { id: 'h1bs-09', text: 'Employer support/offer letter with job details and salary', category: 'H-1B Stamping' },
      { id: 'h1bs-10', text: 'Three most recent pay stubs', category: 'H-1B Stamping' },
      { id: 'h1bs-11', text: 'Resume/CV (updated)', category: 'H-1B Stamping' },
      { id: 'h1bs-12', text: 'Degree certificates and transcripts (originals)', category: 'H-1B Stamping' },
      { id: 'h1bs-13', text: 'U.S. passport-style photo (2x2 inch)', category: 'H-1B Stamping' },
      { id: 'h1bs-14', text: 'Marriage certificate (if bringing dependents)', category: 'H-1B Stamping' },
      { id: 'h1bs-15', text: 'Attend visa interview at U.S. consulate', category: 'H-1B Stamping' },
      { id: 'h1bs-16', text: 'Receive passport with H-1B visa stamp', category: 'H-1B Stamping' },
    ],
  },

  // ─── U.S. Passport Renewal ─────────────────────────────────
  {
    id: 'passport-renewal',
    label: 'U.S. Passport Renewal',
    icon: '🇺🇸',
    description: 'Renew by mail using Form DS-82',
    items: [
      { id: 'pass-01', text: 'Confirm eligibility: passport issued at age 16+, within last 15 years, undamaged', category: 'Passport' },
      { id: 'pass-02', text: 'Complete Form DS-82 (Passport Renewal Application)', category: 'Passport' },
      { id: 'pass-03', text: 'Sign and date the form', category: 'Passport' },
      { id: 'pass-04', text: 'Take new passport photo (2x2 inch, white background)', category: 'Passport' },
      { id: 'pass-05', text: 'Staple photo to the form', category: 'Passport' },
      { id: 'pass-06', text: 'Include most recent passport book/card', category: 'Passport' },
      { id: 'pass-07', text: 'Include name change documents if applicable (marriage cert/court order)', category: 'Passport' },
      { id: 'pass-08', text: 'Prepare payment: $130 for passport book ($30 additional for card)', category: 'Passport' },
      { id: 'pass-09', text: 'Optional: Add $60 for expedited processing', category: 'Passport' },
      { id: 'pass-10', text: 'Optional: Add $22.05 for 1-3 day delivery', category: 'Passport' },
      { id: 'pass-11', text: 'Mail application to address listed on DS-82', category: 'Passport' },
      { id: 'pass-12', text: 'Track status at passportstatus.state.gov', category: 'Passport' },
      { id: 'pass-13', text: 'Receive new passport (8-11 weeks routine / 5-7 weeks expedited)', category: 'Passport' },
      { id: 'pass-14', text: 'Receive old passport returned separately (allow 4 weeks)', category: 'Passport' },
    ],
  },

  // ─── First U.S. Passport (New) ─────────────────────────────
  {
    id: 'passport-new',
    label: 'First U.S. Passport Application',
    icon: '🛂',
    description: 'First-time application using Form DS-11 (in person)',
    items: [
      { id: 'pnew-01', text: 'Complete Form DS-11 online (do NOT sign until in person)', category: 'Passport' },
      { id: 'pnew-02', text: 'Proof of U.S. citizenship (original birth certificate or naturalization cert)', category: 'Passport' },
      { id: 'pnew-03', text: 'Photocopy of citizenship document (front and back)', category: 'Passport' },
      { id: 'pnew-04', text: 'Valid government-issued photo ID (driver\'s license, state ID)', category: 'Passport' },
      { id: 'pnew-05', text: 'Photocopy of photo ID (front and back)', category: 'Passport' },
      { id: 'pnew-06', text: 'One passport photo (2x2 inch, white background)', category: 'Passport' },
      { id: 'pnew-07', text: 'Know your Social Security number', category: 'Passport' },
      { id: 'pnew-08', text: 'Prepare payment: $165 total ($130 application + $35 execution fee)', category: 'Passport' },
      { id: 'pnew-09', text: 'Find and schedule at passport acceptance facility', category: 'Passport' },
      { id: 'pnew-10', text: 'Apply in person — sign form in front of acceptance agent', category: 'Passport' },
      { id: 'pnew-11', text: 'Track status at passportstatus.state.gov', category: 'Passport' },
      { id: 'pnew-12', text: 'Receive new passport', category: 'Passport' },
    ],
  },

  // ─── F-1 Visa Application ──────────────────────────────────
  {
    id: 'f1-visa',
    label: 'F-1 Student Visa Application',
    icon: '🎓',
    description: 'Initial F-1 visa application at U.S. consulate',
    items: [
      { id: 'f1-01', text: 'Receive I-20 from SEVP-certified school', category: 'F-1 Visa' },
      { id: 'f1-02', text: 'Pay SEVIS I-901 fee ($350)', category: 'F-1 Visa' },
      { id: 'f1-03', text: 'Complete DS-160 online visa application', category: 'F-1 Visa' },
      { id: 'f1-04', text: 'Upload photo meeting State Department requirements', category: 'F-1 Visa' },
      { id: 'f1-05', text: 'Pay visa application fee (MRV fee ~$185)', category: 'F-1 Visa' },
      { id: 'f1-06', text: 'Schedule visa interview at nearest U.S. embassy/consulate', category: 'F-1 Visa' },
      { id: 'f1-07', text: 'Passport valid for 6+ months beyond period of stay', category: 'F-1 Visa' },
      { id: 'f1-08', text: 'DS-160 confirmation page (printed)', category: 'F-1 Visa' },
      { id: 'f1-09', text: 'SEVIS I-901 fee receipt', category: 'F-1 Visa' },
      { id: 'f1-10', text: 'Signed I-20 form', category: 'F-1 Visa' },
      { id: 'f1-11', text: 'School acceptance/admission letter', category: 'F-1 Visa' },
      { id: 'f1-12', text: 'Financial documents proving ability to pay (bank statements, I-134, scholarship letter)', category: 'F-1 Visa' },
      { id: 'f1-13', text: 'Academic transcripts and diplomas', category: 'F-1 Visa' },
      { id: 'f1-14', text: 'Standardized test scores (GRE/GMAT/TOEFL if applicable)', category: 'F-1 Visa' },
      { id: 'f1-15', text: 'Evidence of ties to home country (property, family, employment)', category: 'F-1 Visa' },
      { id: 'f1-16', text: 'Attend visa interview', category: 'F-1 Visa' },
      { id: 'f1-17', text: 'Receive passport with F-1 visa stamp', category: 'F-1 Visa' },
    ],
  },

  // ─── Green Card (AOS) ──────────────────────────────────────
  {
    id: 'green-card-aos',
    label: 'Green Card (Adjustment of Status)',
    icon: '🟢',
    description: 'Employment-based I-485 AOS application',
    items: [
      { id: 'gc-01', text: 'Employer files PERM Labor Certification (ETA Form 9089)', category: 'Green Card' },
      { id: 'gc-02', text: 'Receive PERM approval from DOL', category: 'Green Card' },
      { id: 'gc-03', text: 'Employer files Form I-140 (Immigrant Petition)', category: 'Green Card' },
      { id: 'gc-04', text: 'Receive I-140 approval', category: 'Green Card' },
      { id: 'gc-05', text: 'Wait for priority date to become current (check Visa Bulletin)', category: 'Green Card' },
      { id: 'gc-06', text: 'File Form I-485 (Adjustment of Status)', category: 'Green Card' },
      { id: 'gc-07', text: 'File I-131 (Advance Parole for travel) concurrently', category: 'Green Card' },
      { id: 'gc-08', text: 'File I-765 (EAD work permit) concurrently', category: 'Green Card' },
      { id: 'gc-09', text: 'Prepare passport copies (all pages with stamps)', category: 'Green Card' },
      { id: 'gc-10', text: 'Birth certificate (with certified translation if not English)', category: 'Green Card' },
      { id: 'gc-11', text: 'Six passport-style photos', category: 'Green Card' },
      { id: 'gc-12', text: 'Complete medical examination (Form I-693) by USCIS civil surgeon', category: 'Green Card' },
      { id: 'gc-13', text: 'Vaccination records', category: 'Green Card' },
      { id: 'gc-14', text: 'Copy of all immigration documents (I-94, visa stamps, I-797s)', category: 'Green Card' },
      { id: 'gc-15', text: 'Financial evidence / Affidavit of Support (I-864 if applicable)', category: 'Green Card' },
      { id: 'gc-16', text: 'Attend biometrics appointment', category: 'Green Card' },
      { id: 'gc-17', text: 'Attend I-485 interview (if required)', category: 'Green Card' },
      { id: 'gc-18', text: 'Receive Green Card approval', category: 'Green Card' },
    ],
  },

  // ─── Indian Passport Renewal (USA) ───────────────────────────
  {
    id: 'indian-passport-usa',
    label: 'Indian Passport Renewal (USA)',
    icon: '🇮🇳',
    description: 'Indian passport renewal from the US — VFS/Consulate',
    items: [
      // ── Eligibility & Planning ──
      { id: 'ip-01', text: 'Check passport expiry — apply at least 6 months before expiry (airlines may deny boarding with <6 months validity)', category: 'Indian Passport' },
      { id: 'ip-02', text: 'Identify your jurisdiction — Indian consulate/VFS based on your US state of residence', category: 'Indian Passport' },
      { id: 'ip-03', text: 'Confirm you need Renewal vs Re-issue (damage, name change, address change use Re-issue)', category: 'Indian Passport' },
      // ── Online Application ──
      { id: 'ip-04', text: 'Create account or log in at passportindia.gov.in', category: 'Indian Passport' },
      { id: 'ip-05', text: 'Fill Form SP(A) — Fresh/Re-issue of Passport (available on consulate website)', category: 'Indian Passport' },
      { id: 'ip-06', text: 'Select correct category: Normal (36 pages) or Jumbo (60 pages)', category: 'Indian Passport' },
      { id: 'ip-07', text: 'Select validity: 10 years (age 18+) or 5 years (minors)', category: 'Indian Passport' },
      // ── Documents Required ──
      { id: 'ip-08', text: 'Original current Indian passport + self-attested copy of all pages (including blank pages)', category: 'Indian Passport' },
      { id: 'ip-09', text: 'Two recent passport-size photos: 2x2 inch, white background, no glasses, face 70–80% of frame', category: 'Indian Passport' },
      { id: 'ip-10', text: 'Proof of US address: US driving license, utility bill, bank statement, or lease (issued within 6 months)', category: 'Indian Passport' },
      { id: 'ip-11', text: 'Proof of US status: valid US visa stamp in passport OR valid EAD/Green Card (both sides, self-attested copy)', category: 'Indian Passport' },
      { id: 'ip-12', text: 'I-94 printout from cbp.dhs.gov/i94 (shows most recent entry)', category: 'Indian Passport' },
      { id: 'ip-13', text: 'Completed application form SP(A) — signed and dated', category: 'Indian Passport' },
      // ── Optional / Situational ──
      { id: 'ip-14', text: 'Marriage certificate (if name changed due to marriage) + Notarized English translation', category: 'Indian Passport' },
      { id: 'ip-15', text: 'Court order (if name change for other reasons)', category: 'Indian Passport' },
      { id: 'ip-16', text: 'Applicant Declaration form (from consulate website)', category: 'Indian Passport' },
      { id: 'ip-17', text: 'Old expired passport(s) if any — may be required by some consulates', category: 'Indian Passport' },
      // ── VFS Appointment / Submission ──
      { id: 'ip-18', text: 'Book appointment at VFS Global India Visa Application Center for your jurisdiction', category: 'Indian Passport' },
      { id: 'ip-19', text: 'Pay fee: ~$160 for normal adult passport (check consulate website for current fee)', category: 'Indian Passport' },
      { id: 'ip-20', text: 'Bring all originals AND self-attested copies to VFS appointment', category: 'Indian Passport' },
      { id: 'ip-21', text: 'Submit application and biometrics at VFS center', category: 'Indian Passport' },
      // ── After Submission ──
      { id: 'ip-22', text: 'Track application status on VFS portal or consulate website', category: 'Indian Passport' },
      { id: 'ip-23', text: 'Receive passport by mail (prepaid envelope) or collect at VFS', category: 'Indian Passport' },
      { id: 'ip-24', text: 'Verify all details on new passport immediately upon receipt', category: 'Indian Passport' },
      { id: 'ip-25', text: 'Update new passport details with employer, bank, SSA, DMV, and USCIS if needed', category: 'Indian Passport' },
      { id: 'ip-26', text: 'Add new passport to StatusVault with expiry date for future alerts', category: 'Indian Passport' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // CANADA — Process checklists for Indian/expat applicants
  // Sources: IRCC (canada.ca), university ISO offices, Moving2Canada,
  // Canadim, CanadaVisa. Researched 2026 — verify against current IRCC
  // requirements before submitting.
  // ═══════════════════════════════════════════════════════════════

  // ─── Canada Express Entry / PR ────────────────────────────
  {
    id: 'ca-express-entry-pr',
    label: 'Canada Express Entry PR',
    icon: '🇨🇦',
    country: 'CA',
    description: 'Federal Skilled Worker / CEC / FST permanent residence application',
    items: [
      { id: 'cee-01', text: 'Take IELTS General/CELPIP (English) or TEF/TCF (French) — book early', category: 'Express Entry' },
      { id: 'cee-02', text: 'Submit education credential to WES/IQAS for ECA report', category: 'Express Entry' },
      { id: 'cee-03', text: 'Calculate CRS score using IRCC Comprehensive Ranking System tool', category: 'Express Entry' },
      { id: 'cee-04', text: 'Create Express Entry profile on IRCC portal (12-month profile validity)', category: 'Express Entry' },
      { id: 'cee-05', text: 'Submit profiles to relevant Provincial Nominee Programs (PNP) for +600 CRS', category: 'Express Entry' },
      { id: 'cee-06', text: 'Receive Invitation to Apply (ITA) from IRCC draw', category: 'Express Entry' },
      { id: 'cee-07', text: 'Obtain Police Clearance Certificate from each country lived 6+ months', category: 'Express Entry' },
      { id: 'cee-08', text: 'Schedule and complete IRCC medical exam with Panel Physician (12-mo validity)', category: 'Express Entry' },
      { id: 'cee-09', text: 'Get Proof of Funds: 6+ months bank statements meeting LICO threshold', category: 'Express Entry' },
      { id: 'cee-10', text: 'Get reference letters from past employers (with NOC code, hours, salary, duties)', category: 'Express Entry' },
      { id: 'cee-11', text: 'Update passport copies, photos, marriage cert, kids\' birth certs (if applicable)', category: 'Express Entry' },
      { id: 'cee-12', text: 'Pay application fees: $950 PR + $515 Right of PR + $85 biometric per person', category: 'Express Entry' },
      { id: 'cee-13', text: 'Submit complete application within 60 days of ITA', category: 'Express Entry' },
      { id: 'cee-14', text: 'Provide biometrics within 30 days of biometrics request', category: 'Express Entry' },
      { id: 'cee-15', text: 'Receive AOR (Acknowledgement of Receipt) within 24-48 hours', category: 'Express Entry' },
      { id: 'cee-16', text: 'Respond to any IRCC requests for additional documents within deadline', category: 'Express Entry' },
      { id: 'cee-17', text: 'Receive Confirmation of Permanent Residence (COPR) — one-time landing doc', category: 'Express Entry' },
      { id: 'cee-18', text: 'Land in Canada before COPR expires; receive PR card by mail (~30 days)', category: 'Express Entry' },
    ],
  },

  // ─── Canada Study Permit ─────────────────────────────────
  {
    id: 'ca-study-permit',
    label: 'Canada Study Permit',
    icon: '🎓',
    country: 'CA',
    description: 'Study permit application from India / abroad',
    items: [
      { id: 'csp-01', text: 'Apply to and receive acceptance from a Designated Learning Institution (DLI)', category: 'Study Permit' },
      { id: 'csp-02', text: 'Pay first-year tuition deposit and request Letter of Acceptance (LOA)', category: 'Study Permit' },
      { id: 'csp-03', text: 'Obtain Provincial Attestation Letter (PAL) from province (required since 2024)', category: 'Study Permit' },
      { id: 'csp-04', text: 'Show proof of funds: CAD $22,895 + first-year tuition (effective Sept 2025)', category: 'Study Permit' },
      { id: 'csp-05', text: 'Take IELTS Academic / PTE Academic / TOEFL iBT (test results <2 years old)', category: 'Study Permit' },
      { id: 'csp-06', text: 'Get GIC (Guaranteed Investment Certificate) of CAD $20,635 if eligible for SDS', category: 'Study Permit' },
      { id: 'csp-07', text: 'Prepare Statement of Purpose explaining study plan and ties to home country', category: 'Study Permit' },
      { id: 'csp-08', text: 'Get Police Clearance Certificate from Passport Seva Kendra (India)', category: 'Study Permit' },
      { id: 'csp-09', text: 'Schedule medical exam with IRCC-approved Panel Physician', category: 'Study Permit' },
      { id: 'csp-10', text: 'Create IRCC Secure Account, complete IMM 1294 study permit application', category: 'Study Permit' },
      { id: 'csp-11', text: 'Pay fees: $150 study permit + $85 biometrics', category: 'Study Permit' },
      { id: 'csp-12', text: 'Submit application online via IRCC portal', category: 'Study Permit' },
      { id: 'csp-13', text: 'Provide biometrics at VFS Global within 30 days of request', category: 'Study Permit' },
      { id: 'csp-14', text: 'Submit passport for visa stamping if required', category: 'Study Permit' },
      { id: 'csp-15', text: 'Receive Port of Entry Letter; carry to Canada with passport', category: 'Study Permit' },
      { id: 'csp-16', text: 'On arrival: confirm address with CBSA, receive printed study permit', category: 'Study Permit' },
    ],
  },

  // ─── Canada PGWP ─────────────────────────────────────────
  {
    id: 'ca-pgwp',
    label: 'Post-Graduation Work Permit',
    icon: '🎯',
    country: 'CA',
    description: 'PGWP application after Canadian study program completion',
    items: [
      { id: 'cpg-01', text: 'Verify program is PGWP-eligible (DLI list + field of study CIP code)', category: 'PGWP' },
      { id: 'cpg-02', text: 'Maintain full-time student status throughout program (final semester exception)', category: 'PGWP' },
      { id: 'cpg-03', text: 'Complete at least 50% of program in-person from inside Canada (post-Sept 2024)', category: 'PGWP' },
      { id: 'cpg-04', text: 'Take IELTS / CELPIP — meet CLB 5 (diploma) or CLB 7 (degree) per Nov 2024 rules', category: 'PGWP' },
      { id: 'cpg-05', text: 'Receive Letter of Completion / final transcript from institution', category: 'PGWP' },
      { id: 'cpg-06', text: 'Confirm passport is valid for full PGWP duration (or be ready to renew)', category: 'PGWP' },
      { id: 'cpg-07', text: 'Submit PGWP application within 180 days of completion letter', category: 'PGWP' },
      { id: 'cpg-08', text: 'If applying inside Canada: study permit must be valid OR apply for restoration', category: 'PGWP' },
      { id: 'cpg-09', text: 'Pay $255 fee ($155 PGWP + $100 open work permit holder fee)', category: 'PGWP' },
      { id: 'cpg-10', text: 'Submit IMM 5710 application form online via IRCC portal', category: 'PGWP' },
      { id: 'cpg-11', text: 'Begin working full-time immediately if applied while study permit was valid', category: 'PGWP' },
      { id: 'cpg-12', text: 'Receive PGWP — one-time only, cannot be extended (except for passport-cut cases)', category: 'PGWP' },
    ],
  },

  // ─── Canada Work Permit (LMIA-based) ─────────────────────
  {
    id: 'ca-work-permit',
    label: 'Canada Work Permit (Employer)',
    icon: '💼',
    country: 'CA',
    description: 'Employer-specific work permit application from India',
    items: [
      { id: 'cwp-01', text: 'Receive job offer letter from Canadian employer with terms and salary', category: 'Work Permit' },
      { id: 'cwp-02', text: 'Employer obtains Labour Market Impact Assessment (LMIA) from ESDC', category: 'Work Permit' },
      { id: 'cwp-03', text: 'Receive positive LMIA + Offer of Employment from employer', category: 'Work Permit' },
      { id: 'cwp-04', text: 'Confirm NOC TEER classification of the offered position', category: 'Work Permit' },
      { id: 'cwp-05', text: 'Get Police Clearance Certificate from Passport Seva (PSK) India', category: 'Work Permit' },
      { id: 'cwp-06', text: 'Schedule IRCC medical exam if required (job sector-dependent)', category: 'Work Permit' },
      { id: 'cwp-07', text: 'Prepare proof of qualifications: degrees, transcripts, work experience letters', category: 'Work Permit' },
      { id: 'cwp-08', text: 'Complete IMM 1295 work permit application form online', category: 'Work Permit' },
      { id: 'cwp-09', text: 'Pay fees: $155 work permit + $100 open work permit holder fee + $85 biometric', category: 'Work Permit' },
      { id: 'cwp-10', text: 'Submit application; provide biometrics at VFS within 30 days', category: 'Work Permit' },
      { id: 'cwp-11', text: 'Receive Port of Entry Letter (work permit issued at airport on arrival)', category: 'Work Permit' },
      { id: 'cwp-12', text: 'On arrival: declare work intent to CBSA officer; receive printed work permit', category: 'Work Permit' },
      { id: 'cwp-13', text: 'Apply for SIN (Social Insurance Number) at Service Canada within first week', category: 'Work Permit' },
    ],
  },

  // ─── Canada PR Card Renewal ──────────────────────────────
  {
    id: 'ca-pr-card-renewal',
    label: 'Canada PR Card Renewal',
    icon: '🪪',
    country: 'CA',
    description: 'Renew expiring Permanent Resident card (5-year validity)',
    items: [
      { id: 'cpr-01', text: 'Apply within 9 months of card expiry; ideally 6 months before', category: 'PR Card' },
      { id: 'cpr-02', text: 'Verify residency obligation: 730+ physical days in Canada in past 5 years', category: 'PR Card' },
      { id: 'cpr-03', text: 'Calculate physical presence using travel records (passport stamps + flights)', category: 'PR Card' },
      { id: 'cpr-04', text: 'Get 2 PR card photos meeting IRCC photo specifications', category: 'PR Card' },
      { id: 'cpr-05', text: 'Complete IMM 5444 application form (online or paper)', category: 'PR Card' },
      { id: 'cpr-06', text: 'Gather passport copy, current PR card copy, address history (5 yrs)', category: 'PR Card' },
      { id: 'cpr-07', text: 'List employment history covering last 5 years', category: 'PR Card' },
      { id: 'cpr-08', text: 'Provide Canadian tax filing history as proof of residency', category: 'PR Card' },
      { id: 'cpr-09', text: 'Pay $50 PR card fee online', category: 'PR Card' },
      { id: 'cpr-10', text: 'Mail application to Case Processing Centre Sydney (CPC-S) Nova Scotia', category: 'PR Card' },
      { id: 'cpr-11', text: 'Track via IRCC online tools; respond to any residency obligation queries', category: 'PR Card' },
      { id: 'cpr-12', text: 'Receive new PR card by mail (~30 days regular processing)', category: 'PR Card' },
    ],
  },

  // ─── Canada Spousal Sponsorship ──────────────────────────
  {
    id: 'ca-spousal-sponsorship',
    label: 'Canada Spousal Sponsorship',
    icon: '💑',
    country: 'CA',
    description: 'Sponsor spouse / common-law partner for Canada PR',
    items: [
      { id: 'css-01', text: 'Confirm sponsor eligibility: Canadian citizen/PR, 18+, financially capable', category: 'Spousal' },
      { id: 'css-02', text: 'Choose stream: Inland (sponsored partner already in Canada) or Outland', category: 'Spousal' },
      { id: 'css-03', text: 'Gather marriage cert / common-law evidence (12+ months cohabitation)', category: 'Spousal' },
      { id: 'css-04', text: 'Build relationship evidence: photos, joint accounts, lease, communication logs', category: 'Spousal' },
      { id: 'css-05', text: 'Sponsor: complete IMM 1344 sponsor application, sign undertaking', category: 'Spousal' },
      { id: 'css-06', text: 'Sponsored: complete IMM 0008 application + IMM 5532 relationship form', category: 'Spousal' },
      { id: 'css-07', text: 'Sponsored: get police certificates from countries lived 6+ months', category: 'Spousal' },
      { id: 'css-08', text: 'Sponsored: complete IRCC medical exam', category: 'Spousal' },
      { id: 'css-09', text: 'Pay $1,205 fees: $85 sponsor + $570 application + $515 RPRF + $85 biometric', category: 'Spousal' },
      { id: 'css-10', text: 'Submit complete package via IRCC online portal', category: 'Spousal' },
      { id: 'css-11', text: 'Sponsored partner provides biometrics within 30 days', category: 'Spousal' },
      { id: 'css-12', text: 'Apply for Open Work Permit (Inland only) — work while application processes', category: 'Spousal' },
      { id: 'css-13', text: 'Respond to any IRCC interview / additional document requests', category: 'Spousal' },
      { id: 'css-14', text: 'Receive PR confirmation; sponsored partner becomes PR', category: 'Spousal' },
    ],
  },

  // ─── Canadian Citizenship ────────────────────────────────
  {
    id: 'ca-citizenship',
    label: 'Canadian Citizenship',
    icon: '🍁',
    country: 'CA',
    description: 'Citizenship application after meeting PR residency requirements',
    items: [
      { id: 'ccz-01', text: 'Verify physical presence: 1,095+ days in Canada in past 5 years', category: 'Citizenship' },
      { id: 'ccz-02', text: 'Calculate days using IRCC Physical Presence Calculator', category: 'Citizenship' },
      { id: 'ccz-03', text: 'Confirm tax filing for any 3 years within the 5-year qualifying period', category: 'Citizenship' },
      { id: 'ccz-04', text: 'Take IELTS General / CELPIP-General (CLB 4+) — applicants 18-54 only', category: 'Citizenship' },
      { id: 'ccz-05', text: 'Study "Discover Canada" guide for citizenship test', category: 'Citizenship' },
      { id: 'ccz-06', text: 'Complete CIT 0002 application form (online via IRCC portal)', category: 'Citizenship' },
      { id: 'ccz-07', text: 'Provide PR card, passport, language proof, address history', category: 'Citizenship' },
      { id: 'ccz-08', text: 'Pay $630 fee ($530 processing + $100 right of citizenship) per adult', category: 'Citizenship' },
      { id: 'ccz-09', text: 'Submit application; receive AOR within ~6 weeks', category: 'Citizenship' },
      { id: 'ccz-10', text: 'Provide biometrics if requested', category: 'Citizenship' },
      { id: 'ccz-11', text: 'Take citizenship test (online) — 20 questions, 75% pass mark', category: 'Citizenship' },
      { id: 'ccz-12', text: 'Attend citizenship interview (if requested)', category: 'Citizenship' },
      { id: 'ccz-13', text: 'Attend Oath of Citizenship ceremony', category: 'Citizenship' },
      { id: 'ccz-14', text: 'Receive Canadian citizenship certificate; apply for Canadian passport', category: 'Citizenship' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // AUSTRALIA — Process checklists for Indian/expat applicants
  // Sources: Department of Home Affairs (immi.homeaffairs.gov.au),
  // Study Australia, registered MARA agents, AusVisa guides.
  // Researched 2026 — verify with Home Affairs before submission.
  // ═══════════════════════════════════════════════════════════════

  // ─── Australia Student Visa (500) ────────────────────────
  {
    id: 'au-student-500',
    label: 'Australia Student Visa (500)',
    icon: '🎓',
    country: 'AU',
    description: 'Subclass 500 student visa application from India',
    items: [
      { id: 'au5-01', text: 'Apply to and receive offer from CRICOS-registered Australian institution', category: 'Subclass 500' },
      { id: 'au5-02', text: 'Pay tuition deposit; receive Confirmation of Enrolment (CoE)', category: 'Subclass 500' },
      { id: 'au5-03', text: 'Take IELTS / PTE / TOEFL / OET — meet course-level English score', category: 'Subclass 500' },
      { id: 'au5-04', text: 'Prepare Genuine Student (GS) statement (replaces GTE since March 2024)', category: 'Subclass 500' },
      { id: 'au5-05', text: 'Show proof of funds: AUD $29,710+ for 12 months living costs', category: 'Subclass 500' },
      { id: 'au5-06', text: 'Get Overseas Student Health Cover (OSHC) for entire visa duration', category: 'Subclass 500' },
      { id: 'au5-07', text: 'Get Police Clearance Certificate from PSK India', category: 'Subclass 500' },
      { id: 'au5-08', text: 'Schedule health examination with Bupa-approved panel physician', category: 'Subclass 500' },
      { id: 'au5-09', text: 'Note: India is now AL3 (highest risk tier) — extra documentation scrutiny', category: 'Subclass 500' },
      { id: 'au5-10', text: 'Create ImmiAccount; complete Subclass 500 online application', category: 'Subclass 500' },
      { id: 'au5-11', text: 'Pay AUD $2,000+ visa application charge (effective 2026)', category: 'Subclass 500' },
      { id: 'au5-12', text: 'Submit all documents through ImmiAccount portal', category: 'Subclass 500' },
      { id: 'au5-13', text: 'Provide biometrics at VFS Global if requested', category: 'Subclass 500' },
      { id: 'au5-14', text: 'Respond to any case officer questions / additional document requests', category: 'Subclass 500' },
      { id: 'au5-15', text: 'Receive visa grant; arrive in Australia before course start date', category: 'Subclass 500' },
    ],
  },

  // ─── Australia Temporary Graduate Visa (485) ─────────────
  {
    id: 'au-graduate-485',
    label: 'Australia 485 Graduate Visa',
    icon: '🎯',
    country: 'AU',
    description: 'Subclass 485 Temporary Graduate Visa — Post-Higher Education Work / Post-Vocational stream',
    items: [
      { id: 'au4-01', text: 'Confirm course is CRICOS-registered and on PGWP/485-eligible field list', category: 'Subclass 485' },
      { id: 'au4-02', text: 'Verify minimum 16 months of study completed in Australia (post 2024 rule)', category: 'Subclass 485' },
      { id: 'au4-03', text: 'Receive course completion letter / final results from institution', category: 'Subclass 485' },
      { id: 'au4-04', text: 'Verify under 35 years (for most streams; under 50 for Master research/PhD)', category: 'Subclass 485' },
      { id: 'au4-05', text: 'Take IELTS Academic 6.5 (no band <5.5) or equivalent — 1-year validity', category: 'Subclass 485' },
      { id: 'au4-06', text: 'Get Police Clearance Certificates from countries lived 12+ months', category: 'Subclass 485' },
      { id: 'au4-07', text: 'Schedule and complete health examination with panel physician', category: 'Subclass 485' },
      { id: 'au4-08', text: 'Get Overseas Student Health Cover (or substitute health insurance)', category: 'Subclass 485' },
      { id: 'au4-09', text: 'Post-Vocational stream only: obtain positive skills assessment from authority', category: 'Subclass 485' },
      { id: 'au4-10', text: 'Apply within 6 months of course completion (strict deadline)', category: 'Subclass 485' },
      { id: 'au4-11', text: 'Complete application via ImmiAccount; pay AUD $2,300+ fee', category: 'Subclass 485' },
      { id: 'au4-12', text: 'Submit while inside Australia on valid student visa (preferred)', category: 'Subclass 485' },
      { id: 'au4-13', text: 'Receive Bridging Visa A automatically while application processes', category: 'Subclass 485' },
      { id: 'au4-14', text: 'Indian nationals: confirm eligibility for AI-ECTA +1 year extension', category: 'Subclass 485' },
      { id: 'au4-15', text: 'Receive 485 grant — Bachelor 2yr / Master 2-3yr / PhD 4yr', category: 'Subclass 485' },
    ],
  },

  // ─── Australia Skills in Demand Visa (482) ───────────────
  {
    id: 'au-sid-482',
    label: 'Australia 482 Skills in Demand',
    icon: '💼',
    country: 'AU',
    description: 'Subclass 482 employer-sponsored work visa (replaced TSS Dec 2024)',
    items: [
      { id: 'sid-01', text: 'Find Australian employer willing to sponsor (must be approved sponsor)', category: 'Subclass 482' },
      { id: 'sid-02', text: 'Identify stream: Specialist (AUD $141k+), Core Skills (CSOL), or Labour Agreement', category: 'Subclass 482' },
      { id: 'sid-03', text: 'Verify ANZSCO occupation code is on Core Skills Occupation List (CSOL)', category: 'Subclass 482' },
      { id: 'sid-04', text: 'Confirm minimum 1 year relevant work experience (reduced from 2 yrs in 2024)', category: 'Subclass 482' },
      { id: 'sid-05', text: 'Get positive skills assessment from relevant Australian assessing authority', category: 'Subclass 482' },
      { id: 'sid-06', text: 'Take IELTS 5.0+ (each band 5.0+) or accepted equivalent', category: 'Subclass 482' },
      { id: 'sid-07', text: 'Employer lodges Nomination application with Department of Home Affairs', category: 'Subclass 482' },
      { id: 'sid-08', text: 'Get Police Clearance Certificate from PSK India + any other countries', category: 'Subclass 482' },
      { id: 'sid-09', text: 'Schedule and complete Bupa health examination', category: 'Subclass 482' },
      { id: 'sid-10', text: 'Compile employment letters, payslips, tax returns covering past 1-5 years', category: 'Subclass 482' },
      { id: 'sid-11', text: 'Lodge Subclass 482 visa application via ImmiAccount', category: 'Subclass 482' },
      { id: 'sid-12', text: 'Pay visa application charge (~AUD $3,210+ for primary applicant)', category: 'Subclass 482' },
      { id: 'sid-13', text: 'Provide biometrics at VFS Global', category: 'Subclass 482' },
      { id: 'sid-14', text: 'Receive visa grant; can use 180-day buffer to change employers (post-2024)', category: 'Subclass 482' },
    ],
  },

  // ─── Australia Skilled PR (189/190) ──────────────────────
  {
    id: 'au-skilled-pr',
    label: 'Australia Skilled PR (189/190)',
    icon: '⭐',
    country: 'AU',
    description: 'Subclass 189 Skilled Independent / 190 State Nominated permanent residence',
    items: [
      { id: 'asp-01', text: 'Confirm occupation is on MLTSSL (189) or relevant state list (190)', category: 'Skilled PR' },
      { id: 'asp-02', text: 'Get positive skills assessment from authority (e.g. ACS, EA, VETASSESS)', category: 'Skilled PR' },
      { id: 'asp-03', text: 'Take IELTS 8.0 / PTE 79+ (Superior English) for max points', category: 'Skilled PR' },
      { id: 'asp-04', text: 'Calculate points: age + English + experience + education + partner', category: 'Skilled PR' },
      { id: 'asp-05', text: 'Need minimum 65 points; 80+ recommended for invitation', category: 'Skilled PR' },
      { id: 'asp-06', text: 'Submit Expression of Interest (EOI) in SkillSelect (2-year validity)', category: 'Skilled PR' },
      { id: 'asp-07', text: 'For 190: apply for state nomination separately (+5 points)', category: 'Skilled PR' },
      { id: 'asp-08', text: 'Receive Invitation to Apply (ITA) from Home Affairs', category: 'Skilled PR' },
      { id: 'asp-09', text: 'Get Police Clearance Certificates from countries lived 12+ months', category: 'Skilled PR' },
      { id: 'asp-10', text: 'Complete health examination with panel physician', category: 'Skilled PR' },
      { id: 'asp-11', text: 'Compile Form 80 (personal particulars) + Form 1221 (work history)', category: 'Skilled PR' },
      { id: 'asp-12', text: 'Lodge full application within 60 days of invitation', category: 'Skilled PR' },
      { id: 'asp-13', text: 'Pay AUD $4,640+ visa application charge', category: 'Skilled PR' },
      { id: 'asp-14', text: 'Provide biometrics at VFS Global', category: 'Skilled PR' },
      { id: 'asp-15', text: 'Receive PR grant — full Australian permanent resident rights', category: 'Skilled PR' },
    ],
  },

  // ─── Australia Visitor Visa (600) ────────────────────────
  {
    id: 'au-visitor-600',
    label: 'Australia Visitor Visa (600)',
    icon: '🇦🇺',
    country: 'AU',
    description: 'Subclass 600 visitor visa from India — Tourist or Business stream',
    items: [
      { id: 'av6-01', text: 'Identify correct stream: Tourist, Business Visitor, or Sponsored Family', category: 'Subclass 600' },
      { id: 'av6-02', text: 'Indian passport with 6+ months validity beyond intended stay', category: 'Subclass 600' },
      { id: 'av6-03', text: 'Detailed travel itinerary with flight bookings and accommodation', category: 'Subclass 600' },
      { id: 'av6-04', text: 'Bank statements showing sufficient funds for trip duration', category: 'Subclass 600' },
      { id: 'av6-05', text: 'Employment letter (NOC from employer) + recent payslips', category: 'Subclass 600' },
      { id: 'av6-06', text: 'Income Tax Returns from last 2-3 years', category: 'Subclass 600' },
      { id: 'av6-07', text: 'Family visit: invitation letter from Australian sponsor + their PR/citizen proof', category: 'Subclass 600' },
      { id: 'av6-08', text: 'Business: invitation from Australian company + conference/meeting evidence', category: 'Subclass 600' },
      { id: 'av6-09', text: 'Travel insurance (recommended, mandatory for some streams)', category: 'Subclass 600' },
      { id: 'av6-10', text: 'Demonstrate strong ties to India (job, property, family)', category: 'Subclass 600' },
      { id: 'av6-11', text: 'Create ImmiAccount; complete Subclass 600 online application', category: 'Subclass 600' },
      { id: 'av6-12', text: 'Pay visa application charge (AUD $200 base + service fees)', category: 'Subclass 600' },
      { id: 'av6-13', text: 'Provide biometrics at VFS Global Australia centre', category: 'Subclass 600' },
      { id: 'av6-14', text: 'Receive visa grant by email — print and carry to Australia', category: 'Subclass 600' },
    ],
  },

  // ─── Australia Partner Visa (820/801 or 309/100) ─────────
  {
    id: 'au-partner-visa',
    label: 'Australia Partner Visa',
    icon: '💑',
    country: 'AU',
    description: 'Onshore (820/801) or Offshore (309/100) partner visa',
    items: [
      { id: 'app-01', text: 'Confirm sponsor: Australian citizen / PR / eligible NZ citizen', category: 'Partner' },
      { id: 'app-02', text: 'Choose pathway: 820 onshore OR 309 offshore based on applicant location', category: 'Partner' },
      { id: 'app-03', text: 'Document relationship: 12+ months married OR de facto cohabitation', category: 'Partner' },
      { id: 'app-04', text: 'Build evidence: financial (joint accounts, leases), nature of household, social', category: 'Partner' },
      { id: 'app-05', text: 'Get marriage certificate (apostilled if from India)', category: 'Partner' },
      { id: 'app-06', text: 'Sponsor: complete sponsorship application + character documents', category: 'Partner' },
      { id: 'app-07', text: 'Applicant: complete Form 47SP (visa application) + Form 80', category: 'Partner' },
      { id: 'app-08', text: 'Get Police Clearance Certificates from each country lived 12+ months', category: 'Partner' },
      { id: 'app-09', text: 'Complete health examination with panel physician', category: 'Partner' },
      { id: 'app-10', text: 'Compile statutory declarations from Form 888 witnesses (2+)', category: 'Partner' },
      { id: 'app-11', text: 'Lodge application via ImmiAccount; pay AUD $9,365 visa fee (2026)', category: 'Partner' },
      { id: 'app-12', text: 'Onshore (820): receive Bridging Visa A; can work and study', category: 'Partner' },
      { id: 'app-13', text: 'Receive temporary visa grant (820 or 309) — typically 12-18 months wait', category: 'Partner' },
      { id: 'app-14', text: 'After 2 years from initial application: assess for permanent stage (801/100)', category: 'Partner' },
      { id: 'app-15', text: 'Provide updated relationship evidence for permanent stage assessment', category: 'Partner' },
      { id: 'app-16', text: 'Receive permanent partner visa grant', category: 'Partner' },
    ],
  },

  // ─── Australia Citizenship ───────────────────────────────
  {
    id: 'au-citizenship',
    label: 'Australian Citizenship',
    icon: '🦘',
    country: 'AU',
    description: 'Australian citizenship by conferral after 4 years of PR residency',
    items: [
      { id: 'aci-01', text: 'Verify residency: 4+ years legal Australian residence (12 mo as PR)', category: 'Citizenship' },
      { id: 'aci-02', text: 'Calculate absences: <90 days outside Australia in last 12 months as PR', category: 'Citizenship' },
      { id: 'aci-03', text: 'Confirm <12 months total absences in 4-year residency period', category: 'Citizenship' },
      { id: 'aci-04', text: 'Complete Form 1300t citizenship application (online via ImmiAccount)', category: 'Citizenship' },
      { id: 'aci-05', text: 'Provide PR visa, passport, address history, character documents', category: 'Citizenship' },
      { id: 'aci-06', text: 'Get Police Clearance Certificate from each country lived 90+ days', category: 'Citizenship' },
      { id: 'aci-07', text: 'Pay AUD $560 application fee', category: 'Citizenship' },
      { id: 'aci-08', text: 'Submit application; receive acknowledgement within ~2 weeks', category: 'Citizenship' },
      { id: 'aci-09', text: 'Study Australian Citizenship resource book for citizenship test', category: 'Citizenship' },
      { id: 'aci-10', text: 'Sit citizenship test (75% pass) — 20 questions on values/laws/history', category: 'Citizenship' },
      { id: 'aci-11', text: 'Attend citizenship interview if requested', category: 'Citizenship' },
      { id: 'aci-12', text: 'Attend Australian Citizenship Ceremony — make Pledge of Commitment', category: 'Citizenship' },
      { id: 'aci-13', text: 'Receive Australian citizenship certificate; apply for Australian passport', category: 'Citizenship' },
      { id: 'aci-14', text: 'Note: Australia does not allow dual citizenship with India — surrender Indian citizenship', category: 'Citizenship' },
    ],
  },
];

/** Get template by ID */