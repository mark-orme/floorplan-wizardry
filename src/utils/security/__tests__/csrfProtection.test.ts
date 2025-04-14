import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  generateCSRFToken, 
  getCSRFToken, 
  storeCSRFToken,
  addCSRFToHeaders,
  validateCSRFToken,
  initializeCSRFProtection,
  protectForm,
  addCSRFHeader,
  createProtectedFetchOptions,
  protectedFetch
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
  
  describe('generateCSRFToken', () => {
    it('should generate a non-empty string token', () => {
      const token = generateCSRFToken();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });
    
    it('should call crypto.getRandomValues', () => {
      generateCSRFToken();
      expect(window.crypto.getRandomValues).toHaveBeenCalled();
    });
  });
  
  describe('getCSRFToken', () => {
    it('should get token from sessionStorage if it exists', () => {
      const mockToken = 'existing-token';
      window.sessionStorage.getItem = vi.fn().mockReturnValue(mockToken);
      
      const token = getCSRFToken();
      
      expect(window.sessionStorage.getItem).toHaveBeenCalledWith('app_csrf_token');
      expect(token).toBe(mockToken);
    });
    
    it('should generate and store new token if none exists', () => {
      // No existing token
      window.sessionStorage.getItem = vi.fn().mockReturnValue(null);
      
      const token = getCSRFToken();
      
      expect(window.sessionStorage.getItem).toHaveBeenCalledWith('app_csrf_token');
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith('app_csrf_token', token);
      expect(token.length).toBeGreaterThan(0);
    });
  });
  
  describe('addCSRFToHeaders', () => {
    it('should add CSRF token to Headers object', () => {
      // Mock getCSRFToken
      vi.spyOn(window.sessionStorage, 'getItem').mockReturnValue('mock-token');
      
      const headers = new Headers();
      const result = addCSRFToHeaders(headers);
      
      expect(result instanceof Headers).toBe(true);
      expect((result as Headers).get('X-CSRF-Token')).toBe('mock-token');
    });
    
    it('should add CSRF token to array headers', () => {
      // Mock getCSRFToken
      vi.spyOn(window.sessionStorage, 'getItem').mockReturnValue('mock-token');
      
      const headers: [string, string][] = [['Content-Type', 'application/json']];
      const result = addCSRFToHeaders(headers);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toContainEqual(['X-CSRF-Token', 'mock-token']);
    });
    
    it('should add CSRF token to object headers', () => {
      // Mock getCSRFToken
      vi.spyOn(window.sessionStorage, 'getItem').mockReturnValue('mock-token');
      
      const headers = { 'Content-Type': 'application/json' };
      const result = addCSRFToHeaders(headers);
      
      expect(result).toEqual({
        'Content-Type': 'application/json',
        'X-CSRF-Token': 'mock-token'
      });
    });
  });
  
  describe('initializeCSRFProtection', () => {
    it('should initialize CSRF protection', () => {
      // Mock localStorage
      vi.spyOn(localStorage, 'getItem').mockReturnValue(null);
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {});
      
      initializeCSRFProtection();
      
      expect(localStorage.getItem).toHaveBeenCalledWith('csrf_token');
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });
  
  describe('validateCSRFToken', () => {
    it('should validate a CSRF token against the stored token', () => {
      const mockToken = 'valid-token';
      vi.spyOn(localStorage, 'getItem').mockReturnValue(mockToken);
      
      const isValid = validateCSRFToken(mockToken);
      
      expect(localStorage.getItem).toHaveBeenCalledWith('csrf_token');
      expect(isValid).toBe(true);
    });
    
    it('should return false for invalid tokens', () => {
      const mockToken = 'valid-token';
      vi.spyOn(localStorage, 'getItem').mockReturnValue(mockToken);
      
      const isValid = validateCSRFToken('invalid-token');
      
      expect(localStorage.getItem).toHaveBeenCalledWith('csrf_token');
      expect(isValid).toBe(false);
    });
  });
  
  describe('addCSRFHeader', () => {
    it('should be an alias for addCSRFToHeaders', () => {
      expect(addCSRFHeader).toBe(addCSRFToHeaders);
    });
  });

  describe('createProtectedFetchOptions', () => {
    it('should add CSRF token to fetch options', () => {
      const mockToken = 'mock-csrf-token';
      vi.spyOn(localStorage, 'getItem').mockReturnValue(mockToken);
      
      const options = { method: 'POST' };
      const result = createProtectedFetchOptions(options);
      
      expect(result.method).toBe('POST');
      expect(result.headers).toBeDefined();
      
      const headers = result.headers as Headers;
      expect(headers.get('X-CSRF-Token')).toBe(mockToken);
    });
  });

  describe('protectedFetch', () => {
    it('should call fetch with protected options', async () => {
      const mockToken = 'mock-csrf-token';
      vi.spyOn(localStorage, 'getItem').mockReturnValue(mockToken);
      
      const mockResponse = new Response();
      (global.fetch as any).mockResolvedValue(mockResponse);
      
      const result = await protectedFetch('/api/test', { method: 'POST' });
      
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
        method: 'POST',
        headers: expect.any(Headers)
      }));
      
      expect(result).toBe(mockResponse);
    });
  });

  describe('protectForm', () => {
    it('should add CSRF token to form', () => {
      const mockToken = 'mock-csrf-token';
      vi.spyOn(localStorage, 'getItem').mockReturnValue(mockToken);
      
      const form = document.createElement('form');
      protectForm(form);
      
      const tokenInput = form.querySelector('input[name="csrf_token"]') as HTMLInputElement;
      expect(tokenInput).not.toBeNull();
      expect(tokenInput.type).toBe('hidden');
      expect(tokenInput.value).toBe(mockToken);
    });
  });
});
