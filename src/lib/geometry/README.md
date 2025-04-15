
# Geometry Library

## Overview

The geometry library provides utilities for mathematical operations, geometric calculations, and spatial algorithms used throughout the application. This library is essential for drawing tools, measurement features, and layout calculations.

## Key Components

### Core Geometry Types

- **Point**: Represents a point in 2D space (x, y coordinates)
- **Line**: Defined by two Points
- **Rectangle**: Defined by origin point, width, and height
- **Polygon**: Defined by an array of Points
- **Circle**: Defined by center Point and radius

### Distance and Measurement

- **calculateDistance**: Calculate distance between two Points
- **calculateAngle**: Calculate angle between two Points or Lines
- **calculateArea**: Calculate area of Rectangle, Polygon, or Circle
- **calculatePerimeter**: Calculate perimeter of shapes

### Transformations

- **translatePoint**: Move a Point by a vector
- **rotatePoint**: Rotate a Point around an origin
- **scalePoint**: Scale a Point relative to an origin
- **transformShape**: Apply multiple transformations to a shape

### Spatial Relations

- **isPointInRectangle**: Check if a Point is inside a Rectangle
- **isPointOnLine**: Check if a Point is on a Line (within tolerance)
- **findIntersection**: Find intersection between two Lines
- **getNearestPoint**: Find nearest Point on a shape to a given Point

### Grid and Snapping

- **snapPointToGrid**: Snap a Point to the nearest grid intersection
- **snapLineToGrid**: Snap a Line to grid constraints (horizontal, vertical, 45°)
- **snapAngleToIncrement**: Snap an angle to the nearest increment (e.g., 15°)

## Usage Examples

### Basic Distance Calculation

```typescript
import { calculateDistance } from '@/lib/geometry/distance';
import { Point } from '@/types/core/Geometry';

const point1: Point = { x: 0, y: 0 };
const point2: Point = { x: 3, y: 4 };

const distance = calculateDistance(point1, point2);
// distance = 5
```

### Snapping a Point to Grid

```typescript
import { snapPointToGrid } from '@/lib/geometry/grid';
import { Point } from '@/types/core/Geometry';

const point: Point = { x: 23, y: 47 };
const gridSize = 10;

const snappedPoint = snapPointToGrid(point, gridSize);
// snappedPoint = { x: 20, y: 50 }
```

### Finding Line Intersection

```typescript
import { findIntersection } from '@/lib/geometry/intersection';
import { Line } from '@/types/core/Geometry';

const line1: Line = { start: { x: 0, y: 0 }, end: { x: 10, y: 10 } };
const line2: Line = { start: { x: 0, y: 10 }, end: { x: 10, y: 0 } };

const intersectionPoint = findIntersection(line1, line2);
// intersectionPoint = { x: 5, y: 5 }
```

## Implementation Details

The geometry library is implemented with performance in mind:

- Pure functions with no side effects
- Minimal dependencies
- Optimized calculations
- Comprehensive unit tests
- Consistent error handling

## Testing

All geometry functions have corresponding unit tests to verify correctness and handle edge cases. Tests cover:

- Basic functionality
- Edge cases (parallel lines, zero lengths, etc.)
- Numerical precision issues
- Performance benchmarks for complex operations

## Future Improvements

- Add 3D geometry support
- Implement more complex spatial algorithms (convex hull, Delaunay triangulation)
- Optimize performance for large-scale calculations
- Add support for bezier curves and splines
