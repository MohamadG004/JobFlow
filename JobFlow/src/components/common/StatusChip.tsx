import React from 'react';
import type { ApplicationStatus } from '@/types';

const STATUS_CONFIG: Record<ApplicationStatus, { color: string; bg: string }> = {
  Applied:   { color: '#2563EB', bg: '#EFF6FF' },
  Interview: { color: '#D97706', bg: '#FFFBEB' },
  Offer:     { color: '#059669', bg: '#ECFDF5' },
  Rejected:  { color: '#DC2626', bg: '#FEF2F2' },
};

interface StatusChipProps {
  status: ApplicationStatus;
  size?: 'small' | 'medium';
}

const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'small' }) => {
  const cfg = STATUS_CONFIG[status];
  const sizeClasses = size === 'small' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  
  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border ${sizeClasses}`}
      style={{ 
        color: cfg.color, 
        backgroundColor: cfg.bg,
        borderColor: `${cfg.color}30`,
      }}
    >
      {status}
    </span>
  );
};

export default StatusChip;