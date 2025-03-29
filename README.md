
# FloorPlan Designer

A powerful web-based application for creating and editing floor plans with accurate measurements and area calculations.

## 📋 Table of Contents

- [For End Users](#-for-end-users)
- [For Designers](#-for-designers)
- [For Developers](#-for-developers)
- [For Administrators](#-for-administrators)
- [Project Overview](#-project-overview)
- [Features](#-features)
- [Technical Implementation](#-technical-implementation)
- [Getting Started](#-getting-started)
- [Browser Support](#-browser-support)
- [Usage Guide](#-usage-guide)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

## 👤 For End Users

### Quick Start

1. **Access the Application**: Open the application in your web browser.
2. **Create a New Plan**: Click the "New Plan" button to start a new floor plan.
3. **Select Drawing Tools**: Use the toolbar to select different drawing tools.
4. **Save Your Work**: Your work is automatically saved as you go, but you can also export as images.

### Key Features for Users

- Draw rooms with accurate measurements
- Calculate floor areas automatically
- Create multi-floor building plans
- Export your designs as images

### Need Help?

- Check the built-in help section by clicking the "?" icon
- Visit our [User Support Portal](https://support.floorplandesigner.com)
- Email support: help@floorplandesigner.com

## 🎨 For Designers

### Design Features

- **Grid Customization**: Adjust the grid size and visibility to match your design needs.
- **Professional Measurements**: Work with industry-standard measurements and scales.
- **Area Calculations**: Get accurate area calculations for client presentations.
- **Multi-floor Design**: Create and manage multiple floors with synchronized layouts.

### Design Workflow Tips

1. Start with the building outline
2. Add interior walls and room divisions
3. Add doors and windows
4. Add fixtures and furniture
5. Calculate areas and export for presentation

### Design Standards Support

- Support for architectural scales and standards
- Customizable display options for presentations
- Exportable formats compatible with industry tools

## 💻 For Developers

### Technology Stack

- **Frontend**: React 18+ with TypeScript
- **Canvas Manipulation**: Fabric.js
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context + React Query
- **Data Storage**: IndexedDB, Supabase
- **Package Management**: npm/bun

### Development Setup

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

### Architecture Overview

The application follows a component-based architecture with:

- **Canvas Components**: Manage rendering and user interaction
- **Utility Functions**: Handle calculations and data processing
- **Custom Hooks**: Separate logic concerns
- **Context Providers**: Manage application state

For more details, please see the [Contributing Guidelines](CONTRIBUTING.md) and [Architecture Documentation](docs/architecture.md).

### Code Quality

We enforce strict code quality standards with:
- TypeScript for static type checking
- ESLint for code style and error prevention
- Automated tests for core functionality
- Husky pre-commit hooks for quality checks

## 🔧 For Administrators

### Deployment Options

- **Self-hosted**: Deploy on your own servers
- **Cloud-hosted**: Use our managed cloud service
- **Enterprise**: On-premises installation with additional security features

### User Management

- Create and manage user accounts
- Assign roles and permissions
- Monitor usage and activity

### Security Features

- End-to-end encryption for sensitive plans
- Role-based access control
- Regular security updates
- Compliance with industry standards

### Data Management

- Automated backups
- Data export/import options
- Audit logs for all changes

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

## 🔧 Technical Implementation

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

#### Grid System Architecture

The application implements a robust grid system with:

- **Modular Hook Design**: Specialized hooks for different grid functionalities
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

## 🌐 Browser Support

The application works best in modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

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

5. **Save and Export**:
   - Work is automatically saved to local storage
   - Export as PNG for sharing or printing
   - Sync with cloud storage (if enabled)

## 🤝 Contributing

Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgments

- Fabric.js for the powerful canvas manipulation library
- shadcn/ui for the beautiful UI components
- The React team for the excellent framework
