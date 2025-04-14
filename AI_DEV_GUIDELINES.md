
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

## Grid System Safety

1. **Use grid visibility utilities**
   - Always use functions from `gridVisibility.ts` to manage grid
   - Never directly modify grid object visibility
   - Example: `setGridVisibility(canvas, true)` instead of direct property access

2. **Implement proper grid error handling**
   - Add try/catch blocks around grid operations
   - Use diagnoseGridState for troubleshooting
   - Example: 
     ```typescript
     try {
       const result = forceGridCreationAndVisibility(canvas);
       if (!result) {
         logger.warn("Grid recreation failed");
       }
     } catch (error) {
       logger.error("Grid error:", error);
     }
     ```

3. **Follow proper grid constants usage**
   - Access constants only through GRID_CONSTANTS
   - Never hardcode grid values that exist in constants
   - Example: `GRID_CONSTANTS.SMALL_GRID_SIZE` instead of hardcoded `10`

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

4. **Clean up resources in useEffect**
   - Always return a cleanup function when creating event listeners
   - Prevent memory leaks by proper cleanup
   - Example:
     ```typescript
     useEffect(() => {
       const handleResize = () => { /* implementation */ };
       window.addEventListener('resize', handleResize);
       return () => window.removeEventListener('resize', handleResize);
     }, []);
     ```

## Drawing Tool Guidelines

1. **Consistent tool state management**
   - Separate tool state from event handling
   - Use refs for transient values that shouldn't trigger re-renders
   - Implement clean enter/exit transitions between drawing modes

2. **Proper measurement tooltip handling**
   - Create tooltips only when needed
   - Clean up tooltips when operations complete
   - Ensure tooltips are properly positioned and visible

3. **Error handling in drawing operations**
   - Add proper error handling for all drawing operations
   - Provide fallback behaviors when drawing fails
   - Log meaningful error messages for debugging

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
6. **Add proper error handling** - Use try/catch and provide meaningful error messages
7. **Implement proper cleanup** - Ensure all resources are properly cleaned up

## For Human Developers Specifically

1. **Run TypeScript checks before committing** - `npm run typecheck`
2. **Follow ESLint rules** - Don't disable rules without good reason
3. **Add tests for new functionality** - Ensure type safety is maintained
4. **Document complex type relationships** - Help others understand your code
5. **Consider maintenance burden** - Simple, clear code is better than clever code
6. **Verify grid functionality** - Test grid visibility and interactions

## Common Pitfalls to Avoid

1. **Mixing DrawingTool and DrawingMode**
2. **Using `as any` to bypass TypeScript errors**
3. **Incomplete type definitions for complex objects**
4. **Missing null/undefined checks before property access**
5. **Inconsistent naming between types and implementations**
6. **Infinite loops in useEffect** - Ensure proper dependency arrays
7. **Memory leaks** - Clean up event listeners and subscriptions
8. **Grid visibility issues** - Use proper grid visibility utilities
