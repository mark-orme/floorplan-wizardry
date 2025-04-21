
/**
 * Canvas Performance Benchmark
 * 
 * Provides synthetic benchmarks for measuring canvas rendering performance
 * @module utils/performance/canvasBenchmark
 */
import { Canvas as FabricCanvas, Rect, Circle, Line, IObjectOptions } from 'fabric';
import Benchmark from 'benchmark';

/**
 * Available benchmark scenarios
 */
export type BenchmarkScenario = 
  | 'basic-shapes' 
  | 'complex-path'
  | 'many-objects'
  | 'zoom-pan'
  | 'selection'
  | 'all';

/**
 * Benchmark result data
 */
export interface BenchmarkResult {
  name: string;
  opsPerSecond: number;
  margin: number;
  sampleCount: number;
  executionTime: number;
  rme: number; // Relative margin of error
}

/**
 * Canvas benchmark configuration
 */
export interface BenchmarkConfig {
  /** Width of benchmark canvas */
  width?: number;
  /** Height of benchmark canvas */
  height?: number;
  /** Number of objects to create in many-objects test */
  objectCount?: number;
  /** Number of operations to perform in each test */
  operationsPerTest?: number;
  /** Function to call with progress updates */
  onProgress?: (progress: number, scenario: string) => void;
  /** Function to call with results */
  onResult?: (result: BenchmarkResult) => void;
}

/**
 * Run canvas performance benchmarks
 * @param scenarios - Array of scenarios to benchmark
 * @param config - Benchmark configuration
 * @returns Promise with results
 */
