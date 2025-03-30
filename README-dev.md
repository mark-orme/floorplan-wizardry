
# FloorPlan Designer - Developer Guide

This document provides comprehensive technical details and development guidelines for the FloorPlan Designer application. It's intended for developers working on the codebase.

## Project Architecture

### Directory Structure

```
src/
├── components/     # React components
│   ├── ui/         # Reusable UI components (shadcn/ui)
│   ├── canvas/     # Canvas-related components
│   ├── properties/ # Property management components
│   └── property/   # Property detail components
├── contexts/       # React context providers
├── hooks/          # Custom React hooks
│   ├── floor-plan/ # Floor plan specific hooks
│   ├── grid/       # Grid management hooks
│   └── canvas-initialization/ # Canvas initialization hooks
├── lib/            # Core libraries and utilities
├── pages/          # Page components
├── tests/          # Test files and utilities
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
    ├── geometry/   # Geometry-related utilities
    ├── grid/       # Grid creation utilities
    └── fabric/     # Fabric.js utilities
```

### Key Modules

#### Canvas Management
- **Fabric.js Integration**: Custom extensions for drawing and manipulation
- **Event Handling**: Touch, mouse, and stylus event normalization
- **Object Management**: Creation, selection, and modification of canvas objects

#### Grid System Architecture
- **Modular Hook Design**: 
  - `useGridCreation`: Base grid creation logic
  - `useGridRetry`: Retry mechanisms for reliability
  - `useGridThrottling`: Performance optimization
  - `useGridValidation`: Input validation and preparation
  - `useGridSafety`: Error boundaries and timeout protection
  
- **Grid Creation Process**:
  1. **Validation**: Check canvas and input validity 
  2. **Throttling**: Prevent excessive grid creation operations
  3. **Creation**: Generate grid lines with proper batching
  4. **Safety**: Monitor for timeouts and prevent infinite loops
  5. **Error Recovery**: Implement fallbacks and retry mechanisms

- **Error Recovery System**:
  - Multiple fallback methods for grid creation
  - Automatic retries with exponential backoff
  - Emergency grid creation when all else fails
  - Detailed error logging and debugging information

#### Grid Utilities
The `/utils/grid` directory contains a set of specialized modules for grid management:

- `gridCreationUtils.ts`: Core functions for creating different types of grids
  - `createBasicEmergencyGrid`: Simple grid for fallback scenarios
  - `createCompleteGrid`: Full-featured grid with small and large lines
  - `createEnhancedGrid`: Extended grid with additional features
  - `validateGrid`: Validate grid existence and integrity
  - `verifyGridExists`: Quick check if grid objects exist
  - `ensureGrid`: Main grid creation function with safety checks

- `simpleGrid.ts`: Basic grid implementation
  - `createSimpleGrid`: Create a basic grid on the canvas
  - `clearGrid`: Remove grid from canvas
  - `isCanvasValidForGrid`: Validate canvas for grid creation

- `gridDiagnostics.ts`: Tools for grid debugging
  - `runGridDiagnostics`: Comprehensive grid health checks
  - `applyGridFixes`: Automatic fixes for common grid issues
  - `emergencyGridFix`: Last-resort grid repair

- `gridDebugUtils.ts`: Developer-focused grid tools
  - `dumpGridState`: Log detailed grid state information
  - `forceCreateGrid`: Force grid creation for testing

- `gridValidator.ts`: Grid validation utilities
  - `validateCanvasForGrid`: Validate canvas for grid operations
  - `validateGridObjects`: Validate grid objects integrity
  - `checkGridHealth`: Perform comprehensive grid health check

All grid utilities are exported via the `/utils/grid/index.ts` file, which provides a clean interface for importing grid-related functionality.

#### Geometry Calculations
- **Grid Operations**: Snapping, alignment, and coordinate transformation
- **Area Calculations**: Polygon area computation and unit conversion
- **Coordinate Transforms**: Conversion between screen, canvas, and real-world coordinates

#### Data Storage and Synchronization
- **Local Storage**: IndexedDB implementation for floor plan persistence
- **Cloud Sync**: Optional Supabase integration for remote storage
- **State Management**: React context and custom hooks for application state

#### UI Components
- **Drawing Tools**: Tool selection and operation implementations
- **Property Management**: CRUD operations for properties and floor plans
- **Responsive Design**: Adaptation to different screen sizes and devices

## Technology Stack Details

### Frontend
- **React 18+**: Functional components with hooks
- **TypeScript**: Strict typing for all components and utilities
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: Component library built on Radix UI primitives
- **React Query**: Data fetching and state management
- **React Router**: Navigation and routing

### Canvas
- **Fabric.js**: Canvas manipulation library
- **Custom Extensions**: Extended functionality for floor plan specific features

### Storage
- **IndexedDB**: Browser-based storage through the idb library
- **Supabase**: PostgreSQL database with real-time capabilities

### Testing
- **Vitest**: Fast testing framework compatible with Jest
- **React Testing Library**: Component testing utilities
- **JSDOM**: DOM environment for tests

## Development Guidelines

### Coding Standards

1. **TypeScript**:
   - Use strict typing with proper interfaces and type definitions
   - Never use `any` types or `@ts-ignore` directives
   - Create dedicated type files for complex interfaces
   - Prefix interfaces with 'I' (e.g., IUserData)
   - Always include explicit function return types
   - Handle all promises properly (await or .catch())
   - Use strict boolean expressions, avoiding implicit conversions

