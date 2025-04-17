
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { useOptimizedGeometryWorker } from '@/hooks/useOptimizedGeometryWorker';
import { measureCanvasOperation } from '@/utils/canvas/monitoring/performanceMonitoring';
import logger from '@/utils/logger';
import { pointsToTransferable } from '@/utils/computeUtils';

// Size threshold for worker offloading (objects)
const WORKER_THRESHOLD = 100;

/**
 * Captures the current state of a canvas as a JSON string
 * @param canvas Fabric canvas to capture
 * @returns JSON string representing the current state
 */
export const captureCanvasState = (canvas: FabricCanvas): string => {
  if (!canvas) return '';
  
  try {
    // Use performance monitoring to measure serialization time
    return measureCanvasOperation('captureCanvasState', () => {
      // Filter out grid objects
      const objects = canvas.getObjects().filter(obj => (obj as any).objectType !== 'grid');
      
      // For large canvases, we should consider using workers
      // but serialization itself has to happen on the main thread due to Fabric.js limitations
      const json = {
        objects: objects.map(obj => obj.toJSON(['id', 'objectType'])),
        background: canvas.backgroundColor
      };
      
      return JSON.stringify(json);
    });
  } catch (error) {
    logger.error('Error capturing canvas state:', error);
    return '';
  }
};

/**
 * Applies a serialized state to a canvas
 * @param canvas Fabric canvas to apply state to
 * @param state JSON string state to apply
 */
export const applyCanvasState = (canvas: FabricCanvas, state: string): void => {
  if (!canvas || !state) return;
  
  try {
    // Use performance monitoring for deserialization
    measureCanvasOperation('applyCanvasState', () => {
      // Parse the state
      const parsedState = JSON.parse(state);
      
      // Store grid objects
      const gridObjects = canvas.getObjects().filter(obj => (obj as any).objectType === 'grid');
      
      // Clear non-grid objects
      canvas.getObjects()
        .filter(obj => (obj as any).objectType !== 'grid')
        .forEach(obj => canvas.remove(obj));
      
      // Load objects from state
      if (parsedState.objects && Array.isArray(parsedState.objects)) {
        // Use loadFromJSON to properly handle object instantiation
        const objectsToLoad = {
          objects: parsedState.objects,
          background: parsedState.background
        };
        
        canvas.loadFromJSON(objectsToLoad, () => {
          // Grid objects should be on top
          gridObjects.forEach(obj => {
            canvas.add(obj);
            canvas.bringToFront(obj);
          });
          
          // Render canvas
          canvas.renderAll();
        });
      } else {
        // Set background color if provided
        if (parsedState.background) {
          canvas.backgroundColor = parsedState.background;
          canvas.renderAll();
        }
      }
    });
  } catch (error) {
    logger.error('Error applying canvas state:', error);
  }
};

/**
 * Optimizes a canvas state for network transmission
 * This will be used for large canvas states to reduce payload size
 * @param state Canvas state JSON string
 * @returns Optimized state JSON string
 */
export const optimizeCanvasState = async (state: string): Promise<string> => {
  if (!state) return '';
  
  try {
    const parsed = JSON.parse(state);
    
    // Only optimize if we have many objects
    if (parsed.objects && parsed.objects.length > WORKER_THRESHOLD) {
      // We would use the geometry worker here, but since this is a one-off utility function,
      // we need to manually initialize the hook outside of a component
      const geometryWorker = new Worker(
        new URL('../../workers/optimizedGeometryWorker.ts', import.meta.url),
        { type: 'module' }
      );
      
      // Create a promise to handle the worker response
      const result = await new Promise<string>((resolve, reject) => {
        // Set up one-time message handler
        geometryWorker.onmessage = (event) => {
          const { success, result, error } = event.data;
          
          if (success) {
            resolve(result);
          } else {
            reject(new Error(error || 'Unknown worker error'));
          }
          
          // Terminate worker after use
          geometryWorker.terminate();
        };
        
        // Send data to worker using transferable objects where possible
        const transferables: ArrayBuffer[] = [];
        
        // Prepare any transferable objects from paths or points
        const prepareTransferables = (objects: any[]) => {
          objects.forEach(obj => {
            if (obj.points && Array.isArray(obj.points) && obj.points.length > 50) {
              const { data, buffer } = pointsToTransferable(obj.points);
              obj.points = data;
              transferables.push(buffer);
            }
          });
        };
        
        // Try to prepare transferables if we have objects with points
        if (parsed.objects && Array.isArray(parsed.objects)) {
          prepareTransferables(parsed.objects);
        }
        
        // Send to worker
        if (transferables.length > 0) {
          geometryWorker.postMessage({
            id: `optimize-${Date.now()}`,
            type: 'optimizeCanvasState',
            payload: { state, hasTransferables: true, parsed }
          }, transferables);
        } else {
          geometryWorker.postMessage({
            id: `optimize-${Date.now()}`,
            type: 'optimizeCanvasState',
            payload: { state }
          });
        }
      });
      
      return result;
    }
    
    // If below threshold, return original state
    return state;
  } catch (error) {
    logger.error('Error optimizing canvas state:', error);
    return state; // Return original state on error
  }
};
