
/**
 * Test setup file
 * Configures the testing environment
 */
import { afterEach, vi, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

// Extend Vitest's expect with Testing Library's matchers
expect.extend(matchers);

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock canvas
class CanvasRenderingContext2DMock {
  canvas: HTMLCanvasElement;
  fillStyle: string = '#000000';
  strokeStyle: string = '#000000';
  lineWidth: number = 1;
  lineCap: string = 'butt';
  lineJoin: string = 'miter';
  miterLimit: number = 10;
  font: string = '10px sans-serif';
  textAlign: string = 'start';
  textBaseline: string = 'alphabetic';
  direction: string = 'inherit';
  imageSmoothingEnabled: boolean = true;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  // Basic drawing methods
  beginPath() {}
  closePath() {}
  moveTo(x: number, y: number) {}
  lineTo(x: number, y: number) {}
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {}
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {}
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {}
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {}
  ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {}
  rect(x: number, y: number, width: number, height: number) {}
  
  // Drawing operations
  fill() {}
  stroke() {}
  drawImage(image: CanvasImageSource, dx: number, dy: number) {}
  fillRect(x: number, y: number, width: number, height: number) {}
  strokeRect(x: number, y: number, width: number, height: number) {}
  clearRect(x: number, y: number, width: number, height: number) {}
  
  // Pixel manipulation
  createImageData(width: number, height: number): ImageData {
    return { width, height, data: new Uint8ClampedArray(width * height * 4) };
  }
  getImageData(sx: number, sy: number, sw: number, sh: number): ImageData {
    return { width: sw, height: sh, data: new Uint8ClampedArray(sw * sh * 4) };
  }
  putImageData(imagedata: ImageData, dx: number, dy: number) {}
  
  // Transformations
  scale(x: number, y: number) {}
  rotate(angle: number) {}
  translate(x: number, y: number) {}
  transform(a: number, b: number, c: number, d: number, e: number, f: number) {}
  setTransform(a: number, b: number, c: number, d: number, e: number, f: number) {}
  resetTransform() {}
  
  // Text
  fillText(text: string, x: number, y: number, maxWidth?: number) {}
  strokeText(text: string, x: number, y: number, maxWidth?: number) {}
  measureText(text: string): TextMetrics {
    return { width: text.length * 10 } as TextMetrics;
  }
  
  // Gradients and patterns
  createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient {
    return {
      addColorStop: () => {}
    };
  }
  createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient {
    return {
      addColorStop: () => {}
    };
  }
  createPattern(image: CanvasImageSource, repetition: string | null): CanvasPattern | null {
    return {
      setTransform: () => {}
    };
  }
  
  // Path methods
  clip() {}
  isPointInPath(x: number, y: number): boolean {
    return false;
  }
  isPointInStroke(x: number, y: number): boolean {
    return false;
  }
  
  // Shadow
  save() {}
  restore() {}
}

// Mock canvas element
class HTMLCanvasElementMock extends HTMLElement {
  width: number = 300;
  height: number = 150;
  
  getContext(contextId: string): CanvasRenderingContext2DMock | null {
    return new CanvasRenderingContext2DMock(this);
  }
  
  toDataURL(type?: string, quality?: any): string {
    return '';
  }
  
  toBlob(callback: (blob: Blob | null) => void, type?: string, quality?: any): void {
    callback(null);
  }
}

// Setup mocks before any tests run
beforeAll(() => {
  // Mock HTMLCanvasElement
  global.HTMLCanvasElement = HTMLCanvasElementMock as any;
  
  // Mock getContext method
  global.HTMLCanvasElement.prototype.getContext = function(contextType: string) {
    return new CanvasRenderingContext2DMock(this as any);
  };
  
  // Add extra matchers
  expect.extend({
    toHaveCanvasSize(canvas, width, height) {
      const hasWidth = canvas.width === width;
      const hasHeight = canvas.height === height;
      
      return {
        pass: hasWidth && hasHeight,
        message: () => `expected canvas to have size ${width}x${height}, but got ${canvas.width}x${canvas.height}`
      };
    }
  });
});

// Clean up mocks after all tests are done
afterAll(() => {
  // Restore any global mocks or cleanup needed
});
