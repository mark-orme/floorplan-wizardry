
# Types Directory

This directory contains shared TypeScript type definitions used across the application.

## Structure

- `core/` - Core domain types
- `api/` - API and data transfer types
- `ui/` - UI component types
- `canvas/` - Canvas-related types
- `fabric/` - Fabric.js specific types

## Usage Guidelines

1. Group related types into subdirectories or files
2. Use interfaces for objects that will be extended
3. Use type aliases for unions, intersections, and simple objects
4. Export types through barrel files (index.ts)
5. Document complex types with JSDoc comments

## Example

```tsx
// Good example
/**
 * Represents a point in 2D space
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Supported line styles
 */
export type LineStyle = 'solid' | 'dashed' | 'dotted';
```
