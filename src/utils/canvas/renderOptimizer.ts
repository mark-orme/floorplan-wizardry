
import { Canvas } from 'fabric';
import { captureMessage } from '@/utils/sentryUtils';

// Throttling for canvas renders
let canvasRenderScheduled = false;

/**
 * Request an optimized render of the canvas
 * @param canvas The fabric canvas
 * @param source Source of the render request for debugging
 */
export function requestOptimizedRender(canvas: Canvas, source?: string) {
  if (!canvas) return;
  
  if (canvasRenderScheduled) return;
  
  canvasRenderScheduled = true;
  
  window.requestAnimationFrame(() => {
    if (canvas) {
      try {
        canvas.renderAll();
      } catch (error) {
        captureMessage(`Error rendering canvas: ${error}`, {
          level: 'error',
          tags: { component: 'RenderOptimizer', source }
        });
      }
    }
    canvasRenderScheduled = false;
  });
}

// Track performance metrics
let lastRenderTime = 0;
let frameCount = 0;
let fps = 0;
let lastFpsUpdateTime = 0;

/**
 * Update FPS counter
 */
function updateFps() {
  const now = performance.now();
  frameCount++;
  
  if (now - lastFpsUpdateTime >= 1000) {
    fps = Math.round((frameCount * 1000) / (now - lastFpsUpdateTime));
    frameCount = 0;
    lastFpsUpdateTime = now;
  }
  
  lastRenderTime = now;
  
  return fps;
}

/**
 * Get current FPS
 * @returns Current FPS value
 */
export function getCurrentFps() {
  return fps;
}

/**
 * Setup render monitoring for a canvas
 * @param canvas The fabric canvas to monitor
 */
export function setupRenderMonitoring(canvas: Canvas) {
  if (!canvas) return;
  
  // Track rendering performance
  canvas.on('after:render', () => {
    updateFps();
  });
  
  // Log slow renders
  const originalRenderAll = canvas.renderAll.bind(canvas);
  
  canvas.renderAll = function() {
    const start = performance.now();
    const result = originalRenderAll();
    const end = performance.now();
    
    if (end - start > 16) { // 60fps threshold (16ms per frame)
      captureMessage('Slow canvas render detected', {
        level: 'warning',
        tags: { component: 'RenderMonitor' },
        extra: { 
          renderTime: end - start,
          objectCount: canvas.getObjects().length
        }
      });
    }
    
    return result;
  };
  
  return {
    getCurrentFps
  };
}
