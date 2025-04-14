
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  generateCSRFToken, 
  getCSRFToken, 
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
  
  describe('protectForm', () => {
    it('should add CSRF token input to a form', () => {
      // Create a test form
      const form = document.createElement('form');
      
      // Mock getCSRFToken
      vi.spyOn(window.sessionStorage, 'getItem').mockReturnValue('mock-token');
      
      protectForm(form);
      
      // Check if input was added
      const input = form.querySelector('input[name="csrf_token"]');
      expect(input).not.toBeNull();
      expect(input?.getAttribute('type')).toBe('hidden');
      expect(input?.getAttribute('value')).toBe('mock-token');
    });
    
    it('should replace existing CSRF token input', () => {
      // Create a test form with existing token
      const form = document.createElement('form');
      const existingInput = document.createElement('input');
      existingInput.type = 'hidden';
      existingInput.name = 'csrf_token';
      existingInput.value = 'old-token';
      form.appendChild(existingInput);
      
      // Mock getCSRFToken
      vi.spyOn(window.sessionStorage, 'getItem').mockReturnValue('new-token');
      
      protectForm(form);
      
      // Check if input was replaced
      const inputs = form.querySelectorAll('input[name="csrf_token"]');
      expect(inputs.length).toBe(1);
      expect(inputs[0].value).toBe('new-token');
    });
  });
  
  describe('addCSRFHeader', () => {
    it('should add CSRF token to Headers object', () => {
      // Mock getCSRFToken
      vi.spyOn(window.sessionStorage, 'getItem').mockReturnValue('mock-token');
      
      const headers = new Headers();
      const result = addCSRFHeader(headers);
      
      expect(result instanceof Headers).toBe(true);
      expect((result as Headers).get('X-CSRF-Token')).toBe('mock-token');
    });
    
    it('should add CSRF token to array headers', () => {
      // Mock getCSRFToken
      vi.spyOn(window.sessionStorage, 'getItem').mockReturnValue('mock-token');
      
      const headers = [['Content-Type', 'application/json']];
      const result = addCSRFHeader(headers);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toContainEqual(['X-CSRF-Token', 'mock-token']);
    });
    
    it('should add CSRF token to object headers', () => {
      // Mock getCSRFToken
      vi.spyOn(window.sessionStorage, 'getItem').mockReturnValue('mock-token');
      
      const headers = { 'Content-Type': 'application/json' };
      const result = addCSRFHeader(headers);
      
      expect(result).toEqual({
        'Content-Type': 'application/json',
        'X-CSRF-Token': 'mock-token'
      });
    });
  });
  
  describe('createProtectedFetchOptions', () => {
    it('should create fetch options with CSRF protection', () => {
      // Mock getCSRFToken
      vi.spyOn(window.sessionStorage, 'getItem').mockReturnValue('mock-token');
      
      const options = createProtectedFetchOptions();
      
      expect(options.credentials).toBe('include');
      // Check headers format depends on platform implementation, so check both possibilities
      if (options.headers instanceof Headers) {
        expect((options.headers as Headers).get('X-CSRF-Token')).toBe('mock-token');
      } else if (Array.isArray(options.headers)) {
        expect(options.headers).toContainEqual(['X-CSRF-Token', 'mock-token']);
      } else {
        expect((options.headers as Record<string, string>)['X-CSRF-Token']).toBe('mock-token');
      }
    });
    
    it('should merge with existing options', () => {
      // Mock getCSRFToken
      vi.spyOn(window.sessionStorage, 'getItem').mockReturnValue('mock-token');
      
      const existingOptions = {
        method: 'POST',
        body: JSON.stringify({ test: true }),
        headers: { 'Content-Type': 'application/json' }
      };
      
      const options = createProtectedFetchOptions(existingOptions);
      
      expect(options.method).toBe('POST');
      expect(options.body).toBe(existingOptions.body);
      expect(options.credentials).toBe('include');
      
      // Headers should include both the content type and the CSRF token
      const headers = options.headers as Record<string, string>;
      expect(headers['Content-Type']).toBe('application/json');
      expect(headers['X-CSRF-Token']).toBe('mock-token');
    });
  });
  
  describe('protectedFetch', () => {
    it('should call fetch with protected options', async () => {
      // Mock getCSRFToken
      vi.spyOn(window.sessionStorage, 'getItem').mockReturnValue('mock-token');
      
      // Mock fetch response
      const mockResponse = { ok: true, json: () => Promise.resolve({ data: 'test' }) };
      (global.fetch as any).mockResolvedValue(mockResponse);
      
      const url = 'https://example.com/api';
      const options = { method: 'GET' };
      
      await protectedFetch(url, options);
      
      // Check that fetch was called with the correct arguments
      expect(global.fetch).toHaveBeenCalledWith(url, expect.objectContaining({
        method: 'GET',
        credentials: 'include',
        headers: expect.anything()
      }));
    });
  });
});
