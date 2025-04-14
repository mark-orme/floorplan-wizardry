
# TypeScript Security & Validation Best Practices

## Core Security Rules

1. **Never trust external input** - Validate and sanitize all data coming from:
   - User inputs (forms, file uploads)
   - URL parameters and query strings
   - API responses
   - Local storage
   - WebSocket messages

2. **Type safety is security** - Leverage TypeScript's type system as a first line of defense:
   - Use strict typing with explicit interfaces
   - Avoid using `any` type
   - Create proper union types for state
   - Use type guards when narrowing types

3. **Consistent validation pipeline** - Always follow these steps:
   - Sanitize raw input first
   - Validate structure and content with Zod
   - Apply business logic validation
   - Handle errors gracefully with descriptive messages

## Request Security

### Fetch Operations

```typescript
// CORRECT: Use secureFetch instead of regular fetch
import { secureFetch } from '@/utils/security/httpSecurity';

// Type-safe secure fetch with proper error handling
const data = await secureFetch<UserData>('/api/users', {
  method: 'POST',
  body: JSON.stringify(payload)
});
```

### Credential Handling

```typescript
// CORRECT: Use proper RequestCredentials type
const options: RequestInit = {
  credentials: 'include' as RequestCredentials,
  // ...other options
};

// INCORRECT: String literal without type assertion
const options = {
  credentials: 'include', // Type error - not assignable to RequestCredentials
  // ...other options
};
```

## Validation with Zod

### Form Validation

```typescript
// CORRECT: Create and use Zod schemas for form validation
const userSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(['admin', 'user', 'guest'])
});

// Validate with pre-built validation utility
const result = validateAndSanitize(userSchema, formData);
```

### URL Parameter Validation

```typescript
// CORRECT: Validate URL parameters
const idSchema = z.string().uuid();
const id = validateRequestData(idSchema, params.id);

if (!id) {
  // Handle invalid ID
  return null;
}
```

## Content Sanitization

```typescript
// CORRECT: Always sanitize HTML content
import { sanitizeHtml } from '@/utils/security/inputSanitization';

// Sanitize potentially dangerous HTML
const safeContent = sanitizeHtml(userProvidedHtml);
```

## Common Type Problems and Solutions

### Headers Handling

```typescript
// CORRECT: Normalize headers to a consistent type
function normalizeHeaders(headers: HeadersInit | Record<string, string>): Headers {
  const result = new Headers();
  
  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      result.append(key, value);
    });
  } else if (Array.isArray(headers)) {
    headers.forEach(([key, value]) => {
      result.append(key, value);
    });
  } else {
    Object.entries(headers).forEach(([key, value]) => {
      result.append(key, value);
    });
  }
  
  return result;
}
```

### API Response Handling

```typescript
// CORRECT: Type-safe API response handling
async function fetchData<T>(url: string): Promise<T | null> {
  try {
    const response = await secureFetch(url);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    
    // Parse and validate the response data
    const data = await response.json();
    const schema = getSchemaForType<T>();
    const result = validateAndSanitize(schema, data);
    
    return result.success ? result.data : null;
  } catch (error) {
    console.error('API error:', error);
    return null;
  }
}
```

## Zod Transform Pitfalls

When using multiple transforms on a Zod schema, avoid chaining them directly as it can lead to type mismatches. Instead:

```typescript
// CORRECT: Apply a single transform that handles multiple operations
const safeUrlSchema = z.string()
  .url()
  .transform(url => {
    // First sanitize
    const sanitized = sanitizeHtml(url);
    // Then perform any additional processing
    return new URL(sanitized).toString();
  });

// INCORRECT: Chaining transforms can lead to type issues
const problematicSchema = z.string()
  .transform(sanitizeHtml)
  .transform(url => new URL(url).toString());
```

### Best Practices for Zod Transforms

1. **Combine multiple operations in a single transform** to avoid nested ZodEffects types
   ```typescript
   // Good: Single transform with multiple operations
   z.string().transform(val => {
     const sanitized = sanitizeHtml(val);
     return sanitized.toUpperCase();
   });
   ```

2. **Be careful with return type annotations** - ensure they match the actual transformation chain
   ```typescript
   // Make sure the function's return type matches the actual schema being returned
   function createCustomSchema(): z.ZodEffects<z.ZodString, string, string> {
     return z.string().transform(val => val.trim());
   }
   ```

3. **Use type assertions when necessary** - sometimes explicit typing helps TypeScript understand your intentions
   ```typescript
   const schema = z.string().transform(val => parseInt(val, 10)) as z.ZodEffects<z.ZodString, number, string>;
   ```

4. **Avoid refinements after transforms** - this can lead to type confusion, instead:
   ```typescript
   // Good: Do validation and refinement before the transform
   z.string()
     .url()
     .refine(isValidUrl)
     .transform(sanitizeHtml);
   
   // Better: Combine validation and transformation in one step
   z.string().transform(val => {
     if (!isValidUrl(val)) throw new Error("Invalid URL");
     return sanitizeHtml(val);
   });
   ```

5. **Be cautious with `.url()`** - Zod's `.url()` method is a refinement that returns a ZodString. When you add a transform after it, you get nested ZodEffects types that can cause type errors:
   ```typescript
   // Problematic pattern that causes nested ZodEffects:
   z.string().url().transform(sanitizeHtml);
   
   // Better approach - handle URL validation within the transform:
   z.string().transform(val => {
     try {
       new URL(val); // Validate URL
       return sanitizeHtml(val);
     } catch {
       throw new Error("Invalid URL");
     }
   });
   ```

Remember: Security is a continuous process. Always validate and sanitize at every trusted boundary in your application.
