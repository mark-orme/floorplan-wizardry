
# FloorPlan Designer - Developer Guide

This document provides technical details and development guidelines for the FloorPlan Designer application. It's intended for developers working on the codebase.

## Project Architecture

### Directory Structure

```
src/
├── components/     # React components
│   ├── ui/         # Reusable UI components (shadcn/ui)
│   └── ...         # Application-specific components
├── hooks/          # Custom React hooks
├── pages/          # Page components 
├── tests/          # Test files
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
    ├── geometry/   # Geometry-related utilities
    └── ...         # Other utility categories
```

### Key Modules

- **Canvas Management**: Fabric.js integration for drawing and manipulation
- **Geometry Calculations**: Grid operations, area calculations, and coordinate transforms
- **Data Storage**: Local storage of floor plans using IndexedDB
- **UI Components**: Reusable components built with shadcn/ui

## Development Guidelines

### Coding Standards

1. **TypeScript**: Use proper typing, avoid `any` and `@ts-ignore`
2. **Documentation**: Use JSDoc for all functions, classes, and interfaces
3. **Constants**: Use named constants instead of magic numbers
4. **Variable Names**: Use descriptive variable names (e.g., `point` not `p`)
5. **File Size**: Keep files under 200 lines; split larger files into modules
6. **Logging**: Use the custom logger utility instead of raw console.log

### Grid System

The application uses a grid system with the following characteristics:
- Base grid spacing: `GRID_SPACING = 0.1` meters (10cm)
- Large grid: 1.0 meters (100cm)
- Pixels per meter: 100 pixels

### Performance Considerations

1. **Canvas Rendering**: Optimize object creation and manipulation
2. **History Management**: Limit history states to prevent memory issues
3. **Grid Creation**: Use skip factors and limits for large canvases

### Testing

1. **Unit Tests**: Write tests for utility functions and hooks
2. **Mock Canvas**: Use the canvas mock for testing drawing operations
3. **Run Tests**: Use `npm test` to run test suite

### Common Pitfalls

1. **Canvas Initialization**: Ensure proper order of operations
2. **Grid Creation**: Handle race conditions and high frequency creation attempts
3. **Coordinate Systems**: Be aware of pixel vs. meter conversions
4. **Touch Events**: Handle both mouse and touch/stylus inputs correctly

## Debugging Tips

1. Enable debug mode by adding `?debug=true` to the URL
2. Check browser console for detailed logging (organized by category)
3. Use the built-in DebugInfo component for real-time component state

## Pull Request Process

1. Ensure code passes all linting rules and tests
2. Update documentation for any new features or changes
3. Include test coverage for new functionality
4. Keep PRs focused on a single feature or bugfix
