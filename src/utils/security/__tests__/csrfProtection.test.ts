
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  generateCsrfToken, 
  getCsrfToken, 
  validateCsrfToken,
  addCSRFToHeaders,
} from '../csrfProtection';

describe('CSRF Protection Utilities', () => {
  // Mock browser APIs
  beforeEach(() => {
    // Mock sessionStorage
    const sessionStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn()
    };
    
    // Mock window.crypto.getRandomValues
    const cryptoMock = {
      getRandomValues: vi.fn((arr) => {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.floor(Math.random() * 256);
        }
        return arr;
      })
    };
    
    // Assign mocks to window
    Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });
    Object.defineProperty(window, 'crypto', { value: cryptoMock });
    
    // Mock fetch
    global.fetch = vi.fn();
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  describe('generateCsrfToken', () => {
    it('should generate a non-empty string token', () => {
      const token = generateCsrfToken();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });
    
    it('should call crypto.getRandomValues', () => {
      generateCsrfToken();
      expect(window.crypto.getRandomValues).toHaveBeenCalled();
    });
  });
  
  describe('getCsrfToken', () => {
    it('should get token from sessionStorage if it exists', () => {
      const mockToken = 'existing-token';
      window.sessionStorage.getItem = vi.fn().mockReturnValue(mockToken);
      
      const token = getCsrfToken();
      
      expect(window.sessionStorage.getItem).toHaveBeenCalledWith('app_csrf_token');
      expect(token).toBe(mockToken);
    });
    
    it('should generate and store new token if none exists', () => {
      // No existing token
      window.sessionStorage.getItem = vi.fn().mockReturnValue(null);
      
      const token = getCsrfToken();
      
      expect(window.sessionStorage.getItem).toHaveBeenCalledWith('app_csrf_token');
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith('app_csrf_token', token);
      expect(token.length).toBeGreaterThan(0);
    });
  });
  
  describe('addCSRFToHeaders', () => {
    it('should add CSRF token to Headers object', () => {
      // Mock getCsrfToken
      vi.spyOn(window.sessionStorage, 'getItem').mockReturnValue('mock-token');
      
      const headers = new Headers();
      const result = addCSRFToHeaders(headers);
      
      expect(result instanceof Headers).toBe(true);
      expect((result as Headers).get('X-CSRF-Token')).toBe('mock-token');
    });
    
    it('should add CSRF token to object headers', () => {
      // Mock getCsrfToken
      vi.spyOn(window.sessionStorage, 'getItem').mockReturnValue('mock-token');
      
      const headers = { 'Content-Type': 'application/json' };
      const result = addCSRFToHeaders(headers);
      
      expect(result).toEqual({
        'Content-Type': 'application/json',
        'X-CSRF-Token': 'mock-token'
      });
    });
  });
  
  describe('validateCsrfToken', () => {
    it('should validate a CSRF token against the stored token', () => {
      const mockToken = 'valid-token';
      vi.spyOn(window.sessionStorage, 'getItem').mockReturnValue(mockToken);
      
      const isValid = validateCsrfToken(mockToken);
      
      expect(window.sessionStorage.getItem).toHaveBeenCalledWith('app_csrf_token');
      expect(isValid).toBe(true);
    });
    
    it('should return false for invalid tokens', () => {
      const mockToken = 'valid-token';
      vi.spyOn(window.sessionStorage, 'getItem').mockReturnValue(mockToken);
      
      const isValid = validateCsrfToken('invalid-token');
      
      expect(window.sessionStorage.getItem).toHaveBeenCalledWith('app_csrf_token');
      expect(isValid).toBe(false);
    });
  });
});
