
/**
 * Canvas toolbar group component
 * @module components/canvas/toolbar/ToolbarGroup
 */
import React from 'react';
import { cn } from '@/lib/utils';

export interface ToolbarGroupProps {
  /** Group title */
  title?: string;
  /** Group children */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Canvas toolbar group component
 * @param props Component props
 * @returns Rendered component
 */
export const ToolbarGroup: React.FC<ToolbarGroupProps> = ({
  title,
  children,
  className
}) => {
  return (
    <div className={cn('p-2', className)}>
      {title && (
        <h3 className="text-xs font-medium text-muted-foreground mb-1">
          {title}
        </h3>
      )}
      <div className="flex flex-wrap gap-1">
        {children}
      </div>
    </div>
  );
};
