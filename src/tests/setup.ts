
/**
 * Test setup file
 * Configures test environment and mocks
 */
import { afterEach, vi } from 'vitest';
import { setupExpectExtensions } from './utils/expect-extensions';

// Mock canvas global objects
class CanvasRenderingContext2DMock {
  canvas: HTMLCanvasElement;
  fillStyle: string = '#000000';
  strokeStyle: string = '#000000';
  lineWidth: number = 1;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }
  
  // Mock methods
  beginPath() {}
  closePath() {}
  moveTo(x: number, y: number) {}
  lineTo(x: number, y: number) {}
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean) {}
  fill() {}
  stroke() {}
  clearRect(x: number, y: number, width: number, height: number) {}
  fillRect(x: number, y: number, width: number, height: number) {}
  strokeRect(x: number, y: number, width: number, height: number) {}
  measureText(text: string) { return { width: text.length * 10 }; }
  fillText(text: string, x: number, y: number) {}
  setLineDash(segments: number[]) {}
  getLineDash() { return []; }
  save() {}
  restore() {}
  translate(x: number, y: number) {}
  rotate(angle: number) {}
  scale(x: number, y: number) {}
  setTransform(a: number, b: number, c: number, d: number, e: number, f: number) {}
  transform(a: number, b: number, c: number, d: number, e: number, f: number) {}
  createLinearGradient(x0: number, y0: number, x1: number, y1: number) {
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
  createImageData(width: number, height: number) {
    return { width, height, data: new Uint8ClampedArray(width * height * 4) };
  }
  getImageData(sx: number, sy: number, sw: number, sh: number) {
    return { width: sw, height: sh, data: new Uint8ClampedArray(sw * sh * 4) };
  }
  putImageData(imagedata: ImageData, dx: number, dy: number) {}
  isPointInPath(x: number, y: number) { return false; }
  isPointInStroke(x: number, y: number) { return false; }
  clip() {}
  drawImage(image: CanvasImageSource, dx: number, dy: number) {}
}

// Mock HTMLCanvasElement
class HTMLCanvasElementMock extends HTMLElement {
  width: number = 300;
  height: number = 150;
  
  constructor() {
    super();
  }
  
  getContext(contextId: string) {
    return new CanvasRenderingContext2DMock(this);
  }
  
  toDataURL(type?: string, quality?: any) {
    return 'data:image/png;base64,';
  }
  
  toBlob(callback: (blob: Blob | null) => void, type?: string, quality?: any) {
    callback(new Blob([]));
  }
}

// Mock TextMetrics
class TextMetricsMock {
  width: number = 0;
  actualBoundingBoxLeft: number = 0;
  actualBoundingBoxRight: number = 0;
  actualBoundingBoxAscent: number = 0;
  actualBoundingBoxDescent: number = 0;
  fontBoundingBoxAscent: number = 0;
  fontBoundingBoxDescent: number = 0;
  emHeightAscent: number = 0;
  emHeightDescent: number = 0;
  hangingBaseline: number = 0;
  alphabeticBaseline: number = 0;
  ideographicBaseline: number = 0;
}

// Define canvas element before tests
global.HTMLCanvasElement = HTMLCanvasElementMock as any;
global.CanvasRenderingContext2D = CanvasRenderingContext2DMock as any;
global.TextMetrics = TextMetricsMock as any;

// Mock the resize observer
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as any;

// Define requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(callback, 0);
};

global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id);
};

// Setup before all tests
setupExpectExtensions();

// Clean up after each test
afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.useRealTimers();
  
  document.body.innerHTML = '';
});
