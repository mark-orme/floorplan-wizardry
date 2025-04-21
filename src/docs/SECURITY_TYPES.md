# Security Types Documentation

This document provides a comprehensive overview of the security typing system used throughout the application to ensure robust and consistent security implementations.

## Type Organization

Security types are organized in a hierarchical structure:

- **Base Types**: Defined in `src/types/securityTypes.ts`
- **Specialized Types**: Defined in domain-specific files in `src/types/security/`
- **Re-exports**: All types are re-exported through `src/types/security/index.ts`

## Core Security Types

### User Input Validation

```typescript
/**
 * Strict type for user input validation
 */
type SafeUserInput = {
  readonly value: string;
  readonly type: 'text' | 'html' | 'url' | 'email';
  readonly maxLength: number;
};
```

This type ensures that user input is properly validated and sanitized before use, preventing injection attacks.

### Security Configuration

```typescript
/**
 * Security configuration options
 */
interface SecurityConfig {
  readonly csrfEnabled: boolean;
  readonly rateLimitRequests: number;
  readonly rateLimitWindowMs: number;
  readonly maxUploadSizeMb: number;
  readonly allowedFileTypes: readonly string[];
  readonly allowedOrigins: readonly string[];
}
```

This interface defines application-wide security settings.

### Audit Logging

```typescript
/**
 * Audit log entry interface
 */
interface AuditLogEntry {
  id?: string;
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  status: 'success' | 'failure';
  details?: Record<string, unknown>;
  ipAddress?: string;
}
```

This interface allows tracking and logging security-relevant actions for compliance and forensic purposes.

## Domain-Specific Security Types

### Authentication Types

Located in `src/types/security/authTypes.ts`, these types handle user authentication:

- `AuthMethod`: Authentication methods (password, OAuth, etc.)
- `AuthStatus`: Authentication states
- `MfaType`: Multi-factor authentication methods
- `AuthError`: Authentication error details
- `AuthSession`: User session information
- `LoginAttempt`: Login attempt tracking

### CSRF Protection Types

Located in `src/types/security/csrfTypes.ts`, these types handle Cross-Site Request Forgery protection:

- `CsrfConfig`: Configuration for CSRF protection
- `CsrfToken`: Token data structure
- `CsrfVerificationResult`: Result of token verification
- `CsrfProtectionHandler`: Interface for CSRF protection implementation

### Content Security Policy Types

Located in `src/types/security/cspTypes.ts`, these types handle Content Security Policy:

- `CspDirective`: Valid CSP directive names
- `CspConfig`: Complete CSP configuration
- `CspReportingOptions`: Options for violation reporting
- `CspViolationReport`: Violation report structure
- `CspViolationEventData`: Violation event data

### Encryption Types

Located in `src/types/security/encryptionTypes.ts`, these types handle data encryption:

- `EncryptionAlgorithm`: Supported encryption algorithms
- `KeyType`: Encryption key types
- `KeyDerivationFunction`: Key derivation function types
- `EncryptedData`: Encrypted data structure
- `EncryptionConfig`: Encryption configuration
- `KeyPair`: Asymmetric encryption key pair
- `KeyMetadata`: Encryption key metadata

## Usage Patterns

### Importing Security Types

```typescript
// Import all security types from the central export
import {
  SafeUserInput,
  SecurityConfig,
  AuditLogEntry
} from '@/types/security';

// Or import specific domain types
import { CsrfToken, CsrfConfig } from '@/types/security/csrfTypes';
import { AuthSession, AuthStatus } from '@/types/security/authTypes';
```

### Implementing a Security Feature

```typescript
import { CsrfConfig, CsrfToken, CsrfVerificationResult } from '@/types/security/csrfTypes';

// Define configuration
const csrfConfig: CsrfConfig = {
  tokenHeaderName: 'X-CSRF-Token',
  tokenFormName: 'csrf-token',
  cookieName: 'csrf-token',
  enabled: true,
  tokenExpirationMs: 2 * 60 * 60 * 1000
};

// Generate a token
function generateToken(): CsrfToken {
  const now = Date.now();
  return {
    token: generateRandomToken(),
    createdAt: now,
    expiresAt: now + csrfConfig.tokenExpirationMs
  };
}

// Verify a token
function verifyToken(token: string): CsrfVerificationResult {
  // Implementation...
}
```

### Audit Logging Example

```typescript
import { AuditLogEntry, AuditSeverity } from '@/types/security/auditTypes';

function logSecurityEvent(action: string, userId: string, resource: string): void {
  const entry: AuditLogEntry = {
    timestamp: new Date(),
    userId,
    action,
    resource,
    status: 'success',
    ipAddress: getCurrentIpAddress()
  };
  
  // Log the entry
  auditLogger.log(entry);
}
```

## Security Check Types

```typescript
/**
 * Security check interface
 */
interface SecurityCheck {
  id: string;
  name: string;
  description: string;
  status: SecurityCheckStatus;
  details?: string;
  lastRun?: Date;
}

/**
 * Security check status
 */
type SecurityCheckStatus = 'pending' | 'passed' | 'failed' | 'warning';
```

These types are used for implementing security health checks and audits.

## Vulnerability Types

```typescript
/**
 * Vulnerability interface
 */
interface Vulnerability {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  affectedComponent?: string;
  remediation?: string;
  discoveredAt: Date;
  fixedAt?: Date;
  status: 'open' | 'fixed' | 'ignored';
}
```

Used to track and manage security vulnerabilities.

## Best Practices

### Type Safety

Always use strict typing for security-critical code:

```typescript
// Incorrect
function validateInput(input: any): boolean {
  // ...
}

// Correct
function validateInput(input: SafeUserInput): boolean {
  // ...
}
```

### Immutability

Use read-only types for security configurations:

```typescript
const securityConfig: Readonly<SecurityConfig> = {
  csrfEnabled: true,
  // Other settings...
};
```

### Validation

Implement validation for security types:

```typescript
function validateCsrfConfig(config: Partial<CsrfConfig>): CsrfConfig {
  return {
    tokenHeaderName: config.tokenHeaderName || 'X-CSRF-Token',
    tokenFormName: config.tokenFormName || 'csrf-token',
    cookieName: config.cookieName || 'csrf-token',
    enabled: config.enabled !== undefined ? config.enabled : true,
    tokenExpirationMs: config.tokenExpirationMs || 2 * 60 * 60 * 1000
  };
}
```

### Error Handling

Use dedicated error types for security failures:

```typescript
class SecurityError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'SecurityError';
  }
}

// Usage
throw new SecurityError('Invalid CSRF token', 'INVALID_CSRF');
```

## Advanced Topics

### Type Guards for Security Types

```typescript
function isAuthError(error: unknown): error is AuthError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    'message' in error &&
    typeof (error as AuthError).type === 'string' &&
    typeof (error as AuthError).message === 'string'
  );
}

// Usage
if (isAuthError(error)) {
  // Handle authentication error
}
```

### Extending Security Types

When adding new security features:

1. Define types in the appropriate domain file
2. Export from the domain file
3. Re-export through the central `index.ts`
4. Add documentation in JSDoc format
5. Update this document

## Security Type Versioning

When modifying security types:

1. Consider backward compatibility
2. Use type utilities like `Partial<T>` for flexible interfaces
3. Use union types to support old and new values
4. Document changes in JSDoc comments
