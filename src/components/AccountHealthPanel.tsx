import { Activity, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import type { AccountHealth, HealthStatus, AdoptionLevel, PersonaCapabilities } from '../types';

interface Props {
  health: AccountHealth;
  capabilities: PersonaCapabilities;
}

const HEALTH_STYLES: Record<HealthStatus, { dot: string; text: string; bg: string; border: string; label: string }> = {
  healthy:    { dot: 'bg-green-500',  text: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-100', label: 'Healthy'  },
  moderate:   { dot: 'bg-amber-500',  text: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-100', label: 'Moderate' },
  'at-risk':  { dot: 'bg-red-500',    text: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-100',   label: 'At Risk'  },
};

const ADOPTION_STYLES: Record<AdoptionLevel, { text: string; label: string; icon: React.ElementType }> = {
  strong:   { text: 'text-green-700', label: 'Strong',   icon: TrendingUp   },
  moderate: { text: 'text-amber-700', label: 'Moderate', icon: Activity     },
  low:      { text: 'text-red-700',   label: 'Low',      icon: TrendingDown },
};

function MetricRow({
  label,
  value,
  valueClass,
  icon: Icon,
}: {
  label: string;
  value: string;
  valueClass: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
      <span className="text-xs text-slate-500">{label}</span>
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className={`w-3 h-3 ${valueClass}`} />}
        <span className={`text-xs font-semibold ${valueClass}`}>{value}</span>
      </div>
    </div>
  );
}

export function AccountHealthPanel({ health, capabilities }: Props) {
  const overallStyle  = HEALTH_STYLES[health.overall];
  const billingStyle  = HEALTH_STYLES[health.billingRisk];
  const adoptionMeta  = ADOPTION_STYLES[health.adoption];
  const engageMeta    = ADOPTION_STYLES[health.engagement];

  const renewalLabel =
    health.renewalDaysOut <= 60
      ? `${health.renewalDaysOut} days — due soon`
      : health.renewalDaysOut <= 120
      ? `${health.renewalDaysOut} days`
      : `${health.renewalDaysOut} days`;

  const renewalClass =
    health.renewalDaysOut <= 60
      ? 'text-orange-700'
      : health.renewalDaysOut <= 120
      ? 'text-amber-700'
      : 'text-slate-700';

  // capabilities is available for future use
  void capabilities;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Activity className="w-4 h-4 text-slate-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Account Health</h3>
            <p className="text-xs text-slate-500 mt-0.5">Value &amp; engagement signals</p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${overallStyle.bg} ${overallStyle.border} border ${overallStyle.text}`}>
          {overallStyle.label}
        </span>
      </div>

      {/* Metrics */}
      <div className="flex-1 flex flex-col">
        <MetricRow
          label="Billing"
          value={health.billingLabel}
          valueClass={billingStyle.text}
          icon={health.billingRisk === 'at-risk' ? AlertTriangle : CheckCircle}
        />
        <MetricRow
          label="Platform Adoption"
          value={adoptionMeta.label}
          valueClass={adoptionMeta.text}
          icon={adoptionMeta.icon}
        />
        <MetricRow
          label="User Engagement"
          value={engageMeta.label}
          valueClass={engageMeta.text}
          icon={engageMeta.icon}
        />
        <MetricRow
          label="Renewal Outlook"
          value={renewalLabel}
          valueClass={renewalClass}
          icon={Clock}
        />
        <MetricRow
          label="Open Support Issues"
          value={health.openSupportIssues === 0 ? 'None' : `${health.openSupportIssues} open`}
          valueClass={health.openSupportIssues > 1 ? 'text-orange-700' : health.openSupportIssues === 1 ? 'text-amber-700' : 'text-green-700'}
        />
      </div>

      {/* Summary */}
      <div className={`rounded-lg px-3 py-2.5 border ${overallStyle.bg} ${overallStyle.border}`}>
        <p className={`text-xs leading-relaxed ${overallStyle.text}`}>{health.summaryLine}</p>
      </div>
    </div>
  );
}
