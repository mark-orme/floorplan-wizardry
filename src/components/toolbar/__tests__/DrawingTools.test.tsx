
import { render } from '@testing-library/react';

// Create extended render utilities
const renderWithTestUtils = (component: React.ReactElement) => {
  const result = render(component);
  
  // Add missing methods
  return {
    ...result,
    getAllByRole: (role: string) => {
      return Array.from(document.querySelectorAll(`[role="${role}"]`)) as HTMLElement[];
    },
    queryAllByRole: (role: string) => {
      return Array.from(document.querySelectorAll(`[role="${role}"]`)) as HTMLElement[];
    }
  };
};

// Use renderWithTestUtils instead of render in the tests
