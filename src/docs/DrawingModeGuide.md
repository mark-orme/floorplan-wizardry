
# Drawing Mode Guide

## Overview

This guide explains how to correctly use `DrawingMode` and `DrawingTool` throughout the application to prevent type errors and ensure consistency.

## Core Concepts

- `DrawingMode` enum is defined in `@/constants/drawingModes.ts`
- `DrawingTool` type is defined in `@/types/core/DrawingTool.ts` and is an alias for `DrawingMode`

## Importing Correctly

Always import from the canonical source:

```typescript
// CORRECT:
import { DrawingMode } from '@/constants/drawingModes';
import { DrawingTool } from '@/types/core/DrawingTool';

// INCORRECT:
import { DrawingMode } from '@/types/FloorPlan'; // DON'T DO THIS
```

## Common Patterns

### Type Conversion

Use the utility functions to convert between types:

```typescript
import { normalizeDrawingMode } from '@/utils/floorPlanAdapter';

// Convert a string to a DrawingMode
const mode = normalizeDrawingMode('rectangle'); // Returns DrawingMode.RECTANGLE
```

### Using with Components

When creating components that work with drawing tools:

```typescript
interface ToolProps {
  // Use DrawingMode (or DrawingTool) for typing
  activeTool: DrawingMode;
  onSelectTool: (tool: DrawingMode) => void;
}
```

### Type Guards

Use type guards to ensure type safety:

```typescript
import { isValidDrawingTool } from '@/types/core/DrawingTool';

function processTool(tool: unknown) {
  if (isValidDrawingTool(tool)) {
    // TypeScript now knows 'tool' is a valid DrawingMode
    console.log(getToolDisplayName(tool));
  }
}
```

## Best Practices

1. Never use string literals (like 'rectangle') directly - always use the enum: `DrawingMode.RECTANGLE`
2. Always use proper type annotations for functions and variables
3. Validate untrusted input with the provided utility functions
4. Use the centralized display name function: `getToolDisplayName()`
5. When creating tests, import DrawingMode from the canonical source

## ESLint Rules

Our codebase includes ESLint rules to enforce these patterns:

- `drawing-tool-validation/consistent-import`
- `drawing-tool-validation/prevent-string-literals`
- `drawing-tool-validation/enforce-enum-values`
- `drawing-tool-validation/hook-return-types`

## Common Errors and Solutions

### Type Not Assignable Error

```
Type 'import("/src/constants/drawingModes").DrawingMode' is not assignable to type 'import("/src/types/FloorPlan").DrawingMode'
```

**Solution**: Always import DrawingMode from '@/constants/drawingModes'

### Property Missing Error

```
Property 'X' is missing in type 'DrawingMode'
```

**Solution**: Ensure you're using the complete and up-to-date DrawingMode enum

### Cannot Find Name Error

```
Cannot find name 'DrawingTool'
```

**Solution**: Import DrawingTool from '@/types/core/DrawingTool'
