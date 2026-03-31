// Core domain types for TCS Company Portal POC

export type PersonaId =
  | 'tcs-admin'
  | 'tcs-employee'
  | 'customer-admin'
  | 'customer-employee'
  | 'account-manager';

export interface Persona {
  id: PersonaId;
  label: string;
  description: string;
  avatarInitials: string;
  badgeColor: string; // Tailwind classes for the badge chip
}

export type CompanyStatus = 'active' | 'suspended' | 'inactive';
export type SubscriptionStatus = 'active' | 'past_due' | 'suspended';
export type UserStatus = 'active' | 'suspended' | 'disabled';
export type UserRole = 'customer-admin' | 'customer-employee';
export type PlanTier =
  | 'subscriber-full'
  | 'subscriber-frontline'
  | 'subscriber-basic'
  | 'subscriber-basic-tt'
  | 'subscriber-basic-pp'
  | 'subscriber-cafe-pp'
  | 'subscriber-cafe-tt';

export interface Entitlement {
  id: string;
  name: string;
  included: boolean;
}

export interface Subscription {
  planName: string;
  planTier: PlanTier;
  status: SubscriptionStatus;
  billingState: string;
  startDate: string;
  renewalDate: string;
  description: string;
  entitlements: Entitlement[];
  licensedSeats: number;
}

export interface Company {
  id: string;
  name: string;
  status: CompanyStatus;
  tenantId: string;
  parentCompany?: string;
  accountManagerId: string;
  accountManagerName: string;
  note: string;
  lastUpdated: string;
  region: string;
  facilityType: string;
  subscription: Subscription;
}

export interface User {
  id: string;
  companyId: string;
  name: string;
  email: string;
  role: UserRole;
  businessProfile: string;
  status: UserStatus;
  lastLogin: string; // ISO date string or 'Never'
}

export interface NewUserForm {
  name: string;
  email: string;
  role: UserRole;
  businessProfile: string;
}

// What each persona is allowed to see and do
export interface PersonaCapabilities {
  canSwitchCompanies: boolean;
  companyScope: 'all' | 'assigned' | 'own';
  canManageUsers: boolean;   // can change user status (enable/suspend/disable)
  canAddUsers: boolean;
  canViewFullSubscription: boolean;
  canViewUserTable: boolean;
  showAdminControls: boolean;
}

// ── New operational data types ────────────────────────────────────────────────

export interface AccountManagerDetail {
  name: string;
  title: string;
  email: string;
  relationshipNote: string;
  badge: string;
}

export type HealthStatus = 'healthy' | 'moderate' | 'at-risk';
export type AdoptionLevel = 'strong' | 'moderate' | 'low';

export interface AccountHealth {
  overall: HealthStatus;
  billingRisk: HealthStatus;
  billingLabel: string;
  engagement: AdoptionLevel;
  adoption: AdoptionLevel;
  openSupportIssues: number;
  renewalDaysOut: number;
  summaryLine: string;
}

export interface DocCafeDoc {
  title: string;
  category: string;
  uploadedBy: string;
  date: string;
}

export interface DocCafeSnapshot {
  available: boolean;   // ← add this line
  totalDocs: number;
  recentUploads: number;
  lastUploadedBy: string;
  categoriesInUse: string[];
  recentDocuments: DocCafeDoc[];
}

export interface TrainingSnapshot {
  available: boolean;
  assignedTrainings: number;
  completionRate: number;
  overdueCount: number;
  lastCompletionDate: string;
  highlights: string[];
}

export interface SupportTicketItem {
  id: string;
  title: string;
  category: string;
  status: 'open' | 'awaiting-customer' | 'resolved';
}

export interface SupportSnapshot {
  openTickets: number;
  awaitingResponse: number;
  topCategory: string;
  recentTickets: SupportTicketItem[];
}

export type InsightAudience = 'admin' | 'relationship' | 'personal' | 'all';
export type InsightType = 'positive' | 'warning' | 'info' | 'neutral';

export interface OperationalInsight {
  signal: string;
  type: InsightType;
  audience: InsightAudience;
}

export interface CompanyOpsData {
  accountManager: AccountManagerDetail;
  accountHealth: AccountHealth;
  docCafe: DocCafeSnapshot;
  training: TrainingSnapshot;
  support: SupportSnapshot;
  insights: OperationalInsight[];
}

// ── AI Recommendation types ───────────────────────────────────────────────────

export type RecommendationBadge = 'recommended' | 'trending' | 'popular';

export interface ModuleRecommendation {
  moduleId: string;
  moduleName: string;
  badge: RecommendationBadge;
  badgeLabel: string;
  relevanceLine: string;
  insightLine: string;
}

export interface PlanRecommendations {
  topPicks: ModuleRecommendation[];           // shown in AI panel (max 3)
  highlightedModuleIds: string[];             // modules that get a badge in the locked list
  docCafeTicker: string[];                    // rotating insights for locked DocCafe widget
  trainingTicker: string[];                   // rotating insights for locked Training widget
}
