
import { useEffect, useState, useCallback } from 'react';

/**
 * Hook to detect container resize events
 * @param containerRef Reference to container element
 * @param onResize Callback triggered on resize
 */
export const useContainerResizeEffect = (
  containerRef: React.RefObject<HTMLDivElement>,
  onResize?: (width: number, height: number) => void
) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const handleResize = useCallback(() => {
    if (!containerRef.current) return;
    
    const { clientWidth, clientHeight } = containerRef.current;
    setSize({ width: clientWidth, height: clientHeight });
    
    if (onResize) {
      onResize(clientWidth, clientHeight);
    }
  }, [containerRef, onResize]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initial size
    handleResize();
    
    // Create resize observer
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, handleResize]);

  return size;
};
