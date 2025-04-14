
# Constants

This directory contains constant values and enumerations used throughout the application.

## Structure

- `drawingModes.ts`: Enumerations for drawing tool modes
- `canvasConstants.ts`: Constants for canvas configuration
- `errorMessages.ts`: Standardized error messages
- `gridConstants.ts`: Constants for grid configuration

## Usage

Constants should:
1. Use TypeScript enums for related values
2. Use uppercase naming for constant variables
3. Be properly typed
4. Be documented with JSDoc comments

When creating new constants:
- Group related constants in appropriate files
- Export them through the main barrel file (index.ts)
- Consider using const enums for better performance

## Examples

```tsx
import { DrawingMode } from '@/constants/drawingModes';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
```
