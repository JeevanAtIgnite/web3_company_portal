import { useState } from 'react';
import { X } from 'lucide-react';
import type { NewUserForm, UserRole } from '../types';
import { BUSINESS_PROFILES } from '../data/mockData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (form: NewUserForm) => void;
  companyName: string;
}

const EMPTY_FORM: NewUserForm = {
  name: '',
  email: '',
  role: 'customer-employee',
  businessProfile: 'Compliance Staff',
};

export function AddUserModal({ isOpen, onClose, onAdd, companyName }: Props) {
  const [form, setForm] = useState<NewUserForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof NewUserForm, string>>>({});

  if (!isOpen) return null;

  function validate(): boolean {
    const newErrors: Partial<Record<keyof NewUserForm, string>> = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required.';
    if (!form.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onAdd(form);
    setForm(EMPTY_FORM);
    setErrors({});
    onClose();
  }

  function handleClose() {
    setForm(EMPTY_FORM);
    setErrors({});
    onClose();
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      {/* Modal */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Add New User</h2>
            <p className="text-xs text-slate-500 mt-0.5">{companyName}</p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Patricia Nguyen"
              className={`w-full text-sm px-3 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow ${
                errors.name ? 'border-red-400' : 'border-slate-300'
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="e.g. p.nguyen@facility.org"
              className={`w-full text-sm px-3 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow ${
                errors.email ? 'border-red-400' : 'border-slate-300'
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Portal Role
            </label>
            <select
              value={form.role}
              onChange={(e) =>
                setForm((f) => ({ ...f, role: e.target.value as UserRole }))
              }
              className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            >
              <option value="customer-employee">Customer Employee</option>
              <option value="customer-admin">Customer Admin</option>
            </select>
            <p className="text-xs text-slate-400 mt-1">
              Admins can manage users and settings within their organization.
            </p>
          </div>

          {/* Business Profile */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Business Profile
            </label>
            <select
              value={form.businessProfile}
              onChange={(e) => setForm((f) => ({ ...f, businessProfile: e.target.value }))}
              className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            >
              {BUSINESS_PROFILES.map((profile) => (
                <option key={profile} value={profile}>
                  {profile}
                </option>
              ))}
            </select>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
