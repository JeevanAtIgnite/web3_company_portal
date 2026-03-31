import { Building2, CreditCard, Users, AlertTriangle, ShieldAlert } from 'lucide-react';
import type { Company, User, PersonaCapabilities } from '../types';
import { formatDate } from '../utils/format';

interface Props {
  company: Company;
  users: User[];
  capabilities: PersonaCapabilities;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active:   'bg-green-100 text-green-800',
    suspended: 'bg-amber-100 text-amber-800',
    inactive:  'bg-slate-100 text-slate-600',
    past_due:  'bg-orange-100 text-orange-800',
    disabled:  'bg-red-100 text-red-700',
  };
  const labels: Record<string, string> = {
    active:   'Active',
    suspended: 'Suspended',
    inactive:  'Inactive',
    past_due:  'Past Due',
    disabled:  'Disabled',
  };
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
        styles[status] ?? styles.inactive
      }`}
    >
      {labels[status] ?? status}
    </span>
  );
}

const TIER_COLORS: Record<string, string> = {
  'subscriber-full':      'bg-indigo-100 text-indigo-700',
  'subscriber-frontline': 'bg-sky-100 text-sky-700',
  'subscriber-basic':     'bg-slate-100 text-slate-600',
  'subscriber-basic-tt':  'bg-violet-100 text-violet-700',
  'subscriber-basic-pp':  'bg-emerald-100 text-emerald-700',
  'subscriber-cafe-pp':   'bg-teal-100 text-teal-700',
  'subscriber-cafe-tt':   'bg-amber-100 text-amber-700',
};

export function SummaryCards({ company, users, capabilities }: Props) {
  const activeUsers    = users.filter((u) => u.status === 'active').length;
  const totalUsers     = users.length;
  const _activePercent = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0; void _activePercent;
  const subStatus      = company.subscription.status;
  const licensedSeats  = company.subscription.licensedSeats;
  const seatPercent    = licensedSeats > 0 ? Math.round((totalUsers / licensedSeats) * 100) : 0;
  const seatStatus     = seatPercent >= 100 ? 'over' : seatPercent >= 80 ? 'warning' : 'ok';
  const seatBarColor   = seatStatus === 'over' ? 'bg-red-500' : seatStatus === 'warning' ? 'bg-amber-400' : 'bg-green-500';
  const seatLabel      = seatStatus === 'over' ? 'Over licensed seats' : seatStatus === 'warning' ? 'Approaching limit' : 'Within limit';
  const seatLabelColor = seatStatus === 'over' ? 'text-red-600' : seatStatus === 'warning' ? 'text-amber-600' : 'text-green-600';

  return (
    <div className={`grid gap-4 ${capabilities.canViewUserTable ? 'grid-cols-3' : 'grid-cols-2'}`}>
      {/* Company Status */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Company Status
            </p>
            <p className="mt-1.5 text-base font-semibold text-slate-900 leading-tight truncate">
              {company.name}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {company.facilityType} · {company.region}
            </p>
          </div>
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-slate-500" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <StatusBadge status={company.status} />
          <span className="text-xs text-slate-400">{company.tenantId}</span>
        </div>
      </div>

      {/* Subscription Health */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Subscription Health
            </p>
            {capabilities.canViewFullSubscription ? (
              <>
                <p className="mt-1.5 text-base font-semibold text-slate-900">
                  {company.subscription.planName} Plan
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Renews {formatDate(company.subscription.renewalDate)}
                </p>
              </>
            ) : (
              <>
                <p className="mt-1.5 text-base font-semibold text-slate-900">
                  {company.subscription.planName}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Contact your admin for details</p>
              </>
            )}
          </div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              subStatus === 'past_due' ? 'bg-orange-100' : 'bg-slate-100'
            }`}
          >
            {subStatus === 'past_due' ? (
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            ) : (
              <CreditCard className="w-5 h-5 text-slate-500" />
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <StatusBadge status={subStatus} />
          {capabilities.canViewFullSubscription && (
            <span
              className={`text-xs px-2 py-0.5 rounded font-medium ${
                TIER_COLORS[company.subscription.planTier] ?? 'bg-slate-100 text-slate-600'
              }`}
            >
              {company.subscription.planName}
            </span>
          )}
        </div>
      </div>

      {/* Seat Utilisation — hidden for Customer Employee */}
      {capabilities.canViewUserTable && (
        <div className={`bg-white rounded-xl border shadow-sm p-5 ${seatStatus === 'over' ? 'border-red-200' : 'border-slate-200'}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Seat Utilisation
              </p>
              <p className="mt-1.5 text-base font-semibold text-slate-900">
                {totalUsers}{' '}
                <span className="text-slate-400 font-normal text-sm">/ {licensedSeats} licensed</span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{activeUsers} active · {totalUsers - activeUsers} inactive</p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${seatStatus === 'over' ? 'bg-red-100' : seatStatus === 'warning' ? 'bg-amber-100' : 'bg-slate-100'}`}>
              {seatStatus === 'over'
                ? <ShieldAlert className="w-5 h-5 text-red-600" />
                : <Users className={`w-5 h-5 ${seatStatus === 'warning' ? 'text-amber-600' : 'text-slate-500'}`} />
              }
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-medium ${seatLabelColor}`}>{seatLabel}</span>
              <span className={`text-xs font-semibold ${seatLabelColor}`}>{Math.min(seatPercent, 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${seatBarColor}`}
                style={{ width: `${Math.min(seatPercent, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
