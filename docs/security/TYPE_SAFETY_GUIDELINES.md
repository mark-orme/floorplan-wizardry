
# Security Type Safety Guidelines

This document provides best practices for maintaining type safety in security-critical code.

## Core Principles

1. **Explicit is better than implicit**: Always use explicit type annotations
2. **No `any` types in security code**: Avoid `any` in security-related code
3. **Validate runtime data**: Don't assume external data matches expected types
4. **Document security types**: Add JSDoc comments to all security types
5. **Use strict type checking**: Enable all strict TypeScript options

## Type Safety in Security Features

### Use Type Guards for Runtime Validation

```typescript
// Type guard for user input validation
function isValidUserInput(input: unknown): input is { username: string; password: string } {
  return (
    typeof input === 'object' &&
    input !== null &&
    'username' in input &&
    'password' in input &&
    typeof input.username === 'string' &&
    typeof input.password === 'string'
  );
}

// Usage:
function processLogin(input: unknown) {
  if (!isValidUserInput(input)) {
    throw new Error('Invalid login data');
  }
  
  // TypeScript now knows input has username and password properties
  authenticate(input.username, input.password);
}
```

### Never Trust External Data

```typescript
// Bad: Assuming data structure
function processCspReport(report: any) {
  logViolation(report.documentUri, report.blockedUri);
}

// Good: Validate structure first
function processCspReport(report: unknown) {
  if (
    typeof report === 'object' && 
    report !== null &&
    'documentUri' in report &&
    'blockedUri' in report
  ) {
    logViolation(
      String(report.documentUri),
      String(report.blockedUri)
    );
  } else {
    logError('Invalid CSP report format');
  }
}
```

### Use Discriminated Unions for Security Events

```typescript
// Define specific event types with discriminator
type SecurityEvent =
  | { type: 'login'; userId: string; success: boolean; ip: string }
  | { type: 'permission_change'; userId: string; permission: string; granted: boolean }
  | { type: 'data_access'; userId: string; resource: string; action: 'read' | 'write' | 'delete' };

// Safe handling with exhaustiveness checking
function handleSecurityEvent(event: SecurityEvent) {
  switch (event.type) {
    case 'login':
      // Handle login event
      logLoginAttempt(event.userId, event.success, event.ip);
      break;
    case 'permission_change':
      // Handle permission change
      updatePermissionLog(event.userId, event.permission, event.granted);
      break;
    case 'data_access':
      // Handle data access
      auditDataAccess(event.userId, event.resource, event.action);
      break;
    default:
      // Exhaustiveness checking
      const _exhaustiveCheck: never = event;
      throw new Error(`Unhandled event type: ${(_exhaustiveCheck as any).type}`);
  }
}
```

### Avoid Type Assertions in Security Code

```typescript
// Bad: Type assertion
const userData = untrustedInput as UserData;

// Good: Proper validation
function validateUserData(input: unknown): UserData {
  // Perform validation
  if (!isValidUserData(input)) {
    throw new Error('Invalid user data');
  }
  return input;
}
```

## Configuration Management

### Type-Safe Configuration

```typescript
// Define allowed configuration values
interface SecurityConfig {
  csrfProtection: 'lax' | 'strict' | 'disabled';
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordRequirements: {
    minLength: number;
    requireSpecialChars: boolean;
    requireNumbers: boolean;
  };
}

// Validate configuration
function validateSecurityConfig(config: unknown): SecurityConfig {
  // Implement validation logic
  if (!isValidSecurityConfig(config)) {
    throw new Error('Invalid security configuration');
  }
  return config;
}
```

## Error Handling

### Type-Safe Error Handling

```typescript
// Define specific security error types
class SecurityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SecurityError';
  }
}

class AuthenticationError extends SecurityError {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

class AuthorizationError extends SecurityError {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

// Type guard for security errors
function isSecurityError(error: unknown): error is SecurityError {
  return error instanceof SecurityError;
}

// Safe error handling
try {
  // Security-sensitive operation
} catch (error: unknown) {
  if (error instanceof AuthenticationError) {
    // Handle authentication errors
  } else if (error instanceof AuthorizationError) {
    // Handle authorization errors
  } else if (isSecurityError(error)) {
    // Handle other security errors
  } else {
    // Handle unknown errors
  }
}
```

## ESLint Rules for Security Type Safety

We recommend configuring ESLint with these rules for security-critical code:

```json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/restrict-template-expressions": "error",
    "@typescript-eslint/strict-boolean-expressions": "error"
  }
}
```

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [OWASP TypeScript Security Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Typescript_Cheatsheet.html)
- [Security-focused TypeScript ESLint Rules](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin)
