import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  fullHeight?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  fullHeight = true,
}) => (
  <div
    className={`flex flex-col justify-center items-center gap-4 ${fullHeight ? 'min-h-[80vh]' : 'h-full'}`}
  >
    <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
    {message && (
      <p className="text-sm text-[var(--color-text-secondary)]">
        {message}
      </p>
    )}
  </div>
);

export default LoadingSpinner;