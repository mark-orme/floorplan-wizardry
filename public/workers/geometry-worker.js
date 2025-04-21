
/**
 * Geometry Worker
 * Performs geometry calculations in a separate thread
 */

// Import geometry utilities
importScripts('/utils/geometry-engine.js');

// Track work being performed
let isProcessing = false;

/**
 * Handle messages from the main thread
 */
self.onmessage = function(e) {
  const { messageId, data } = e.data;
  
  try {
    isProcessing = true;
    
    // Process based on message type
    switch (data.type) {
      case 'calculateArea':
        handleCalculateArea(messageId, data.payload);
        break;
        
      case 'calculateDistance':
        handleCalculateDistance(messageId, data.payload);
        break;
        
      case 'calculateIntersection':
        handleCalculateIntersection(messageId, data.payload);
        break;
        
      default:
        throw new Error(`Unknown message type: ${data.type}`);
    }
  } catch (error) {
    self.postMessage({
      messageId,
      error: error.message || 'Unknown error in geometry worker'
    });
  } finally {
    isProcessing = false;
  }
};

/**
 * Calculate area of a polygon
 */
function handleCalculateArea(messageId, { points }) {
  // Use the geometry engine to calculate area
  const area = self.GeometryEngine.calculatePolygonArea(points);
  
  self.postMessage({
    messageId,
    data: {
      type: 'areaResult',
      payload: { area }
    }
  });
}

/**
 * Calculate distance between two points
 */
function handleCalculateDistance(messageId, { start, end }) {
  // Use the geometry engine to calculate distance
  const distance = self.GeometryEngine.calculateDistance(start, end);
  
  self.postMessage({
    messageId,
    data: {
      type: 'distanceResult',
      payload: { distance }
    }
  });
}

/**
 * Calculate intersection of two lines
 */
function handleCalculateIntersection(messageId, { line1, line2 }) {
  // Use the geometry engine to calculate intersection
  const point = self.GeometryEngine.calculateIntersection(line1, line2);
  
  self.postMessage({
    messageId,
    data: {
      type: 'intersectionResult',
      payload: { point }
    }
  });
}

/**
 * Notify the main thread that the worker is ready
 */
self.postMessage({
  type: 'ready',
  payload: {
    initialized: true
  }
});
