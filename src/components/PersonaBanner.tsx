import type { PersonaId, PersonaCapabilities } from '../types';

interface Props {
  personaId: PersonaId;
  companyName: string;
  capabilities: PersonaCapabilities;
}

interface BannerConfig {
  initials: string;
  label: string;
  description: string;
  borderColor: string;  // border-l-4 color class
  bg: string;
  labelColor: string;
  descColor: string;
  badgeBg: string;
  badgeText: string;
}

const CONFIG: Record<PersonaId, BannerConfig> = {
  'tcs-admin': {
    initials: 'TA',
    label: 'TCS Platform Administration',
    description: 'Full administrative access across all companies, subscriptions, and users.',
    borderColor: 'border-indigo-500',
    bg: 'bg-indigo-50',
    labelColor: 'text-indigo-900',
    descColor: 'text-indigo-600',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-700',
  },
  'tcs-employee': {
    initials: 'TE',
    label: 'TCS Internal View',
    description: 'Cross-company read and limited manage access for internal support operations.',
    borderColor: 'border-violet-500',
    bg: 'bg-violet-50',
    labelColor: 'text-violet-900',
    descColor: 'text-violet-600',
    badgeBg: 'bg-violet-100',
    badgeText: 'text-violet-700',
  },
  'customer-admin': {
    initials: 'CA',
    label: 'Company Administration',
    description: 'Self-service management for your company — users, access, and subscription visibility.',
    borderColor: 'border-emerald-500',
    bg: 'bg-emerald-50',
    labelColor: 'text-emerald-900',
    descColor: 'text-emerald-600',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-700',
  },
  'customer-employee': {
    initials: 'CE',
    label: 'Company Member View',
    description: 'Read-only access to your company portal. User and access changes are managed by your administrator.',
    borderColor: 'border-sky-500',
    bg: 'bg-sky-50',
    labelColor: 'text-sky-900',
    descColor: 'text-sky-600',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-700',
  },
  'account-manager': {
    initials: 'AM',
    label: 'Account Portfolio View',
    description: 'Relationship overview for assigned customer accounts. Administrative actions are not available.',
    borderColor: 'border-amber-500',
    bg: 'bg-amber-50',
    labelColor: 'text-amber-900',
    descColor: 'text-amber-600',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-700',
  },
};

export function PersonaBanner({ personaId, companyName, capabilities }: Props) {
  const c = CONFIG[personaId];

  const scopeText =
    capabilities.companyScope === 'own'
      ? `Scoped to ${companyName}`
      : capabilities.companyScope === 'assigned'
      ? 'Assigned accounts only'
      : 'All companies visible';

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-l-4 ${c.borderColor} ${c.bg}`}
    >
      {/* Role initials badge */}
      <span
        className={`text-xs font-bold px-2 py-0.5 rounded-md flex-shrink-0 ${c.badgeBg} ${c.badgeText}`}
      >
        {c.initials}
      </span>

      {/* Label */}
      <span className={`text-sm font-semibold flex-shrink-0 ${c.labelColor}`}>{c.label}</span>

      {/* Divider dot */}
      <span className={`text-xs flex-shrink-0 ${c.descColor}`}>·</span>

      {/* Description */}
      <span className={`text-xs ${c.descColor} truncate`}>{c.description}</span>

      {/* Scope chip — right-aligned */}
      <span
        className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${c.badgeBg} ${c.badgeText}`}
      >
        {scopeText}
      </span>
    </div>
  );
}
