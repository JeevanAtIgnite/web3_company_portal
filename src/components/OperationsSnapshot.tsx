import { TrendingUp, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import type { PersonaId, CompanyOpsData, OperationalInsight, InsightType } from '../types';

interface Props {
  personaId: PersonaId;
  opsData: CompanyOpsData;
  planTier: string;
}

// ── Shared helpers ────────────────────────────────────────────────────────────

function WidgetCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full ${className}`}>
      {children}
    </div>
  );
}

function WidgetHeader({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  badge,
  badgeStyle,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  badge?: string;
  badgeStyle?: string;
}) {
  return (
    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>
      </div>
      {badge && (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeStyle}`}>{badge}</span>
      )}
    </div>
  );
}

// ── Operational Insights Widget ───────────────────────────────────────────────

const INSIGHT_STYLES: Record<InsightType, { icon: React.ElementType; iconColor: string; textColor: string; bg: string; border: string }> = {
  positive: { icon: CheckCircle,   iconColor: 'text-green-500',  textColor: 'text-green-800',  bg: 'bg-green-50',  border: 'border-green-100' },
  warning:  { icon: AlertTriangle, iconColor: 'text-orange-500', textColor: 'text-orange-800', bg: 'bg-orange-50', border: 'border-orange-100' },
  info:     { icon: Info,          iconColor: 'text-blue-500',   textColor: 'text-blue-800',   bg: 'bg-blue-50',   border: 'border-blue-100'  },
  neutral:  { icon: Info,          iconColor: 'text-slate-400',  textColor: 'text-slate-600',  bg: 'bg-slate-50',  border: 'border-slate-100' },
};

function getInsightsForPersona(insights: OperationalInsight[], personaId: PersonaId): OperationalInsight[] {
  const audienceMap: Record<PersonaId, string[]> = {
    'tcs-admin':         ['admin', 'relationship', 'all'],
    'tcs-employee':      ['admin', 'relationship', 'all'],
    'customer-admin':    ['admin', 'all'],
    'customer-employee': ['personal', 'all'],
    'account-manager':   ['relationship', 'all'],
  };
  const allowed = audienceMap[personaId];
  return insights.filter((i) => allowed.includes(i.audience));
}

const INSIGHTS_HEADER_SUBTITLE: Record<PersonaId, string> = {
  'tcs-admin':         'Cross-company operational and adoption signals',
  'tcs-employee':      'Support and operational engagement signals',
  'customer-admin':    'Company adoption, usage, and compliance signals',
  'customer-employee': 'Team resources and personal learning signals',
  'account-manager':   'Adoption, engagement, and relationship health signals',
};

function InsightsWidget({ personaId, opsData }: Props) {
  const filtered = getInsightsForPersona(opsData.insights, personaId);

  return (
    <WidgetCard>
      <WidgetHeader
        icon={TrendingUp}
        iconBg="bg-indigo-50"
        iconColor="text-indigo-600"
        title="Operational Insights"
        subtitle={INSIGHTS_HEADER_SUBTITLE[personaId]}
      />
      <div className="p-5 flex flex-col gap-2.5 flex-1">
        {filtered.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-slate-400">No signals available for this view.</p>
          </div>
        ) : (
          filtered.map((insight, i) => {
            const style = INSIGHT_STYLES[insight.type];
            const Icon = style.icon;
            return (
              <div
                key={i}
                className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg border ${style.bg} ${style.border}`}
              >
                <Icon className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${style.iconColor}`} />
                <p className={`text-xs leading-relaxed ${style.textColor}`}>{insight.signal}</p>
              </div>
            );
          })
        )}
      </div>
    </WidgetCard>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function OperationsSnapshot({ personaId, opsData, planTier: _planTier }: Props) {
  return (
    <div className="h-full">
      <InsightsWidget personaId={personaId} opsData={opsData} planTier="" />
    </div>
  );
}
