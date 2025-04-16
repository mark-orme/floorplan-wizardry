
/**
 * Toolbar section component
 * @module components/toolbar/ToolbarSection
 */
import React from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export interface ToolbarSectionProps {
  /** Section title */
  title?: string;
  /** Section children */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Show separator after section */
  showSeparator?: boolean;
  /** Layout direction */
  direction?: 'horizontal' | 'vertical';
}

/**
 * Toolbar section component
 * @param props Component props
 * @returns Rendered component
 */
export const ToolbarSection: React.FC<ToolbarSectionProps> = ({
  title,
  children,
  className,
  showSeparator = true,
  direction = 'horizontal'
}) => {
  return (
    <>
      <div className={cn('px-2 py-1', className)}>
        {title && (
          <h3 className="text-xs font-medium text-muted-foreground mb-1">
            {title}
          </h3>
        )}
        <div
          className={cn(
            'flex gap-1',
            direction === 'horizontal' ? 'flex-row' : 'flex-col'
          )}
        >
          {children}
        </div>
      </div>
      {showSeparator && (
        <Separator
          orientation={direction === 'horizontal' ? 'vertical' : 'horizontal'}
          className={direction === 'horizontal' ? 'h-8' : 'w-full'}
        />
      )}
    </>
  );
};
