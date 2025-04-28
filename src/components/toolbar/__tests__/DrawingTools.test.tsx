
import { render } from '@testing-library/react';
import { enhancedQueries } from '@/utils/testing-utils';

export const renderWithTestUtils = (component: React.ReactElement) => {
  const utils = render(component);
  
  return {
    ...utils,
    ...enhancedQueries
  };
};
