import type { PersonaId, PlanRecommendations } from '../types';

// ── Per-plan recommendation data ─────────────────────────────────────────────

const RECOMMENDATIONS: Record<string, PlanRecommendations> = {

  // ── Subscriber – Full: nothing to recommend ───────────────────────────────
  'subscriber-full': {
    topPicks: [],
    highlightedModuleIds: [],
    docCafeTicker: [],
    trainingTicker: [],
  },

  // ── Subscriber – Basic (wcpa — Post-Acute / Rehab) ────────────────────────
  'subscriber-basic': {
    topPicks: [
      {
        moduleId: 'poc',
        moduleName: 'Plan of Correction',
        badge: 'recommended',
        badgeLabel: 'Recommended',
        relevanceLine: 'For Post-Acute facilities managing deficiency response workflows',
        insightLine: 'Guided corrective-action workflows reduce manual drafting effort and improve response consistency across survey cycles.',
      },
      {
        moduleId: 'lms',
        moduleName: 'LMS / Training',
        badge: 'trending',
        badgeLabel: 'Popular upgrade',
        relevanceLine: 'Common next step for facilities improving staff training visibility',
        insightLine: 'Links staff training directly to compliance content — supports completion tracking and assignment-based accountability.',
      },
      {
        moduleId: 'doc-cafe',
        moduleName: 'Document Café',
        badge: 'popular',
        badgeLabel: 'Often added',
        relevanceLine: 'Helps Post-Acute facilities manage care protocols alongside TCS compliance content',
        insightLine: 'Centralises facility-owned policies and operational guides in one portal for frontline staff access.',
      },
    ],
    highlightedModuleIds: ['poc', 'lms', 'doc-cafe'],
    docCafeTicker: [
      'Facilities using Document Café centralise company-specific policies and care protocols in one portal',
      'Helps frontline staff find facility-specific materials without searching shared drives or paper binders',
      'A natural addition to document library access — extends from TCS content to facility-managed content',
      'Often paired with Policies & Procedures for a complete policy management workflow',
    ],
    trainingTicker: [
      'LMS links staff training directly to compliance workflows — supports completion tracking and overdue visibility',
      'Common expansion path for organisations moving away from spreadsheet-based completion tracking',
      'Supports assignment-based accountability and overdue visibility across care staff groups',
      'Often adopted alongside Document Café for a complete content and training experience',
    ],
  },

  // ── Subscriber – Basic + T&T (ssl — Assisted Living) ─────────────────────
  'subscriber-basic-tt': {
    topPicks: [
      {
        moduleId: 'poc',
        moduleName: 'Plan of Correction',
        badge: 'recommended',
        badgeLabel: 'Recommended',
        relevanceLine: 'Recommended for Assisted Living facilities managing survey findings and corrective actions',
        insightLine: 'AI-assisted corrective workflows reduce manual effort — a strong complement to your existing training capabilities.',
      },
      {
        moduleId: 'survey',
        moduleName: 'Survey Readiness',
        badge: 'trending',
        badgeLabel: 'Trending in AL',
        relevanceLine: 'Helps teams shift from reactive survey prep to proactive readiness tracking',
        insightLine: 'Often adopted together with Training and PoC workflows for end-to-end deficiency response coverage.',
      },
      {
        moduleId: 'policies',
        moduleName: 'Policies & Procedures',
        badge: 'popular',
        badgeLabel: 'Often paired',
        relevanceLine: 'Strengthens compliance posture when combined with your existing Training module',
        insightLine: 'Organisations using Training and Policy workflows together show stronger staff completion and lower manual follow-up.',
      },
    ],
    highlightedModuleIds: ['poc', 'survey', 'policies'],
    docCafeTicker: [
      'Facilities using Document Café centralise company-specific policies alongside TCS compliance content',
      'Common adoption pattern: add Café to manage local documents alongside your existing compliance content',
      'Helps staff access facility-specific guides and operational documents in one place',
      'Often paired with Policies & Procedures for end-to-end policy management',
    ],
    trainingTicker: [],
  },

  // ── Subscriber – Basic + P&P (lcc — Independent Living) ──────────────────
  'subscriber-basic-pp': {
    topPicks: [
      {
        moduleId: 'lms',
        moduleName: 'LMS / Training',
        badge: 'recommended',
        badgeLabel: 'Recommended',
        relevanceLine: 'Natural complement to your Policies & Procedures module',
        insightLine: 'Organisations using Training alongside Policy workflows show stronger staff completion visibility and lower manual follow-up.',
      },
      {
        moduleId: 'ai-search',
        moduleName: 'AI Search & Guidance',
        badge: 'trending',
        badgeLabel: 'Trending',
        relevanceLine: 'Enhances value of your existing P&P content with intelligent search and guided responses',
        insightLine: 'Facilities with AI Search resolve the majority of compliance queries without raising a support ticket.',
      },
      {
        moduleId: 'poc',
        moduleName: 'Plan of Correction',
        badge: 'popular',
        badgeLabel: 'Often added',
        relevanceLine: 'Rounds out your compliance workflow — from policy access to corrective action response',
        insightLine: 'Guided corrective-action workflows reduce manual drafting and improve response consistency across survey cycles.',
      },
    ],
    highlightedModuleIds: ['lms', 'ai-search', 'poc'],
    docCafeTicker: [
      'Document Café complements your existing P&P module with a facility-managed document layer',
      'Facilities use Café to manage company-specific policies alongside TCS compliance content',
      'Helps staff access local operational guides and facility-specific materials in one portal',
      'Often added by facilities that want to manage both TCS and company-owned content in one place',
    ],
    trainingTicker: [
      'LMS links staff training directly to your existing Policies & Procedures workflows',
      'Common next step for organisations that want training completion visibility alongside policy management',
      'Supports assignment-based accountability and overdue tracking across staff groups',
      'Organisations using Training and Policy together demonstrate stronger compliance readiness trends',
    ],
  },

  // ── Subscriber – Frontline (mnr — Skilled Nursing) ────────────────────────
  'subscriber-frontline': {
    topPicks: [
      {
        moduleId: 'lms',
        moduleName: 'LMS / Training',
        badge: 'recommended',
        badgeLabel: 'Recommended for SNFs',
        relevanceLine: 'Useful for Skilled Nursing facilities linking frontline staff training to compliance workflows',
        insightLine: 'Supports completion tracking, overdue visibility, and assignment-based accountability — common in high-compliance SNF environments.',
      },
      {
        moduleId: 'poc',
        moduleName: 'Plan of Correction',
        badge: 'trending',
        badgeLabel: 'Trending in SNFs',
        relevanceLine: 'Particularly relevant for Skilled Nursing Facilities managing CMS survey findings',
        insightLine: 'Facilities using guided corrective-action workflows demonstrate faster deficiency response turnaround and improved consistency.',
      },
      {
        moduleId: 'doc-cafe',
        moduleName: 'Document Café',
        badge: 'popular',
        badgeLabel: 'Popular with frontline teams',
        relevanceLine: 'Helps manage facility-specific care protocols alongside standard TCS content',
        insightLine: 'Gives frontline staff direct access to company-owned policies and guides without separate document systems.',
      },
    ],
    highlightedModuleIds: ['lms', 'poc', 'doc-cafe'],
    docCafeTicker: [
      'Facilities using Document Café give frontline staff direct access to company-specific care protocols',
      'Centralise facility-owned care guides, shift briefings, and operational policies in one portal',
      'A natural complement to Document Library access — adds a facility-managed content layer',
      'Often adopted by SNFs reducing reliance on paper-based policy distribution',
    ],
    trainingTicker: [
      'LMS links frontline staff training to compliance workflows — common in high-compliance SNF environments',
      'Supports completion tracking and overdue visibility without spreadsheet management',
      'Enables assignment-based accountability across shifts and care groups',
      'Often adopted when facilities move from general document access to full compliance workflow coverage',
    ],
  },

  // ── Subscriber – Café + P&P (pal — Assisted Living) ──────────────────────
  'subscriber-cafe-pp': {
    topPicks: [
      {
        moduleId: 'lms',
        moduleName: 'LMS / Training',
        badge: 'recommended',
        badgeLabel: 'Recommended',
        relevanceLine: 'Natural next step — combines your Document Café and P&P capabilities with staff training tracking',
        insightLine: 'Organisations using Training alongside Café and Policy workflows show stronger end-to-end compliance coverage.',
      },
      {
        moduleId: 'survey',
        moduleName: 'Survey Readiness',
        badge: 'trending',
        badgeLabel: 'Trending in AL',
        relevanceLine: 'Proactive readiness tracking for facilities already managing strong policy workflows',
        insightLine: 'Common next adoption for facilities wanting to move from reactive survey preparation to structured readiness planning.',
      },
      {
        moduleId: 'ai-search',
        moduleName: 'AI Search & Guidance',
        badge: 'popular',
        badgeLabel: 'Often added',
        relevanceLine: 'Enhances the value of your existing P&P and Café content with intelligent, guided search',
        insightLine: 'Facilities with AI Search resolve the majority of compliance queries without raising support tickets.',
      },
    ],
    highlightedModuleIds: ['lms', 'survey', 'ai-search'],
    docCafeTicker: [],
    trainingTicker: [
      'LMS links staff training to your existing Café and P&P content for end-to-end compliance coverage',
      'Common expansion path for facilities wanting training completion visibility alongside policy management',
      'Supports overdue tracking and assignment-based accountability for care staff groups',
      'Combining Café, P&P, and Training creates a complete internal compliance workflow layer',
    ],
  },

  // ── Subscriber – Café + T&T (hvmc — Memory Care) ─────────────────────────
  'subscriber-cafe-tt': {
    topPicks: [
      {
        moduleId: 'poc',
        moduleName: 'Plan of Correction',
        badge: 'recommended',
        badgeLabel: 'Recommended',
        relevanceLine: 'Valuable for Memory Care facilities managing survey findings and care-specific corrective actions',
        insightLine: 'AI-assisted corrective workflows reduce manual drafting — a strong complement to your existing Training capabilities.',
      },
      {
        moduleId: 'survey',
        moduleName: 'Survey Readiness',
        badge: 'trending',
        badgeLabel: 'Trending in MC',
        relevanceLine: 'Proactive readiness tracking for facilities with active training and Café workflows',
        insightLine: 'Often adopted together with Training and PoC for comprehensive deficiency response coverage.',
      },
      {
        moduleId: 'policies',
        moduleName: 'Policies & Procedures',
        badge: 'popular',
        badgeLabel: 'Often paired with T&T',
        relevanceLine: 'Strengthens compliance posture by linking policy management to your existing Training workflows',
        insightLine: 'Organisations using Training and Policy workflows together show higher staff completion and lower manual follow-up.',
      },
    ],
    highlightedModuleIds: ['poc', 'survey', 'policies'],
    docCafeTicker: [],
    trainingTicker: [],
  },
};

