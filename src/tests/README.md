
# Tests

This directory contains test utilities, mocks, and fixtures used for testing the application.

## Structure

- `mocks/`: Mock implementations of components and functions
- `utils/`: Utility functions for testing
- `vitest.setup.ts`: Setup file for Vitest

## Usage

Tests should:
1. Use descriptive names that explain what's being tested
2. Follow the Arrange-Act-Assert pattern
3. Be focused on a single unit of functionality
4. Use mocks and stubs appropriately

When creating new test utilities:
- Group related utilities in appropriate subdirectories
- Export them through the main barrel file (index.ts)
- Keep utility functions small and focused
- Document the purpose and usage of each utility

## Examples

```tsx
import { renderWithProviders } from '@/tests/utils/test-utils';
import { createTestFabricCanvas } from '@/tests/utils/fabric-test-utils';
import { mockStraightLineTool } from '@/tests/mocks/mockStraightLineTool';
```
