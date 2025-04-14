
# Types

This directory contains TypeScript type definitions used throughout the application.

## Structure

- `core/`: Core type definitions for the application
- `floor-plan/`: Types related to floor plan data structures
- `fabric-types.ts`: Type definitions for fabric.js
- `drawingTypes.ts`: Types for drawing tools and operations

## Usage

Types should:
1. Be properly named following TypeScript conventions
2. Be well-documented with JSDoc comments
3. Be exported through the appropriate barrel files
4. Use descriptive names and follow consistent conventions

When creating new types:
- Group related types in appropriate subdirectories
- Use interfaces for object shapes that will be implemented
- Use type aliases for unions, intersections, and complex types
- Consider using utility types (Partial, Omit, etc.) when appropriate

## Examples

```tsx
import { Point } from '@/types/core/Point';
import { FloorPlan, Room, Wall } from '@/types/core/floor-plan';
import { DrawingMode } from '@/constants/drawingModes';
```
