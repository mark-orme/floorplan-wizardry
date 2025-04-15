
# Drawing Application Documentation

## Overview

This application is a sophisticated drawing tool built with React and Fabric.js, featuring:

- Advanced drawing tools
- Grid snapping
- Touch and stylus support (including Apple Pencil)
- Undo/redo functionality
- Layer management

## Technical Architecture

### Core Technologies

- **React**: UI framework
- **Fabric.js**: Canvas manipulation library
- **TypeScript**: Type safety and developer experience
- **Vitest**: Testing framework

### Project Structure

- `/components`: UI components
- `/hooks`: React hooks for state and behavior
- `/utils`: Utility functions
- `/contexts`: React context providers
- `/types`: TypeScript type definitions
- `/tests`: Test files
- `/features`: Feature-specific modules

## Key Features

### Drawing Tools

The application includes various drawing tools:

- **Straight Line Tool**: Draw precise lines with grid snapping and angle constraints
- **Freehand Tool**: Natural drawing with pressure sensitivity
- **Shape Tools**: Create geometric shapes

### Input Handling

The application supports multiple input methods:

- **Mouse**: Traditional mouse interaction
- **Touch**: Multi-touch support for mobile devices
- **Stylus/Apple Pencil**: Pressure-sensitive drawing with palm rejection

### Grid System

The grid system provides visual guides and precision:

- **Grid Display**: Visual grid with customizable size
- **Snap-to-Grid**: Precise positioning of drawing elements
- **Angle Constraints**: Snap to common angles (0°, 45°, 90°)

## Development Guides

### Adding New Tools

To add a new drawing tool:

1. Create tool-specific hooks in `/hooks`
2. Add UI components in `/components`
3. Register the tool in the drawing context
4. Add keyboard shortcuts if applicable
5. Implement tests in `/tests`

### Improving Touch Support

When enhancing touch and stylus support:

1. Use the `useApplePencilSupport` hook for stylus detection
2. Implement palm rejection for better drawing experience
3. Handle iOS-specific quirks using the utilities in `utils/fabric/events.ts`
4. Test on actual devices (iOS and Android)

### Code Quality Standards

Maintain high code quality by:

1. Following the existing architecture patterns
2. Writing comprehensive tests (aim for >80% coverage)
3. Using TypeScript properly with well-defined interfaces
4. Adding JSDoc comments for all public APIs
5. Keeping components and hooks focused on single responsibilities

## Performance Considerations

For optimal performance:

1. Use React.memo for frequently rendered components
2. Optimize canvas rendering with Fabric.js best practices
3. Debounce or throttle event handlers for touch/mouse events
4. Use the React profiler to identify and fix rendering bottlenecks

## Testing Strategy

The application uses a comprehensive testing approach:

1. **Unit Tests**: For individual functions and hooks
2. **Integration Tests**: For combinations of components
3. **Visual Tests**: For UI components
4. **Performance Tests**: For critical rendering paths

## Contributing

When contributing to this project:

1. Follow the existing code style and architecture
2. Write tests for new functionality
3. Document your changes with JSDoc comments
4. Create focused pull requests with clear descriptions
5. Address all code review feedback before merging
