
/**
 * Security Utilities Tests
 * Tests for HTML sanitization and security features
 */
import { describe, it, expect } from 'vitest';
import { sanitizeHtml, sanitizeRichHtml } from '@/utils/security/htmlSanitization';

describe('HTML Sanitization', () => {
  describe('sanitizeHtml', () => {
    it('should strip all HTML tags', () => {
      const input = '<p>Hello <script>alert("xss")</script> <b>world</b>!</p>';
      const result = sanitizeHtml(input);
      
      // Should remove all HTML tags
      expect(result).not.toContain('<p>');
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('<b>');
      
      // Should preserve actual text content
      expect(result).toContain('Hello');
      expect(result).toContain('world');
    });
    
    it('should handle null and undefined gracefully', () => {
      // @ts-ignore
      expect(sanitizeHtml(null)).toBe('');
      // @ts-ignore
      expect(sanitizeHtml(undefined)).toBe('');
    });
    
    it('should handle non-string inputs gracefully', () => {
      // @ts-ignore
      expect(sanitizeHtml(123)).toBe('');
      // @ts-ignore
      expect(sanitizeHtml({})).toBe('');
    });
  });
  
  describe('sanitizeRichHtml', () => {
    it('should allow safe HTML tags', () => {
      const input = '<p>Hello <b>world</b>!</p>';
      const result = sanitizeRichHtml(input);
      
      // Should preserve safe tags
      expect(result).toContain('<p>');
      expect(result).toContain('<b>');
    });
    
    it('should remove unsafe HTML tags', () => {
      const input = '<p>Hello <script>alert("xss")</script> world!</p>';
      const result = sanitizeRichHtml(input);
      
      // Should remove unsafe tags
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
      
      // Should preserve safe tags and content
      expect(result).toContain('<p>');
      expect(result).toContain('Hello');
      expect(result).toContain('world');
    });
    
    it('should sanitize attributes', () => {
      const input = '<a href="javascript:alert(\'xss\')" onclick="alert(\'xss\')">Click me</a>';
      const result = sanitizeRichHtml(input);
      
      // Should remove unsafe attributes
      expect(result).not.toContain('javascript:');
      expect(result).not.toContain('onclick');
      
      // Should preserve the link tag and text
      expect(result).toContain('<a');
      expect(result).toContain('Click me');
    });
  });
});
