
# Project Architecture

## Directory Structure

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

## Key Modules

### Canvas Management
- **Fabric.js Integration**: Custom extensions for drawing and manipulation
- **Event Handling**: Touch, mouse, and stylus event normalization
- **Object Management**: Creation, selection, and modification of canvas objects

### Data Storage and Synchronization
- **Local Storage**: IndexedDB implementation for floor plan persistence
- **Cloud Sync**: Optional Supabase integration for remote storage
- **State Management**: React context and custom hooks for application state

### UI Components
- **Drawing Tools**: Tool selection and operation implementations
- **Property Management**: CRUD operations for properties and floor plans
- **Responsive Design**: Adaptation to different screen sizes and devices

## Technology Stack

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
