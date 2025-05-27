
import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

interface UseOptimizedObjectManagementProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
}

/**
 * Hook for optimized fabric object management
 * Provides utilities for efficiently adding, removing, and updating objects
 */
export const useOptimizedObjectManagement = ({
  fabricCanvasRef
}: UseOptimizedObjectManagementProps) => {
  const batchOperationsQueueRef = useRef<Array<(canvas: FabricCanvas) => void>>([]);
  const isBatchingRef = useRef(false);
  
  // Function to start batching operations
  const startBatch = useCallback(() => {
    isBatchingRef.current = true;
    batchOperationsQueueRef.current = [];
  }, []);
  
  // Function to commit batched operations
  const commitBatch = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isBatchingRef.current) return;
    
    // Execute each operation in the queue
    batchOperationsQueueRef.current.forEach(operation => {
      if (typeof operation === 'function') {
        operation(canvas);
      }
    });
    
    // Render canvas once after all operations
    canvas.renderAll();
    
    isBatchingRef.current = false;
    batchOperationsQueueRef.current = [];
  }, [fabricCanvasRef]);
  
  // Function to add objects optimally
  const addObjects = useCallback((objects: FabricObject | FabricObject[]) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const objectsArray = Array.isArray(objects) ? objects : [objects];
    
    const operation = (canvas: FabricCanvas) => {
      objectsArray.forEach(obj => canvas.add(obj));
    };
    
    if (isBatchingRef.current) {
      batchOperationsQueueRef.current.push(operation);
    } else {
      operation(canvas);
      canvas.renderAll();
    }
  }, [fabricCanvasRef]);
  
  // Function to remove objects optimally
  const removeObjects = useCallback((objects: FabricObject | FabricObject[]) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const objectsArray = Array.isArray(objects) ? objects : [objects];
    
    const operation = (canvas: FabricCanvas) => {
      objectsArray.forEach(obj => canvas.remove(obj));
    };
    
    if (isBatchingRef.current) {
      batchOperationsQueueRef.current.push(operation);
    } else {
      operation(canvas);
      canvas.renderAll();
    }
  }, [fabricCanvasRef]);
  
  // Function to update object properties optimally
  const updateObjects = useCallback((
    objects: FabricObject | FabricObject[],
    properties: Partial<FabricObject>
  ) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const objectsArray = Array.isArray(objects) ? objects : [objects];
    
    const operation = (canvas: FabricCanvas) => {
      objectsArray.forEach(obj => {
        obj.set(properties);
        if (typeof obj.setCoords === 'function') {
          obj.setCoords();
        }
      });
    };
    
    if (isBatchingRef.current) {
      batchOperationsQueueRef.current.push(operation);
    } else {
      operation(canvas);
      canvas.renderAll();
    }
  }, [fabricCanvasRef]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      batchOperationsQueueRef.current = [];
      isBatchingRef.current = false;
    };
  }, []);
  
  return {
    addObjects,
    removeObjects,
    updateObjects,
    startBatch,
    commitBatch
  };
};
