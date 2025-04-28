
import { useCallback, useEffect, useState } from 'react';
import { debounce } from '@/utils/debounce';
import { UseCanvasResizingProps, CanvasDimensions } from './types';

export const useCanvasResizing = ({
  fabricCanvasRef,
  options = {},
  debugInfo
}: UseCanvasResizingProps) => {
  const {
    minWidth = 100,
    minHeight = 100,
    maxWidth = 3000,
    maxHeight = 2000,
    preserveAspectRatio = false,
    onResize,
    onResizeComplete,
    debounceDelay = 200
  } = options;

  const [dimensions, setDimensions] = useState<CanvasDimensions>({
    width: fabricCanvasRef.current?.getWidth() || 800,
    height: fabricCanvasRef.current?.getHeight() || 600
  });

  const updateCanvasSize = useCallback(
    (width: number, height: number) => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      // Ensure dimensions are within limits
      width = Math.max(minWidth, Math.min(maxWidth, width));
      height = Math.max(minHeight, Math.min(maxHeight, height));

      // Update canvas size
      canvas.setWidth(width);
      canvas.setHeight(height);

      // Update dimensions state
      setDimensions({ width, height });

      // Call onResize callback if provided
      onResize?.({ width, height });

      // Update debug info if provided
      if (debugInfo?.current) {
        debugInfo.current.width = width;
        debugInfo.current.height = height;
      }

      // Render canvas
      canvas.renderAll();
    },
    [fabricCanvasRef, minWidth, maxWidth, minHeight, maxHeight, onResize, debugInfo]
  );

  const handleResize = useCallback(
    debounce(
      (width: number, height: number) => {
        updateCanvasSize(width, height);
        onResizeComplete?.({ width, height });
      },
      debounceDelay
    ),
    [updateCanvasSize, onResizeComplete, debounceDelay]
  );

  // Initialize canvas size
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const initialWidth = canvas.getWidth() || 800;
    const initialHeight = canvas.getHeight() || 600;

    if (initialWidth !== dimensions.width || initialHeight !== dimensions.height) {
      updateCanvasSize(initialWidth, initialHeight);
    }
  }, [fabricCanvasRef, dimensions.width, dimensions.height, updateCanvasSize]);

  return {
    dimensions,
    updateCanvasSize,
    handleResize
  };
};
