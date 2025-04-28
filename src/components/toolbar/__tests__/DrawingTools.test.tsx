import { render } from '@testing-library/react';

export const renderWithTestUtils = (component: React.ReactElement) => {
  const utils = render(component);
  
  return {
    ...utils,
    getByTestId: (testId: string) => {
      const element = document.querySelector(`[data-testid="${testId}"]`);
      if (!element) {
        throw new Error(`Unable to find element with testId: ${testId}`);
      }
      return element as HTMLElement;
    },
    queryByTestId: (testId: string) => 
      document.querySelector(`[data-testid="${testId}"]`) as HTMLElement | null,
    getAllByRole: (role: string) => 
      Array.from(document.querySelectorAll(`[role="${role}"]`)) as HTMLElement[],
    queryAllByRole: (role: string) => 
      Array.from(document.querySelectorAll(`[role="${role}"]`)) as HTMLElement[]
  };
};

// Use renderWithTestUtils instead of render in the tests
