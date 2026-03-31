import { Shield, CheckCircle } from 'lucide-react';
import type { PersonaId, PersonaCapabilities } from '../types';

interface Props {
  personaId: PersonaId;
  capabilities: PersonaCapabilities;
  companyName: string;
}

const GOVERNANCE_ITEMS = [
  {
    label: 'Company-scoped tenant isolation',
    detail: 'All users and data are isolated within their company workspace',
  },
  {
    label: 'Role-based access control',
    detail: 'Admin and employee roles enforce distinct access boundaries',
  },
  {
    label: 'Self-service user management',
    detail: 'Facility admins can onboard and manage staff directly',
  },
  {
    label: 'Individual user accounts enforced',
    detail: 'Shared login links are no longer required or permitted',
  },
  {
    label: 'Admin action audit trail',
    detail: 'All user management changes are logged for compliance review',
  },
];

const PERSONA_FRAMING: Record<PersonaId, string> = {
  'tcs-admin':        'Platform-wide governance posture. All tenant access controls active.',
  'tcs-employee':     'Access governance summary for internal operational reference.',
  'customer-admin':   "Your company's access and governance posture in this workspace.",
  'customer-employee': '',
  'account-manager':  'Customer governance readiness — access controls in place for this account.',
};

export function AccessSecurityCard({ personaId, capabilities, companyName }: Props) {
  const isEmployee = personaId === 'customer-employee';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Shield className="w-4 h-4 text-slate-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Access &amp; Security</h3>
          <p className="text-xs text-slate-500 mt-0.5">Governance posture</p>
        </div>
      </div>

      {isEmployee ? (
        /* Customer Employee — simplified view */
        <div className="flex-1 flex flex-col justify-center gap-3">
          <div className="bg-sky-50 border border-sky-100 rounded-xl p-4">
            <p className="text-sm font-medium text-sky-900 leading-relaxed">
              Your account access is secured and managed by{' '}
              <span className="font-semibold">{companyName}</span>.
            </p>
            <p className="text-xs text-sky-700 mt-2 leading-relaxed">
              Contact your administrator for access changes or to report access issues.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              <span className="text-xs text-slate-600">Your account has dedicated login credentials</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              <span className="text-xs text-slate-600">Access is scoped to your company only</span>
            </div>
          </div>
        </div>
      ) : (
        /* All other personas — governance checklist */
        <div className="flex-1 flex flex-col gap-3">
          {PERSONA_FRAMING[personaId] && (
            <p className="text-xs text-slate-500 leading-relaxed">{PERSONA_FRAMING[personaId]}</p>
          )}
          <div className="space-y-2.5">
            {GOVERNANCE_ITEMS.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-700">{item.label}</p>
                  {capabilities.showAdminControls && (
                    <p className="text-xs text-slate-400 mt-0.5 leading-snug">{item.detail}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          {capabilities.canViewFullSubscription && (
            <div className="mt-auto pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Governance status</span>
                <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                  Controls Active
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
