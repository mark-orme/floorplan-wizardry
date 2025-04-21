
/**
 * CSRF Protection Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  generateCsrfToken,
  getCsrfToken,
  verifyCsrfToken,
  addCsrfHeader,
  initializeCsrfProtection,
  resetCsrfProtection,
  rotateCsrfToken
} from '../csrfProtection';
import * as cookieSecurity from '../cookieSecurity';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

// Mock cookie functions
vi.mock('../cookieSecurity', () => ({
  setCookie: vi.fn(),
  getCookie: vi.fn(),
  deleteCookie: vi.fn()
}));

describe('Enhanced CSRF Protection', () => {
  beforeEach(() => {
    // Set up localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });
    
    // Reset localStorage
    window.localStorage.clear();
    
    // Reset cookie mocks
    vi.mocked(cookieSecurity.setCookie).mockClear();
    vi.mocked(cookieSecurity.getCookie).mockClear();
    vi.mocked(cookieSecurity.deleteCookie).mockClear();
    
    // Reset fetch mock
    if ('fetch' in window) {
      // @ts-ignore
      delete window.fetch;
    }
    window.fetch = vi.fn();
    
    // Mock Date.now() to return a fixed timestamp
    vi.spyOn(Date, 'now').mockImplementation(() => 1625097600000); // Fixed timestamp
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  describe('Token Generation and Storage', () => {
    it('generateCsrfToken should create token and store it in both localStorage and cookie', () => {
      const token = generateCsrfToken();
      
      expect(token).toBeTruthy();
      expect(token.length).toBeGreaterThan(20);
      
      // Check localStorage
      const storedData = window.localStorage.getItem('x-csrf-token');
      expect(storedData).toBeTruthy();
      expect(JSON.parse(storedData!).token).toBe(token);
      
      // Check cookie was set
      expect(cookieSecurity.setCookie).toHaveBeenCalledWith(
        'x-csrf-cookie',
        token,
        expect.objectContaining({
          sameSite: 'strict',
          path: '/'
        })
      );
    });
    
    it('getCsrfToken should return existing token if valid', () => {
      // Mock existing valid token
      const mockToken = 'existing-csrf-token';
      window.localStorage.setItem('x-csrf-token', JSON.stringify({
        token: mockToken,
        expiry: Date.now() + 3600000 // Valid for 1 hour
      }));
      
      // Mock matching cookie
      vi.mocked(cookieSecurity.getCookie).mockReturnValue(mockToken);
      
      const token = getCsrfToken();
      
      expect(token).toBe(mockToken);
      expect(cookieSecurity.getCookie).toHaveBeenCalledWith('x-csrf-cookie');
    });
    
    it('getCsrfToken should generate new token if expired', () => {
      // Mock expired token
      const expiredToken = 'expired-csrf-token';
      window.localStorage.setItem('x-csrf-token', JSON.stringify({
        token: expiredToken,
        expiry: Date.now() - 1000 // Expired 1 second ago
      }));
      
      const token = getCsrfToken();
      
      expect(token).not.toBe(expiredToken);
      expect(token.length).toBeGreaterThan(20);
    });
    
    it('getCsrfToken should generate new token if cookie-localStorage mismatch', () => {
      // Mock valid token in localStorage
      const storedToken = 'stored-csrf-token';
      window.localStorage.setItem('x-csrf-token', JSON.stringify({
        token: storedToken,
        expiry: Date.now() + 3600000 // Valid for 1 hour
      }));
      
      // Mock different cookie value
      vi.mocked(cookieSecurity.getCookie).mockReturnValue('different-cookie-token');
      
      const token = getCsrfToken();
      
      expect(token).not.toBe(storedToken);
      expect(token.length).toBeGreaterThan(20);
    });
  });
  
  describe('Token Verification', () => {
    it('verifyCsrfToken should validate tokens correctly with double-submit check', () => {
      const token = generateCsrfToken();
      
      // Mock cookie to match the token
      vi.mocked(cookieSecurity.getCookie).mockReturnValue(token);
      
      expect(verifyCsrfToken(token)).toBe(true);
      expect(verifyCsrfToken('wrong-token')).toBe(false);
    });
    
    it('verifyCsrfToken should fail if cookie value does not match', () => {
      const token = generateCsrfToken();
      
      // Mock cookie with different value
      vi.mocked(cookieSecurity.getCookie).mockReturnValue('different-cookie-value');
      
      expect(verifyCsrfToken(token)).toBe(false);
    });
    
    it('verifyCsrfToken should fail if token is expired', () => {
      const token = 'test-token';
      
      // Store expired token
      window.localStorage.setItem('x-csrf-token', JSON.stringify({
        token,
        expiry: Date.now() - 1000 // Expired 1 second ago
      }));
      
      // Mock cookie to match the token
      vi.mocked(cookieSecurity.getCookie).mockReturnValue(token);
      
      expect(verifyCsrfToken(token)).toBe(false);
    });
  });
  
  describe('Token Rotation', () => {
    it('rotateCsrfToken should clear existing token and generate a new one', () => {
      // Setup existing token
      const oldToken = generateCsrfToken();
      
      // Rotate token
      const newToken = rotateCsrfToken();
      
      expect(newToken).not.toBe(oldToken);
      expect(newToken.length).toBeGreaterThan(20);
      expect(cookieSecurity.deleteCookie).toHaveBeenCalledWith('x-csrf-cookie');
    });
  });
  
  describe('Headers and Fetch Integration', () => {
    it('addCsrfHeader should add token to headers', () => {
      const token = generateCsrfToken();
      
      // Test with object headers
      const headers = addCsrfHeader({
        'Content-Type': 'application/json'
      });
      
      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'X-CSRF-Token': token
      });
      
      // Test with Headers instance
      const headersInstance = new Headers({ 'Content-Type': 'application/json' });
      const newHeadersInstance = addCsrfHeader(headersInstance);
      
      expect(newHeadersInstance instanceof Headers).toBe(true);
      expect((newHeadersInstance as Headers).get('X-CSRF-Token')).toBe(token);
    });
    
    it('initializeCsrfProtection should monkey patch fetch', () => {
      const originalFetch = window.fetch;
      initializeCsrfProtection();
      
      expect(window.fetch).not.toBe(originalFetch);
    });
    
    it('patched fetch should include CSRF token for all requests', async () => {
      const token = generateCsrfToken();
      initializeCsrfProtection();
      
      // Mock successful response
      const mockResponse = new Response(null, { status: 200 });
      vi.mocked(window.fetch).mockResolvedValue(mockResponse);
      
      await window.fetch('https://api.example.com', {
        method: 'GET'
      });
      
      expect(window.fetch).toHaveBeenCalledWith(
        'https://api.example.com',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'X-CSRF-Token': token
          })
        })
      );
    });
    
    it('should rotate token after mutating requests', async () => {
      const token = generateCsrfToken();
      initializeCsrfProtection();
      
      // Mock successful response
      const mockResponse = new Response(null, { status: 200 });
      vi.mocked(window.fetch).mockResolvedValue(mockResponse);
      
      // Mock setTimeout to execute immediately
      vi.spyOn(window, 'setTimeout').mockImplementation((fn) => {
        if (typeof fn === 'function') fn();
        return 0 as any;
      });
      
      await window.fetch('https://api.example.com', {
        method: 'POST',
        body: JSON.stringify({ data: 'test' })
      });
      
      // Verify fetch was called with correct headers
      expect(window.fetch).toHaveBeenCalledWith(
        'https://api.example.com',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ data: 'test' }),
          headers: expect.objectContaining({
            'X-CSRF-Token': token
          })
        })
      );
      
      // Token should be different after rotation
      const newTokenData = JSON.parse(window.localStorage.getItem('x-csrf-token')!);
      expect(newTokenData.token).not.toBe(token);
    });
  });
  
  describe('Reset Functionality', () => {
    it('resetCsrfProtection should clear the token', () => {
      generateCsrfToken();
      resetCsrfProtection();
      
      expect(window.localStorage.getItem('x-csrf-token')).toBeNull();
      expect(cookieSecurity.deleteCookie).toHaveBeenCalledWith('x-csrf-cookie');
    });
  });
});
