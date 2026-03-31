import { AlertTriangle, Check, Lock, Zap } from 'lucide-react';
import type { Company, PersonaCapabilities, PersonaId } from '../types';
import { formatDate } from '../utils/format';
import { getRecommendations, BADGE_STYLES, MODULE_INSIGHT_LINES } from '../data/recommendations';

interface Props {
  company: Company;
  capabilities: PersonaCapabilities;
  personaId: PersonaId;
}

const PLAN_TIER_STYLES: Record<string, { bg: string; text: string; border: string; sub: string }> = {
  'subscriber-full':      { bg: 'bg-indigo-50',  text: 'text-indigo-700',  border: 'border-indigo-200',  sub: 'text-indigo-400'  },
  'subscriber-frontline': { bg: 'bg-sky-50',     text: 'text-sky-700',     border: 'border-sky-200',     sub: 'text-sky-400'     },
  'subscriber-basic':     { bg: 'bg-slate-50',   text: 'text-slate-700',   border: 'border-slate-200',   sub: 'text-slate-400'   },
  'subscriber-basic-tt':  { bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200',  sub: 'text-violet-400'  },
  'subscriber-basic-pp':  { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', sub: 'text-emerald-400' },
  'subscriber-cafe-pp':   { bg: 'bg-teal-50',    text: 'text-teal-700',    border: 'border-teal-200',    sub: 'text-teal-400'    },
  'subscriber-cafe-tt':   { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   sub: 'text-amber-400'   },
};

const PLAN_TIER_LABELS: Record<string, string> = {
  'subscriber-full':      'Full Access Bundle',
  'subscriber-frontline': 'Frontline Bundle',
  'subscriber-basic':     'Basic Bundle',
  'subscriber-basic-tt':  'Basic + Training Bundle',
  'subscriber-basic-pp':  'Basic + Policies Bundle',
  'subscriber-cafe-pp':   'Café + Policies Bundle',
  'subscriber-cafe-tt':   'Café + Training Bundle',
};

const SUB_STATUS_STYLES: Record<string, string> = {
  active:    'bg-green-100 text-green-800',
  past_due:  'bg-orange-100 text-orange-800',
  suspended: 'bg-amber-100 text-amber-800',
};

const SUB_STATUS_LABELS: Record<string, string> = {
  active:    'Active',
  past_due:  'Past Due',
  suspended: 'Suspended',
};

export function SubscriptionCard({ company, capabilities, personaId }: Props) {
  const sub        = company.subscription;
  const tierStyle  = PLAN_TIER_STYLES[sub.planTier] ?? PLAN_TIER_STYLES['subscriber-basic'];
  const isPastDue  = sub.status === 'past_due';
  const included   = sub.entitlements.filter((e) =>  e.included);
  const locked     = sub.entitlements.filter((e) => !e.included);

  // AI recommendations — badges on locked modules only
  const showRecommendations = personaId !== 'customer-employee';
  const recs         = getRecommendations(sub.planTier);
  const highlightSet = new Set(recs.highlightedModuleIds);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
      {/* Past-due alert */}
      {isPastDue && (
        <div className="flex items-start gap-2.5 px-5 py-3 bg-orange-50 border-b border-orange-200 rounded-t-xl">
          <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-orange-800">Payment Past Due</p>
            <p className="text-xs text-orange-700 mt-0.5">
              {sub.billingState}. Service continuity may be affected. Contact billing to resolve.
            </p>
          </div>
        </div>
      )}

      {/* Card header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Subscription &amp; Plan</h3>
            <p className="text-xs text-slate-500 mt-0.5">Module access and entitlements</p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${SUB_STATUS_STYLES[sub.status] ?? SUB_STATUS_STYLES.active}`}>
          {SUB_STATUS_LABELS[sub.status] ?? sub.status}
        </span>
      </div>

      <div className="p-5 space-y-4 flex-1">
        {/* Plan tier hero */}
        <div className={`rounded-xl border p-4 flex items-start justify-between gap-3 ${tierStyle.bg} ${tierStyle.border}`}>
          <div className="min-w-0">
            <p className={`text-lg font-bold leading-tight ${tierStyle.text}`}>{sub.planName}</p>
            <p className={`text-xs font-medium mt-0.5 ${tierStyle.sub}`}>{PLAN_TIER_LABELS[sub.planTier] ?? sub.planTier}</p>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">{sub.description}</p>
          </div>
        </div>

        {/* Billing / dates strip */}
        {capabilities.canViewFullSubscription && (
          <div className="flex divide-x divide-slate-100 rounded-xl border border-slate-100 bg-slate-50 overflow-hidden">
            <div className="flex-1 px-4 py-2.5 text-center">
              <p className="text-xs text-slate-400 font-medium">Billing</p>
              <p className={`text-sm font-semibold mt-0.5 ${isPastDue ? 'text-orange-600' : 'text-slate-800'}`}>
                {sub.billingState}
              </p>
            </div>
            <div className="flex-1 px-4 py-2.5 text-center">
              <p className="text-xs text-slate-400 font-medium">Start Date</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">{formatDate(sub.startDate)}</p>
            </div>
            <div className="flex-1 px-4 py-2.5 text-center">
              <p className="text-xs text-slate-400 font-medium">Renewal</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">{formatDate(sub.renewalDate)}</p>
            </div>
          </div>
        )}

        {/* Entitlements */}
        <div className="space-y-3">
          {/* Included */}
          {included.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Included in current plan
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {included.map((ent) => (
                  <div
                    key={ent.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium bg-green-50 border-green-100 text-slate-700"
                  >
                    <Check className="w-3 h-3 text-green-600 flex-shrink-0" />
                    <span className="truncate">{ent.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locked — with smart badges for highlighted modules */}
          {locked.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Not available in this plan
              </p>
              <div className="space-y-1.5">
                {locked.map((ent) => {
                  const rec         = showRecommendations ? recs.topPicks.find((r) => r.moduleId === ent.id) : undefined;
                  const isHighlighted = highlightSet.has(ent.id) && showRecommendations;
                  const insightLine = MODULE_INSIGHT_LINES[ent.id];

                  return (
                    <div
                      key={ent.id}
                      className="rounded-lg border border-slate-100 bg-slate-50 overflow-hidden"
                    >
                      <div className="flex items-center gap-2 px-3 pt-2 pb-1">
                        <Lock className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="text-xs font-medium flex-1 text-slate-700">
                          {ent.name}
                        </span>
                        {isHighlighted && rec && (
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap ${BADGE_STYLES[rec.badge]}`}>
                            {rec.badgeLabel}
                          </span>
                        )}
                      </div>
                      {insightLine && (
                        <p className="text-[11px] text-slate-400 leading-snug px-3 pb-2 pl-8 truncate">
                          {insightLine}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
