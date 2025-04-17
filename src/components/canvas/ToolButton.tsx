
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ToolButtonProps {
  /** Whether the button is active */
  isActive: boolean;
  /** Click handler */
  onClick: () => void;
  /** Icon to display in the button */
  icon: React.ReactNode;
  /** Tooltip text */
  tooltip?: string;
  /** Additional class names */
  className?: string;
  /** Button size */
  size?: 'sm' | 'default' | 'lg';
  /** Whether to show a pulse effect when active */
  pulseWhenActive?: boolean;
}

/**
 * Canvas tool button component
 * Used in the toolbar for selecting drawing tools
 */
export const ToolButton: React.FC<ToolButtonProps> = ({
  isActive,
  onClick,
  icon,
  tooltip,
  className,
  size = 'default',
  pulseWhenActive = false
}) => {
  return (
    <Button
      variant={isActive ? 'default' : 'outline'}
      size={size}
      onClick={onClick}
      title={tooltip}
      className={cn(
        'flex items-center justify-center transition-all duration-200',
        isActive 
          ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90 border-primary/70 ring-2 ring-primary/20 ring-offset-1' 
          : 'hover:bg-accent/50 hover:border-primary/30 shadow-sm hover:shadow hover:ring-1 hover:ring-primary/10',
        pulseWhenActive && isActive && 'animate-[pulse_2s_ease-in-out_infinite]',
        className
      )}
    >
      {icon}
    </Button>
  );
};
