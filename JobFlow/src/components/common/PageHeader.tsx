import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => (
  <div className="px-6 py-5 bg-[var(--color-bg-paper)] border-b border-[var(--color-divider)] shrink-0">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-xl font-extrabold text-[var(--color-text-primary)]">{title}</h2>
        {subtitle && (
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  </div>
);

export default PageHeader;