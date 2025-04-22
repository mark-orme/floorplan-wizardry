
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { SecurityInitializer } from '@/components/security/SecurityInitializer';

describe('Security Components Accessibility', () => {
  it('SecurityInitializer has no accessibility violations', async () => {
    const { container } = render(
      <SecurityInitializer />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
