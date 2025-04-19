
import { useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { getPressure, isTiltSupported, getTilt } from '@/utils/canvas/pointerEvents';

interface UseStylusInputProps {
  fabricCanvas: FabricCanvas | null;
  baseWidth?: number;
  baseColor?: string;
}

/**
 * Hook to enhance drawing with stylus input
 * @param props Hook configuration
 * @returns void
 */
export function useStylusInput({
  fabricCanvas,
  baseWidth = 2,
  baseColor = '#000000'
}: UseStylusInputProps) {
  useEffect(() => {
    if (!fabricCanvas) return;
    
    // Set up drawing brush
    fabricCanvas.freeDrawingBrush.width = baseWidth;
    fabricCanvas.freeDrawingBrush.color = baseColor;
    
    // Event handlers
    const handlePointerDown = (e: PointerEvent) => {
      if (fabricCanvas.isDrawingMode) {
        // Apply pressure sensitivity for width
        const pressure = getPressure(e);
        fabricCanvas.freeDrawingBrush.width = baseWidth * (pressure * 2);
        
        // Apply tilt for brush effects if supported
        if (isTiltSupported()) {
          const { tiltX, tiltY } = getTilt(e);
          console.log('Tilt detected:', tiltX, tiltY);
          // Could modify brush behavior based on tilt
        }
      }
    };
    
    const handlePointerMove = (e: PointerEvent) => {
      if (fabricCanvas.isDrawingMode && e.buttons === 1) {
        // Update pressure during move
        const pressure = getPressure(e);
        fabricCanvas.freeDrawingBrush.width = baseWidth * (pressure * 2);
      }
    };
    
    // Add event listeners
    if (fabricCanvas.upperCanvasEl) {
      fabricCanvas.upperCanvasEl.addEventListener('pointerdown', handlePointerDown);
      fabricCanvas.upperCanvasEl.addEventListener('pointermove', handlePointerMove);
    }
    
    // Clean up listeners
    return () => {
      if (fabricCanvas.upperCanvasEl) {
        fabricCanvas.upperCanvasEl.removeEventListener('pointerdown', handlePointerDown);
        fabricCanvas.upperCanvasEl.removeEventListener('pointermove', handlePointerMove);
      }
    };
  }, [fabricCanvas, baseWidth, baseColor]);
  
  // No return value needed for this hook
  return;
}
