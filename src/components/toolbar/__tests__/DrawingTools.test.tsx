
import { render } from '@testing-library/react';

// Create extended render utilities
const renderWithTestUtils = (component: React.ReactElement) => {
  const result = render(component);
  
  return {
    ...result,
    getAllByRole: (role: string) => {
      return Array.from(document.querySelectorAll(`[role="${role}"]`)) as HTMLElement[];
    },
    queryAllByRole: (role: string) => {
      return Array.from(document.querySelectorAll(`[role="${role}"]`)) as HTMLElement[];
    },
    getByTestId: (testId: string) => {
      const element = document.querySelector(`[data-testid="${testId}"]`);
      if (!element) {
        throw new Error(`Unable to find an element with the testId: ${testId}`);
      }
      return element as HTMLElement;
    },
    queryByTestId: (testId: string) => {
      return document.querySelector(`[data-testid="${testId}"]`) as HTMLElement | null;
    }
  };
};

// Use renderWithTestUtils instead of render in the tests
