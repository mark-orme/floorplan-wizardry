/**
 * CSRF Protection Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateCsrfToken,
  getCsrfToken,
  verifyCsrfToken,
  addCsrfHeader,
  initializeCsrfProtection,
  resetCsrfProtection
} from '../csrfProtection';

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

// Mock window
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('CSRF Protection', () => {
  beforeEach(() => {
    // Reset localStorage
    window.localStorage.clear();
    
    // Reset fetch mock
    if ('fetch' in window) {
      // @ts-ignore
      delete window.fetch;
    }
    window.fetch = vi.fn();
  });
  
  test('generateCsrfToken should create and store a token', () => {
    const token = generateCsrfToken();
    
    expect(token).toBeTruthy();
    expect(token.length).toBeGreaterThan(20);
    expect(window.localStorage.getItem('x-csrf-token')).toBe(token);
  });
  
  test('getCsrfToken should return existing token', () => {
    const token = generateCsrfToken();
    const retrievedToken = getCsrfToken();
    
    expect(retrievedToken).toBe(token);
  });
  
  test('getCsrfToken should generate new token if none exists', () => {
    window.localStorage.clear();
    
    const token = getCsrfToken();
    
    expect(token).toBeTruthy();
    expect(window.localStorage.getItem('x-csrf-token')).toBe(token);
  });
  
  test('verifyCsrfToken should validate tokens correctly', () => {
    const token = generateCsrfToken();
    
    expect(verifyCsrfToken(token)).toBe(true);
    expect(verifyCsrfToken('wrong-token')).toBe(false);
  });
  
  test('addCsrfHeader should add token to headers', () => {
    const token = generateCsrfToken();
    const headers = addCsrfHeader({
      'Content-Type': 'application/json'
    });
    
    expect(headers).toEqual({
      'Content-Type': 'application/json',
      'X-CSRF-Token': token
    });
  });
  
  test('initializeCsrfProtection should monkey patch fetch', () => {
    const originalFetch = window.fetch;
    initializeCsrfProtection();
    
    expect(window.fetch).not.toBe(originalFetch);
  });
  
  test('patched fetch should include CSRF token', () => {
    const token = generateCsrfToken();
    initializeCsrfProtection();
    
    window.fetch('https://api.example.com', {
      method: 'POST',
      body: JSON.stringify({ data: 'test' })
    });
    
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
  });
  
  test('resetCsrfProtection should clear the token', () => {
    generateCsrfToken();
    resetCsrfProtection();
    
    expect(window.localStorage.getItem('x-csrf-token')).toBeNull();
  });
});
