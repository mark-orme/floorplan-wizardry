
# Features Directory

This directory contains feature-specific modules that combine multiple components, hooks, and utilities to implement complete application features.

## Current Features

### Drawing Tools

The drawing tools feature provides various tools for creating and manipulating objects on the canvas:

- Straight line tool
- Freehand drawing
- Shape creation (rectangles, circles, etc.)
- Selection and transformation

Each drawing tool is implemented using a combination of:
- Specialized hooks for state management and event handling
- UI components for tool controls
- Utility functions for calculations and transformations

### Grid System

The grid system provides visual guides and snapping functionality to assist with precise drawing:

- Grid display with customizable size and appearance
- Snap-to-grid functionality for drawing operations
- Keyboard shortcuts for toggling grid features

## Implementation Details

### Feature Structure

Each feature typically includes:

1. Core feature hooks in the `/hooks` directory
2. UI components in the `/components` directory
3. Utility functions in the `/utils` directory
4. Feature-specific types in the `/types` directory

### Adding New Features

When adding a new feature:

1. Create appropriate hooks for state and behavior
2. Create UI components for user interaction
3. Add any necessary utility functions
4. Update relevant context providers if needed
5. Add feature-specific tests

### Testing

Features should include comprehensive tests:

- Unit tests for individual hooks and utilities
- Integration tests for feature behavior
- Visual regression tests where appropriate

## Feature Roadmap

Planned feature enhancements:

- Enhanced touch and Apple Pencil support
- Layer management
- Advanced shape manipulation
- Drawing history and version control
