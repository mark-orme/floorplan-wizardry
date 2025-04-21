
# Geometry Engine Documentation

This document describes the Geometry Engine module, which provides comprehensive geometric calculations, transformations, and optimizations for the application.

## Overview

The Geometry Engine is a core utility module that handles all geometric operations in the application, from simple distance calculations to complex polygon manipulations. It is designed to be performant, accurate, and easy to use.

## Core Functionality

### Basic Calculations

- **Area Calculation**: Calculate the area of polygons
- **Distance Calculation**: Calculate distances between points
- **Angle Calculation**: Calculate angles between lines and points
- **Midpoint Calculation**: Calculate midpoints between points
- **Bounding Box Calculation**: Calculate bounding boxes for sets of points

### Transformations

- **Point Translation**: Move points by specified offsets
- **Point Scaling**: Scale points relative to an origin
- **Point Rotation**: Rotate points around an origin

### Path Processing

- **Path Simplification**: Reduce the number of points in a path while preserving its shape
- **Path Smoothing**: Smooth irregular paths
- **Path Optimization**: Remove redundant points from paths
- **Grid Snapping**: Snap points to a regular grid

### Unit Conversion

- **Pixels to Meters**: Convert pixel dimensions to real-world meters
- **Meters to Pixels**: Convert real-world meters to pixel dimensions
- **Area Conversion**: Convert between square pixels and square meters

## API Reference

### Calculation Functions

```typescript
/**
 * Calculate the area of a polygon in square pixels
 */
function calculateArea(points: Point[]): number;

/**
 * Calculate Gross Internal Area in square meters
 */
function calculateGIA(polygons: Polygon[]): number;

/**
 * Calculate the distance between two points
 */
function getDistance(p1: Point, p2: Point): number;

/**
 * Calculate the angle between two points
 */
function calculateAngle(p1: Point, p2: Point): number;

/**
 * Calculate the midpoint between two points
 */
function calculateMidpoint(p1: Point, p2: Point): Point;
```

### Transformation Functions

```typescript
/**
 * Translate a point by the given offsets
 */
function translatePoint(point: Point, dx: number, dy: number): Point;

/**
 * Check if a polygon is closed
 */
function isPolygonClosed(points: Point[], tolerance?: number): boolean;

/**
 * Get the bounding box of a set of points
 */
function getBoundingBox(points: Point[]): BoundingBox;
```

### Path Processing Functions

```typescript
/**
 * Simplify a path using the Ramer-Douglas-Peucker algorithm
 */
function simplifyPath(points: Point[], epsilon?: number): Point[];

/**
 * Optimize points by removing redundant ones
 */
function optimizePoints(points: Point[], tolerance?: number): Point[];

/**
 * Smooth a path using a moving average
 */
function smoothPath(points: Point[], windowSize?: number): Point[];

/**
 * Snap points to a grid
 */
function snapPointsToGrid(points: Point[], gridSize?: number): Point[];
```

### Unit Conversion Functions

```typescript
/**
 * Convert pixels to meters
 */
function pixelsToMeters(pixels: number): number;

/**
 * Convert square pixels to square meters
 */
function pixelsToSquareMeters(squarePixels: number): number;

/**
 * Convert meters to pixels
 */
function metersToPixels(meters: number): number;
```

### Formatting Functions

```typescript
/**
 * Format a distance for display
 */
function formatDisplayDistance(distance: number): string;

/**
 * Format a distance value
 */
function formatDistance(distance: number, precision?: number): string;
```

## Usage Examples

### Area Calculation

```typescript
import { calculateArea, pixelsToSquareMeters } from '@/utils/geometry/engine';

// Define a polygon
const polygon = [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 100 },
  { x: 0, y: 100 }
];

// Calculate area in square pixels
const areaInPixels = calculateArea(polygon);
console.log(`Area: ${areaInPixels} square pixels`);

// Convert to square meters
const areaInSquareMeters = pixelsToSquareMeters(areaInPixels);
console.log(`Area: ${areaInSquareMeters} m²`);
```

### Path Simplification

```typescript
import { simplifyPath } from '@/utils/geometry/engine';

// Complex path with many points
const complexPath = [/* many points */];

// Simplify the path
const simplifiedPath = simplifyPath(complexPath, 2);
console.log(`Reduced from ${complexPath.length} to ${simplifiedPath.length} points`);
```

### Grid Snapping

```typescript
import { snapPointsToGrid } from '@/utils/geometry/engine';

// Points to snap
const points = [
  { x: 103, y: 97 },
  { x: 198, y: 203 }
];

// Snap to grid (assuming GRID_SPACING = 100)
const snappedPoints = snapPointsToGrid(points);
// Result: [{ x: 100, y: 100 }, { x: 200, y: 200 }]
```

## Advanced Topics

### Polygon Validation

Before performing calculations on polygons, it's important to validate them:

```typescript
import { isPolygonClosed } from '@/utils/geometry/engine';

// Check if polygon is closed
if (!isPolygonClosed(polygon)) {
  console.warn('Polygon is not closed!');
}
```

### Performance Optimization

When working with large datasets:

1. Use `optimizePoints()` to reduce the number of points
2. Consider using Web Workers for intensive calculations
3. Implement caching for frequently accessed calculations

### Web Worker Integration

The Geometry Engine is designed to work in both the main thread and Web Workers:

```typescript
// In your worker file
import {
  perpendicularDistance,
  optimizePoints,
  snapPointsToGrid
} from '@/utils/geometry/engine';

self.addEventListener('message', (event) => {
  const { operation, points } = event.data;
  
  switch (operation) {
    case 'optimize':
      self.postMessage({
        result: optimizePoints(points),
        operation
      });
      break;
    // Handle other operations
  }
});
```

## Debugging

Debug flags can be enabled for the Geometry Engine to provide additional logging:

```typescript
// Set debug mode (typically in development environments)
window.__DEBUG_GEOMETRY_ENGINE = true;
```

## Error Handling

The Geometry Engine includes safeguards against common errors:

- Protection against empty arrays
- Handling of degenerate polygons
- Validation of input parameters

## Extending the Engine

To add new geometry functions:

1. Add the function to `src/utils/geometry/engine.ts`
2. Export the function at the bottom of the file
3. Add appropriate JSDoc comments
4. Add unit tests in the corresponding test file
5. Update this documentation
