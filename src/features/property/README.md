
# Property Feature

This directory contains all components, hooks, and utilities related to property management.

## Structure

- `components/`: Property-related components
- `hooks/`: Custom hooks for property operations
- `utils/`: Property-specific utility functions
- `types/`: TypeScript type definitions for property data

## Responsibilities

- Property listing and details display
- Property creation and editing
- Property search and filtering
- Property data fetching and state management

## Usage

```tsx
import { PropertyHeader, PropertyDetailsTab, PropertyFloorPlanTab } from '@/features/property';
import { useProperty, useListProperties } from '@/features/property';
import { type Property, type PropertyStatus } from '@/features/property';
```
