
# Utilities

This directory contains utility functions and helpers used throughout the application.

## Categories

- **canvas/**: Canvas-specific utilities
- **security/**: Security-related utilities for safe rendering and validation
- **validation/**: Input validation and schema verification
- **error-handling/**: Error handling and reporting utilities

## Usage Guidelines

1. **Keep utilities pure and stateless** when possible
2. **Document with JSDoc** for better IDE integration
3. **Write unit tests** for all utilities
4. **Use TypeScript** for type safety

## Security Utilities

The application implements several security measures:

### HTML Sanitization

Use `sanitizeHtml` or `sanitizeRichHtml` to clean user input:

```tsx
import { sanitizeHtml } from '@/utils/security/htmlSanitization';

const cleanHtml = sanitizeHtml(userInput);
```

### Rate Limiting

Use the rate limiting utilities to prevent excessive operations:

```tsx
import { debounce, throttle } from '@/utils/canvas/rateLimit';

const debouncedFn = debounce(expensiveOperation, 250);
const throttledFn = throttle(frequentOperation, 50);
```

### Input Validation

Use Zod schemas with the validator service:

```tsx
import { validateWithSchema } from '@/utils/validation/validatorService';
import { userSchema } from '@/schemas/userSchema';

const result = validateWithSchema(userSchema, userData);

if (result.valid) {
  // Use validated data
} else {
  // Handle validation errors
}
```
