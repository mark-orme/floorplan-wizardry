
import { useState, useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';

export interface PaperSize {
  id: string;
  name: string;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
}

// Standard paper sizes in pixels (at 72 DPI)
export const STANDARD_PAPER_SIZES: PaperSize[] = [
  { id: 'a4-portrait', name: 'A4', width: 595, height: 842, orientation: 'portrait' },
  { id: 'a4-landscape', name: 'A4', width: 842, height: 595, orientation: 'landscape' },
  { id: 'a3-portrait', name: 'A3', width: 842, height: 1191, orientation: 'portrait' },
  { id: 'a3-landscape', name: 'A3', width: 1191, height: 842, orientation: 'landscape' },
  { id: 'a2-portrait', name: 'A2', width: 1191, height: 1684, orientation: 'portrait' },
  { id: 'a2-landscape', name: 'A2', width: 1684, height: 1191, orientation: 'landscape' },
  { id: 'a1-portrait', name: 'A1', width: 1684, height: 2384, orientation: 'portrait' },
  { id: 'a1-landscape', name: 'A1', width: 2384, height: 1684, orientation: 'landscape' },
  { id: 'a0-portrait', name: 'A0', width: 2384, height: 3370, orientation: 'portrait' },
  { id: 'a0-landscape', name: 'A0', width: 3370, height: 2384, orientation: 'landscape' },
];

export interface UsePaperSizeManagerProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  initialPaperSizeId?: string;
  onPaperSizeChange?: (paperSize: PaperSize) => void;
}

export const usePaperSizeManager = ({
  fabricCanvasRef,
  initialPaperSizeId = 'a4-portrait',
  onPaperSizeChange
}: UsePaperSizeManagerProps) => {
  const [currentPaperSize, setCurrentPaperSize] = useState<PaperSize>(
    STANDARD_PAPER_SIZES.find(size => size.id === initialPaperSizeId) || STANDARD_PAPER_SIZES[0]
  );
  const [paperSizes, setPaperSizes] = useState<PaperSize[]>(STANDARD_PAPER_SIZES);
  const [infiniteCanvas, setInfiniteCanvas] = useState(false);
  
  // Change paper size
  const changePaperSize = useCallback((sizeId: string) => {
    const newSize = paperSizes.find(size => size.id === sizeId);
    if (!newSize) {
      toast.error(`Invalid paper size: ${sizeId}`);
      return;
    }
    
    setCurrentPaperSize(newSize);
    
    if (onPaperSizeChange) {
      onPaperSizeChange(newSize);
    }
    
    // Apply to canvas if available
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      // Save current objects
      const objects = canvas.getObjects();
      
      // Set new dimensions
      canvas.setDimensions({
        width: newSize.width,
        height: newSize.height
      });
      
      // Center objects if they're now outside the canvas
      objects.forEach(obj => {
        const objBounds = obj.getBoundingRect();
        
        if (objBounds.left > newSize.width || objBounds.top > newSize.height) {
          obj.set({
            left: Math.min(objBounds.left, newSize.width - objBounds.width),
            top: Math.min(objBounds.top, newSize.height - objBounds.height)
          });
        }
      });
      
      canvas.renderAll();
      toast.success(`Paper size changed to ${newSize.name} ${newSize.orientation}`);
    }
  }, [fabricCanvasRef, paperSizes, onPaperSizeChange]);
  
  // Toggle between portrait and landscape for current size
  const toggleOrientation = useCallback(() => {
    const currentId = currentPaperSize.id;
    const isPortrait = currentId.includes('portrait');
    
    const newOrientationId = isPortrait 
      ? currentId.replace('portrait', 'landscape')
      : currentId.replace('landscape', 'portrait');
      
    changePaperSize(newOrientationId);
  }, [currentPaperSize, changePaperSize]);
  
  // Add custom paper size
  const addCustomPaperSize = useCallback((name: string, width: number, height: number) => {
    const id = `custom-${name.toLowerCase()}-${Date.now()}`;
    const orientation = width > height ? 'landscape' : 'portrait';
    
    const newSize: PaperSize = {
      id,
      name,
      width,
      height,
      orientation
    };
    
    setPaperSizes(prev => [...prev, newSize]);
    toast.success(`Added custom paper size: ${name}`);
    
    return newSize;
  }, []);
  
  // Toggle infinite canvas mode
  const toggleInfiniteCanvas = useCallback(() => {
    setInfiniteCanvas(prev => !prev);
    
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      if (!infiniteCanvas) {
        // Switch to infinite canvas
        canvas.setDimensions({
          width: window.innerWidth * 3,
          height: window.innerHeight * 3
        });
        
        // Center the viewport
        if (canvas.viewportTransform) {
          canvas.viewportTransform[4] = window.innerWidth / 2;
          canvas.viewportTransform[5] = window.innerHeight / 2;
          canvas.requestRenderAll();
        }
        
        toast.success('Switched to infinite canvas mode');
      } else {
        // Switch back to paper size
        canvas.setDimensions({
          width: currentPaperSize.width,
          height: currentPaperSize.height
        });
        
        // Reset viewport transform
        if (canvas.viewportTransform) {
          canvas.viewportTransform[4] = 0;
          canvas.viewportTransform[5] = 0;
          canvas.requestRenderAll();
        }
        
        toast.success(`Switched to paper size: ${currentPaperSize.name}`);
      }
    }
  }, [fabricCanvasRef, infiniteCanvas, currentPaperSize]);
  
  // Initialize with the selected paper size
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Only set dimensions if not in infinite canvas mode
    if (!infiniteCanvas) {
      canvas.setDimensions({
        width: currentPaperSize.width,
        height: currentPaperSize.height
      });
      canvas.renderAll();
    }
  }, [fabricCanvasRef, currentPaperSize, infiniteCanvas]);
  
  return {
    currentPaperSize,
    paperSizes,
    infiniteCanvas,
    changePaperSize,
    toggleOrientation,
    addCustomPaperSize,
    toggleInfiniteCanvas
  };
};
