
# Module Dependency Graph

This document outlines the module dependency structure of the Floor Plan Editor application, enforcing a clear separation of concerns and preventing cyclic dependencies.

## Core Principles

1. **Hexagonal Architecture**: Our application follows a hexagonal (ports and adapters) architecture with clear boundaries between:
   - Domain logic (core)
   - UI components
   - Infrastructure (persistence, external services)
   - Application services

2. **Dependency Direction**: Dependencies should always point inward to the domain core, never outward.

3. **Package Structure**: The application is organized into well-defined packages:
   - `@/packages/floorplan-core`: Domain logic and business rules
   - `@/packages/ui-components`: Reusable UI components
   - `@/packages/hooks`: React hooks for UI logic and state management
   - `@/packages/persistence`: Storage adapters and repositories
   - `@/packages/plugin-api`: Plugin system for extensibility

## Approved Dependencies

The following diagram shows the allowed dependencies between modules:

```
┌──────────────────┐         ┌──────────────────┐
│                  │         │                  │
│   UI Components  │ ───────▶│      Hooks       │
│                  │         │                  │
└────────┬─────────┘         └────────┬─────────┘
         │                            │
         │                            │
         │                            │
         ▼                            ▼
┌──────────────────┐         ┌──────────────────┐
│                  │         │                  │
│   Plugin API     │ ───────▶│  Floorplan Core  │
│                  │         │                  │
└────────┬─────────┘         └────────┬─────────┘
         │                            │
         │                            │
         │                            │
         ▼                            ▼
┌──────────────────┐         ┌──────────────────┐
│                  │         │                  │
│   Persistence    │ ───────▶│    Utils/Types   │
│                  │         │                  │
└──────────────────┘         └──────────────────┘
```

### Dependency Rules:

1. `floorplan-core` can only depend on primitive types and utils
2. `persistence` can only depend on `floorplan-core` and utils
3. `hooks` can depend on `floorplan-core`, `persistence`, and utils
4. `ui-components` can depend on `hooks`, `floorplan-core`, and utils
5. `plugin-api` can depend on `floorplan-core` and utils

## Enforcing the Graph

The module dependency graph is enforced through several mechanisms:

1. **ESLint Rules**: Custom ESLint rules check for prohibited import patterns.
2. **CI Validation**: Automated checks in the CI pipeline verify compliance.
3. **Code Reviews**: Reviewers should verify that new code follows the dependency rules.

## Module Responsibilities

### floorplan-core
- Domain entities (Wall, Room, FloorPlan)
- Domain services (area calculation, validation)
- Domain events
- Value objects

### persistence
- Storage adapters (LocalStorage, IndexedDB)
- Repositories for domain objects
- Data serialization/deserialization

### hooks
- UI state management
- Interaction logic
- Business logic coordination

### ui-components
- Reusable UI components
- Layout components
- Presentational components

### plugin-api
- Plugin registry
- Extension points
- Plugin interfaces and contracts

## Preventing Cyclic Dependencies

Cyclic dependencies are strictly prohibited and prevented by:

1. Using well-defined interfaces
2. Using dependency injection when needed
3. Using events for communication between modules
4. Static analysis tools to detect and prevent cycles

## Example of Correct Module Usage

Domain logic:
```typescript
// In floorplan-core
export function calculateRoomArea(room: Room): number {
  // Pure domain logic
}
```

UI usage:
```typescript
// In a UI component
import { calculateRoomArea } from '@/packages/floorplan-core';
import { useFloorPlan } from '@/packages/hooks';

function RoomInfo() {
  const { currentRoom } = useFloorPlan();
  const area = calculateRoomArea(currentRoom);
  return <div>Area: {area}m²</div>;
}
```
