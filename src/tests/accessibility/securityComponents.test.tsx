
/**
 * Accessibility tests for security components
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import SecurityInitializer from '@/components/security/SecurityInitializer';
import SecurityProvider from '@/components/security/SecurityProvider';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

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
    
    // Since SecurityInitializer doesn't render visible elements, this mainly tests
    // that it doesn't add inaccessible elements to the DOM
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('SecurityProvider should have no accessibility violations', async () => {
    const { container } = render(
      <SecurityProvider showToasts={false}>
        <div>Protected content</div>
      </SecurityProvider>
    );
    
    // Test that SecurityProvider and its children are accessible
    const results = await axe(container);
    expect(results).toHaveNoViolations();
    
    // Check that content is rendered
    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });
  
  it('SecurityProvider should add proper meta tags for security', () => {
    render(
      <SecurityProvider showToasts={false}>
        <div>Protected content</div>
      </SecurityProvider>
    );
    
    // Check that appropriate meta tags are added
    const metaTags = document.querySelectorAll('meta');
    
    // There should be at least one meta tag for referrer policy
    const referrerTag = Array.from(metaTags).find(
      tag => tag.getAttribute('name') === 'referrer'
    );
    expect(referrerTag).toBeTruthy();
    expect(referrerTag?.getAttribute('content')).toBe('strict-origin-when-cross-origin');
    
    // There should be at least one meta tag for X-Content-Type-Options
    const noSniffTag = Array.from(metaTags).find(
      tag => tag.getAttribute('http-equiv') === 'X-Content-Type-Options'
    );
    expect(noSniffTag).toBeTruthy();
    expect(noSniffTag?.getAttribute('content')).toBe('nosniff');
  });
});
