
import { Canvas as FabricCanvas } from 'fabric';

const animationFrames = new Map<string, number>();

export const requestOptimizedRender = (
  canvas: FabricCanvas,
  id: string = 'default'
): void => {
  if (animationFrames.has(id)) {
    cancelAnimationFrame(animationFrames.get(id)!);
  }
  
  const frameId = requestAnimationFrame(() => {
    canvas.requestRenderAll();
    animationFrames.delete(id);
  });
  
  animationFrames.set(id, frameId);
};

export const cancelOptimizedRender = (id: string = 'default'): void => {
  if (animationFrames.has(id)) {
    cancelAnimationFrame(animationFrames.get(id)!);
    animationFrames.delete(id);
  }
};

export const createSmoothEventHandler = <T extends (...args: any[]) => void>(
  callback: T,
  throttleTime: number = 16
): T => {
  let lastRun = 0;
  
  return ((...args: Parameters<T>) => {
    const now = performance.now();
    if (now - lastRun >= throttleTime) {
      lastRun = now;
      return callback(...args);
    }
  }) as T;
};
