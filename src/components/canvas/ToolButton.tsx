
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
  size = 'default'
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
          ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90 border-primary/70' 
          : 'hover:bg-accent/50 hover:border-primary/30 shadow-sm hover:shadow',
        className
      )}
    >
      {icon}
    </Button>
  );
};
