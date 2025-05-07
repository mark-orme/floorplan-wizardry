import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { throttle } from 'lodash';

interface UseDimensionChangeHandlerProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  onDimensionsChange?: (width: number, height: number) => void;
  resizeThrottle?: number;
  enableResize?: boolean;
}

export const useDimensionChangeHandler = ({
  fabricCanvasRef,
  onDimensionsChange,
  resizeThrottle = 200,
  enableResize = true
}: UseDimensionChangeHandlerProps) => {
  // Keep track of previous dimensions
  const previousDimensions = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  
  // Create throttled resize handler to avoid performance issues
  const handleResize = useCallback(throttle(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !canvas.wrapperEl) return;
    
    // Get the parent element's dimensions
    const parent = canvas.wrapperEl.parentElement;
    if (!parent) return;
    
    // Get parent dimensions accounting for padding and border
    const parentStyle = window.getComputedStyle(parent);
    const paddingX = parseFloat(parentStyle.paddingLeft) + parseFloat(parentStyle.paddingRight);
    const paddingY = parseFloat(parentStyle.paddingTop) + parseFloat(parentStyle.paddingBottom);
    const borderX = parseFloat(parentStyle.borderLeftWidth) + parseFloat(parentStyle.borderRightWidth);
    const borderY = parseFloat(parentStyle.borderTopWidth) + parseFloat(parentStyle.borderBottomWidth);
    
    // Calculate available space
    const availableWidth = parent.clientWidth - paddingX - borderX;
    const availableHeight = parent.clientHeight - paddingY - borderY;
    
    // Check if dimensions actually changed
    if (previousDimensions.current.width === availableWidth && 
        previousDimensions.current.height === availableHeight) {
      return;
    }
    
    previousDimensions.current = { width: availableWidth, height: availableHeight };
    
    // Resize canvas
    if (canvas.setWidth && canvas.setHeight) {
      canvas.setWidth(availableWidth);
      canvas.setHeight(availableHeight);
      
      // Call the dimensions change callback
      if (onDimensionsChange) {
        onDimensionsChange(availableWidth, availableHeight);
      }
    } else if (canvas.setDimensions) {
      // Alternative API
      canvas.setDimensions({
        width: availableWidth,
        height: availableHeight
      });
      
      // Call the dimensions change callback
      if (onDimensionsChange) {
        onDimensionsChange(availableWidth, availableHeight);
      }
    }
    
    // Request render after resize
    if (canvas.requestRenderAll) {
      canvas.requestRenderAll();
    }
  }, resizeThrottle), [fabricCanvasRef, onDimensionsChange, resizeThrottle]);
  
  // Set up resize observer for parent element
  useEffect(() => {
    if (!enableResize) return;
    
    const canvas = fabricCanvasRef.current;
    if (!canvas || !canvas.wrapperEl) return;
    
    const parent = canvas.wrapperEl.parentElement;
    if (!parent) return;
    
    // Initial resize
    handleResize();
    
    // Set up resize observer
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(parent);
    
    // Also listen to window resize
    window.addEventListener('resize', handleResize);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      handleResize.cancel();
    };
  }, [fabricCanvasRef, handleResize, enableResize]);
  
  return {
    handleResize
  };
};
