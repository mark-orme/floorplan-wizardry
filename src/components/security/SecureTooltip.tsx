
/**
 * SecureTooltip Component
 * A tooltip component that safely renders HTML content
 */
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { sanitizeCanvasHtml } from '@/utils/security/htmlSanitization';

interface SecureTooltipProps {
  /** HTML content to display in the tooltip */
  content: string;
  /** Whether to allow rich HTML in the tooltip */
  allowRich?: boolean;
  /** Children element that triggers the tooltip */
  children: React.ReactNode;
  /** Tooltip side placement */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Tooltip alignment */
  align?: 'start' | 'center' | 'end';
  /** Additional classes for the tooltip content */
  className?: string;
}

/**
 * Tooltip component that safely displays HTML content
 */
export const SecureTooltip: React.FC<SecureTooltipProps> = ({
  content,
  allowRich = false,
  children,
  side = 'top',
  align = 'center',
  className = ''
}) => {
  // Always sanitize HTML content regardless of allowRich setting
  const sanitizedContent = sanitizeCanvasHtml(content);
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          align={align}
          className={className}
          dangerouslySetInnerHTML={{ 
            __html: sanitizedContent 
          }}
        />
      </Tooltip>
    </TooltipProvider>
  );
};

export default SecureTooltip;
