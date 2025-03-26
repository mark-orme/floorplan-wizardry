
/**
 * Custom hook for managing canvas dimensions
 * Tracks and updates canvas dimensions based on container size
 * @module useDomRef
 */
import { useState, useEffect } from 'react';
import { CanvasDimensions } from '@/types/drawingTypes';

/**
 * Hook to track and respond to canvas container size changes
 * Provides current width and height of the canvas container
 * Used to ensure canvas resizes correctly with its container
 * 
 * @returns {CanvasDimensions} Current dimensions of the canvas container
 * 
 * @example
 * const dimensions = useCanvasDimensions();
 * // Use dimensions to size canvas: 
 * // canvas.setDimensions({ width: dimensions.width, height: dimensions.height });
 */
export const useCanvasDimensions = (): CanvasDimensions => {
  /**
   * State to track current dimensions
   * @type {CanvasDimensions}
   */
  const [dimensions, setDimensions] = useState<CanvasDimensions>({
    width: 800,
    height: 600
  });

  useEffect(() => {
    /**
     * Update dimensions based on container size
     * Gets called on window resize and on initial mount
     */
    const updateDimensions = () => {
      const container = document.getElementById('canvas-container');
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight
        });
      }
    };

    // Initial size calculation
    updateDimensions();
    
    // Listen for window resize events
    window.addEventListener('resize', updateDimensions);
    
    // Clean up event listener on unmount
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return dimensions;
};