// ── Motivating insight line per module (shown on every locked module) ─────────
// Positive, outcome-led, single line, LTC-grounded

export const MODULE_INSIGHT_LINES: Record<string, string> = {
  'doc-cafe':  'Teams using Document Café find facility-specific policies faster and eliminate the need for separate document systems.',
  'lms':       'Facilities with LMS show higher staff completion rates and stronger compliance readiness across all groups.',
  'policies':  'Organisations with P&P access see stronger policy adherence and less variability in how care protocols are followed.',
  'ai-search': 'Facilities with AI Search resolve most compliance queries in seconds — without raising a support ticket.',
  'survey':    'Facilities using Survey Readiness consistently enter surveys better prepared and with clearer corrective action trails.',
  'poc':       'Facilities with Plan of Correction spend less time on survey prep and see fewer repeat deficiency citations.',
  'analytics': 'Operators with Analytics make faster, data-backed decisions on adoption gaps and compliance trends across teams.',
};

export function getRecommendations(planTier: string): PlanRecommendations {
  return RECOMMENDATIONS[planTier] ?? RECOMMENDATIONS['subscriber-basic'];
}

// ── Persona-specific panel labels ─────────────────────────────────────────────

export const PERSONA_PANEL_CONFIG: Partial<Record<PersonaId, {
  title: string;
  subtitle: string;
  ctaText: string;
}>> = {
  'tcs-admin':       { title: 'Expansion Opportunities',       subtitle: 'Modules with upsell potential for this account',     ctaText: 'View signal'              },
  'tcs-employee':    { title: 'Potential for This Account',    subtitle: 'Relevant modules based on facility type and segment', ctaText: 'Note for AM'              },
  'customer-admin':  { title: 'Recommended for Your Facility', subtitle: 'Based on facilities similar to yours',                ctaText: 'Ask your account manager' },
  'account-manager': { title: 'Upsell Opportunity',            subtitle: 'Account growth signals for this facility',            ctaText: 'Start conversation'       },
};

// ── Badge colours ─────────────────────────────────────────────────────────────

export const BADGE_STYLES: Record<string, string> = {
  recommended: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  trending:    'bg-amber-50  text-amber-700  border border-amber-200',
  popular:     'bg-teal-50   text-teal-700   border border-teal-200',
};
