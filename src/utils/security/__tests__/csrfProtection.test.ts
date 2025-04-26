
/**
 * CSRF Protection Tests
 * Tests for CSRF protection utilities
 * @module utils/security/__tests__/csrfProtection
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateCSRFToken, generateCSRFToken } from '../csrfProtection';

interface MockRequest {
  headers: Record<string, string>;
  cookies?: Record<string, string>;
  body?: Record<string, unknown>;
}

interface MockResponse {
  cookie: (name: string, value: string, options?: Record<string, unknown>) => void;
  status: (code: number) => MockResponse;
  json: (data: unknown) => void;
}

describe('CSRF Protection', () => {
  let mockRequest: MockRequest;
  let mockResponse: MockResponse;
  let mockNext: () => void;
  
  beforeEach(() => {
    mockRequest = {
      headers: {},
      cookies: {},
      body: {}
    };
    
    mockResponse = {
      cookie: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    
    mockNext = vi.fn();
  });
  
  describe('generateCSRFToken', () => {
    it('should generate a CSRF token and set cookie', () => {
      // Call the function
      generateCSRFToken(mockResponse);
      
      // Assert cookie was set
      expect(mockResponse.cookie).toHaveBeenCalled();
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'csrf-token',
        expect.any(String),
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'strict'
        })
      );
    });
  });
  
  describe('validateCSRFToken', () => {
    it('should validate matching CSRF token', () => {
      // Setup matching tokens
      const token = 'valid-csrf-token';
      mockRequest.headers['x-csrf-token'] = token;
      mockRequest.cookies = { 'csrf-token': token };
      
      // Call middleware
      validateCSRFToken(mockRequest, mockResponse, mockNext);
      
      // Assert next was called
      expect(mockNext).toHaveBeenCalled();
    });
    
    it('should reject request when CSRF token is missing', () => {
      // No CSRF token in request
      validateCSRFToken(mockRequest, mockResponse, mockNext);
      
      // Assert response
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('CSRF')
        })
      );
    });
    
    it('should reject request when CSRF tokens do not match', () => {
      // Setup non-matching tokens
      mockRequest.headers['x-csrf-token'] = 'token1';
      mockRequest.cookies = { 'csrf-token': 'token2' };
      
      // Call middleware
      validateCSRFToken(mockRequest, mockResponse, mockNext);
      
      // Assert response
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('CSRF')
        })
      );
    });
  });
});
