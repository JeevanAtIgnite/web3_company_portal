import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Search,
  Plus,
  MoreVertical,
  UserCheck,
  UserX,
  UserMinus,
  Filter,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { User, UserStatus, PersonaCapabilities } from '../types';
import { formatRelativeDate, getInitials } from '../utils/format';

interface Props {
  users: User[];
  capabilities: PersonaCapabilities;
  onAddUser: () => void;
  onStatusChange: (userId: string, newStatus: UserStatus) => void;
}

const ITEMS_PER_PAGE = 10;

// ── Status badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<UserStatus, string> = {
  active:    'bg-green-100 text-green-800',
  suspended: 'bg-amber-100 text-amber-800',
  disabled:  'bg-red-100 text-red-700',
};

function UserStatusBadge({ status }: { status: UserStatus }) {
  return (
    <span className={`inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLES[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ── Role badge ────────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<string, string> = {
  'customer-admin':    'Admin',
  'customer-employee': 'Employee',
};

const ROLE_STYLES: Record<string, string> = {
  'customer-admin':    'bg-emerald-100 text-emerald-700',
  'customer-employee': 'bg-sky-100 text-sky-700',
};

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full ${ROLE_STYLES[role] ?? 'bg-slate-100 text-slate-600'}`}>
      {ROLE_LABELS[role] ?? role}
    </span>
  );
}

// ── User avatar ───────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
  'bg-violet-100 text-violet-700',
  'bg-sky-100 text-sky-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
];

function UserAvatar({ name, index }: { name: string; index: number }) {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${color}`}>
      {getInitials(name)}
    </div>
  );
}

// ── Row actions per status ────────────────────────────────────────────────────

function getActions(status: UserStatus) {
  switch (status) {
    case 'active':
      return [
        { label: 'Suspend Access',   newStatus: 'suspended' as UserStatus, icon: UserMinus },
        { label: 'Disable Account',  newStatus: 'disabled'  as UserStatus, icon: UserX,    danger: true },
      ];
    case 'suspended':
      return [
        { label: 'Restore Access',   newStatus: 'active'   as UserStatus, icon: UserCheck },
        { label: 'Disable Account',  newStatus: 'disabled' as UserStatus, icon: UserX,    danger: true },
      ];
    case 'disabled':
      return [
        { label: 'Restore Access',   newStatus: 'active'    as UserStatus, icon: UserCheck },
        { label: 'Suspend Access',   newStatus: 'suspended' as UserStatus, icon: UserMinus },
      ];
  }
}

// ── Action dropdown ───────────────────────────────────────────────────────────

function ActionDropdown({
  user,
  onStatusChange,
  onClose,
}: {
  user: User;
  onStatusChange: (id: string, s: UserStatus) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const actions = getActions(user.status);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="dropdown-enter absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 z-30"
    >
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.newStatus}
            onClick={() => { onStatusChange(user.id, action.newStatus); onClose(); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-slate-50 transition-colors text-left ${
              action.danger ? 'text-red-600' : 'text-slate-700'
            }`}
          >
            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────

function Pagination({
  currentPage,
  totalPages,
  totalItems,
  from,
  to,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  from: number;
  to: number;
  onPageChange: (page: number) => void;
}) {
  // Build page number list with ellipsis
  function buildPages(): (number | '...')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (currentPage > 3) pages.push('...');
    for (let p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) {
      pages.push(p);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  }

  return (
    <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between gap-4">
      <p className="text-xs text-slate-500 flex-shrink-0">
        Showing <span className="font-medium text-slate-700">{from}–{to}</span> of{' '}
        <span className="font-medium text-slate-700">{totalItems}</span> users
      </p>

      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Page numbers */}
        {buildPages().map((page, idx) =>
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-xs text-slate-400">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                currentPage === page
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function UserManagementTable({ users, capabilities, onAddUser, onStatusChange }: Props) {
  const [search, setSearch]           = useState('');
  const [roleFilter, setRoleFilter]   = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [changedId, setChangedId]     = useState<string | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleStatusChange = useCallback((userId: string, newStatus: UserStatus) => {
    onStatusChange(userId, newStatus);
    setChangedId(userId);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setChangedId(null), 1800);
  }, [onStatusChange]);

  // Reset to page 1 whenever filters change
  useEffect(() => { setCurrentPage(1); }, [search, roleFilter, statusFilter]);

  // Filter
  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole   = roleFilter   === 'all' || u.role   === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const totalPages  = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage    = Math.min(currentPage, totalPages);
  const fromIndex   = (safePage - 1) * ITEMS_PER_PAGE;
  const toIndex     = Math.min(fromIndex + ITEMS_PER_PAGE, filtered.length);
  const pageUsers   = filtered.slice(fromIndex, toIndex);

  // Restricted state for Customer Employee
  if (!capabilities.canViewUserTable) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">User Management</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
            <ShieldAlert className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Access Restricted</p>
          <p className="text-sm text-slate-500 mt-1.5 max-w-sm leading-relaxed">
            You do not have permission to view or manage user accounts. Contact your company
            administrator for access changes or user-related requests.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">User Management</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {filtered.length} of {users.length} users
          </p>
        </div>
        {capabilities.canAddUsers && (
          <button
            onClick={onAddUser}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-sm px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
          >
            <option value="all">All Roles</option>
            <option value="customer-admin">Admin</option>
            <option value="customer-employee">Employee</option>
          </select>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {['Name', 'Role', 'Business Profile', 'Status', 'Last Login', ''].map((col) => (
                <th
                  key={col}
                  className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {pageUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">
                  No users match your current filters.
                </td>
              </tr>
            ) : (
              pageUsers.map((user, idx) => (
                <tr
                  key={user.id}
                  className={`transition-colors duration-300 ${
                    changedId === user.id
                      ? 'bg-indigo-50 ring-1 ring-inset ring-indigo-200'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={user.name} index={fromIndex + idx} />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><RoleBadge role={user.role} /></td>
                  <td className="px-5 py-3.5"><span className="text-sm text-slate-600">{user.businessProfile}</span></td>
                  <td className="px-5 py-3.5"><UserStatusBadge status={user.status} /></td>
                  <td className="px-5 py-3.5"><span className="text-sm text-slate-500">{formatRelativeDate(user.lastLogin)}</span></td>
                  <td className="px-5 py-3.5">
                    {capabilities.canManageUsers ? (
                      <div className="relative flex justify-end">
                        <button
                          onClick={() => setOpenDropdownId((prev) => prev === user.id ? null : user.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {openDropdownId === user.id && (
                          <ActionDropdown
                            user={user}
                            onStatusChange={handleStatusChange}
                            onClose={() => setOpenDropdownId(null)}
                          />
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          totalItems={filtered.length}
          from={fromIndex + 1}
          to={toIndex}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
