
# Floor Plan Editor

[![CI](https://github.com/floor-plan-team/floor-plan-editor/workflows/CI/badge.svg)](https://github.com/floor-plan-team/floor-plan-editor/actions)
[![Test Coverage](https://img.shields.io/badge/coverage-80%25-brightgreen.svg)](./coverage/lcov-report/index.html)

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
- **@tanstack/react-query**: Data fetching and state management
- **Sentry**: Error tracking and monitoring

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Architecture

The application follows a modular architecture:

- **components/**: UI components organized by feature
- **hooks/**: Reusable React hooks for logic encapsulation
- **utils/**: Utility functions for common operations
- **features/**: Feature-specific code organized by domain
- **constants/**: Application constants and enumerations
- **types/**: TypeScript type definitions

For detailed architecture information, see [docs/architecture.md](docs/architecture.md).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
