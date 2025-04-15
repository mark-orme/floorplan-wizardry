
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
- **Error Monitoring**: Integrated with Sentry for error tracking

## Technology Stack

- **React**: UI components and state management
- **TypeScript**: Type-safe development
- **Fabric.js**: Canvas manipulation library
- **Shadcn/UI**: UI component library
- **Sentry**: Error tracking and performance monitoring
- **Pusher**: Real-time updates and collaboration
- **Storybook**: Component documentation and testing

## Architecture

The application follows a modular architecture:

- **components/**: UI components organized by feature
- **hooks/**: Reusable React hooks for logic encapsulation
- **utils/**: Utility functions for common operations
- **contexts/**: React contexts for state management
- **features/**: Feature-specific code organized by domain
- **constants/**: Application constants and enumerations
- **types/**: TypeScript type definitions

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Component Documentation

Component documentation is available via Storybook:

```
npm run storybook
```

This will start the Storybook server at [http://localhost:6006](http://localhost:6006).

## Testing

The application includes comprehensive testing:

```
npm run test
```

## Monitoring and Logging

The application is integrated with Sentry for error tracking and performance monitoring. Key aspects of the application are monitored:

- Tool usage metrics
- Drawing operations
- Performance metrics
- Error tracking with detailed context

This provides valuable insights into how the application is being used and helps identify issues quickly.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
