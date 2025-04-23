
# Floor Plan Designer

A professional web-based architectural drawing tool built with modern technologies that aims to provide native-like drawing capabilities for creating and editing floor plans.

## 🏗 Project Overview

Floor Plan Designer is an advanced, collaborative web-based architectural drawing tool built with cutting-edge web technologies. Designed for architects, interior designers, and spatial planners, it provides a comprehensive suite of drawing and measurement tools that closely mimic native application functionality.

## ✨ Key Features

- 📏 Precise Measurement Tools
- 🖌 Professional Drawing Capabilities
- 📊 Multi-floor Support
- 🤝 Real-time Collaboration
- 📜 Comprehensive Undo/Redo Functionality
- 📱 Responsive Design
- ♿ Full Accessibility Support

## 🚀 Technology Stack

- **Frontend**: React 18 with TypeScript
- **Canvas**: Fabric.js for advanced graphics rendering
- **State Management**: React hooks and context
- **UI Components**: Shadcn/UI
- **Styling**: Tailwind CSS
- **Error Tracking**: React Error Boundary
- **Testing**: Vitest, React Testing Library

## 🏛 Architecture

The application follows a layered architecture pattern with clear separation of concerns:

### Core Layers:

1. **Domain Layer** (Core)
   - Contains business entities and logic
   - No dependencies on other layers
   - Located in `src/packages/floorplan-core`

2. **Application Layer**
   - Implements use cases using domain entities
   - Located in `src/hooks`

3. **UI Layer**
   - Presentation logic and user interaction
   - Located in `src/components`

### Key Architectural Patterns:

- **Custom Hooks**: Logic encapsulation for reusability
- **Component Composition**: Building complex UI from simple components
- **Context Providers**: Application-wide state management
- **Canvas Virtualization**: Optimized rendering for large floor plans

## 📐 Canvas & Drawing System

The application uses Fabric.js to provide a powerful yet performant canvas experience:

1. **Object Model**: All elements in a floor plan are objects with properties
2. **Layer System**: Support for multiple layers with visibility and locking
3. **Grid System**: Customizable grid with snapping capabilities
4. **Tool System**: Extensible tool architecture with support for:
   - Selection
   - Free drawing
   - Line tools
   - Shape tools
   - Wall tools
   - Text annotation

## 🧩 Component Structure

Components follow a modular organization pattern:

- **Canvas**: Core canvas components for rendering and interaction
- **Tools**: Drawing tool implementations
- **UI**: User interface components
- **Layout**: Page structure components
- **Common**: Reusable UI building blocks

## 🔄 State Management

The application uses a combination of:

1. **Local Component State**: For UI-specific state
2. **React Context**: For shared application state
3. **Custom Hooks**: For encapsulating complex state logic

Key state hooks:

- `useFloorPlanDrawing`: Core drawing functionality
- `useCanvasController`: Canvas management
- `useOptimizedFloorPlanCanvas`: Performance optimization

## 📏 Code Standards & Development Rules

### General Principles

1. **Component Size**: Keep components small and focused (<100 lines)
2. **Hooks**: Extract complex logic into custom hooks
3. **TypeScript**: Use strict TypeScript for all code
4. **Testing**: Write tests for all critical paths

### Coding Standards

1. **File Naming**:
   - React components: PascalCase.tsx
   - Hooks: camelCase.ts
   - Utilities: camelCase.ts
   - Tests: ComponentName.test.tsx

2. **Component Structure**:
   - Import statements
   - Interface definitions
   - Component implementation
   - Export statement

3. **Linting Rules**:
   - Follow ESLint configuration
   - Use Prettier for formatting
   - Support TypeScript strict mode

### API Guidelines

1. **Hook APIs**:
   - Clear input props interface
   - Return object with explicit typing
   - Document public methods

2. **Component Props**:
   - Use TypeScript interfaces
   - Provide sensible defaults
   - Document prop requirements

### Performance Guidelines

1. **Rendering Optimization**:
   - Use React.memo for expensive components
   - Implement virtualization for large lists
   - Optimize canvas rendering

2. **Canvas Performance**:
   - Use object culling for large floor plans
   - Implement tiered rendering based on zoom level
   - Offload heavy calculations to Web Workers

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
```bash
# Clone the repository
git clone https://github.com/your-organization/floor-plan-designer.git

# Navigate to project directory
cd floor-plan-designer

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

## 📚 Key Files and Directories

```
src/
├── components/         # UI components
│   ├── canvas/         # Canvas-specific components
│   ├── toolbar/        # Toolbar components
│   └── ui/             # General UI components
├── constants/          # Application constants
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
│   ├── canvas/         # Canvas-related hooks
│   └── floor-plan/     # Floor plan specific hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   ├── canvas/         # Canvas utility functions
│   └── grid/           # Grid system utilities
└── packages/           # Core domain logic
    └── floorplan-core/ # Core floor plan domain
```

## 💾 Data Model

The floor plan data model consists of:

- `FloorPlan`: Top-level container
- `Wall`: Linear elements with thickness
- `Room`: Enclosed areas defined by walls
- `Furniture`: Placeable items
- `Annotation`: Text and measurement notes

## 🔧 Tools and Features

The application provides the following tools:

1. **Selection Tool**: Select, move, resize and rotate objects
2. **Drawing Tool**: Freehand drawing with pressure sensitivity
3. **Line Tool**: Create straight lines
4. **Shape Tools**: Rectangle, circle, and other geometric shapes
5. **Wall Tool**: Create architectural walls
6. **Room Tool**: Define room areas
7. **Measurement Tool**: Take measurements of distances and areas
8. **Text Tool**: Add text annotations

## 🧪 Testing Strategy

The application follows a comprehensive testing approach:

1. **Unit Tests**: For individual functions and components
2. **Integration Tests**: For feature workflows
3. **Visual Tests**: For UI components
4. **Performance Tests**: For canvas rendering performance

## 🔄 Contribution Workflow

1. Create feature branch from `main`
2. Implement changes following code standards
3. Write tests for new functionality
4. Create pull request with detailed description
5. Pass code review and CI checks
6. Merge to `main`

## 📈 Future Roadmap

1. **Advanced Features**:
   - 3D visualization
   - Material mapping
   - Cost estimation

2. **Performance Improvements**:
   - WebAssembly for geometry calculations
   - Canvas rendering optimizations

3. **Integration Capabilities**:
   - Export to CAD formats
   - BIM integration

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
