
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Safely set dimensions on a canvas to avoid destructuring issues
 * @param canvas The fabric canvas
 * @param width The width to set
 * @param height The height to set
 */
export const setSafeDimensions = (
  canvas: FabricCanvas,
  width: number,
  height: number,
  options?: { backstoreOnly?: boolean; cssOnly?: boolean }
): void => {
  if (!canvas) return;
  
  try {
    // Use individual dimension setting to avoid destructuring issues
    if (options?.backstoreOnly) {
      canvas.setWidth(width);
      canvas.setHeight(height);
    } else if (options?.cssOnly) {
      canvas.setDimensions({ width, height }, { cssOnly: true });
    } else {
      // Set both CSS and backstore dimensions
      canvas.setWidth(width);
      canvas.setHeight(height);
      canvas.setDimensions({ width, height }, { cssOnly: true });
    }
    
    // Force a render to ensure dimensions are applied
    canvas.renderAll();
  } catch (error) {
    console.error('Error setting canvas dimensions:', error);
  }
};

/**
 * Safely update canvas dimensions based on container
 * @param canvas The fabric canvas
 * @param containerRef Reference to the container element
 */
export const updateCanvasDimensions = (
  canvas: FabricCanvas,
  containerRef: React.RefObject<HTMLDivElement>
): void => {
  if (!canvas || !containerRef.current) return;
  
  try {
    const { width, height } = containerRef.current.getBoundingClientRect();
    
    // Use individual dimension setting to avoid destructuring issues
    setSafeDimensions(canvas, width, height);
    
    // Log success
    console.log('Canvas dimensions updated:', width, height);
  } catch (error) {
    console.error('Error updating canvas dimensions:', error);
  }
};

/**
 * Add a resize observer to keep canvas dimensions in sync with container
 * @param canvas The fabric canvas
 * @param containerRef Reference to the container element
 * @returns Cleanup function to remove observer
 */
export const observeCanvasContainer = (
  canvas: FabricCanvas,
  containerRef: React.RefObject<HTMLDivElement>
): () => void => {
  if (!containerRef.current) return () => {};
  
  const observer = new ResizeObserver(() => {
    updateCanvasDimensions(canvas, containerRef);
  });
  
  observer.observe(containerRef.current);
  
  // Return cleanup function
  return () => observer.disconnect();
};

/**
 * Create a safe wrapper for dimension-related operations on canvas
 */
export const createSafeDimensionsHandler = (canvas: FabricCanvas) => {
  return {
    setDimensions: (width: number, height: number, options?: { backstoreOnly?: boolean; cssOnly?: boolean }) => 
      setSafeDimensions(canvas, width, height, options),
    updateFromContainer: (containerRef: React.RefObject<HTMLDivElement>) => 
      updateCanvasDimensions(canvas, containerRef),
    observe: (containerRef: React.RefObject<HTMLDivElement>) => 
      observeCanvasContainer(canvas, containerRef)
  };
};
