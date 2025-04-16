
/**
 * Toolbar button component
 * @module components/toolbar/ToolbarButton
 */
import React from 'react';
import { cn } from '@/lib/utils';

export interface ToolbarButtonProps {
  /** Icon to display */
  icon: React.ReactNode;
  /** Button label */
  label: string;
  /** Whether the button is active */
  active?: boolean;
  /** onClick handler */
  onClick: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Tooltip content */
  tooltip?: string;
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Button variant */
  variant?: 'default' | 'outline' | 'ghost';
}

/**
 * Toolbar button component
 * @param props Component props
 * @returns Rendered component
 */
export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  label,
  active = false,
  onClick,
  className,
  tooltip,
  size = 'md',
  variant = 'default'
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'p-1 text-sm',
    md: 'p-2',
    lg: 'p-3 text-lg'
  };
  
  // Variant classes
  const variantClasses = {
    default: 'bg-background hover:bg-accent',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground'
  };
  
  return (
    <button
      type="button"
      className={cn(
        'flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        sizeClasses[size],
        variantClasses[variant],
        active && 'bg-primary text-primary-foreground hover:bg-primary/90',
        className
      )}
      onClick={onClick}
      title={tooltip || label}
      aria-label={label}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  );
};
