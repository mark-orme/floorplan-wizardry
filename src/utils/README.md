
# Utils Directory

This directory contains utility functions and helper modules used across the application.

## Structure

- `geometry/` - Geometric calculations and operations
- `grid/` - Grid-related utilities
- `canvas/` - Canvas manipulation utilities
- `fabric/` - Fabric.js specific utilities
- `validation/` - Validation utilities

## Usage Guidelines

1. Utilities should be pure functions where possible
2. Group related utilities into subdirectories
3. Document function parameters and return values
4. Add TypeScript types for parameters and return values
5. Export utilities through barrel files (index.ts)

## Example

```tsx
// Good example
export function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
```
