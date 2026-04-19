import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nothing here yet',
  description = 'Get started by adding your first item.',
  actionLabel,
  onAction,
  icon,
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
    <div className="mb-4 text-gray-400 opacity-50">
      {icon ?? <Inbox size={56} />}
    </div>
    <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">{title}</h3>
    <p className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-[320px]">
      {description}
    </p>
    {actionLabel && onAction && (
      <button 
        onClick={onAction}
        className="px-6 py-2.5 bg-[var(--color-primary)] text-white font-semibold rounded-[var(--radius-lg)] hover:bg-[var(--color-primary-dark)] transition-colors"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;