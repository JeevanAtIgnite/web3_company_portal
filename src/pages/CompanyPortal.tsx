import { useState } from 'react';
import type { Company, User, PersonaCapabilities, PersonaId, NewUserForm, UserStatus, CompanyOpsData } from '../types';
import { SummaryCards } from '../components/SummaryCards';
import { CompanyInfoCard } from '../components/CompanyInfoCard';
import { SubscriptionCard } from '../components/SubscriptionCard';
import { AccessSecurityCard } from '../components/AccessSecurityCard';
import { AccountHealthPanel } from '../components/AccountHealthPanel';
import { OperationsSnapshot } from '../components/OperationsSnapshot';
import { UserManagementTable } from '../components/UserManagementTable';
import { AddUserModal } from '../components/AddUserModal';
import { PersonaBanner } from '../components/PersonaBanner';

interface Props {
  personaId: PersonaId;
  company: Company;
  users: User[];
  capabilities: PersonaCapabilities;
  opsData: CompanyOpsData;
  onAddUser: (form: NewUserForm) => void;
  onUserStatusChange: (userId: string, newStatus: UserStatus) => void;
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="pb-4 border-b border-slate-200">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
    </div>
  );
}

const SUBTITLES: Record<PersonaId, {
  overview: string;
  subscription: string;
  operations: string;
  users: string;
}> = {
  'tcs-admin': {
    overview:     'Full administrative view — company profile, account manager, and access governance.',
    subscription: 'Complete billing, plan, entitlement details, and account health indicators.',
    operations:   'Platform usage, document activity, training compliance, and support visibility.',
    users:        'Manage all users in this company. Status changes take effect immediately.',
  },
  'tcs-employee': {
    overview:     'Internal read-only company view for support and operations reference.',
    subscription: 'Plan, entitlement, and account health overview for internal support context.',
    operations:   'Operational signals for support context and engagement monitoring.',
    users:        'View user accounts for support and diagnostic purposes.',
  },
  'customer-admin': {
    overview:     'Your company profile, account manager contact, and access governance at a glance.',
    subscription: 'Your current plan, included modules, billing status, and renewal information.',
    operations:   'Your company\'s document activity, training progress, support status, and engagement.',
    users:        'Manage your team — invite users and adjust their access levels.',
  },
  'customer-employee': {
    overview:     'Your company profile and access overview.',
    subscription: 'Your current subscription plan and available modules.',
    operations:   'Your team\'s resources, training progress, and support access.',
    users:        '',
  },
  'account-manager': {
    overview:     'Relationship overview for this assigned customer account.',
    subscription: 'Plan, entitlement visibility, and account health for account context.',
    operations:   'Account adoption, training health, support load, and engagement signals.',
    users:        '',
  },
};

export function CompanyPortal({
  personaId,
  company,
  users,
  capabilities,
  opsData,
  onAddUser,
  onUserStatusChange,
}: Props) {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const sub = SUBTITLES[personaId];

  return (
    <div className="p-6 space-y-8">
      {/* Page title + persona banner */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Company Portal</h1>
            <p className="text-sm text-slate-500 mt-1">
              Company profile, subscription overview, and user management
            </p>
          </div>
        </div>
        <PersonaBanner
          personaId={personaId}
          companyName={company.name}
          capabilities={capabilities}
        />
      </div>

      {/* ── Section 1: Company Overview ────────────────────────────────────── */}
      <section id="section-overview" className="space-y-5 scroll-mt-4">
        <SectionHeader title="Company Overview" subtitle={sub.overview} />
        <SummaryCards company={company} users={users} capabilities={capabilities} />
        <div className="grid grid-cols-5 gap-5 items-stretch">
          <div className="col-span-3 h-full">
            <CompanyInfoCard company={company} capabilities={capabilities} opsData={opsData} />
          </div>
          <div className="col-span-2 h-full">
            <AccessSecurityCard
              personaId={personaId}
              capabilities={capabilities}
              companyName={company.name}
            />
          </div>
        </div>
      </section>

      {/* ── Section 2: Subscription & Entitlements ─────────────────────────── */}
      <section id="section-subscription" className="space-y-5 scroll-mt-4">
        <SectionHeader title="Subscription &amp; Entitlements" subtitle={sub.subscription} />
        <div className="grid grid-cols-5 gap-5 items-stretch">
          <div className="col-span-3 h-full">
            <SubscriptionCard company={company} capabilities={capabilities} personaId={personaId} />
          </div>
          <div className="col-span-2 flex flex-col gap-5 h-full">
            <AccountHealthPanel health={opsData.accountHealth} capabilities={capabilities} />
            <div className="flex-1 min-h-0">
              <OperationsSnapshot personaId={personaId} opsData={opsData} planTier={company.subscription.planTier} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: User Management ─────────────────────────────────────── */}
      {capabilities.canViewUserTable && (
        <section id="section-users" className="space-y-5 scroll-mt-4">
          <SectionHeader title="User Management" subtitle={sub.users} />
          <UserManagementTable
            users={users}
            capabilities={capabilities}
            onAddUser={() => setIsAddUserOpen(true)}
            onStatusChange={onUserStatusChange}
          />
        </section>
      )}

      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onAdd={onAddUser}
        companyName={company.name}
      />
    </div>
  );
}
