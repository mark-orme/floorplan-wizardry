# Type Error Prevention Guide

This guide provides strategies to prevent common TypeScript errors in our codebase.

## Common Error Types and Prevention

### 1. Property Does Not Exist on Type

```
error TS2339: Property 'xyz' does not exist on type 'ABC'
```

**Prevention:**
- Use proper interfaces for all objects
- Verify imports come from correct type definition files
- Use optional chaining (`?.`) for nullable properties
- Create and use interface extensions for related types

### 2. Type Not Assignable to Parameter

```
error TS2345: Argument of type 'X' is not assignable to parameter of type 'Y'
```

**Prevention:**
- Use proper parameter objects with interfaces
- Always use helper functions for creating test objects (`createMockFunctionParams`, `createTestPoint`)
- Implement type assertion helper functions (`asMockCanvas`) rather than direct type casts
- Create explicit conversion functions for incompatible types

### 3. Module Has No Exported Member

```
error TS2305: Module 'X' has no exported member 'Y'
```

**Prevention:**
- Maintain consistent exports in all modules
- Use barrel files (index.ts) for organizing exports
- Keep constants in their canonical locations
- Verify import paths to ensure correct modules are used

### 4. Implementation / Interface Mismatches

```
error TS2322: Type 'X' is not assignable to type 'Y'
```

**Prevention:**
- Keep interface definitions and implementations in sync
- Use utility types for implementation flexibility (Pick, Omit, Partial)
- Create interface validation functions
- Add type annotations to all return values

## Project-Specific Prevention Strategies

### Canvas Component Type Safety

1. Use strongly-typed props:
   ```typescript
   interface CanvasProps {
     width: number;
     height: number;
     onCanvasReady: (canvas: FabricCanvas) => void;
     // etc.
   }
   ```

2. Avoid direct type assertions:
   ```typescript
   // INCORRECT
   const canvas = document.createElement('canvas') as HTMLCanvasElement;
   
   // CORRECT
   const canvasElement = document.createElement('canvas');
   if (!(canvasElement instanceof HTMLCanvasElement)) {
     throw new Error('Failed to create canvas element');
   }
   ```

3. Use type guards for events:
   ```typescript
   function isPointerEvent(event: Event): event is PointerEvent {
     return 'pointerId' in event;
   }
   
   function handleEvent(event: Event) {
     if (isPointerEvent(event)) {
       // Now TypeScript knows it's a PointerEvent
       console.log(event.pointerId);
     }
   }
   ```

### Mock Test Type Safety

1. Use typed mock creation:
   ```typescript
   // In test file
   const mockCanvas = createTypedMockCanvas();
   
   // Use in hook or component
   const result = useStraightLineTool({
     canvas: asMockCanvas(mockCanvas),
     // other props
   });
   ```

2. Maintain complete mock object properties:
   ```typescript
   // When mocking hooks or objects, include ALL required properties
   const mockLineState = {
     isDrawing: false,
     // ALL other properties and methods
     cancelDrawing: vi.fn()
   };
   ```

3. Use parameter object patterns:
   ```typescript
   // Instead of multiple parameters, use object parameters
   function someFunction(params: {
     a: string;
     b: number;
     c?: boolean;
   }) {
     // Implementation
   }
   
   // Call with named parameters
   someFunction({ a: 'test', b: 123 });
   ```

## ESLint Rules for Prevention

We've implemented several ESLint rules to catch type errors:

1. **typeSafetyRules**: Enforce strict type checking and prevent unsafe operations
2. **hookMockValidationRules**: Ensure hooks are mocked correctly with all properties
3. **testMockValidationRules**: Validate proper test object creation and typing
4. **lineToolValidationRules**: Enforce proper use of drawing tools and hooks
5. **fabricTestTypingRules**: Prevent errors when working with Fabric.js in tests

## CI/Pre-commit Checks

1. Run TypeScript type checking before commits:
   ```bash
   npm run typecheck
   ```

2. Run ESLint with type safety rules:
   ```bash
   npm run lint
   ```

3. Run tests to catch runtime issues:
   ```bash
   npm test
   ```

## When Adding New Features

1. Create interfaces first
2. Write tests with explicit mocks
3. Implement the feature with proper type annotations
4. Update documentation and guides

By following these guidelines, we can prevent type errors before they cause build failures or runtime issues.
