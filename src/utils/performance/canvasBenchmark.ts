
import { Canvas, Point, Object as FabricObject } from 'fabric';

interface BenchmarkOptions {
  iterations?: number;
  objectCount?: number;
  left?: number;
  top?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  selectable?: boolean;
  evented?: boolean;
  objectCaching?: boolean;
}

export function runCanvasBenchmark(canvas: Canvas, options: BenchmarkOptions = {}) {
  const {
    iterations = 1000,
    objectCount = 100
  } = options;

  const results = {
    totalTime: 0,
    averageFrameTime: 0,
    objectsDrawn: 0,
    framesRendered: 0
  };

  // Create fabric Point for coordinates
  const point = new Point(100, 100);

  // Run benchmark
  console.time('canvas-benchmark');
  
  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();
    
    // Add test objects
    for (let j = 0; j < objectCount; j++) {
      const circle = new FabricObject({
        left: point.x + (j * 10),
        top: point.y + (j * 10),
        radius: 5,
        fill: 'red',
        type: 'circle'
      });
      canvas.add(circle);
    }
    
    // Force render
    canvas.renderAll();
    
    const endTime = performance.now();
    results.totalTime += endTime - startTime;
    results.framesRendered++;
    results.objectsDrawn += objectCount;
  }
  
  console.timeEnd('canvas-benchmark');
  
  // Calculate averages
  results.averageFrameTime = results.totalTime / results.framesRendered;
  
  return results;
}
