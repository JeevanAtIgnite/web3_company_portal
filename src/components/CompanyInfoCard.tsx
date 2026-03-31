import { Building2, Info, Hash, Calendar, Network, MapPin, Mail } from 'lucide-react';
import type { Company, PersonaCapabilities, CompanyOpsData } from '../types';
import { formatDate } from '../utils/format';

interface Props {
  company: Company;
  capabilities: PersonaCapabilities;
  opsData: CompanyOpsData;
}

const STATUS_STYLES: Record<string, { dot: string; label: string; text: string }> = {
  active:    { dot: 'bg-green-500', label: 'Active',    text: 'text-green-700' },
  suspended: { dot: 'bg-amber-500', label: 'Suspended', text: 'text-amber-700' },
  inactive:  { dot: 'bg-slate-400', label: 'Inactive',  text: 'text-slate-600' },
};

interface TileProps {
  icon: React.ElementType;
  label: string;
  value: string;
  iconBg?: string;
  iconColor?: string;
}

function DetailTile({ icon: Icon, label, value, iconBg = 'bg-slate-100', iconColor = 'text-slate-500' }: TileProps) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-center gap-2.5">
      <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-800 mt-0.5 leading-snug">{value}</p>
      </div>
    </div>
  );
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function CompanyInfoCard({ company, capabilities, opsData }: Props) {
  const statusStyle = STATUS_STYLES[company.status] ?? STATUS_STYLES.inactive;
  const am = opsData.accountManager;
  const showFullAM = capabilities.canViewFullSubscription;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 leading-tight truncate">
              {company.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {company.facilityType} &middot; {company.region}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
          <span className={`text-xs font-semibold ${statusStyle.text}`}>{statusStyle.label}</span>
        </div>
      </div>

      {/* 2×2 detail tile grid */}
      <div className="grid grid-cols-2 gap-3">
        <DetailTile
          icon={Hash}
          label="Tenant ID"
          value={company.tenantId}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-500"
        />
        <DetailTile
          icon={MapPin}
          label="Region"
          value={company.region}
          iconBg="bg-sky-50"
          iconColor="text-sky-500"
        />
        <DetailTile
          icon={Network}
          label="Parent Organization"
          value={company.parentCompany ?? '—'}
          iconBg="bg-violet-50"
          iconColor="text-violet-500"
        />
        <DetailTile
          icon={Calendar}
          label="Last Updated"
          value={formatDate(company.lastUpdated)}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
        />
      </div>

      {/* Account Manager enhanced contact section */}
      <div className="border-t border-slate-100 pt-3.5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
          Account Manager
        </p>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-emerald-700">{getInitials(am.name)}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800 leading-tight">{am.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">{am.title}</p>
            {showFullAM && (
              <div className="flex items-center gap-1 mt-1">
                <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <p className="text-xs text-indigo-600">{am.email}</p>
              </div>
            )}
          </div>
          {showFullAM && (
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2 py-0.5 flex-shrink-0 leading-snug">
              {am.badge}
            </span>
          )}
        </div>
        {/* Relationship note — internal TCS / AM view only */}
        {capabilities.showAdminControls && (
          <p className="text-xs text-slate-400 mt-2 leading-relaxed italic">
            &ldquo;{am.relationshipNote}&rdquo;
          </p>
        )}
      </div>

      {/* Account Health Note */}
      {capabilities.canViewFullSubscription && (
        <div className="border-t border-slate-100 pt-3.5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Account Health Note
          </p>
          <div className="flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed">{company.note}</p>
          </div>
        </div>
      )}
    </div>
  );
}
