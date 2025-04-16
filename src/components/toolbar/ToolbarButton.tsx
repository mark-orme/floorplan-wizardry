
/**
 * Toolbar button component
 * @module components/toolbar/ToolbarButton
 */
import React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export interface ToolbarButtonProps {
  /** Button icon */
  icon: React.ReactNode;
  /** Button label */
  label: string;
  /** Button tooltip */
  tooltip?: string;
  /** Click handler */
  onClick?: () => void;
  /** Whether the button is active */
  active?: boolean;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Toolbar button component
 * @param props Component props
 * @returns Rendered component
 */
export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  label,
  tooltip,
  onClick,
  active = false,
  disabled = false,
  className
}) => {
  const button = (
    <button
      type="button"
      className={cn(
        'flex items-center justify-center w-9 h-9 rounded-md transition-colors',
        active ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className
      )}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={label}
    >
      {icon}
    </button>
  );

  // If tooltip is provided, wrap the button in a tooltip
  if (tooltip && !disabled) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    );
  }

  return button;
};
