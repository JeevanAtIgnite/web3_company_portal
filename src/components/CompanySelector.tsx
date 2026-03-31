import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Building2, Lock, Check } from 'lucide-react';
import type { Company, PersonaId, CompanyOpsData } from '../types';

interface Props {
  companies: Company[]; // filtered to what this persona can see
  selectedCompany: Company;
  personaId: PersonaId;
  onCompanyChange: (id: string) => void;
  opsData: Record<string, CompanyOpsData>;
}

interface HealthConfig {
  label: string;
  dotColor: string;
  pingColor: string;
  tint: string;
  pulse: boolean;
}

function getHealthConfig(health: CompanyOpsData['accountHealth'] | undefined): HealthConfig {
  if (!health) return { label: 'Unknown', dotColor: 'bg-slate-400', pingColor: '', tint: '', pulse: false };
  switch (health.overall) {
    case 'healthy':
      return { label: 'Healthy', dotColor: 'bg-green-500', pingColor: '', tint: '', pulse: false };
    case 'moderate':
      return { label: 'Moderate', dotColor: 'bg-amber-400', pingColor: '', tint: 'bg-amber-50', pulse: false };
    case 'at-risk':
      return { label: 'At Risk', dotColor: 'bg-red-500', pingColor: 'bg-red-400', tint: 'bg-red-50', pulse: true };
  }
}

const PLAN_TIER_COLORS: Record<string, string> = {
  'subscriber-full':      'bg-indigo-100 text-indigo-700',
  'subscriber-frontline': 'bg-sky-100 text-sky-700',
  'subscriber-basic':     'bg-slate-100 text-slate-600',
  'subscriber-basic-tt':  'bg-violet-100 text-violet-700',
  'subscriber-basic-pp':  'bg-emerald-100 text-emerald-700',
  'subscriber-cafe-pp':   'bg-teal-100 text-teal-700',
  'subscriber-cafe-tt':   'bg-amber-100 text-amber-700',
};

export function CompanySelector({ companies, selectedCompany, personaId, onCompanyChange, opsData }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredDotId, setHoveredDotId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Customer roles are locked to their own company — no switcher
  const isLocked =
    personaId === 'customer-admin' || personaId === 'customer-employee';

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  if (isLocked) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm">
        <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <span className="text-slate-600 font-medium truncate max-w-[180px]">
          {selectedCompany.name}
        </span>
        <Lock className="w-3 h-3 text-slate-400 flex-shrink-0" />
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
      >
        <Building2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
        <span className="text-slate-700 font-medium truncate max-w-[180px]">
          {selectedCompany.name}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="dropdown-enter absolute right-0 top-full mt-1.5 w-[420px] bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
          <div className="px-3 py-2.5 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Select Company
            </p>
            {personaId === 'account-manager' && (
              <p className="text-xs text-slate-400 mt-0.5">Showing assigned accounts only</p>
            )}
          </div>

          {companies.map((company) => {
            const isSelected = company.id === selectedCompany.id;
            const tierColor =
              PLAN_TIER_COLORS[company.subscription.planTier] ?? 'bg-slate-100 text-slate-600';
            const health = opsData[company.id]?.accountHealth;
            const hc = getHealthConfig(health);
            const isHoveringDot = hoveredDotId === company.id;

            // Tooltip signal lines
            const billingLine = health
              ? (health.billingRisk === 'healthy' ? `Billing: ${health.billingLabel}` : `⚠ Billing: ${health.billingLabel}`)
              : null;
            const supportLine = health
              ? (health.openSupportIssues === 0 ? 'Support: All clear' : `⚠ ${health.openSupportIssues} open support ticket${health.openSupportIssues > 1 ? 's' : ''}`)
              : null;
            const renewalLine = health
              ? `Renewal: ${health.renewalDaysOut} days out`
              : null;

            return (
              <button
                key={company.id}
                onClick={() => {
                  onCompanyChange(company.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-start gap-3 px-3 py-2.5 transition-colors text-left ${
                  isSelected
                    ? hc.tint || 'bg-slate-50'
                    : hc.tint
                    ? `${hc.tint} hover:brightness-95`
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Building2 className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{company.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium whitespace-nowrap ${tierColor}`}>
                      {company.subscription.planName}
                    </span>
                    <span className="text-xs text-slate-400">{company.facilityType}</span>
                  </div>
                </div>

                {/* Health dot with tooltip */}
                <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                  {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                  <div
                    className="relative"
                    onMouseEnter={() => setHoveredDotId(company.id)}
                    onMouseLeave={() => setHoveredDotId(null)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Dot */}
                    <span className="relative flex h-2.5 w-2.5">
                      {hc.pulse && (
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${hc.pingColor}`}
                        />
                      )}
                      <span
                        className={`relative inline-flex rounded-full h-2.5 w-2.5 ${hc.dotColor}`}
                      />
                    </span>

                    {/* Tooltip */}
                    {isHoveringDot && health && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-[100] w-52 bg-slate-900 text-white rounded-lg shadow-xl px-3 py-2.5 pointer-events-none">
                        <p className={`text-xs font-semibold mb-1.5 ${
                          hc.label === 'Healthy' ? 'text-green-400' :
                          hc.label === 'Moderate' ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          ● {hc.label}
                        </p>
                        <div className="space-y-1">
                          {billingLine && (
                            <p className={`text-xs ${billingLine.startsWith('⚠') ? 'text-red-300' : 'text-slate-300'}`}>
                              {billingLine}
                            </p>
                          )}
                          {supportLine && (
                            <p className={`text-xs ${supportLine.startsWith('⚠') ? 'text-amber-300' : 'text-slate-300'}`}>
                              {supportLine}
                            </p>
                          )}
                          {renewalLine && (
                            <p className="text-xs text-slate-300">{renewalLine}</p>
                          )}
                        </div>
                        {/* Arrow pointing right */}
                        <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-slate-900 rotate-45" />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
