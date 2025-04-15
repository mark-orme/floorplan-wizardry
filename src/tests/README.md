
# Tests Directory

This directory contains test files for the application, organized by feature and type.

## Testing Structure

- `canvas/` - Tests for canvas-related functionality
- `drawing/` - Tests for drawing tools and features
- `grid/` - Tests for grid and snapping functionality
- `touch/` - Tests for touch and pointer interactions
- `utils/` - Tests for utility functions

## Test Coverage

We aim for high test coverage across the codebase:

- **Unit Tests**: For individual functions and hooks
- **Integration Tests**: For interactions between components
- **Visual Tests**: For UI components and layouts

## Running Tests

Tests are run using Vitest. To run the test suite:

```bash
# Run all tests
npm test

# Run with coverage report
npm test -- --coverage

# Run specific test file
npm test -- grid/snapping.test.ts

# Run tests in watch mode
npm test -- --watch
```

## Writing Tests

### Test File Naming

Test files should be named with the pattern:
- `*.test.ts` for TypeScript tests
- `*.test.tsx` for React component tests

### Test Structure

Each test file should follow this structure:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { functionToTest } from '@/path/to/function';

describe('Component or Function Name', () => {
  describe('specific functionality', () => {
    it('should behave in a specific way', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = functionToTest(input);
      
      // Assert
      expect(result).toBe('expected output');
    });
  });
});
```

### Mocking

Use Vitest's mocking capabilities:

```typescript
// Mock an import
vi.mock('@/utils/logger', () => ({
  info: vi.fn(),
  error: vi.fn()
}));

// Mock a function
const mockFn = vi.fn();
mockFn.mockReturnValue('mocked result');

// Spy on a method
const spy = vi.spyOn(object, 'method');
```

### Testing Hooks

Use `renderHook` from `@testing-library/react-hooks`:

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useMyHook } from '@/hooks/useMyHook';

it('should update state when called', () => {
  const { result } = renderHook(() => useMyHook());
  
  act(() => {
    result.current.update('new value');
  });
  
  expect(result.current.value).toBe('new value');
});
```

## CI Integration

Tests are automatically run in the CI pipeline:
- On pull requests to ensure code quality
- On merges to main branch to prevent regressions
- Before releases to verify stability
