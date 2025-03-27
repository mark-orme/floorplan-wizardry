
/**
 * Test setup file
 * Configures the testing environment
 */
import '@testing-library/jest-dom';

// Create a more complete mock for canvas API
class CanvasRenderingContext2DMock {
  canvas: HTMLCanvasElement;
  fillStyle: string = '#000000';
  strokeStyle: string = '#000000';
  lineWidth: number = 1;
  font: string = '10px sans-serif';
  textAlign: CanvasTextAlign = 'start';
  textBaseline: CanvasTextBaseline = 'alphabetic';
  lineCap: CanvasLineCap = 'butt';
  lineJoin: CanvasLineJoin = 'miter';
  miterLimit: number = 10;
  shadowBlur: number = 0;
  shadowColor: string = 'rgba(0, 0, 0, 0)';
  shadowOffsetX: number = 0;
  shadowOffsetY: number = 0;
  globalAlpha: number = 1;
  globalCompositeOperation: GlobalCompositeOperation = 'source-over';
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }
  
  beginPath() { return this; }
  closePath() { return this; }
  moveTo(x: number, y: number) { return this; }
  lineTo(x: number, y: number) { return this; }
  stroke() { return this; }
  fill() { return this; }
  rect(x: number, y: number, width: number, height: number) { return this; }
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean) { return this; }
  clearRect(x: number, y: number, width: number, height: number) { return this; }
  fillRect(x: number, y: number, width: number, height: number) { return this; }
  strokeRect(x: number, y: number, width: number, height: number) { return this; }
  fillText(text: string, x: number, y: number, maxWidth?: number) { return this; }
  strokeText(text: string, x: number, y: number, maxWidth?: number) { return this; }
  measureText(text: string) { return { width: text.length * 5, height: 10 }; }
  getImageData(sx: number, sy: number, sw: number, sh: number) { 
    return { data: new Uint8ClampedArray(sw * sh * 4) };
  }
  putImageData(imagedata: ImageData, dx: number, dy: number) { return this; }
  drawImage(image: CanvasImageSource, dx: number, dy: number) { return this; }
  clip() { return this; }
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) { return this; }
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) { return this; }
  save() { return this; }
  restore() { return this; }
  scale(x: number, y: number) { return this; }
  rotate(angle: number) { return this; }
  translate(x: number, y: number) { return this; }
  transform(a: number, b: number, c: number, d: number, e: number, f: number) { return this; }
  setTransform(a: number, b: number, c: number, d: number, e: number, f: number) { return this; }
  resetTransform() { return this; }
  createLinearGradient(x0: number, y0: number, x1: number, y1: number) { 
    return { addColorStop: (offset: number, color: string) => {} };
  }
  createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number) { 
    return { addColorStop: (offset: number, color: string) => {} };
  }
  createPattern(image: CanvasImageSource, repetition: string | null) { return null; }
  isPointInPath(x: number, y: number) { return false; }
  isPointInStroke(x: number, y: number) { return false; }
  setLineDash(segments: number[]) {}
  getLineDash() { return []; }
  
  // Additional methods needed for CanvasRenderingContext2D
  createImageData(width: number, height: number): ImageData {
    return new ImageData(width, height);
  }
  getContextAttributes() { return {}; }
  createConicGradient(startAngle: number, x: number, y: number) {
    return { addColorStop: (offset: number, color: string) => {} };
  }
  
  // Mock for new methods in the Canvas API
  get filter() { return 'none'; }
  set filter(value: string) {}
}

// Extend the mock prototype with any missing methods
Object.defineProperty(global.HTMLCanvasElement.prototype, 'getContext', {
  value: function(contextType: string) {
    if (contextType === '2d') {
      return new CanvasRenderingContext2DMock(this) as unknown as CanvasRenderingContext2D;
    }
    return null;
  }
});

// Add global.expect for Jest matchers
(global as any).expect = expect;

// Set up global matchers for Jest
if (typeof expect !== 'undefined') {
  expect.extend({
    toBeInTheDocument(received) {
      const pass = Boolean(received);
      return {
        message: () => `expected ${received} to be in the document`,
        pass
      };
    }
  });
}
