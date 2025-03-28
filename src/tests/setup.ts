import '@testing-library/jest-dom';  // Import jest-dom for toBeInTheDocument
import { expect } from 'vitest';
import { vi } from 'vitest';

// Define a mock requestAnimationFrame timeout type
declare global {
  interface Window {
    requestAnimationFrame: (callback: FrameRequestCallback) => number;
    cancelAnimationFrame: (handle: number) => void;
  }
}

// Extend expect with jest-dom matchers
expect.extend({
  toBeInTheDocument(received) {
    const pass = Boolean(received && received.ownerDocument && received.ownerDocument.contains(received));
    if (pass) {
      return {
        message: () => `expected element not to be in the document`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected element to be in the document`,
        pass: false,
      };
    }
  }
});

// Mock for CanvasRenderingContext2D
class CanvasRenderingContext2DMock {
  canvas: HTMLCanvasElement;
  fillStyle: string = '#000000';
  strokeStyle: string = '#000000';
  lineWidth: number = 1;
  lineCap: CanvasLineCap = 'butt';
  lineJoin: CanvasLineJoin = 'miter';
  miterLimit: number = 10;
  lineDashOffset: number = 0;
  font: string = '10px sans-serif';
  textAlign: CanvasTextAlign = 'start';
  textBaseline: CanvasTextBaseline = 'alphabetic';
  direction: CanvasDirection = 'ltr';
  globalAlpha: number = 1.0;
  globalCompositeOperation: GlobalCompositeOperation = 'source-over';
  imageSmoothingEnabled: boolean = true;
  imageSmoothingQuality: ImageSmoothingQuality = 'low';
  shadowOffsetX: number = 0;
  shadowOffsetY: number = 0;
  shadowBlur: number = 0;
  shadowColor: string = '#000000';
  filter: string = 'none';
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  beginPath() {}
  closePath() {}
  moveTo(x: number, y: number) {}
  lineTo(x: number, y: number) {}
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {}
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {}
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean) {}
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {}
  ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean) {}
  rect(x: number, y: number, w: number, h: number) {}
  fill() {}
  stroke() {}
  drawImage(image: CanvasImageSource, dx: number, dy: number) {}
  fillRect(x: number, y: number, w: number, h: number) {}
  strokeRect(x: number, y: number, w: number, h: number) {}
  clearRect(x: number, y: number, w: number, h: number) {}
  getImageData(sx: number, sy: number, sw: number, sh: number) { return new ImageData(1, 1); }
  putImageData(imagedata: ImageData, dx: number, dy: number) {}
  getTransform() { return new DOMMatrix(); }
  resetTransform() {}
  rotate(angle: number) {}
  scale(x: number, y: number) {}
  translate(x: number, y: number) {}
  transform(a: number, b: number, c: number, d: number, e: number, f: number) {}
  setTransform(a: number, b: number, c: number, d: number, e: number, f: number) {}
  measureText(text: string) { return { width: 0 }; }
  createLinearGradient(x0: number, y0: number, x1: number, y1: number) {
    return {
      addColorStop: (offset: number, color: string) => {}
    };
  }
  createConicGradient(startAngle: number, x: number, y: number) {
    return {
      addColorStop: (offset: number, color: string) => {}
    };
  }
  createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number) {
    return {
      addColorStop: (offset: number, color: string) => {}
    };
  }
  createPattern(image: CanvasImageSource, repetition: string | null) { return null; }
  setLineDash(segments: number[]) {}
  getLineDash() { return []; }
  clip(path?: Path2D, fillRule?: CanvasFillRule) {}
  isPointInPath(x: number, y: number, fillRule?: CanvasFillRule) { return false; }
  isPointInStroke(x: number, y: number) { return false; }
  fillText(text: string, x: number, y: number, maxWidth?: number) {}
  strokeText(text: string, x: number, y: number, maxWidth?: number) {}
  save() {}
  restore() {}
  transferFromImageBitmap(bitmap: ImageBitmap): void {}
}

// Mock for the canvas element
class HTMLCanvasElementMock {
  width: number = 300;
  height: number = 150;
  style: Partial<CSSStyleDeclaration> = {};
  
  getContext(contextId: string): CanvasRenderingContext2D | ImageBitmapRenderingContext | null {
    if (contextId === '2d') {
      return new CanvasRenderingContext2DMock(this as unknown as HTMLCanvasElement) as unknown as CanvasRenderingContext2D;
    }
    if (contextId === 'bitmaprenderer') {
      return new ImageBitmapRenderingContextMock(this as unknown as HTMLCanvasElement) as unknown as ImageBitmapRenderingContext;
    }
    return null;
  }
}

// Mock for the ImageBitmapRenderingContext
class ImageBitmapRenderingContextMock {
  canvas: HTMLCanvasElement;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }
  
  transferFromImageBitmap(bitmap: ImageBitmap): void {}
}

// Define contextId overloads for canvas getContext
interface HTMLCanvasElementWithContexts extends HTMLCanvasElement {
  getContext(contextId: '2d', options?: CanvasRenderingContext2DSettings): CanvasRenderingContext2D | null;
  getContext(contextId: 'bitmaprenderer', options?: ImageBitmapRenderingContextSettings): ImageBitmapRenderingContext | null;
  getContext(contextId: 'webgl', options?: WebGLContextAttributes): WebGLRenderingContext | null;
  getContext(contextId: 'webgl2', options?: WebGLContextAttributes): WebGL2RenderingContext | null;
  getContext(contextId: string, options?: any): RenderingContext | null;
}

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = (callback: FrameRequestCallback): number => {
  return setTimeout(() => callback(Date.now()), 0) as unknown as number;
};

global.cancelAnimationFrame = (handle: number): void => {
  clearTimeout(handle as unknown as NodeJS.Timeout);
};

// Mock the ResizeObserver
class ResizeObserverMock {
  callback: ResizeObserverCallback;
  
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as any;

// Mock Element.getBoundingClientRect
Element.prototype.getBoundingClientRect = vi.fn(() => ({
  width: 500,
  height: 500,
  top: 0,
  left: 0,
  bottom: 500,
  right: 500,
  x: 0,
  y: 0,
  toJSON: () => ({})
}));

// Override canvas getContext with a function that handles all context types
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: function(contextId: string, options?: any): RenderingContext | null {
    if (contextId === '2d') {
      return new CanvasRenderingContext2DMock(this) as unknown as CanvasRenderingContext2D;
    } else if (contextId === 'bitmaprenderer') {
      return new ImageBitmapRenderingContextMock(this) as unknown as ImageBitmapRenderingContext;
    }
    return null;
  },
  configurable: true
});
