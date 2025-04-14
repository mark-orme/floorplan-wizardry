
# Shared

This directory contains shared utilities, components, and constants used across multiple features.

## Structure

- `ui/`: Shared UI components
- `lib/`: Shared library code and utilities
- `constants/`: Application-wide constants
- `types/`: Shared TypeScript type definitions

## Usage

The shared directory should only contain code that is truly shared across multiple features. Feature-specific code should be placed in the appropriate feature directory.

```tsx
import { Button, Card } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';
import { GRID_CONSTANTS } from '@/shared/constants';
```
