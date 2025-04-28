
import { useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Hook for making a canvas responsive
 * @param canvas FabricCanvas
 * @param containerRef Reference to container element
 */
export const useResponsiveCanvas = (
  canvas: FabricCanvas | null,
  containerRef: React.RefObject<HTMLDivElement>
) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!canvas || !containerRef.current) return;

    const updateCanvasSize = () => {
      if (!containerRef.current) return;
      
      const { clientWidth, clientHeight } = containerRef.current;
      setDimensions({ width: clientWidth, height: clientHeight });
      
      // Update canvas dimensions
      canvas.setWidth(clientWidth);
      canvas.setHeight(clientHeight);
      canvas.renderAll();
    };

    // Initial size
    updateCanvasSize();

    // Add resize listener
    const resizeObserver = new ResizeObserver(updateCanvasSize);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [canvas, containerRef]);

  return dimensions;
};
