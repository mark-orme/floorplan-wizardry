
# FloorPlan Designer

A powerful web-based application for creating and editing floor plans with accurate measurements and area calculations.

## Project Overview

This application allows architects, designers, and homeowners to:

- Create multi-floor building plans
- Draw rooms and walls with accurate measurements
- Calculate Gross Internal Area (GIA) automatically
- Save and export floor plans as images

## Features

- **Multiple Drawing Tools**: Freehand drawing, straight lines, and room creation with area calculation
- **Grid System**: Precise 0.1m and 1.0m grid for accurate measurements
- **Multi-floor Support**: Create and switch between multiple floor plans
- **Area Calculation**: Automatic calculation of room and total floor areas
- **Undo/Redo**: Full history support for all drawing operations
- **Export**: Save your work as PNG images
- **Responsive Design**: Works on desktop and tablet devices
- **Touch & Stylus Support**: Optimized for drawing with stylus devices

## Technical Implementation

The application is built using:

- **React** with TypeScript for the UI
- **Fabric.js** for canvas manipulation and drawing tools
- **Tailwind CSS** with shadcn/ui for responsive design
- **IndexedDB** for local storage of floor plans

### Architecture

The application follows a component-based architecture with:

- **Canvas Components**: Handle rendering and user interaction
- **Utility Functions**: Manage geometry calculations and data processing
- **Custom Hooks**: Separate logic concerns (drawing, resizing, history, etc.)

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

## Usage Guide

1. **Select a Drawing Tool**:
   - Freehand: Draw irregular shapes
   - Straight Line: Create precise straight lines
   - Room: Draw enclosed spaces with area calculation

2. **Draw on the Canvas**:
   - Click and drag to draw
   - For rooms, create a closed shape to calculate area

3. **Manage Floors**:
   - Add a new floor with the "+" button
   - Select different floors from the sidebar

4. **View and Edit**:
   - Use undo/redo for corrections
   - Zoom in/out for detailed work
   - Check the calculated GIA in the toolbar

5. **Save Your Work**:
   - Click the save button to export as PNG
   - Work is automatically saved to local storage

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Fabric.js for the powerful canvas manipulation library
- shadcn/ui for the beautiful UI components
