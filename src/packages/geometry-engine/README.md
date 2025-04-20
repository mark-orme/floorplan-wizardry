
# Geometry Engine

A high-performance, lightweight geometry calculation library designed for floor plan applications, CAD tools, and vector graphics operations.

## Features

- **Core Geometric Operations** - Calculate areas, perimeters, distances, and intersections
- **Polygon Optimization** - Simplify complex polygons using Ramer-Douglas-Peucker algorithm
- **Transformations** - Apply transformations to points and shapes
- **Grid Snapping** - Snap points to grid for precise drawing
- **Worker Support** - Offload calculations to Web Workers for better performance
- **TypeScript Support** - Full type definitions for all functions and interfaces

## Installation

```bash
npm install @company/geometry-engine
# or
yarn add @company/geometry-engine
```

## Basic Usage

```typescript
import { 
  calculatePolygonArea, 
  optimizePoints, 
  isPointInPolygon 
} from '@company/geometry-engine';

// Calculate area of a polygon
const points = [
  { x: 0, y: 0 },
  { x: 10, y: 0 },
  { x: 10, y: 10 },
  { x: 0, y: 10 }
];
const area = calculatePolygonArea(points); // 100

// Optimize a path with many points
const complexPath = [...]; // Array of many points
const simplifiedPath = optimizePoints(complexPath, 1.0);

// Check if a point is inside a polygon
const isInside = isPointInPolygon({ x: 5, y: 5 }, points); // true
```

## Advanced Usage with Web Workers

```typescript
import { initGeometryEngine } from '@company/geometry-engine';

// Initialize with worker support for better performance
initGeometryEngine({ useWorker: true });

// Now calculations will be offloaded to a web worker
// when possible for better UI responsiveness
```

## License

MIT
