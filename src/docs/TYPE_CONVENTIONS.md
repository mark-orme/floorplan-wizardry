
# Type Conventions

This document outlines the conventions and best practices for working with types in the application.

## Naming Conventions

### Type Names

- **Interfaces**: Use PascalCase, descriptive names
  ```typescript
  interface FloorPlan { /* ... */ }
  interface SecurityConfig { /* ... */ }
  ```

- **Type Aliases**: Use PascalCase for object-like types, PascalCase for union/enum-like types
  ```typescript
  type Point = { x: number; y: number };
  type DrawingTool = DrawingMode;
  ```

- **Enums**: Use PascalCase for the enum name, UPPER_CASE for enum values
  ```typescript
  enum DrawingMode {
    SELECT = 'select',
    DRAW = 'draw',
    // ...
  }
  ```

### File Names

- **Core Types**: `src/types/core/TypeName.ts`
- **Domain Types**: `src/types/{domain}/typeGroup.ts`
- **Barrel Files**: `src/types/{domain}/index.ts`

## Type Organization

### Directory Structure

```
src/
  types/
    core/           # Core application types
      Geometry.ts
      DrawingTool.ts
      ...
    security/       # Security-specific types
      authTypes.ts
      csrfTypes.ts
      ...
    floor-plan/     # Floor plan types
      floorPlanTypes.ts
      roomTypes.ts
      ...
    index.ts        # Central re-export
```

### Barrel Files

Use barrel files to re-export types:

```typescript
// src/types/security/index.ts
export * from './authTypes';
export * from './csrfTypes';
export * from './cspTypes';
// ...
```

## Documentation Standards

### JSDoc Comments

All types should have JSDoc comments:

```typescript
/**
 * Represents a point in 2D space.
 */
export interface Point {
  /**
   * X-coordinate
   */
  x: number;
  
  /**
   * Y-coordinate
   */
  y: number;
}
```

### Module Documentation

Each type module should have a module JSDoc:

```typescript
/**
 * Geometry Type Definitions
 * 
 * This module provides type definitions for geometry-related operations
 * throughout the application, including points, lines, polygons, and
 * transformation matrices.
 * 
 * @module types/core/Geometry
 */
```

## Type Safety Practices

### Avoid `any`

Never use `any` type unless absolutely necessary:

```typescript
// Bad
function processData(data: any): any {
  // ...
}

// Good
function processData(data: unknown): Result {
  // Validate and type-narrow data
  // ...
}
```

### Use `unknown` for Untyped Data

Use `unknown` instead of `any` for data with unspecified type:

```typescript
function parseApiResponse(response: unknown): ParsedResponse {
  // Validate and type-check before using
  if (isValidResponse(response)) {
    return processResponse(response);
  }
  throw new Error('Invalid response');
}
```

### Type Guards

Create type guards for complex types:

```typescript
/**
 * Type guard for Point objects
 */
function isPoint(value: unknown): value is Point {
  return (
    typeof value === 'object' &&
    value !== null &&
    'x' in value &&
    'y' in value &&
    typeof (value as Point).x === 'number' &&
    typeof (value as Point).y === 'number'
  );
}
```

### ReadOnly Types

Use `readonly` for immutable data:

```typescript
interface ReadOnlyPoint {
  readonly x: number;
  readonly y: number;
}

type ReadOnlyArray<T> = ReadonlyArray<T>;
```

## Import Best Practices

### Type Imports

Use type imports to prevent circular dependencies:

```typescript
import type { Point } from '@/types/core/Geometry';
```

### Central Imports

Import from central barrel files when possible:

```typescript
import { Point, LineSegment, Rectangle } from '@/types/core';
```

### Canonical Imports

Import types from their canonical source:

```typescript
// Good
import { DrawingMode } from '@/constants/drawingModes';

// Bad - not the canonical source
import { DrawingMode } from '@/types/DrawingMode';
```

## Type Utility Usage

### TypeScript Utility Types

Use built-in utility types:

