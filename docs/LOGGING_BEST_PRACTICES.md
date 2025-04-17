
# Logging Best Practices

## Overview

This project uses a structured logging system that balances information needs with performance concerns. Our logging system is designed to be:

- **Informative** in development environments
- **Minimal** in production to avoid performance degradation
- **Configurable** to enable debugging in specific areas when needed

## Logger Structure

The logging system consists of:

1. **Core Logger** (`src/utils/logger.ts`) - Main interface for all application logging
2. **Configuration** (`src/utils/logger/loggerConfig.ts`) - Controls logging levels by namespace
3. **Debug Utilities** (`src/utils/debugUtils.ts`) - Provides throttling and environment awareness
4. **Migration Helper** (`src/utils/logger/LogMigrationHelper.ts`) - Assists in identifying and fixing raw console calls

## Log Levels

We use the following log levels:

- **DEBUG** (4): Verbose information useful for development and debugging
- **INFO** (3): General information about application flow
- **WARN** (2): Warning conditions that don't cause errors but may need attention
- **ERROR** (1): Error conditions that affect functionality
- **NONE** (0): No logging

## Best Practices

### DO

- Use namespaced loggers for component/module specific logs:
  ```typescript
  import { canvasLogger } from '@/utils/logger';
  canvasLogger.info('Canvas initialized');
  ```

- Include relevant contextual data:
  ```typescript
  logger.debug('User interaction', { userId, action, timestamp });
  ```

- Use appropriate log levels:
  ```typescript
  logger.debug('Loop iteration', { index, value }); // Development-only info
  logger.info('Feature activated', { feature }); // General flow info
  logger.warn('Deprecated method used', { method, alternative }); // Warning
  logger.error('Operation failed', { operation, error }); // Error condition
  ```

### DON'T

- Avoid raw `console.log` calls - they bypass our logging controls:
  ```typescript
  // Don't do this:
  console.log('Debug info', data);
  
  // Do this instead:
  logger.debug('Debug info', data);
  ```

- Avoid logging in tight loops without throttling:
  ```typescript
  // Avoid this:
  items.forEach(item => logger.debug('Processing item', item));
  
  // Better:
  logger.debug('Processing items', { count: items.length, first: items[0] });
  ```

- Don't log sensitive information:
  ```typescript
  // Never log passwords, tokens, personal identifiable information
  logger.debug('Auth attempt', { username: user.email, password: '***REDACTED***' });
  ```

## Development Tools

To help debug in the browser console, the following globals are available:

```javascript
// Control logging
__logger.setLevel('canvas', LogLevel.DEBUG); // Enable debug logs for canvas
__logger.enable('grid', false); // Disable all grid logs
__logger.setGlobalDebug(true); // Enable all logs

// Find raw console calls
__logMigration.scanConsoleUsage();
__logMigration.generateMigrationPlan();
```

## Migrating Legacy Console Logs

Use the built-in Log Migration Helper to identify and fix raw console calls:

1. Run the scan in your development console:
   ```javascript
   __logMigration.scanConsoleUsage();
   ```

2. Interact with your application for a few seconds to capture logs

3. Generate a migration plan:
   ```javascript
   __logMigration.generateMigrationPlan();
   ```

4. Use the suggested replacements to update your code

## Performance Considerations

- In production builds, DEBUG and DEV level logs are automatically stripped by the stripLogsPlugin
- All logs support throttling to avoid spam
- Log data is processed lazily to minimize performance impact
