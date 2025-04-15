
# Features Directory

This directory contains feature-sliced modules organized by domain.

## Structure

- `drawing/` - Drawing-related functionality
  - `components/` - UI components specific to drawing
  - `hooks/` - Custom hooks for drawing operations
  - `state/` - State management for drawing features
  - `utils/` - Utility functions for drawing

- `grid/` - Grid system functionality
  - `components/` - Grid-specific components
  - `hooks/` - Grid-related hooks
  - `utils/` - Grid utility functions

- `canvas/` - Canvas management
  - `components/` - Canvas components
  - `controllers/` - Canvas control logic
  - `hooks/` - Canvas-related hooks

## Usage Guidelines

1. Keep features isolated and independent
2. Use shared modules from `shared/` directory for cross-feature functionality
3. Export public API through index.ts files
4. Avoid circular dependencies between features

## Feature Module Design

Each feature module should:

1. Export a clear public API through the index.ts file
2. Hide implementation details within the module
3. Be self-contained with minimal dependencies on other features
4. Include comprehensive tests
5. Document its purpose and usage

## Example Feature Structure

```
features/
  drawing/
    index.ts           // Public API
    components/
      DrawingToolbar.tsx
      ColorPicker.tsx
    hooks/
      useDrawingTool.ts
      useColorSelection.ts
    state/
      drawingState.ts
    utils/
      pathCalculations.ts
    types/
      drawingTypes.ts
    README.md          // Feature documentation
```

## Adding New Features

When adding a new feature:

1. Create a new directory in the features folder
2. Design a clear public API for the feature
3. Implement the feature using the structure above
4. Document the feature's purpose and usage
5. Add tests for the feature
6. Update this README if needed