export async function runCanvasBenchmarks(
  scenarios: BenchmarkScenario[] | 'all' = 'all',
  config: BenchmarkConfig = {}
): Promise<BenchmarkResult[]> {
  const {
    width = 800,
    height = 600,
    objectCount = 100,
    operationsPerTest = 50,
    onProgress,
    onResult
  } = config;
  
  // Create a hidden canvas element for benchmarking
  const canvasElement = document.createElement('canvas');
  canvasElement.width = width;
  canvasElement.height = height;
  canvasElement.style.position = 'absolute';
  canvasElement.style.left = '-9999px';
  canvasElement.style.visibility = 'hidden';
  document.body.appendChild(canvasElement);
  
  // Initialize Fabric canvas
  const canvas = new FabricCanvas(canvasElement);
  
  // Determine which scenarios to run
  const scenariosToRun = scenarios === 'all' 
    ? ['basic-shapes', 'complex-path', 'many-objects', 'zoom-pan', 'selection'] 
    : scenarios;
  
  const results: BenchmarkResult[] = [];
  const suite = new Benchmark.Suite();
  
  // Add basic shapes benchmark
  if (scenariosToRun.includes('basic-shapes')) {
    suite.add('Basic Shapes Rendering', {
      defer: true,
      fn: async function(deferred: { resolve: () => void }) {
        canvas.clear();
        
        for (let i = 0; i < operationsPerTest; i++) {
          // Add a rectangle
          const rect = new Rect({
            left: Math.random() * width,
            top: Math.random() * height,
            width: 50 + Math.random() * 50,
            height: 50 + Math.random() * 50,
            fill: `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`,
          });
          canvas.add(rect);
          
          // Add a circle
          const circle = new Circle({
            left: Math.random() * width,
            top: Math.random() * height,
            radius: 25 + Math.random() * 25,
            fill: `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`,
          });
          canvas.add(circle);
          
          // Render
          canvas.renderAll();
        }
        
        deferred.resolve();
      }
    });
  }
  
  // Add many objects benchmark
  if (scenariosToRun.includes('many-objects')) {
    suite.add('Many Objects (100+)', {
      defer: true,
      fn: async function(deferred: { resolve: () => void }) {
        canvas.clear();
        
        // Create many objects
        for (let i = 0; i < objectCount; i++) {
          const shape = Math.random() > 0.5 
            ? new Rect({
                left: Math.random() * width,
                top: Math.random() * height,
                width: 10 + Math.random() * 20,
                height: 10 + Math.random() * 20,
                fill: `rgba(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, 0.5)`,
              })
            : new Circle({
                left: Math.random() * width,
                top: Math.random() * height,
                radius: 5 + Math.random() * 10,
                fill: `rgba(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, 0.5)`,
              });
          
          canvas.add(shape);
        }
        
        // Render and measure performance
        canvas.renderAll();
        deferred.resolve();
      }
    });
  }
  
  // Add zoom-pan benchmark
  if (scenariosToRun.includes('zoom-pan')) {
    suite.add('Zoom and Pan Operations', {
      defer: true,
      fn: async function(deferred: { resolve: () => void }) {
        canvas.clear();
        
        // Add some objects to have something to zoom/pan
        for (let i = 0; i < 20; i++) {
          const rect = new Rect({
            left: Math.random() * width,
            top: Math.random() * height,
            width: 50,
            height: 50,
            fill: 'blue',
          });
          canvas.add(rect);
        }
        
        // Perform zoom/pan operations
        for (let i = 0; i < operationsPerTest; i++) {
          // Zoom
          const zoomLevel = 0.8 + Math.random() * 0.5; // 0.8 to 1.3
          canvas.setZoom(zoomLevel);
          
          // Pan
          canvas.relativePan({ x: (Math.random() - 0.5) * 20, y: (Math.random() - 0.5) * 20 });
          
          // Render
          canvas.renderAll();
        }
        
        deferred.resolve();
      }
    });
  }
  
  // Add selection benchmark
  if (scenariosToRun.includes('selection')) {
    suite.add('Object Selection Operations', {
      defer: true,
      fn: async function(deferred: { resolve: () => void }) {
        canvas.clear();
        
        // Add objects for selection
        const objects: any[] = [];
        for (let i = 0; i < 50; i++) {
          const rect = new Rect({
            left: Math.random() * width,
            top: Math.random() * height,
            width: 30 + Math.random() * 40,
            height: 30 + Math.random() * 40,
            fill: 'green',
          });
          canvas.add(rect);
          objects.push(rect);
        }
        
        // Perform selection operations
        for (let i = 0; i < operationsPerTest; i++) {
          // Select random object
          const randomIndex = Math.floor(Math.random() * objects.length);
          canvas.setActiveObject(objects[randomIndex]);
          
          // Render selection
          canvas.renderAll();
          
          // Deselect
          canvas.discardActiveObject();
          canvas.renderAll();
        }
        
        deferred.resolve();
      }
    });
  }
  
  // Event handlers and result collection
  let completedTests = 0;
  
  // Add listeners
  suite
    .on('cycle', function(event: any) {
      const benchmark = event.target;
      const result: BenchmarkResult = {
        name: benchmark.name,
        opsPerSecond: benchmark.hz,
        margin: benchmark.stats.moe,
        sampleCount: benchmark.stats.sample.length,
        executionTime: benchmark.times.elapsed,
        rme: benchmark.stats.rme
      };
      
      results.push(result);
      if (onResult) {
        onResult(result);
      }
      
      completedTests++;
      if (onProgress) {
        onProgress(completedTests / scenariosToRun.length, benchmark.name);
      }
      
      console.log(String(benchmark));
    })
    .on('complete', function() {
      // Clean up
      canvas.dispose();
      document.body.removeChild(canvasElement);
    });
  
  // Run the benchmarks
  return new Promise((resolve) => {
    suite.on('complete', function() {
      resolve(results);
    });
    
    // Start the benchmark
    suite.run({ async: true });
  });
}

/**
 * Run a quick performance test and return a simple score
 * Useful for CI environments or quick checks
 */
export async function quickPerformanceCheck(): Promise<number> {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  document.body.appendChild(canvas);
  
  const fabricCanvas = new FabricCanvas(canvas);
  const startTime = performance.now();
  let score = 0;
  
  try {
    // Add 200 rectangles to the canvas
    for (let i = 0; i < 200; i++) {
      const rect = new Rect({
        left: Math.random() * 800,
        top: Math.random() * 600,
        width: 20,
        height: 20,
        fill: 'red'
      });
      fabricCanvas.add(rect);
    }
    
    // Measure render time
    const beforeRender = performance.now();
    fabricCanvas.renderAll();
    const renderTime = performance.now() - beforeRender;
    
    // Calculate score (higher is better)
    // Base score on how quickly we can render 200 objects
    // 100 = excellent (< 16ms - 60fps)
    // 50 = acceptable (< 32ms - 30fps)
    // < 50 = needs optimization
    score = Math.min(100, 1600 / renderTime);
  } finally {
    fabricCanvas.dispose();
    document.body.removeChild(canvas);
  }
  
  return Math.round(score);
}
