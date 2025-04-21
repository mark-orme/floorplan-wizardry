
# Type Safety Guidelines

This document outlines best practices for ensuring type safety across the project.

## Core Type System

The project uses TypeScript for type safety, with several important patterns:

### Type Adapters

Always use type adapters when converting between different type systems:

```typescript
import { adaptFloorPlan, adaptWall, adaptRoom } from '@/utils/typeAdapters';

// Convert a partial wall to a complete wall
const completeWall = adaptWall(partialWall);

// Convert a partial floor plan to a complete floor plan
const completeFloorPlan = adaptFloorPlan(partialFloorPlan);
```

### Test Fixtures

When creating test objects, always use the typed test fixtures:

```typescript
import { createTestFloorPlan, createTestWall } from '@/utils/test/typedTestFixtures';

// Create a test floor plan with all required properties
const testPlan = createTestFloorPlan({
  name: 'Test Plan'
});

// Create a test wall with all required properties
const testWall = createTestWall({
  start: { x: 0, y: 0 },
  end: { x: 100, y: 0 }
});
```

### Canvas Mocks

When creating canvas mocks for tests, use the fixed typing:

```typescript
import { createFixedMockCanvas } from '@/utils/test/fixMockCanvas';

// Create a mock canvas with correct return types
const mockCanvas = createFixedMockCanvas();
```

## Common Issues to Avoid

### 1. Missing Required Properties

Always ensure objects have all required properties:

```typescript
// INCORRECT - missing required properties
const metadata = {
  createdAt: now,
  updatedAt: now
};

// CORRECT - using adapter to ensure all properties
const metadata = adaptMetadata({
  createdAt: now,
  updatedAt: now
});
```

### 2. Incorrect Return Types

Ensure functions return the expected types, especially with promises:

```typescript
// INCORRECT - callback doesn't return Promise<void>
const withImplementation = vi.fn();

// CORRECT - callback returns Promise<void>
const withImplementation = vi.fn().mockImplementation((callback?: Function): Promise<void> => {
  // ... implementation
  return Promise.resolve();
});
```

### 3. Type Conversion Issues

When converting between types, use proper type adapters:

```typescript
// INCORRECT - direct conversion can cause errors
const appFloorPlan = coreFloorPlan as FloorPlan;

// CORRECT - use adapters
const appFloorPlan = adaptFloorPlan(coreFloorPlan);
```

## ESLint Rules

The project includes ESLint rules to catch common type issues:

- `@typescript-eslint/no-unsafe-assignment`: Prevents unsafe type assignments
- `@typescript-eslint/no-unsafe-argument`: Prevents unsafe function arguments
- `@typescript-eslint/explicit-function-return-type`: Ensures functions have return types
- `@typescript-eslint/no-explicit-any`: Discourages the use of `any` type

## Pre-commit Hooks

Type checking is performed as part of the pre-commit hook to catch issues early:

```bash
# Run type check
npm run type-check

# Run linting with type checking
npm run lint:strict
```

## Additional Resources

- TypeScript Deep Dive: https://basarat.gitbook.io/typescript/
- TypeScript Handbook: https://www.typescriptlang.org/docs/handbook/intro.html
- ESLint TypeScript Plugin: https://github.com/typescript-eslint/typescript-eslint
