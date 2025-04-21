
/**
 * Geometry Engine
 * Implementation of geometric calculations
 */

// Attach to self to be accessible in the worker context
self.GeometryEngine = {
  /**
   * Calculate the area of a polygon
   * @param {Array} points - Array of {x, y} points
   * @returns {number} Area of the polygon
   */
  calculatePolygonArea: function(points) {
    if (!points || points.length < 3) return 0;
    
    let total = 0;
    
    for (let i = 0, l = points.length; i < l; i++) {
      const addX = points[i].x;
      const addY = points[i === points.length - 1 ? 0 : i + 1].y;
      const subX = points[i === points.length - 1 ? 0 : i + 1].x;
      const subY = points[i].y;
      
      total += (addX * addY * 0.5);
      total -= (subX * subY * 0.5);
    }
    
    return Math.abs(total);
  },

  /**
   * Calculate the distance between two points
   * @param {Object} start - {x, y} start point
   * @param {Object} end - {x, y} end point
   * @returns {number} Distance between points
   */
  calculateDistance: function(start, end) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    return Math.sqrt(dx * dx + dy * dy);
  },

  /**
   * Calculate intersection point of two lines
   * @param {Object} line1 - {start: {x, y}, end: {x, y}} first line
   * @param {Object} line2 - {start: {x, y}, end: {x, y}} second line
   * @returns {Object|null} Intersection point {x, y} or null if no intersection
   */
  calculateIntersection: function(line1, line2) {
    const x1 = line1.start.x;
    const y1 = line1.start.y;
    const x2 = line1.end.x;
    const y2 = line1.end.y;
    const x3 = line2.start.x;
    const y3 = line2.start.y;
    const x4 = line2.end.x;
    const y4 = line2.end.y;
    
    const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    
    // Lines are parallel
    if (denominator === 0) {
      return null;
    }
    
    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;
    
    // Check if intersection is on both line segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
      return null;
    }
    
    const x = x1 + ua * (x2 - x1);
    const y = y1 + ua * (y2 - y1);
    
    return { x, y };
  },

  /**
   * Check if a point is inside a polygon
   * @param {Object} point - {x, y} point to check
   * @param {Array} polygon - Array of {x, y} points defining the polygon
   * @returns {boolean} True if point is inside polygon
   */
  isPointInsidePolygon: function(point, polygon) {
    if (!polygon || polygon.length < 3) return false;
    
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x;
      const yi = polygon[i].y;
      const xj = polygon[j].x;
      const yj = polygon[j].y;
      
      const intersect = ((yi > point.y) !== (yj > point.y)) &&
        (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
      
      if (intersect) inside = !inside;
    }
    
    return inside;
  }
};

// Notify that the engine is loaded
console.log('Geometry engine loaded');
