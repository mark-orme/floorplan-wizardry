
# Type Safety Best Practices

This document provides detailed guidelines for maintaining type safety throughout the codebase.

## DrawingTool and DrawingMode Consistency

One of the most common sources of confusion in our codebase has been the relationship between `DrawingTool` and `DrawingMode`. Here's how to use them correctly:

### The Canonical Source

- **DrawingTool** is defined in `@/types/core/DrawingTool.ts` and is the canonical type
- **DrawingMode** is an enum from `@/constants/drawingModes.ts`
- DrawingTool is effectively an alias to DrawingMode

### Correct Usage

```typescript
import { DrawingTool } from '@/types/core/DrawingTool';
import { DrawingMode } from '@/constants/drawingModes';

// Correct: Use DrawingMode for values
function setTool(tool: DrawingTool): void {
  if (tool === DrawingMode.SELECT) {
    // ...
  }
}
```

### Incorrect Usage

```typescript
// ❌ WRONG: Don't import DrawingTool from multiple places
import { DrawingTool } from '@/types/drawingTypes';
// ❌ WRONG: Don't create string literals that should be DrawingMode values
function setTool(tool: 'select' | 'draw'): void {
  // ...
}
```

## Grid State Validation

All grid state objects should be validated using the utilities in `@/utils/grid/gridStateValidation.ts`:

```typescript
import { validateGridState } from '@/utils/grid/gridStateValidation';

function processGridState(rawState: unknown): void {
  const validState = validateGridState(rawState as Partial<GridCreationState>);
  // Now use validState safely
}
```

## Type-Safe Property Access

When accessing properties dynamically or from unknown objects:

```typescript
// Safe property access with type assertion
function getProperty<T>(obj: Record<string, unknown>, key: string): T | undefined {
  return (obj as Record<string, T>)[key];
}

// With type guards
function hasProp<K extends string>(obj: unknown, prop: K): obj is { [P in K]: unknown } {
  return !!obj && typeof obj === 'object' && prop in obj;
}

if (hasProp(obj, 'someProperty')) {
  // TypeScript now knows obj.someProperty exists
  console.log(obj.someProperty);
}
```

## Hook Return Types

All custom hooks must have explicit return types:

```typescript
// ✅ CORRECT: Explicit return type
function useCounter(): { count: number; increment: () => void; decrement: () => void } {
  const [count, setCount] = useState(0);
  
  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  
  return { count, increment, decrement };
}

// ❌ WRONG: Missing return type
function useCounter() {
  // ...
}
```

## Understanding Type Assertions

Use type assertions carefully and only when you're certain about the type:

```typescript
// Safe assertion when you know the precise type
const element = document.getElementById('root') as HTMLDivElement;

// Safer approach with type checking
const maybeElement = document.getElementById('root');
if (maybeElement instanceof HTMLDivElement) {
  // Now it's safe to use maybeElement as HTMLDivElement
}

// Handling unknown data with type guards
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' && 
    data !== null && 
    'name' in data && 
    'id' in data
  );
}

if (isUser(data)) {
  // TypeScript knows data is User
  console.log(data.name);
}
```

## Common Error Patterns to Avoid

1. **Using type assertions without checks**
   ```typescript
   // ❌ WRONG: Unsafe assertion
   const data = someApi.getData() as UserData;
   
   // ✅ RIGHT: Check first, then use
   const data = someApi.getData();
   if (isUserData(data)) {
     // Use data as UserData
   }
   ```

2. **Ignoring nullable values**
   ```typescript
   // ❌ WRONG: May cause runtime error
   const name = user.profile.name.toUpperCase();
   
   // ✅ RIGHT: Use optional chaining and nullish coalescing
   const name = user?.profile?.name?.toUpperCase() ?? 'UNKNOWN';
   ```

3. **Using 'any' to solve type errors**
   ```typescript
   // ❌ WRONG: Defeats TypeScript's purpose
   function processData(data: any): void {
     // ...
   }
   
   // ✅ RIGHT: Use unknown and narrow with type guards
   function processData(data: unknown): void {
     if (typeof data === 'string') {
       // String-specific operations
     } else if (Array.isArray(data)) {
       // Array operations
     }
   }
   ```

4. **Incorrect handling of union types**
   ```typescript
   // ❌ WRONG: May cause runtime errors
   function process(value: string | number) {
     return value.toUpperCase(); // Error: number doesn't have toUpperCase
   }
   
   // ✅ RIGHT: Check type before operations
   function process(value: string | number) {
     if (typeof value === 'string') {
       return value.toUpperCase();
     }
     return value.toString();
   }
   ```

Remember: Type safety is a team effort. By following these guidelines, we create code that's more robust, maintainable, and less prone to runtime errors.
