
/**
 * Geometry Engine
 * Provides geometry calculations for workers
 */

(function(global) {
  /**
   * Geometry Engine implementation
   */
  const GeometryEngine = {
    /**
     * Calculate the distance between two points
     * @param {Object} p1 First point {x, y}
     * @param {Object} p2 Second point {x, y}
     * @returns {number} Distance
     */
    calculateDistance: function(p1, p2) {
      return Math.sqrt(
        Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
      );
    },
    
    /**
     * Calculate the area of a polygon
     * @param {Array} points Array of points {x, y}
     * @returns {number} Area
     */
    calculatePolygonArea: function(points) {
      if (!points || points.length < 3) {
        return 0;
      }
      
      let area = 0;
      const n = points.length;
      
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        area += points[i].x * points[j].y;
        area -= points[j].x * points[i].y;
      }
      
      return Math.abs(area / 2);
    },
    
    /**
     * Calculate the intersection of two line segments
     * @param {Array} line1 First line as [p1, p2]
     * @param {Array} line2 Second line as [p1, p2]
     * @returns {Object|null} Intersection point or null if no intersection
     */
    calculateIntersection: function(line1, line2) {
      const [p1, p2] = line1;
      const [p3, p4] = line2;
      
      // Line 1 represented as a1x + b1y = c1
      const a1 = p2.y - p1.y;
      const b1 = p1.x - p2.x;
      const c1 = a1 * p1.x + b1 * p1.y;
      
      // Line 2 represented as a2x + b2y = c2
      const a2 = p4.y - p3.y;
      const b2 = p3.x - p4.x;
      const c2 = a2 * p3.x + b2 * p3.y;
      
      const determinant = a1 * b2 - a2 * b1;
      
      if (determinant === 0) {
        // Lines are parallel
        return null;
      }
      
      const x = (b2 * c1 - b1 * c2) / determinant;
      const y = (a1 * c2 - a2 * c1) / determinant;
      
      // Check if intersection point is on both line segments
      const onSegment1 = this.isPointOnLineSegment(p1, p2, { x, y });
      const onSegment2 = this.isPointOnLineSegment(p3, p4, { x, y });
      
      if (onSegment1 && onSegment2) {
        return { x, y };
      }
      
      return null;
    },
    
    /**
     * Check if a point is on a line segment
     * @param {Object} p1 First end of line segment
     * @param {Object} p2 Second end of line segment
     * @param {Object} p Point to check
     * @returns {boolean} True if point is on line segment
     */
    isPointOnLineSegment: function(p1, p2, p) {
      const dxc = p.x - p1.x;
      const dyc = p.y - p1.y;
      const dxl = p2.x - p1.x;
      const dyl = p2.y - p1.y;
      
      // Check if point is on the line
      const cross = dxc * dyl - dyc * dxl;
      if (Math.abs(cross) > 0.0001) {
        return false;
      }
      
      // Check if point is within the line segment bounds
      if (Math.abs(dxl) >= Math.abs(dyl)) {
        return dxl > 0 ? 
          p1.x <= p.x && p.x <= p2.x : 
          p2.x <= p.x && p.x <= p1.x;
      } else {
        return dyl > 0 ? 
          p1.y <= p.y && p.y <= p2.y : 
          p2.y <= p.y && p.y <= p1.y;
      }
    },
    
    /**
     * Check if a polygon is closed
     * @param {Array} points Array of points {x, y}
     * @returns {boolean} True if polygon is closed
     */
    isPolygonClosed: function(points) {
      if (!points || points.length < 3) {
        return false;
      }
      
      const first = points[0];
      const last = points[points.length - 1];
      
      // Check if first and last points are the same
      return Math.abs(first.x - last.x) < 0.0001 && 
             Math.abs(first.y - last.y) < 0.0001;
    },
    
    /**
     * Calculate the perimeter of a polygon
     * @param {Array} points Array of points {x, y}
     * @returns {number} Perimeter
     */
    calculatePerimeter: function(points) {
      if (!points || points.length < 2) {
        return 0;
      }
      
      let perimeter = 0;
      const n = points.length;
      
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        perimeter += this.calculateDistance(points[i], points[j]);
      }
      
      return perimeter;
    }
  };
  
  // Expose the GeometryEngine to the global scope
  global.GeometryEngine = GeometryEngine;
})(typeof self !== 'undefined' ? self : this);