```typescript
// Make all properties optional
type PartialConfig = Partial<Config>;

// Pick specific properties
type NameAndId = Pick<User, 'id' | 'name'>;

// Omit specific properties
type WithoutPassword = Omit<User, 'password'>;

// Required properties
type RequiredConfig = Required<Config>;

// Record type
type UserMap = Record<string, User>;
```

### Custom Type Utilities

Create custom type utilities for domain-specific needs:

```typescript
/**
 * Make specific properties of T required
 */
type RequireProps<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};

/**
 * Convert properties to nullable
 */
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};
```

## Type Definition Patterns

### Factory Functions

Provide factory functions for complex types:

```typescript
/**
 * Create a point with the given coordinates
 */
function createPoint(x: number, y: number): Point {
  return { x, y };
}

/**
 * Create an empty floor plan with default values
 */
function createEmptyFloorPlan(
  partialPlan: Partial<FloorPlan> = {}
): FloorPlan {
  return {
    id: partialPlan.id || generateId(),
    name: partialPlan.name || 'Untitled',
    walls: partialPlan.walls || [],
    rooms: partialPlan.rooms || [],
    // ...
  };
}
```

### Union and Intersection Types

Use union and intersection types appropriately:

```typescript
// Union type - one of these types
type Result = Success | Error;

// Intersection type - combined type
type AdminUser = User & AdminPermissions;
```

### Literal Types

Use literal types for specific values:

```typescript
type Direction = 'north' | 'south' | 'east' | 'west';
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
```

## Testing Types

### Type Testing

Use `ts-expect-error` or `ts-ignore` with caution:

```typescript
// @ts-expect-error - Testing that this should fail
const invalidPoint: Point = { x: 'not a number', y: 5 };
```

### Type Assertions in Tests

Use assertions in tests to validate types:

```typescript
const result = calculateArea(polygon);
expectTypeOf(result).toBeNumber();
```

## Version Control for Types

### Breaking Changes

Document breaking changes to types:

```typescript
/**
 * Represents a user
 * @deprecated Use User from '@/types/core/User' instead
 */
export interface LegacyUser {
  // ...
}

/**
 * Represents a user
 * @since v2.0.0
 */
export interface User {
  // New structure
}
```

### Migration Strategies

Provide migration helpers:

```typescript
/**
 * Convert legacy user format to current format
 */
export function migrateUser(legacy: LegacyUser): User {
  return {
    id: legacy.userId,
    name: legacy.name,
    // ...
  };
}
```

## Advanced Type Features

### Branded Types

Use branded types for additional type safety:

```typescript
// Branded user ID type
type UserId = string & { __brand: 'UserId' };

// Create a user ID
function createUserId(id: string): UserId {
  return id as UserId;
}

// Function that only accepts user IDs
function getUserById(id: UserId): User {
  // ...
}
```

### Conditional Types

Use conditional types for flexibility:

```typescript
type ArrayOrSingle<T> = T[] | T;

type ExtractPromise<T> = T extends Promise<infer U> ? U : T;
```

### Mapped Types

Use mapped types to transform existing types:

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Optional<T> = {
  [P in keyof T]?: T[P];
};
```

## Common Anti-Patterns to Avoid

### Type Assertion Overuse

Avoid excessive type assertions:

```typescript
// Bad
const point = data as Point;

// Good
if (isPoint(data)) {
  const point = data; // Now safely typed as Point
}
```

### String Literal Type Duplication

Avoid duplicating string literals:

```typescript
// Bad
type Direction = 'north' | 'south' | 'east' | 'west';
function move(direction: 'north' | 'south' | 'east' | 'west') {
  // ...
}

// Good
type Direction = 'north' | 'south' | 'east' | 'west';
function move(direction: Direction) {
  // ...
}
```

### Exporting Too Many Types

Avoid exporting internal types:

```typescript
// Bad - Exporting implementation details
export interface InternalCacheItem {
  // ...
}

// Good - Export only what's needed by consumers
export interface CacheOptions {
  // ...
}
```

### Inconsistent Naming

Avoid inconsistent naming:

```typescript
// Bad
interface point { x: number; y: number; }
type DIRECTION = 'north' | 'south';

// Good
interface Point { x: number; y: number; }
type Direction = 'north' | 'south';
```
