
# Utilities

This directory contains utility functions and helpers used throughout the application.

## Structure

- `fabric/`: Utilities specifically for fabric.js canvas manipulation
- `geometry/`: Utilities for geometric calculations and operations
- `grid/`: Utilities for grid creation and management
- `security/`: Utilities for security features like CSRF protection

## Usage

Utilities should:
1. Be pure functions when possible
2. Be properly typed with TypeScript
3. Handle edge cases gracefully
4. Be documented with JSDoc comments
5. Be unit tested

When creating new utilities:
- Group related functions in appropriate subdirectories
- Export them through the relevant barrel file (index.ts)
- Keep functions small and focused
- Use meaningful function and parameter names

## Examples

```tsx
import { createCompleteGrid } from '@/utils/grid/gridRenderers';
import { calculateArea } from '@/utils/geometry/areaCalculation';
import { addCSRFToHeaders } from '@/utils/security/csrfProtection';
```
