
# Floor Plan Adapter Architecture

## Overview

The Floor Plan Adapter module provides conversion utilities between different floor plan data formats used in the application. It follows a modular architecture for better maintainability and separation of concerns.

## Directory Structure

```
src/utils/floorPlanAdapter/
├── index.ts         # Re-exports all adapter functionality
├── converters.ts    # Conversion functions between app and core floor plan types
├── validators.ts    # Validation utilities for floor plan data
└── types.ts         # Type helpers and conversion utilities
```

## Key Components

### Converters (`converters.ts`)

Contains functions to convert between the application's FloorPlan type and the core FloorPlan type:

- `appToCoreFloorPlan`: Converts from app FloorPlan type to core FloorPlan type
- `coreToAppFloorPlan`: Converts from core FloorPlan type to app FloorPlan type
- `appToCoreFloorPlans`: Batch conversion for multiple floor plans
- `coreToAppFloorPlans`: Batch conversion for multiple floor plans

### Validators (`validators.ts`)

Provides validation utilities to ensure data integrity:

- `validatePoint`: Validates and ensures a point object is properly formed
- `validateTimestamp`: Validates a metadata object's timestamps
- `validateColor`: Validates and normalizes a color string

### Type Helpers (`types.ts`)

Contains type conversion and validation utilities:

- `validateStrokeType`: Validates and converts a string to a valid StrokeTypeLiteral
- `mapRoomType`: Maps a string to a valid RoomTypeLiteral
- `validateRoomType`: Maps RoomTypeLiteral to core RoomType

## Usage Examples

### Converting Floor Plans

```typescript
import { appToCoreFloorPlan, coreToAppFloorPlan } from '@/utils/floorPlanAdapter';

// Convert app floor plan to core format
const coreFloorPlan = appToCoreFloorPlan(appFloorPlan);

// Convert core floor plan to app format
const appFloorPlan = coreToAppFloorPlan(coreFloorPlan);
```

### Validating Data

```typescript
import { validatePoint, validateColor } from '@/utils/floorPlanAdapter';

// Validate a point
const validPoint = validatePoint(somePoint);

// Validate a color with a default
const validColor = validateColor(someColor, '#FFFFFF');
```

## Design Principles

1. **Modularity**: Each file has a single responsibility
2. **Type Safety**: Strong typing throughout the module
3. **Default Values**: Sensible defaults provided for missing or invalid data
4. **Validation**: Input validation to prevent runtime errors
5. **Backwards Compatibility**: Legacy code paths preserved through re-exports

## Integration with Floor Plan Types

The adapter works closely with the floor plan type definitions in:

- `src/types/core/floor-plan/` - Core floor plan types
- `src/types/floor-plan/` - Application floor plan types

These type systems are kept separate for better separation of concerns, with the adapter providing the bridge between them.
