
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactElement } from 'react';

const customRender = (ui: ReactElement, options = {}) => {
  return {
    ...render(ui, options),
    screen,
  };
};

export * from '@testing-library/react';
export { customRender as render };
export { userEvent };
export { fireEvent };
