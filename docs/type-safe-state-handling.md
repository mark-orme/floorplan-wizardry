
# Type-Safe State Handling Guidelines

## Dynamic Property Access

When accessing properties dynamically using string keys, always use proper type assertions to maintain type safety.

### Problem:

```typescript
// BAD - TypeScript error: Type 'string' cannot be used to index type 'MyState'
function updateState(state: MyState, key: string, value: any) {
  state[key] = value; // Error!
}
```

### Solution:

```typescript
// GOOD - Using proper type assertions
function updateState<T>(state: T, key: string, value: unknown) {
  // Assert the key is a valid key of T
  if (key in state) {
    const typedKey = key as keyof T;
    // Type-safe assignment using proper casting
    (state as Record<keyof T, unknown>)[typedKey] = value;
  }
}
```

## Working with Object.keys() and forEach

When iterating over object keys with `forEach`, always check that the key is a valid property and use proper type assertions.

### Problem:

```typescript
// BAD - can cause "Type 'string' is not assignable to type 'never'" errors
Object.keys(sourceObj).forEach(key => {
  targetObj[key] = sourceObj[key]; // Error!
});
```

### Solution:

```typescript
// GOOD - With proper type checking and assertions
Object.keys(sourceObj).forEach(key => {
  // Check if key exists in target object type
  if (key in targetObj) {
    const typedKey = key as keyof typeof targetObj;
    // Type-safe assignment
    targetObj[typedKey] = sourceObj[key] as typeof targetObj[typeof typedKey];
  }
});
```

## Dynamic Property Updates with Spread Operator

For state updates with React's `setState`, use type-safe patterns:

### Problem:

```typescript
// BAD - Potential type errors with dynamic keys
setState(prev => {
  return { ...prev, [dynamicKey]: newValue };
});
```

### Solution:

```typescript
// GOOD - Type-safe approach
setState(prev => {
  // Check if key is valid for this state type
  if (dynamicKey in prev) {
    const typedKey = dynamicKey as keyof typeof prev;
    return {
      ...prev,
      [typedKey]: newValue as typeof prev[typeof typedKey]
    };
  }
  return prev;
});
```

## Use Utility Functions for Common Operations

Create and use type-safe utility functions for common dynamic property operations:

```typescript
/**
 * Type-safe way to get a property value from an object using a string key
 */
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

/**
 * Type-safe way to set a property value on an object using a string key
 */
function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
  obj[key] = value;
}

/**
 * Type-safe way to check if a property exists on an object
 */
function hasProperty<T>(obj: T, key: string): key is keyof T {
  return key in obj;
}
```

## Using Type Guards for Complex Types

For complex nested objects, create type guards to ensure type safety:

```typescript
/**
 * Type guard for GridCreationState
 */
function isGridCreationState(obj: unknown): obj is GridCreationState {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'started' in obj &&
    'completed' in obj &&
    'inProgress' in obj
  );
}

// Usage
if (isGridCreationState(someObject)) {
  // TypeScript knows someObject is GridCreationState here
  console.log(someObject.started);
}
```

## ESLint Rules to Enforce Type Safety

Our ESLint configuration includes rules to enforce these practices:

```javascript
"no-restricted-syntax": [
  "error",
  {
    "selector": "MemberExpression[computed=true][property.type='Identifier'][object.type=/ObjectExpression|ArrayExpression/]",
    "message": "Use proper type assertion when accessing properties dynamically"
  },
  {
    "selector": "AssignmentExpression[left.type='MemberExpression'][left.computed=true]",
    "message": "Use proper type assertion when assigning to dynamic properties"
  }
]
```

Following these guidelines will help maintain type safety throughout the codebase.
