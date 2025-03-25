
# FloorPlan Designer

A powerful web-based application for creating and editing floor plans with accurate measurements and area calculations.

## Project Overview

This application allows architects, designers, and homeowners to:

- Create multi-floor building plans
- Draw rooms and walls with accurate measurements
- Calculate Gross Internal Area (GIA) automatically
- Save and export floor plans as images

## Features

### Drawing Tools
- **Freehand Drawing**: Create custom shapes and annotations
- **Line Tool**: Draw precise straight lines with measurements
- **Room Creation**: Draw enclosed spaces with automatic area calculation
- **Wall Tool**: Create walls with proper thickness and connections

### Measurement & Precision
- **Grid System**: Precise 0.1m and 1.0m grid for accurate measurements
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

## Technical Implementation

The application is built using:

- **React 18+** with TypeScript for the UI and application logic
- **Fabric.js** for canvas manipulation and drawing tools
- **Tailwind CSS** with shadcn/ui for responsive design components
- **IndexedDB** for local storage of floor plans
- **Supabase** for cloud storage and user authentication
- **React Query** for efficient data fetching and state management

### Architecture

The application follows a component-based architecture with:

- **Canvas Components**: Handle rendering and user interaction
- **Utility Functions**: Manage geometry calculations and data processing
- **Custom Hooks**: Separate logic concerns (drawing, resizing, history, etc.)
- **Context Providers**: Manage application state and user preferences

## Getting Started

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

## Browser Support

The application works best in modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Usage Guide

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

5. **Save and Export**:
   - Work is automatically saved to local storage
   - Export as PNG for sharing or printing
   - Sync with cloud storage (if enabled)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Fabric.js for the powerful canvas manipulation library
- shadcn/ui for the beautiful UI components
- The React team for the excellent framework
