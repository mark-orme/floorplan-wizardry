
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
