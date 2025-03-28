
/**
 * Test setup file
 * Configures the test environment for all tests
 * @module tests/setup
 */
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock canvas and context
class CanvasRenderingContext2DMock {
  // Basic properties
  canvas: HTMLCanvasElement;
  fillStyle: string = '#000000';
  strokeStyle: string = '#000000';
  lineWidth: number = 1;
  lineCap: CanvasLineCap = 'butt';
  lineJoin: CanvasLineJoin = 'miter';
  miterLimit: number = 10;
  font: string = '10px sans-serif';
  textAlign: CanvasTextAlign = 'start';
  textBaseline: CanvasTextBaseline = 'alphabetic';
  direction: CanvasDirection = 'ltr';
  globalAlpha: number = 1;
  globalCompositeOperation: string = 'source-over';
  imageSmoothingEnabled: boolean = true;
  imageSmoothingQuality: ImageSmoothingQuality = 'low';
  shadowBlur: number = 0;
  shadowColor: string = '#000000';
  shadowOffsetX: number = 0;
  shadowOffsetY: number = 0;
  
  // Track calls for testing
  fillRectCalls: any[] = [];
  clearRectCalls: any[] = [];
  strokeRectCalls: any[] = [];
  beginPathCalls: any[] = [];
  moveToCalLs: any[] = [];
  lineToCalLs: any[] = [];
  arcCalLs: any[] = [];
  fillCalLs: any[] = [];
  strokeCalLs: any[] = [];
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }
  
  // Path methods
  beginPath() { this.beginPathCalls.push([]); }
  closePath() {}
  moveTo(x: number, y: number) { this.moveToCalLs.push([x, y]); }
  lineTo(x: number, y: number) { this.lineToCalLs.push([x, y]); }
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {}
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {}
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {
    this.arcCalLs.push([x, y, radius, startAngle, endAngle, anticlockwise]);
  }
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {}
  ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {}
  rect(x: number, y: number, width: number, height: number) {}
  
  // Drawing methods
  fill() { this.fillCalLs.push([]); }
  stroke() { this.strokeCalLs.push([]); }
  drawFocusIfNeeded(element: Element) {}
  scrollPathIntoView() {}
  clip() {}
  isPointInPath(x: number, y: number) { return false; }
  isPointInStroke(x: number, y: number) { return false; }
  
  // Rectangle methods
  clearRect(x: number, y: number, width: number, height: number) {
    this.clearRectCalls.push([x, y, width, height]);
  }
  fillRect(x: number, y: number, width: number, height: number) {
    this.fillRectCalls.push([x, y, width, height]);
  }
  strokeRect(x: number, y: number, width: number, height: number) {
    this.strokeRectCalls.push([x, y, width, height]);
  }
  
  // Text methods
  fillText(text: string, x: number, y: number, maxWidth?: number) {}
  strokeText(text: string, x: number, y: number, maxWidth?: number) {}
  measureText(text: string) { return { width: text.length * 10 } as TextMetrics; }
  
  // Image methods
  drawImage(image: CanvasImageSource, dx: number, dy: number): void;
  drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void;
  drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
  drawImage() {}
  
  // Transformations
  getTransform() { return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 } as DOMMatrix; }
  rotate(angle: number) {}
  scale(x: number, y: number) {}
  translate(x: number, y: number) {}
  transform(a: number, b: number, c: number, d: number, e: number, f: number) {}
  setTransform(a: number, b: number, c: number, d: number, e: number, f: number) {}
  resetTransform() {}
  
  // Additional methods
  save() {}
  restore() {}
  
  // Add missing methods
  createLinearGradient(x0: number, y0: number, x1: number, y1: number) {
    return { addColorStop: () => {} } as CanvasGradient;
  }
  
  createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number) {
    return { addColorStop: () => {} } as CanvasGradient;
  }
  
  createPattern(image: CanvasImageSource, repetition: string | null) {
    return {} as CanvasPattern;
  }
  
  createImageData(width: number, height: number) {
    return { width, height, data: new Uint8ClampedArray(width * height * 4) } as ImageData;
  }
  
  getImageData(sx: number, sy: number, sw: number, sh: number) {
    return this.createImageData(sw, sh);
  }
  
  putImageData(imagedata: ImageData, dx: number, dy: number) {}
  
  getContextAttributes() {
    return {
      alpha: true,
      desynchronized: false,
      colorSpace: 'srgb',
      willReadFrequently: false
    } as CanvasRenderingContext2DSettings;
  }
  
  createConicGradient(startAngle: number, x: number, y: number) {
    return { addColorStop: () => {} } as CanvasGradient;
  }
}

// Mock HTMLCanvasElement
HTMLCanvasElement.prototype.getContext = function(contextType: string) {
  if (contextType === '2d') {
    return new CanvasRenderingContext2DMock(this);
  }
  return null;
} as any;

// Add a global expect for testing
(globalThis as any).expect = vi.expect;

// Mock Fabric.js
vi.mock('fabric', () => {
  return {
    Canvas: vi.fn().mockImplementation(() => ({
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn(),
      getObjects: vi.fn().mockReturnValue([]),
      setActiveObject: vi.fn(),
      getActiveObject: vi.fn(),
      renderAll: vi.fn(),
      getZoom: vi.fn().mockReturnValue(1),
      setZoom: vi.fn(),
      dispose: vi.fn(),
      isDrawingMode: false,
      freeDrawingBrush: {
        color: '#000000',
        width: 1
      },
      on: vi.fn(),
      off: vi.fn(),
      fire: vi.fn(),
      getWidth: vi.fn().mockReturnValue(800),
      getHeight: vi.fn().mockReturnValue(600),
      viewportTransform: [1, 0, 0, 1, 0, 0],
      setViewportTransform: vi.fn(),
      requestRenderAll: vi.fn(),
      clear: vi.fn(),
      _objects: []
    })),
    Object: vi.fn().mockImplementation(() => ({
      set: vi.fn(),
      setCoords: vi.fn()
    })),
    Line: vi.fn().mockImplementation((points, options) => ({
      type: 'line',
      points,
      ...options,
      setCoords: vi.fn(),
      set: vi.fn()
    })),
    Path: vi.fn().mockImplementation((path, options) => ({
      type: 'path',
      path,
      ...options,
      setCoords: vi.fn(),
      set: vi.fn()
    })),
    Text: vi.fn().mockImplementation((text, options) => ({
      type: 'text',
      text,
      ...options,
      setCoords: vi.fn(),
      set: vi.fn()
    }))
  };
});
