
# Security Types and Documentation

This document provides an overview of the security-related types and utilities used throughout the application, with a focus on type safety and best practices.

## Content Security Policy (CSP)

The CSP module provides utilities for creating and managing Content Security Policy directives, which help protect against XSS and other injection attacks.

### Key Types

```typescript
// Valid CSP directive names
type CspDirective =
  | 'default-src'
  | 'script-src'
  | 'style-src'
  | 'img-src'
  | 'font-src'
  | 'connect-src'
  | 'frame-src'
  | 'object-src'
  | 'base-uri'
  | 'form-action'
  | 'frame-ancestors'
  | 'block-all-mixed-content'
  | 'upgrade-insecure-requests'
  | 'report-uri';

// Complete CSP configuration
type CspConfig = Record<CspDirective, string[]>;
```

### Usage Examples

```typescript
import { initializeCSP, setupCspViolationReporting } from '@/utils/security/cspUtils';

// Basic initialization
initializeCSP();

// Custom configuration
initializeCSP({
  'script-src': ["'self'", "https://trusted-scripts.example.com"],
  'connect-src': ["'self'", "https://api.example.com"]
});

// Enable violation reporting
setupCspViolationReporting('https://example.com/csp-reports');
```

## Type Safety Best Practices

### Use Explicit Type Annotations

Always use explicit type annotations for security-related code to prevent unintended behaviors:

```typescript
// Good: Explicitly typed security configuration
const securityConfig: SecurityConfig = {
  csrfEnabled: true,
  rateLimitRequests: 100,
  maxUploadSizeMb: 10
};

// Avoid: Implicit typing might miss properties
const securityConfig = {
  csrfEnabled: true
  // Missing other required properties
};
```

### Validate User Input

Always validate user input with proper type checking:

```typescript
// Good: Validate and sanitize user input
function processUserInput(input: unknown): SafeUserInput {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  return {
    value: sanitizeHtml(input),
    type: 'text',
    maxLength: input.length
  };
}

// Avoid: Assuming input type
function processUserInput(input: any): string {
  return sanitizeHtml(input); // input might not be a string
}
```

### Use Type Guards for Runtime Validation

Implement type guards to validate objects at runtime:

```typescript
// Type guard for AuditLogEntry
function isAuditLogEntry(value: unknown): value is AuditLogEntry {
  return (
    typeof value === 'object' &&
    value !== null &&
    'timestamp' in value &&
    'userId' in value &&
    'action' in value &&
    'resource' in value &&
    'status' in value
  );
}

// Usage:
function processLog(log: unknown) {
  if (isAuditLogEntry(log)) {
    // TypeScript knows log is AuditLogEntry here
    console.log(log.userId);
  }
}
```

## Extending Security Types

When extending security types, follow these guidelines:

1. **Extend enums explicitly**: Add new values to security enums with appropriate JSDoc comments
2. **Use discriminated unions**: Add type discriminators to make union types safer
3. **Provide factory functions**: Always provide factory functions for complex types
4. **Use const assertions**: Use `as const` for immutable values

Example:

```typescript
// Extending SecurityCheckCategory
export enum SecurityCheckCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  DATA_VALIDATION = 'data_validation',
  COMMUNICATION = 'communication',
  STORAGE = 'storage',
  DEPENDENCY = 'dependency',
  // New value with comment
  /** Checks related to input validation */
  INPUT_VALIDATION = 'input_validation'
}

// Using discriminated union
type SecurityEvent = 
  | { type: 'login'; userId: string; success: boolean; ipAddress: string }
  | { type: 'logout'; userId: string; sessionDuration: number }
  | { type: 'permission_change'; userId: string; permission: string; granted: boolean };

// Factory function
function createSecurityEvent(type: 'login', userId: string, success: boolean, ipAddress: string): SecurityEvent;
function createSecurityEvent(type: 'logout', userId: string, sessionDuration: number): SecurityEvent;
function createSecurityEvent(type: 'permission_change', userId: string, permission: string, granted: boolean): SecurityEvent;
function createSecurityEvent(type: any, userId: string, ...args: any[]): SecurityEvent {
  // Implementation...
}
```

## Recommended Tools

- **TypeScript ESLint**: Enable strict mode and security-specific rules
- **JSDoc with TypeScript**: Add detailed JSDoc comments with correct `@param` and `@returns` tags
- **Zod**: Use Zod for runtime validation of security-related objects

## Resources

- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Content Security Policy Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [OWASP TypeScript Secure Coding Guidelines](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Typescript_Cheatsheet.md)
