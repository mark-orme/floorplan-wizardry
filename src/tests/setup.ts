
/**
 * Vitest setup file
 * @module tests/setup
 */

// This file will run before each test file
// Add any global setup code here

// Setup for Canvas API if needed (for jsdom)
if (typeof window !== 'undefined') {
  // Mock canvas methods that jsdom doesn't implement
  if (!HTMLCanvasElement.prototype.getContext) {
    // We need to use type assertion here to satisfy TypeScript's strict typing
    HTMLCanvasElement.prototype.getContext = function(
      contextId: string, 
      options?: any
    ) {
      // Mock 2d context
      if (contextId === '2d') {
        // Create a partial implementation that satisfies TypeScript
        const ctx = {
          canvas: this,
          getContextAttributes: () => ({}),
          globalAlpha: 1.0,
          globalCompositeOperation: 'source-over',
          fillStyle: '#000000',
          strokeStyle: '#000000',
          lineWidth: 1,
          lineCap: 'butt',
          lineJoin: 'miter',
          miterLimit: 10,
          lineDashOffset: 0,
          font: '10px sans-serif',
          textAlign: 'start',
          textBaseline: 'alphabetic',
          direction: 'ltr',
          imageSmoothingEnabled: true,
          fillRect: function() {},
          clearRect: function() {},
          getImageData: function() {
            return {
              data: []
            };
          },
          putImageData: function() {},
          createImageData: function() {
            return [];
          },
          setTransform: function() {},
          drawImage: function() {},
          save: function() {},
          restore: function() {},
          beginPath: function() {},
          moveTo: function() {},
          lineTo: function() {},
          closePath: function() {},
          stroke: function() {},
          translate: function() {},
          scale: function() {},
          rotate: function() {},
          arc: function() {},
          fill: function() {},
          transform: function() {},
          rect: function() {},
          clip: function() {},
          
          // Add missing methods required by TypeScript's CanvasRenderingContext2D
          isPointInPath: function() { return false; },
          isPointInStroke: function() { return false; },
          createConicGradient: function() { return {} as any; },
          createLinearGradient: function() { return {} as any; },
          createPattern: function() { return null; },
          createRadialGradient: function() { return {} as any; },
          measureText: function() { return { width: 0 } as any; },
          
          // For fabric.js specific needs
          currentTransform: null,
          mozCurrentTransform: [1, 0, 0, 1, 0, 0],
          mozCurrentTransformInverse: [1, 0, 0, 1, 0, 0],
          
          // Add stubs for all remaining methods
          addHitRegion: function() {},
          clearHitRegions: function() {},
          ellipse: function() {},
          resetTransform: function() {},
          drawFocusIfNeeded: function() {},
          scrollPathIntoView: function() {},
          quadraticCurveTo: function() {},
          bezierCurveTo: function() {},
          fillText: function() {},
          strokeText: function() {},
          setLineDash: function() { return []; },
          getLineDash: function() { return []; }
        };
        
        // Use type assertion to tell TypeScript this partial implementation is sufficient
        return ctx as unknown as CanvasRenderingContext2D;
      }
      // Mock bitmaprenderer context
      else if (contextId === 'bitmaprenderer') {
        return {
          canvas: this,
          transferFromImageBitmap: function() {}
        } as unknown as ImageBitmapRenderingContext;
      }
      // Mock webgl context
      else if (contextId === 'webgl') {
        return {
          canvas: this,
          // Add minimum WebGL context properties
          drawingBufferWidth: 0,
          drawingBufferHeight: 0
        } as unknown as WebGLRenderingContext;
      }
      // Mock webgl2 context
      else if (contextId === 'webgl2') {
        return {
          canvas: this,
          // Add minimum WebGL2 context properties
          drawingBufferWidth: 0,
          drawingBufferHeight: 0
        } as unknown as WebGL2RenderingContext;
      }
      
      return null;
    } as any; // Final type assertion to make TypeScript happy
  }
}

// Import the matchers from @testing-library/jest-dom
import '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

// Add jest-dom custom matchers
expect.extend(matchers);
