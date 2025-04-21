
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import SecurityInitializer from '@/components/security/SecurityInitializer';
import SecurityProvider from '@/components/security/SecurityProvider';
import type { AxeResults } from 'axe-core';

// Add jest-axe matchers to Jest's expect
expect.extend(toHaveNoViolations);

// Extend the Vitest Assertion interface
declare module 'vitest' {
  interface Assertion<T = any> {
    toHaveNoViolations(): Promise<void>;
  }
}

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn()
  }
}));

vi.mock('@/utils/security/csrfProtection', () => ({
  initializeCsrfProtection: vi.fn(),
  getCsrfToken: vi.fn().mockReturnValue('mock-csrf-token')
}));

vi.mock('@/utils/security/cspUtils', () => ({
  initializeCSP: vi.fn()
}));

vi.mock('@/utils/security', () => ({
  initializeAllSecurity: vi.fn()
}));

vi.mock('@/utils/security/encryption', () => ({
  isEncryptionSupported: vi.fn().mockReturnValue(true)
}));

describe('Security Components Accessibility', () => {
  it('SecurityInitializer should have no accessibility violations', async () => {
    const { container } = render(<SecurityInitializer enableToasts={false} />);
    
    const results: AxeResults = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('SecurityProvider should have no accessibility violations', async () => {
    const { container } = render(
      <SecurityProvider showToasts={false}>
        <div>Protected content</div>
      </SecurityProvider>
    );
    
    const results: AxeResults = await axe(container);
    expect(results).toHaveNoViolations();
    
    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });
  
  it('SecurityProvider should add proper meta tags for security', () => {
    render(
      <SecurityProvider showToasts={false}>
        <div>Protected content</div>
      </SecurityProvider>
    );
    
    const metaTags = document.querySelectorAll('meta');
    
    const referrerTag = Array.from(metaTags).find(
      tag => tag.getAttribute('name') === 'referrer'
    );
    expect(referrerTag).toBeTruthy();
    expect(referrerTag?.getAttribute('content')).toBe('strict-origin-when-cross-origin');
    
    const noSniffTag = Array.from(metaTags).find(
      tag => tag.getAttribute('http-equiv') === 'X-Content-Type-Options'
    );
    expect(noSniffTag).toBeTruthy();
    expect(noSniffTag?.getAttribute('content')).toBe('nosniff');
  });
});
