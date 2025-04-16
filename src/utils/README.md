
# Utilities

This directory contains utility functions and helpers used throughout the application.

## Categories

- **logger**: Structured logging with timestamps and log levels
- **canvas**: Canvas-specific utilities for drawing operations
- **validation**: Input validation and schema verification
- **error-handling**: Error handling and reporting utilities

## Logger Utility

The logger utility provides structured logging with timestamps and log levels:

```typescript
import logger from '@/utils/logger';

// Available log levels
logger.debug('Detailed debug information');
logger.info('General information about system operation');
logger.warn('Warning conditions');
logger.error('Error conditions', errorObject);
```

### Log Levels

- **DEBUG**: Detailed debug information
- **INFO**: General information about system operation
- **WARN**: Warning conditions
- **ERROR**: Error conditions

### Features

- Timestamp-based logging
- Console output formatting
- Support for additional data objects
- Level-based filtering

## Usage Guidelines

1. **Keep utilities pure and stateless** when possible
2. **Document with JSDoc** for better IDE integration
3. **Write unit tests** for all utilities
4. **Use TypeScript** for type safety

## Error Handling

Use the logger for error handling:

```typescript
try {
  // Some operation
} catch (error) {
  logger.error('Failed to perform operation', error);
  // Handle error
}
```

## Canvas Utilities

Canvas utilities help with common canvas operations:

```typescript
// Example with canvas utilities
try {
  const canvas = initializeCanvas(canvasRef.current);
  logger.info('Canvas initialized');
} catch (error) {
  logger.error('Failed to initialize canvas', error);
}
```
