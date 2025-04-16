
# Floor Plan Editor

## Overview

An advanced floor plan editor built with React, TypeScript, and Fabric.js. This application provides a comprehensive set of drawing tools for creating architectural floor plans, measuring spaces, and collaborating in real-time.

## Features

- **Professional Drawing Tools**: Straight lines, walls, freehand drawing
- **Measurement Tools**: Real-time measurements with area calculations
- **Grid System**: Precise grid with snapping for accurate drawing
- **Multi-floor Support**: Create and manage multiple floors
- **Collaboration**: Real-time collaboration via Pusher
- **History Management**: Comprehensive undo/redo functionality
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Error Monitoring**: Integrated error logging and debugging tools

## Technology Stack

- **React**: UI components and state management
- **TypeScript**: Type-safe development
- **Fabric.js**: Canvas manipulation library
- **Shadcn/UI**: UI component library
- **Logger**: Custom logger utility for tracking application events

## Architecture

The application follows a modular architecture:

- **components/**: UI components organized by feature
- **hooks/**: Reusable React hooks for logic encapsulation
- **utils/**: Utility functions for common operations
- **features/**: Feature-specific code organized by domain
- **constants/**: Application constants and enumerations
- **types/**: TypeScript type definitions

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Key Components

### Straight Line Tool

The straight line tool allows users to draw precise straight lines on the canvas. Key features include:
- Real-time measurement display
- Grid snapping capability
- Apple Pencil and stylus support
- Line color and thickness customization

### Grid System

The grid system provides visual guides and precise measurement references:
- Small grid (0.1m) for detailed precision
- Large grid (1.0m) for primary measurements
- Toggle grid visibility
- Grid snapping for precise drawing

## Debugging and Monitoring

The application includes comprehensive logging:
- Log levels (DEBUG, INFO, WARN, ERROR)
- Timestamp-based logging
- Component-specific logging
- Event tracking for drawing operations

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
