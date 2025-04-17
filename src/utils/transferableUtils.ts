
/**
 * Utilities for working with transferable objects
 * to optimize performance in worker communications
 */

/**
 * Convert an array of points to a transferable Float32Array
 * @param points Array of point objects with x and y properties
 * @returns Object containing the Float32Array and its buffer for transferring
 */
export const pointsToTransferable = (points: { x: number, y: number }[]): {
  data: Float32Array;
  buffer: ArrayBuffer;
} => {
  // Create a typed array with enough space for all point coordinates
  const float32Array = new Float32Array(points.length * 2);
  
  // Fill the array with alternating x, y values
  points.forEach((point, index) => {
    float32Array[index * 2] = point.x;
    float32Array[index * 2 + 1] = point.y;
  });
  
  return {
    data: float32Array,
    buffer: float32Array.buffer
  };
};

/**
 * Convert a transferable Float32Array back to an array of point objects
 * @param float32Array Typed array containing point data
 * @returns Array of point objects
 */
export const transferableToPoints = (float32Array: Float32Array): { x: number, y: number }[] => {
  const points: { x: number, y: number }[] = [];
  
  // Extract pairs of values as points
  for (let i = 0; i < float32Array.length; i += 2) {
    points.push({
      x: float32Array[i],
      y: float32Array[i + 1]
    });
  }
  
  return points;
};

/**
 * Check if transferable objects are supported in this environment
 * @returns Boolean indicating support
 */
export const supportsTransferables = (): boolean => {
  try {
    // Create a small test buffer
    const buffer = new ArrayBuffer(1);
    
    // Try to transfer it to a new worker
    const worker = new Worker(
      URL.createObjectURL(new Blob([''], { type: 'application/javascript' }))
    );
    
    worker.postMessage({ buffer }, [buffer]);
    
    // If we get here without error and the buffer is transferred (zero length)
    const isSupported = buffer.byteLength === 0;
    
    // Clean up
    worker.terminate();
    
    return isSupported;
  } catch (e) {
    return false;
  }
};

/**
 * Create a transferable version of canvas state for efficient worker communication
 * @param state Canvas state object
 * @returns Object with state and transferable buffers
 */
export const createTransferableCanvasState = (state: any): {
  data: any;
  transferables: ArrayBuffer[];
} => {
  const transferables: ArrayBuffer[] = [];
  const processedState = { ...state };
  
  // Process paths and points to use transferable objects
  if (state.objects && Array.isArray(state.objects)) {
    processedState.objects = state.objects.map((obj: any) => {
      const result = { ...obj };
      
      // Convert point arrays to transferable objects
      if (obj.points && Array.isArray(obj.points) && obj.points.length > 0) {
        const { data, buffer } = pointsToTransferable(obj.points);
        result.points = data;
        transferables.push(buffer);
      }
      
      return result;
    });
  }
  
  return {
    data: processedState,
    transferables
  };
};
