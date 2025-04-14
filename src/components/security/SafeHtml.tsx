
/**
 * SafeHtml Component
 * Renders HTML content safely with DOMPurify sanitization
 */
import React from 'react';
import { sanitizeHtml, sanitizeRichHtml } from '@/utils/security/htmlSanitization';

interface SafeHtmlProps {
  /** HTML content to render safely */
  html: string;
  /** Whether to allow rich HTML tags or strip all HTML */
  allowRich?: boolean;
  /** Optional className for the container */
  className?: string;
  /** Element type to render (div, span, p, etc.) */
  as?: React.ElementType;
}

/**
 * Component for safely rendering HTML content with XSS protection
 */
export const SafeHtml: React.FC<SafeHtmlProps> = ({
  html,
  allowRich = false,
  className = '',
  as: Component = 'div'
}) => {
  // Sanitize HTML based on allowRich setting
  const sanitizedHtml = allowRich ? sanitizeRichHtml(html) : sanitizeHtml(html);
  
  return (
    <Component 
      className={className} 
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
    />
  );
};

export default SafeHtml;
