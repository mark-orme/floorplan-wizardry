
# Grid State Type Safety Guidelines

## Common Issues and Their Solutions

This document outlines common type safety issues when working with `GridCreationState` objects and how to avoid them.

### Problem: "Type X is not assignable to type 'never'"

This error typically occurs when TypeScript cannot determine a valid type for a property assignment. When working with `GridCreationState` objects, this often happens when copying properties between objects.

#### Solution:

Use proper type assertions when copying properties:

```typescript
// INCORRECT - May cause "Type X is not assignable to type 'never'" errors
const typedKey = key as keyof GridCreationState;
validState[typedKey] = state[typedKey];

// CORRECT - Uses intermediate Record type for safe property assignment
const typedKey = key as keyof GridCreationState;
if (typedKey in state) {
  const value = state[typedKey];
  (validState as Record<string, unknown>)[typedKey] = value;
}
```

### Dynamic Property Access

When accessing properties dynamically using string keys, always ensure the property exists:

```typescript
// INCORRECT - May cause runtime errors if property doesn't exist
const value = gridState[propertyName];

// CORRECT - Check first, then access with proper typing
if (propertyName in gridState) {
  const typedKey = propertyName as keyof GridCreationState;
  const value = gridState[typedKey];
  // Now use value...
}
```

### Using Type-Safe Utility Functions

Always use the utility functions in `gridStateValidation.ts` when working with grid state objects:

```typescript
import { validateGridState, createGridStateUpdate, repairGridState } from '@/utils/grid/gridStateValidation';

// Validate and fix a grid state object
const validatedState = validateGridState(partialState);

// Create a valid update object
const update = createGridStateUpdate({ exists: true, isCreated: true });

// Fix incorrectly named properties
const fixedState = repairGridState({ visible: true, created: true });
```

### Proper Type Casting for Dynamic Property Access

When working with dynamic property access, use proper type casting with Record:

```typescript
// INCORRECT - May cause "Type X is not assignable to type 'never'" errors
gridState[propertyName] = someValue;

// CORRECT - Use intermediate casting with Record
(gridState as Record<string, unknown>)[propertyName] = someValue;
```

### GridCreationState Property Mapping

When migrating code or working with different property naming conventions, refer to the `GRID_STATE_PROPERTY_MAP` for the correct property names:

| Incorrect Property | Correct Property |
|-------------------|------------------|
| `visible`         | `exists`         |
| `visibility`      | `exists`         |
| `created`         | `isCreated`      |
| `error`           | `errorMessage`   |

## ESLint Rules

Our ESLint configuration includes rules to detect and prevent common type safety issues with `GridCreationState` objects. Pay attention to warnings and errors related to grid state properties.

### Type Safety Recommendations

1. Always use explicit types for objects and maps
2. Avoid using `any` type
3. Use `Record<string, unknown>` for intermediate type casting
4. Check property existence before access
5. Use utility functions for grid state operations
6. Follow naming conventions for grid state properties
