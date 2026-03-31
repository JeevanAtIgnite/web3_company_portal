import {
  Building2,
  FileText,
  GraduationCap,
  LifeBuoy,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const PORTAL_SECTIONS = [
  { id: 'section-overview',     label: 'Overview'       },
  { id: 'section-subscription', label: 'Subscription'   },
  { id: 'section-users',        label: 'User Management'},
];

const OTHER_NAV = [
  { id: 'documents', label: 'Document Library', icon: FileText },
  { id: 'lms',       label: 'LMS / Training',   icon: GraduationCap },
  { id: 'support',   label: 'Support',          icon: LifeBuoy },
  { id: 'reporting', label: 'Reporting',        icon: BarChart3 },
];

export function Sidebar({ activeSection, onNavigate }: Props) {
  return (
    <aside className="w-60 bg-slate-900 flex flex-col flex-shrink-0 h-screen sticky top-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-none">
            <p className="text-white text-sm font-semibold tracking-tight">The Compliance</p>
            <p className="text-indigo-400 text-sm font-semibold tracking-tight">Store</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-slate-600 text-xs font-medium uppercase tracking-wider px-3 pb-2">
          Navigation
        </p>

        {/* Company Portal — active group with sub-sections */}
        <div className="mb-1">
          {/* Group header */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-indigo-600 text-white font-medium text-sm shadow-sm mb-0.5">
            <Building2 className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">Company Portal</span>
            <span className="text-xs bg-indigo-500 text-indigo-100 rounded px-1.5 py-0.5 leading-none">
              POC
            </span>
          </div>

          {/* Sub-section rail */}
          <div className="ml-5 pl-3 border-l border-slate-700 space-y-0.5 py-0.5">
            {PORTAL_SECTIONS.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => onNavigate(section.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-left transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
                      isActive ? 'bg-indigo-400' : 'bg-slate-600'
                    }`}
                  />
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Other nav items — disabled in POC */}
        <div className="space-y-0.5 mt-1">
          {OTHER_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                disabled
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 cursor-default text-left"
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer note */}
      <div className="px-5 py-4 border-t border-slate-800 flex-shrink-0">
        <p className="text-slate-600 text-xs">POC Demo · v1.0</p>
        <p className="text-slate-700 text-xs mt-0.5">Frontend Only</p>
      </div>
    </aside>
  );
}
