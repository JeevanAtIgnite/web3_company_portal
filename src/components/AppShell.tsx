import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface Props {
  header: ReactNode;
  children: ReactNode;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export function AppShell({ header, children, activeSection, onNavigate }: Props) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Left sidebar */}
      <Sidebar activeSection={activeSection} onNavigate={onNavigate} />

      {/* Right column: header + scrollable content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {header}
        <main className="flex-1 overflow-y-auto" id="main-scroll">
          {children}
        </main>
      </div>
    </div>
  );
}
