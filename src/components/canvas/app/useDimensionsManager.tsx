
import { useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { updateGridWithZoom } from '@/utils/grid/gridVisibility';
import { requestOptimizedRender } from '@/utils/canvas/renderOptimizer';

interface UseDimensionsManagerProps {
  containerRef: React.RefObject<HTMLDivElement>;
  fabricCanvas: FabricCanvas | null;
  propWidth?: number;
  propHeight?: number;
  windowWidth: number;
  windowHeight: number;
  setDimensions: React.Dispatch<React.SetStateAction<{ width: number; height: number }>>;
}

export const useDimensionsManager = ({
  containerRef,
  fabricCanvas,
  propWidth,
  propHeight,
  windowWidth, 
  windowHeight,
  setDimensions
}: UseDimensionsManagerProps) => {
  // Update canvas dimensions based on container size
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      if (!containerRef.current) return;
      
      // Use container dimensions if props not provided
      const newWidth = propWidth || containerRef.current.clientWidth;
      const newHeight = propHeight || containerRef.current.clientHeight;
      
      setDimensions({
        width: Math.max(newWidth, 100), // min width 100px
        height: Math.max(newHeight, 100) // min height 100px
      });
      
      // Update canvas size if it exists
      if (fabricCanvas) {
        fabricCanvas.setDimensions({
          width: Math.max(newWidth, 100),
          height: Math.max(newHeight, 100)
        });
        
        // Update grid with new dimensions
        updateGridWithZoom(fabricCanvas);
        requestOptimizedRender(fabricCanvas, 'resize');
      }
    };
    
    // Initial update
    updateDimensions();
    
    // Listen for window resize
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [fabricCanvas, containerRef, propWidth, propHeight, windowWidth, windowHeight, setDimensions]);
};
