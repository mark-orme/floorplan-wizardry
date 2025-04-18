
import { Canvas as FabricCanvas } from 'fabric';
import { PerformanceMetrics } from '@/types/canvas';

let lastFrameTime = performance.now();
let frameCount = 0;
let fpsValue = 0;

export const measurePerformance = (canvas: FabricCanvas): PerformanceMetrics => {
  const now = performance.now();
  frameCount++;

  if (now - lastFrameTime >= 1000) {
    fpsValue = frameCount;
    frameCount = 0;
    lastFrameTime = now;
  }

  return {
    fps: fpsValue,
    objectCount: canvas.getObjects().length,
    visibleObjectCount: canvas.getObjects().filter(obj => obj.visible).length
  };
};
