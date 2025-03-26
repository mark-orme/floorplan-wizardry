
/**
 * Custom hook for tracking canvas dimensions
 * Provides reactive canvas size based on container element
 * @module useCanvasDimensions
 */
import { useState, useEffect } from 'react';
import { CanvasDimensions } from '@/types/drawingTypes';

/**
 * Hook to get and update canvas dimensions based on container size
 * Automatically updates when the window is resized
 * 
 * @returns {CanvasDimensions} Current canvas dimensions
 */
export const useCanvasDimensions = (): CanvasDimensions => {
  /**
   * State to store current canvas dimensions
   * Initialized with default values that will be updated on mount
   * @type {CanvasDimensions}
   */
  const [dimensions, setDimensions] = useState<CanvasDimensions>({
    width: 800,
    height: 600
  });

  useEffect(() => {
    /**
     * Update dimensions based on container size
     * Measures the canvas container element and updates state
     * @function
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

    // Initial update
    updateDimensions();
    
    /**
     * Window resize event handler
     * Updates dimensions when window size changes
     */
    window.addEventListener('resize', updateDimensions);
    
    // Clean up event listener on unmount
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return dimensions;
};
