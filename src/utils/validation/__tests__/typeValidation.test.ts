
import { describe, it, expect } from 'vitest';
import { 
  validateAndSanitize, 
  createSanitizedStringSchema, 
  createUrlSchema,
  commonSchemas 
} from '../typeValidation';
import { z } from 'zod';

// Mock the sanitization functions
vi.mock('../../security/inputSanitization', () => ({
  sanitizeHtml: vi.fn((input) => `sanitized:${input}`),
  sanitizeObject: vi.fn((obj) => {
    const result: Record<string, any> = {};
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        result[key] = `sanitized:${obj[key]}`;
      } else {
        result[key] = obj[key];
      }
    }
    return result;
  })
}));

describe('Type Validation Utilities', () => {
  describe('validateAndSanitize', () => {
    it('should sanitize and validate string data', () => {
      const schema = z.string();
      const result = validateAndSanitize(schema, 'test');
      
      expect(result.success).toBe(true);
      expect(result.data).toBe('sanitized:test');
    });
    
    it('should sanitize and validate object data', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number()
      });
      
      const result = validateAndSanitize(schema, { name: 'John', age: 30 });
      
      expect(result.success).toBe(true);
      expect(result.data?.name).toBe('sanitized:John');
      expect(result.data?.age).toBe(30);
    });
    
    it('should return errors for invalid data', () => {
      const schema = z.string().email();
      const result = validateAndSanitize(schema, 'not-an-email');
      
      expect(result.success).toBe(false);
      expect(result.data).toBe(null);
      expect(result.errors).toBeDefined();
    });
  });
  
  describe('createSanitizedStringSchema', () => {
    it('should create a schema that sanitizes input', () => {
      const schema = createSanitizedStringSchema();
      const result = schema.parse('test');
      
      expect(result).toBe('sanitized:test');
    });
    
    it('should work with custom string schema', () => {
      const schema = createSanitizedStringSchema(z.string().min(3));
      
      // Valid input
      expect(schema.parse('test')).toBe('sanitized:test');
      
      // Invalid input
      expect(() => schema.parse('ab')).toThrow();
    });
  });
  
  describe('createUrlSchema', () => {
    it('should create a schema that validates and sanitizes URLs', () => {
      const schema = createUrlSchema();
      
      // Valid URL
      const result = schema.safeParse('http://example.com');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('sanitized:http://example.com');
      }
      
      // Invalid URL
      const invalidResult = schema.safeParse('not a url');
      expect(invalidResult.success).toBe(false);
    });
    
    it('should reject URLs with disallowed protocols', () => {
      const schema = createUrlSchema({ allowedProtocols: ['https:'] });
      
      // HTTP not allowed
      const result = schema.safeParse('http://example.com');
      expect(result.success).toBe(false);
      
      // HTTPS allowed
      const httpsResult = schema.safeParse('https://example.com');
      expect(httpsResult.success).toBe(true);
    });
  });
  
  describe('commonSchemas', () => {
    it('should provide a valid safeString schema', () => {
      const result = commonSchemas.safeString.parse('test');
      expect(result).toBe('sanitized:test');
    });
    
    it('should provide a valid safeEmail schema', () => {
      const result = commonSchemas.safeEmail.parse('test@example.com');
      expect(result).toBe('sanitized:test@example.com');
      
      expect(() => commonSchemas.safeEmail.parse('not-an-email')).toThrow();
    });
    
    it('should provide a valid safeId schema', () => {
      // UUID format
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      expect(commonSchemas.safeId.parse(uuid)).toBe('sanitized:123e4567-e89b-12d3-a456-426614174000');
      
      // Alphanumeric format
      expect(commonSchemas.safeId.parse('abc_123-xyz')).toBe('sanitized:abc_123-xyz');
      
      // Invalid format
      expect(() => commonSchemas.safeId.parse('invalid@id')).toThrow();
    });
  });
});
