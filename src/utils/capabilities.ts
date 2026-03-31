import type { PersonaId, PersonaCapabilities } from '../types';

export function getCapabilities(personaId: PersonaId): PersonaCapabilities {
  switch (personaId) {
    case 'tcs-admin':
      return {
        canSwitchCompanies: true,
        companyScope: 'all',
        canManageUsers: true,
        canAddUsers: true,
        canViewFullSubscription: true,
        canViewUserTable: true,
        showAdminControls: true,
      };

    case 'tcs-employee':
      return {
        canSwitchCompanies: true,
        companyScope: 'all',
        canManageUsers: true,   // can change status but cannot add
        canAddUsers: false,
        canViewFullSubscription: true,
        canViewUserTable: true,
        showAdminControls: true,
      };

    case 'customer-admin':
      return {
        canSwitchCompanies: false,
        companyScope: 'own',
        canManageUsers: true,
        canAddUsers: true,
        canViewFullSubscription: true,
        canViewUserTable: true,
        showAdminControls: true,
      };

    case 'customer-employee':
      return {
        canSwitchCompanies: false,
        companyScope: 'own',
        canManageUsers: false,
        canAddUsers: false,
        canViewFullSubscription: false,
        canViewUserTable: false,
        showAdminControls: false,
      };

    case 'account-manager':
      return {
        canSwitchCompanies: true,
        companyScope: 'assigned',
        canManageUsers: false,
        canAddUsers: false,
        canViewFullSubscription: true,
        canViewUserTable: true,
        showAdminControls: false,
      };
  }
}
