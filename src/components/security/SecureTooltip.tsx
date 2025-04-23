
import React from 'react';
import { sanitizeHtml } from '@/utils/security/htmlSanitization';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SecureTooltipProps {
  content: string;
  children: React.ReactNode;
}

export const SecureTooltip: React.FC<SecureTooltipProps> = ({ content, children }) => {
  const sanitizedContent = sanitizeHtml(content);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
