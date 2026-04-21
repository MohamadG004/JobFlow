import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import type { Application, ApplicationInsert, ApplicationStatus } from '@/types';

const STATUSES: ApplicationStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected'];

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ApplicationInsert) => Promise<void>;
  initialData?: Application | null;
  defaultStatus?: ApplicationStatus;
}

const defaultForm: ApplicationInsert = {
  company: '',
  role: '',
  status: 'Applied',
  notes: '',
  applied_date: new Date().toISOString().split('T')[0],
};

const ApplicationFormDialog: React.FC<Props> = ({
  open, onClose, onSubmit, initialData, defaultStatus,
}) => {
  const [form, setForm] = React.useState<ApplicationInsert>(defaultForm);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Partial<Record<keyof ApplicationInsert, string>>>({});

  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm({
          company: initialData.company,
          role: initialData.role,
          status: initialData.status,
          notes: initialData.notes || '',
          applied_date: initialData.applied_date,
        });
      } else {
        setForm({ ...defaultForm, status: defaultStatus || 'Applied' });
      }
      setErrors({});
    }
  }, [open, initialData, defaultStatus]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ApplicationInsert, string>> = {};
    if (!form.company.trim()) newErrors.company = 'Company name is required';
    if (!form.role.trim()) newErrors.role = 'Role/title is required';
    if (!form.applied_date) newErrors.applied_date = 'Date applied is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof ApplicationInsert) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <style>{`input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; }`}</style>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 cursor-pointer" onClick={onClose} />
      
      {/* Dialog */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#0D0F17]" style={{ fontFamily: 'Sora, sans-serif' }}>
            {initialData ? 'Edit Application' : 'Add New Application'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#0D0F17] mb-1.5">Company Name</label>
            <input
              type="text"
              value={form.company}
              onChange={handleChange('company')}
              placeholder="e.g. Google, Amazon, Stripe..."
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all ${errors.company ? 'border-red-400' : 'border-gray-200'}`}
              autoFocus
            />
            {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0D0F17] mb-1.5">Role / Title</label>
            <input
              type="text"
              value={form.role}
              onChange={handleChange('role')}
              placeholder="e.g. Senior Software Engineer"
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all ${errors.role ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0D0F17] mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={handleChange('status')}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all bg-white cursor-pointer"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0D0F17] mb-1.5">Date Applied</label>
            <input
              type="date"
              value={form.applied_date}
              onChange={handleChange('applied_date')}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all ${errors.applied_date ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.applied_date && <p className="text-xs text-red-500 mt-1">{errors.applied_date}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0D0F17] mb-1.5">Notes</label>
            <textarea
              value={form.notes}
              onChange={handleChange('notes')}
              placeholder="Recruiter contact, next steps, salary range..."
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 px-6 pb-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Saving...' : initialData ? 'Save Changes' : 'Add Application'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFormDialog;