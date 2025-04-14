
/**
 * Safe HTML Component
 * Renders HTML content safely with DOMPurify sanitization
 */
import React from 'react';
import { cn } from '@/lib/utils';
import { sanitizeHtml, sanitizeRichHtml } from '@/utils/security/htmlSanitization';

export interface SafeHtmlProps extends React.HTMLAttributes<HTMLDivElement> {
  /** HTML content to render safely */
  html: string;
  /** Whether to allow rich HTML tags or strip all HTML */
  allowRich?: boolean;
  /** Element type to render (div, span, p, etc.) */
  as?: React.ElementType;
}

/**
 * Component for safely rendering HTML content with XSS protection
 * 
 * @example
 * ```tsx
 * // Basic usage - strips all HTML
 * <SafeHtml html={userContent} />
 * 
 * // Allow basic formatting tags
 * <SafeHtml 
 *   html={userContent} 
 *   allowRich={true} 
 *   className="prose"
 * />
 * 
 * // Use a different element
 * <SafeHtml 
 *   html={userContent} 
 *   as="span" 
 * />
 * ```
 */
export const SafeHtml = React.forwardRef<HTMLDivElement, SafeHtmlProps>(
  ({ html, allowRich = false, as: Component = 'div', className, ...props }, ref) => {
    // Sanitize HTML based on allowRich setting
    const sanitizedHtml = allowRich ? sanitizeRichHtml(html) : sanitizeHtml(html);
    
    return (
      <Component 
        ref={ref}
        className={cn(className)} 
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        {...props}
      />
    );
  }
);

SafeHtml.displayName = 'SafeHtml';
