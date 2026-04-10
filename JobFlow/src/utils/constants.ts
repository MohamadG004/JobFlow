import type { ApplicationStatus } from '@/types';

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'Applied',
  'Interview',
  'Offer',
  'Rejected',
];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  Applied: 'Applied',
  Interview: 'Interview',
  Offer: 'Offer',
  Rejected: 'Rejected',
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  Applied: '#2563EB',
  Interview: '#D97706',
  Offer: '#059669',
  Rejected: '#DC2626',
};

export const STATUS_BG_COLORS: Record<ApplicationStatus, string> = {
  Applied: '#EFF6FF',
  Interview: '#FFFBEB',
  Offer: '#ECFDF5',
  Rejected: '#FEF2F2',
};

export const APP_NAME = 'JobFlow';
export const APP_VERSION = '1.0.0';
