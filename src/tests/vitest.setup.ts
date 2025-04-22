
import '@testing-library/jest-dom';
import 'vitest-axe/extend-expect';
import { toHaveNoViolations } from 'jest-axe';

// Extend Jest matchers with axe
expect.extend(toHaveNoViolations);
