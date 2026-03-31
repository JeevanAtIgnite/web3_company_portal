import { Bell, ChevronRight } from 'lucide-react';
import type { Company, Persona, PersonaId, CompanyOpsData } from '../types';
import { PersonaSwitcher } from './PersonaSwitcher';
import { CompanySelector } from './CompanySelector';

interface Props {
  personas: Persona[];
  selectedPersona: Persona;
  onPersonaChange: (id: PersonaId) => void;
  availableCompanies: Company[];
  selectedCompany: Company;
  personaId: PersonaId;
  onCompanyChange: (id: string) => void;
  opsData: Record<string, CompanyOpsData>;
}

const CONTEXT_LABELS: Partial<Record<PersonaId, string>> = {
  'customer-admin':    'Company-scoped workspace',
  'customer-employee': 'Company-scoped workspace',
  'account-manager':   'Assigned account view',
};

export function HeaderBar({
  personas,
  selectedPersona,
  onPersonaChange,
  availableCompanies,
  selectedCompany,
  personaId,
  onCompanyChange,
  opsData,
}: Props) {
  const contextLabel = CONTEXT_LABELS[personaId];

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 flex-shrink-0 z-10">
      {/* Breadcrumb + context label */}
      <div className="flex-1 flex items-center gap-1.5 text-sm text-slate-500 min-w-0">
        <span className="text-slate-400">Platform</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
        <span className="text-slate-600">Company Portal</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
        <span className="text-slate-900 font-medium truncate">{selectedCompany.name}</span>
        {contextLabel && (
          <span className="ml-2 pl-2 border-l border-slate-200 text-xs text-slate-400 flex-shrink-0">
            {contextLabel}
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <CompanySelector
          companies={availableCompanies}
          selectedCompany={selectedCompany}
          personaId={personaId}
          onCompanyChange={onCompanyChange}
          opsData={opsData}
        />

        <div className="w-px h-6 bg-slate-200" />

        <PersonaSwitcher
          personas={personas}
          selectedPersona={selectedPersona}
          onPersonaChange={onPersonaChange}
        />

        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-slate-500 relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
