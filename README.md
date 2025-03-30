
# FloorPlan Designer

A powerful web-based application for creating and editing floor plans with accurate measurements and area calculations.

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Technical Architecture](#-technical-architecture)
- [Getting Started](#-getting-started)
- [Usage Guide](#-usage-guide)
- [Code Structure](#-code-structure)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Project Overview

This application allows architects, designers, and homeowners to:

- Create multi-floor building plans
- Draw rooms and walls with accurate measurements
- Calculate Gross Internal Area (GIA) automatically
- Save and export floor plans as images

## ✨ Features

### Drawing Tools
- **Freehand Drawing**: Create custom shapes and annotations
- **Line Tool**: Draw precise straight lines with measurements
- **Room Creation**: Draw enclosed spaces with automatic area calculation
- **Wall Tool**: Create walls with proper thickness and connections

### Measurement & Precision
- **Advanced Grid System**: Precise 0.1m and 1.0m grid with multi-layered architecture and error recovery
- **Smart Snapping**: Objects snap to grid points for alignment
- **Real-time Measurements**: Display distances and areas as you draw
- **Scale Management**: Work in real-world measurements (meters)

### Floor Management
- **Multi-floor Support**: Create and switch between multiple floor plans
- **Floor Organization**: Name and organize floors logically
- **Copy Between Floors**: Duplicate elements across different floors

### Calculation Features
- **Area Calculation**: Automatic calculation of room areas
- **Total Floor Area**: Calculate Gross Internal Area (GIA) for each floor
- **Measurement Display**: Show dimensions on the plan

### User Experience
- **Undo/Redo**: Full history support for all drawing operations
- **Export Options**: Save your work as PNG images
- **Responsive Design**: Works on desktop and tablet devices
- **Touch & Stylus Support**: Optimized for drawing with stylus devices
- **Local Storage**: Work is automatically saved locally

## 🔧 Technical Architecture

### Core Technologies
- **React 18+** with TypeScript for the UI and application logic
- **Fabric.js** for canvas manipulation and drawing tools
- **Tailwind CSS** with shadcn/ui for responsive design components
- **IndexedDB** for local storage of floor plans
- **Supabase** for cloud storage and user authentication
- **React Query** for efficient data fetching and state management

### Architecture Overview
The application follows a component-based architecture with:

- **Canvas Components**: Handle rendering and user interaction
- **Utility Functions**: Manage geometry calculations and data processing
- **Custom Hooks**: Separate logic concerns (drawing, resizing, history, etc.)
- **Context Providers**: Manage application state and user preferences

### Grid System Architecture
The application implements a robust grid system with:

- **Modular Design**: Specialized utility functions for different grid functionalities
- **Error Recovery**: Automatic retry mechanisms and fallback grid rendering
- **Performance Optimization**: Throttling and batched operations for smooth performance
- **Safety Mechanisms**: Lock acquisition and timeout protection to prevent rendering issues

## 🚦 Getting Started

To run this project locally:

```sh
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd floorplan-designer

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 📖 Usage Guide

1. **Select a Drawing Tool**:
   - Freehand: Draw irregular shapes
   - Line: Create precise straight lines with measurements
   - Room: Draw enclosed spaces with area calculation
   - Wall: Create walls with proper thickness

2. **Use the Grid for Precision**:
   - The grid shows 0.1m intervals with darker lines at 1.0m
   - Drawing snaps to grid points for accuracy
   - Toggle grid visibility or change density as needed

3. **Create and Manage Floors**:
   - Add a new floor with the "+" button
   - Select different floors from the sidebar
   - Each floor can have its own layout and measurements

4. **View and Edit Your Plans**:
   - Use undo/redo for corrections (Ctrl+Z/Ctrl+Y)
   - Zoom in/out for detailed work
   - Pan across the canvas by holding Space and dragging
   - Check the calculated GIA in the toolbar

## 💻 Code Structure

### Directory Organization
```
src/
├── components/     # React components
│   ├── ui/         # UI components from shadcn/ui
│   ├── canvas/     # Canvas-related components
│   └── property/   # Property components
├── hooks/          # Custom React hooks
│   ├── grid/       # Grid-related hooks
│   └── canvas/     # Canvas-related hooks
├── utils/          # Utility functions
│   ├── grid/       # Grid utilities
│   ├── fabric/     # Fabric.js utilities
│   └── geometry/   # Geometry calculation utilities
├── pages/          # Page components
└── types/          # TypeScript type definitions
```

### Key Modules

#### Grid System
The grid system is implemented in `src/utils/grid/` with these key files:

- `gridCreationUtils.ts`: Core grid creation functions
- `simpleGrid.ts`: Basic grid implementation
- `gridDiagnostics.ts`: Grid debugging tools
- `gridDebugUtils.ts`: Developer tools for grid management
- `gridValidator.ts`: Validation utilities for grid integrity

The grid system provides:
- Multiple grid types (basic, complete, enhanced)
- Validation and verification mechanisms
- Error recovery with retry logic
- Diagnostic and debugging tools

#### Canvas System
The canvas system is built on Fabric.js and organized in:

- `src/hooks/canvas/`: Canvas-related hooks
- `src/utils/fabric/`: Fabric.js utility functions
- `src/components/canvas/`: Canvas React components

#### Drawing Tools
Drawing tools are implemented in:

- `src/hooks/drawing/`: Drawing-related hooks
- `src/components/canvas/`: Tool-specific components
- `src/utils/drawing/`: Drawing utility functions

## 🤝 Contributing

Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
