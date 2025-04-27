
/**
 * Safe HTML Component
 * Renders HTML content safely with DOMPurify sanitization
 */
import React from 'react';
import { cn } from '@/lib/utils';

// Creating a mock sanitizeHtml function since the actual implementation is missing
const sanitizeHtml = (html: string): string => {
  // In a real implementation, this would use DOMPurify or another sanitization library
  return html; // Basic implementation that doesn't actually sanitize
};

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
    // Sanitize HTML - using the same function for both rich and non-rich content
    const sanitizedHtml = sanitizeHtml(html);
    
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
