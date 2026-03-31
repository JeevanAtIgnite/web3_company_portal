import { useState } from 'react';
import type { PersonaId, UserStatus, NewUserForm, User } from './types';
import {
  PERSONAS,
  COMPANIES,
  INITIAL_USERS,
  ACCOUNT_MANAGER_COMPANIES,
  COMPANY_OPS_DATA,
} from './data/mockData';
import { getCapabilities } from './utils/capabilities';
import { AppShell } from './components/AppShell';
import { HeaderBar } from './components/HeaderBar';
import { CompanyPortal } from './pages/CompanyPortal';

const CUSTOMER_DEFAULT_COMPANY_ID = 'gvcc';

export default function App() {
  const [selectedPersonaId, setSelectedPersonaId] = useState<PersonaId>('tcs-admin');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('gvcc');
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [activeSection, setActiveSection] = useState('section-overview');

  // ── Derived values ──────────────────────────────────────────────────────────

  const selectedPersona = PERSONAS.find((p) => p.id === selectedPersonaId)!;
  const capabilities = getCapabilities(selectedPersonaId);

  const availableCompanies = (() => {
    switch (capabilities.companyScope) {
      case 'all':
        return COMPANIES;
      case 'assigned':
        return COMPANIES.filter((c) => ACCOUNT_MANAGER_COMPANIES.includes(c.id));
      case 'own':
        return COMPANIES.filter((c) => c.id === CUSTOMER_DEFAULT_COMPANY_ID);
    }
  })();

  const selectedCompany =
    COMPANIES.find((c) => c.id === selectedCompanyId) ?? COMPANIES[0];

  const companyUsers = users.filter((u) => u.companyId === selectedCompanyId);

  const companyOpsData = COMPANY_OPS_DATA[selectedCompanyId] ?? COMPANY_OPS_DATA['gvcc'];

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handlePersonaChange(newPersonaId: PersonaId) {
    setSelectedPersonaId(newPersonaId);
    setActiveSection('section-overview');

    const newCaps = getCapabilities(newPersonaId);
    if (newCaps.companyScope === 'own') {
      setSelectedCompanyId(CUSTOMER_DEFAULT_COMPANY_ID);
    } else if (newCaps.companyScope === 'assigned') {
      if (!ACCOUNT_MANAGER_COMPANIES.includes(selectedCompanyId)) {
        setSelectedCompanyId(ACCOUNT_MANAGER_COMPANIES[0]);
      }
    }
  }

  function handleCompanyChange(companyId: string) {
    setSelectedCompanyId(companyId);
  }

  function handleUserStatusChange(userId: string, newStatus: UserStatus) {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
  }

  function handleAddUser(form: NewUserForm) {
    const newUser: User = {
      id: `u-${Date.now()}`,
      companyId: selectedCompanyId,
      name: form.name,
      email: form.email,
      role: form.role,
      businessProfile: form.businessProfile,
      status: 'active',
      lastLogin: 'Never',
    };
    setUsers((prev) => [...prev, newUser]);
  }

  function handleNavigate(sectionId: string) {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <AppShell
      activeSection={activeSection}
      onNavigate={handleNavigate}
      header={
        <HeaderBar
          personas={PERSONAS}
          selectedPersona={selectedPersona}
          onPersonaChange={handlePersonaChange}
          availableCompanies={availableCompanies}
          selectedCompany={selectedCompany}
          personaId={selectedPersonaId}
          onCompanyChange={handleCompanyChange}
          opsData={COMPANY_OPS_DATA}
        />
      }
    >
      <CompanyPortal
        personaId={selectedPersonaId}
        company={selectedCompany}
        users={companyUsers}
        capabilities={capabilities}
        opsData={companyOpsData}
        onAddUser={handleAddUser}
        onUserStatusChange={handleUserStatusChange}
      />
    </AppShell>
  );
}
