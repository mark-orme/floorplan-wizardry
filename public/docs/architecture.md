
# Floor Plan Application Architecture

## Overview

This document describes the architectural decisions and patterns used in the Floor Plan application. The application follows a hybrid pattern combining elements of Hexagonal Architecture and Clean Architecture to create clear boundaries between domain logic, UI, and external services.

## Core Principles

1. **Separation of Concerns**: Domain logic is isolated from UI and infrastructure concerns
2. **Dependency Rule**: Dependencies only point inward, with domain at the center
3. **Use Cases**: Business logic organized around specific use cases
4. **Testability**: Architecture designed for high testability at all levels

## Layered Architecture

The application is organized into the following layers:

### Domain Layer (Core)

- Contains business entities and logic
- Has no dependencies on other layers or external frameworks
- Located in `src/packages/floorplan-core`

### Application Layer

- Implements use cases using domain entities
- Coordinates between domain and infrastructure layers
- Located in `src/packages/application`

### Infrastructure Layer

- Implements interfaces defined by the domain layer
- Provides concrete implementations for persistence, rendering, etc.
- Located in `src/implementations`

### UI Layer

- Presents information to the user and handles user input
- Uses components, hooks, and contexts
- Located in `src/components` and `src/pages`

## Key Packages

- **floorplan-core**: Domain entities and business logic
- **hooks**: Custom React hooks for state management and functionality
- **ui-components**: Reusable UI components
- **implementations**: Concrete implementations of interfaces

## Canvas Virtualization

The application implements an optimized canvas rendering strategy that includes:

1. **Object Culling**: Only objects in the visible viewport are rendered
2. **Tiered Rendering**: Objects are rendered at different detail levels based on zoom
3. **Web Workers**: Heavy calculations are offloaded to separate threads

## Performance Optimizations

- **Lazy Loading**: Heavy modules are loaded on demand
- **Code Splitting**: Application is divided into smaller chunks
- **Web Workers**: CPU-intensive tasks run in separate threads
- **Canvas Optimizations**: Rendering is optimized for performance

## Security Measures

- **CSP**: Content Security Policy prevents XSS attacks
- **CSRF Protection**: All state-changing operations require CSRF tokens
- **Data Encryption**: Sensitive data is encrypted client-side before storage

## Monitoring and Metrics

- **Performance Budgets**: Clear performance targets for core metrics
- **Real User Monitoring**: Tracks actual user experience metrics
- **Automated Testing**: CI pipeline includes performance regression tests

## Module Dependency Graph

```
floorplan-core <- application <- implementations
                                       ^
                                       |
ui-components <- components <- pages   |
       ^               ^               |
       |               |               |
      hooks -----------+---------------+
```

## Build Process

- **Vite**: For fast development and optimized production builds
- **TypeScript**: For static typing and better developer experience
- **ESLint/Prettier**: For code quality and consistent formatting
- **Jest/Testing Library**: For comprehensive testing

## Future Considerations

- **Server-Side Rendering**: For improved initial load performance
- **WebAssembly**: For even faster geometry calculations
- **Offline Support**: Using Service Workers for offline functionality
