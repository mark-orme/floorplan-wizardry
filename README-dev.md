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
  1. Validation: Check canvas and input validity 
  2. Throttling: Prevent excessive grid creation operations
  3. Creation: Generate grid lines with proper batching
  4. Safety: Monitor for timeouts and prevent infinite loops
  5. Error Recovery: Implement fallbacks and retry mechanisms

- **Error Recovery System**:
  - Multiple fallback methods for grid creation
  - Automatic retries with exponential backoff
  - Emergency grid creation when all else fails
  - Detailed error logging and debugging information

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
   - Avoid `any` types and `@ts-ignore` directives
   - Create dedicated type files for complex interfaces
   - Prefix interfaces with 'I' (e.g., IUserData)
   - Always include explicit function return types
   - Handle all promises properly (await or .catch())
   - Use strict boolean expressions

2. **React Best Practices**:
   - Use functional components with hooks
   - Implement proper memo/useMemo for performance optimization
   - Split large components into smaller, reusable ones
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

6. **Code Quality Enforcement**:
   - ESLint rules enforce TypeScript best practices
   - Pre-commit hooks run linting automatically via Husky
   - Prettier ensures consistent code formatting
   - Regular dependency audits with depcheck

### Working with the Canvas

#### Grid System Implementation
The application uses a modular grid system with the following characteristics:
- **Base Settings**:
  - Base grid spacing: `GRID_SIZE = 0.1` meters (10cm)
  - Large grid: 1.0 meters (100cm)
  - Pixels per meter: 100 pixels (configurable)

- **Grid Component Architecture**:
  - `useCanvasGrid`: Main hook that composes specialized grid hooks
  - `useGridCreation`: Handles the actual grid line creation
  - `useGridRetry`: Implements retry logic for reliability
  - `useGridThrottling`: Manages performance optimization
  - `useGridValidation`: Validates inputs before grid creation
  - `useGridSafety`: Provides timeouts and safety boundaries

- **Error Recovery Strategy**:
  - Multi-level fallback mechanisms
  - Automatic retry with exponential backoff
  - Emergency grid creation when normal methods fail
  - Detailed logging for debugging

#### Performance Considerations

1. **Canvas Rendering**:
   - Use object batching for large operations
   - Implement proper object caching
   - Consider offscreen rendering for complex operations

2. **State Management**:
   - Limit history states to prevent memory issues (default: 100 states)
   - Use immutable patterns for state updates
   - Implement throttling for high-frequency updates

3. **Grid Creation**:
   - Optimize grid line creation with batching
   - Use visibility toggling instead of recreation when possible
   - Implement proper cleanup to prevent memory leaks

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

### ESLint and Type Safety

The project enforces strict type safety through ESLint rules:

1. **Type Checking Rules**:
   - No explicit `any` types allowed
   - Explicit function return types required
   - No floating promises (all promises must be handled)
   - Strict boolean expressions enforced
   - No misused promises (e.g., in if conditions)

2. **Code Organization Rules**:
   - Consistent type imports required
   - Consistent type definitions (prefer interfaces)
   - No magic numbers (must use constants)
   - Explicit member accessibility modifiers

3. **Common Issues Prevented**:
   - Runtime type errors
   - Unhandled promise rejections
   - NaN and undefined propagation
   - Type mismatches in React components

4. **Running Linting Checks**:
   - `npm run lint` - Check for linting issues
   - `npm run lint:fix` - Automatically fix linting issues
   - Pre-commit hooks will run linting on staged files

### Debugging Tips

1. **Canvas Debug Mode**:
   - Enable debug mode by adding `?debug=true` to the URL
   - Use the DebugInfo component to visualize state
   - Check bounding boxes and control points with debug rendering

2. **Performance Analysis**:
   - Use the React Profiler for component performance
   - Monitor canvas rendering performance
   - Check for unnecessary re-renders and object creation

3. **Error Logging**:
   - Check browser console for detailed logging
   - Use the logger utility with appropriate categories
   - Monitor for fabric.js warnings and errors

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

## Release Process

1. **Version Bumping**:
   - Follow semantic versioning principles
   - Update version in package.json
   - Create a release tag

2. **Testing**:
   - Run the full test suite before release
   - Perform manual testing of key workflows
   - Verify browser compatibility

3. **Deployment**:
   - Build production assets
   - Deploy to staging environment first
   - Verify functionality before production deployment
