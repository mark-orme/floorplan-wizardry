
# Property Feature

This module handles all property management functionality including:

- Property listing and details
- Property creation and editing
- Property status management

## Components

- `PropertyList` - List of properties
- `PropertyHeader` - Header for property pages
- `PropertyDetailsTab` - Tab showing property details
- `PropertyFloorPlanTab` - Tab showing property floor plans

## Hooks

- `usePropertyQuery` - Data fetching hook for properties
- `usePropertyManagement` - Hook for property CRUD operations

## Usage

Import components and hooks directly from the feature:

```tsx
import { PropertyList, usePropertyQuery } from '@/features/property';
```
