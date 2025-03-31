
# AI and Developer Guidelines

This document provides clear guidelines for both AI assistants and human developers working on this codebase. Following these rules will ensure type safety and consistency across the project.

## Core Type Safety Rules

1. **Use canonical DrawingTool type**
   - Always import `DrawingTool` from `@/types/core/DrawingTool`
   - Never redefine or create alternative DrawingTool types
   - Use DrawingMode enum values from `@/constants/drawingModes`

2. **Explicit function return types**
   - All functions must have explicit return types
   - Example: `function calculateArea(width: number, height: number): number`

3. **No any types**
   - Never use `any` in type definitions or casts
   - Use `unknown` for truly unknown types and narrow with type guards
   - Example: `function processData(data: unknown): void`

4. **Type-safe property access**
   - Never access dynamic properties without type assertion
   - Always use type guards before accessing optional properties
   - Example: `(obj as Record<string, unknown>)[key]`

5. **Grid state validation**
   - Use the utility functions in `gridStateValidation.ts`
   - Always validate grid state objects before use
   - Example: `const validState = validateGridState(inputState)`

## Hook Contract Guidelines

1. **Explicit return types for hooks**
   - All custom hooks must specify their return type
   - Example: 
     ```typescript
     function useCounter(): { count: number; increment: () => void } {
       // implementation
     }
     ```

2. **Documented hook dependencies**
   - Always include required dependencies in useEffect dependency arrays
   - Document why certain dependencies are excluded if needed

3. **Proper hook naming**
   - Prefix with 'use'
   - Clearly describe the hook's purpose
   - Example: `useCanvasEvents`, `useGridValidation`

## Code Structure

1. **Small, focused files**
   - Keep files under 200 lines
   - Split complex functionality into multiple files
   - Use barrel exports (index.ts) for related functionality

2. **Explicit imports**
   - Import only what's needed
   - Use named imports rather than namespace imports
   - Example: `import { validateGridState } from '@/utils/grid/gridStateValidation';`

3. **Document interfaces and types**
   - Add JSDoc comments to all interfaces and type definitions
   - Example: 
     ```typescript
     /**
      * Represents grid creation state with validation status
      */
     interface GridCreationState {
       // properties
     }
     ```

## For AI Assistants Specifically

1. **Never use `any`** - Use proper type assertions and type guards
2. **Always validate user inputs** - Prevent type errors at runtime
3. **Use existing utility functions** - Don't reimplement validation logic
4. **Follow patterns in existing code** - Maintain consistency
5. **When refactoring, keep the same functionality** - Don't change behavior unless explicitly requested

## For Human Developers Specifically

1. **Run TypeScript checks before committing** - `npm run typecheck`
2. **Follow ESLint rules** - Don't disable rules without good reason
3. **Add tests for new functionality** - Ensure type safety is maintained
4. **Document complex type relationships** - Help others understand your code
5. **Consider maintenance burden** - Simple, clear code is better than clever code

## Common Pitfalls to Avoid

1. **Mixing DrawingTool and DrawingMode**
2. **Using `as any` to bypass TypeScript errors**
3. **Incomplete type definitions for complex objects**
4. **Missing null/undefined checks before property access**
5. **Inconsistent naming between types and implementations**
