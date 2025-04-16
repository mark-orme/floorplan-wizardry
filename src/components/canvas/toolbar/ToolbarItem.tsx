
/**
 * Canvas toolbar item component
 * @module components/canvas/toolbar/ToolbarItem
 */
import React from 'react';
import { cn } from '@/lib/utils';

export interface ToolbarItemProps {
  /** Item icon */
  icon: React.ReactNode;
  /** Item label */
  label: string;
  /** Whether the item is active */
  active?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether the item is disabled */
  disabled?: boolean;
}

/**
 * Canvas toolbar item component
 * @param props Component props
 * @returns Rendered component
 */
export const ToolbarItem: React.FC<ToolbarItemProps> = ({
  icon,
  label,
  active = false,
  onClick,
  className,
  disabled = false
}) => {
  return (
    <button
      type="button"
      className={cn(
        'flex flex-col items-center justify-center p-2 rounded-md transition-colors',
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-foreground hover:bg-accent hover:text-accent-foreground',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};