2. **React Best Practices**:
   - Use functional components with hooks
   - Implement proper memo/useMemo for performance optimization
   - Split large components into smaller, reusable ones (max 200 lines)
   - Avoid unnecessary re-renders

3. **Documentation**:
   - Use JSDoc for all functions, classes, and interfaces
   - Include examples for non-obvious implementations
   - Document complex algorithms and business rules
   - Keep documentation updated when code changes

4. **State Management**:
   - Use React Query for server state
   - Use React Context for global UI state
   - Keep local state with useState/useReducer when appropriate
   - Implement proper state initialization and cleanup

5. **Error Handling**:
   - Implement proper error boundaries
   - Log errors with appropriate context
   - Provide user-friendly error messages and recovery options
   - Catch and handle all promise rejections

### Working with the Canvas Grid System

#### Grid Architecture Overview

The application's grid system follows a layered architecture:

1. **Core Grid Creation** (`gridCreationUtils.ts`):
   - Low-level grid creation functions
   - Multiple grid types with different complexities
   - Error recovery mechanisms

2. **Grid React Integration** (`SimpleGrid.tsx`):
   - React component for grid management
   - Grid state management
   - Integration with canvas lifecycle

3. **Grid Hooks** (`useGridCreation.ts`, `useGridRetry.ts`, etc.):
   - React hooks for grid operations
   - Safety and validation logic
   - Performance optimization

4. **Grid Diagnostics** (`gridDiagnostics.ts`):
   - Tools for debugging grid issues
   - Health check utilities
   - Grid recovery functions

#### Grid Creation Process

The grid creation follows a reliable process:

1. **Canvas Validation**:
   - Check if the canvas exists and is properly initialized
   - Validate canvas dimensions

2. **Grid Creation**:
   - Create grid objects (lines) based on canvas dimensions
   - Apply proper styling and properties
   - Add grid objects to canvas

3. **Grid Validation**:
   - Verify grid objects were properly created
   - Check if grid objects exist on canvas
   - Validate grid visibility

4. **Error Recovery**:
   - Retry grid creation with backoff if initial creation fails
   - Fall back to emergency grid if standard grid fails
   - Apply automatic fixes for common grid issues

#### Working with Grid Functions

To work with the grid system, use these key functions:

- **Creating a grid**:
  ```typescript
  // Standard grid creation
  const gridObjects = createCompleteGrid(canvas);
  
  // Simple grid creation
  const simpleGrid = createSimpleGrid(canvas);
  
  // Reliable grid creation with safety checks
  const reliableGrid = ensureGrid(canvas, gridLayerRef);
  ```

- **Grid validation and debugging**:
  ```typescript
  // Check if grid exists
  const exists = verifyGridExists(canvas, gridObjects);
  
  // Validate grid integrity
  const isValid = validateGrid(canvas, gridObjects);
  
  // Debug grid state
  dumpGridState(canvas, gridObjects);
  
  // Run diagnostics
  const diagnostics = runGridDiagnostics(canvas, gridObjects);
  ```

- **Grid manipulation**:
  ```typescript
  // Clear grid
  clearGrid(canvas, gridObjects);
  
  // Reorder grid objects to back
  reorderGridObjects(canvas, gridObjects);
  
  // Fix grid issues
  const fixCount = applyGridFixes(canvas, gridObjects);
  ```

### Hook Design Patterns

1. **Composition**:
   - Compose complex hooks from simpler ones
   - Follow the single responsibility principle
   - Export individual hooks for testing

2. **Dependencies**:
   - Clearly document hook dependencies
   - Use dependency arrays correctly
   - Consider using useCallback for function dependencies

3. **Error Handling**:
   - Implement try/catch blocks where appropriate
   - Return error states from hooks
   - Use error boundaries for component-level errors

### Testing Strategy

1. **Unit Tests**:
   - Focus on utility functions and hooks
   - Test edge cases and error conditions
   - Mock external dependencies

2. **Component Tests**:
   - Test key user interactions
   - Verify correct rendering and state updates
   - Use the testing-library approach (test behavior, not implementation)

3. **Integration Tests**:
   - Test workflows across multiple components
   - Verify data flow and state management
   - Test real-world user scenarios

4. **Canvas Testing**:
   - Use the canvas mock for fabric.js operations
   - Verify proper object creation and manipulation
   - Test canvas event handling

### Common Pitfalls and Solutions

1. **Canvas Initialization**:
   - Ensure proper order of operations (canvas → grid → objects)
   - Handle resize events correctly
   - Clean up resources on unmount

2. **Grid Management**:
   - Handle race conditions during creation
   - Implement retry mechanisms for grid failures
   - Use proper state tracking for grid creation

3. **Coordinate Systems**:
   - Be aware of multiple coordinate systems (screen, canvas, grid)
   - Use appropriate transformation utilities
   - Document coordinate assumptions in functions

4. **Touch and Mouse Events**:
   - Normalize events across different input methods
   - Handle touch, mouse, and stylus inputs correctly
   - Implement proper gesture recognition

## Pull Request Process

1. **Preparation**:
   - Ensure code passes all linting rules and tests
   - Update documentation for any new features or changes
   - Include test coverage for new functionality

2. **Code Quality**:
   - Keep PRs focused on a single feature or bugfix
   - Follow the established patterns and conventions
   - Ensure proper type safety and error handling

3. **Review Process**:
   - Address all review comments
   - Re-test after making requested changes
   - Update documentation as needed

4. **Merging**:
   - Squash commits with clear commit messages
   - Ensure CI passes before merging
   - Update the changelog if applicable
