
/**
 * Hook for Apple Pencil and stylus support in drawing tools
 * @module hooks/straightLineTool/useApplePencilSupport
 */
import { useCallback, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface PencilState {
  pressure: number;
  tiltX: number;
  tiltY: number;
  twist: number;
}

interface UseApplePencilSupportProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  lineThickness: number;
}

/**
 * Hook for handling Apple Pencil and other stylus input
 */
export const useApplePencilSupport = ({
  fabricCanvasRef,
  lineThickness
}: UseApplePencilSupportProps) => {
  // Track stylus state
  const [pencilState, setPencilState] = useState<PencilState>({
    pressure: 1,
    tiltX: 0,
    tiltY: 0,
    twist: 0
  });
  
  // Track if Apple Pencil is being used
  const [isApplePencil, setIsApplePencil] = useState(false);
  const [isPencilMode, setIsPencilMode] = useState(false);
  
  // Calculate adjusted line thickness based on pressure
  const adjustedLineThickness = pencilState.pressure * lineThickness;
  
  // Handle pointer pressure events
  const handlePointerEvent = useCallback((e: PointerEvent) => {
    // Check if it's a pen/stylus
    if (e.pointerType === 'pen') {
      setIsApplePencil(true);
      setPencilState({
        pressure: e.pressure || 1,  // Default to 1 if not available
        tiltX: e.tiltX || 0,
        tiltY: e.tiltY || 0,
        twist: (e as any).twist || 0  // Not supported in all browsers
      });
      setIsPencilMode(true);
    } else {
      setIsApplePencil(false);
      setIsPencilMode(false);
    }
  }, []);
  
  // Set up event listeners when the canvas is available
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const handlePointerDown = handlePointerEvent;
    const handlePointerMove = handlePointerEvent;
    
    // Get the canvas element
    const canvasElement = fabricCanvasRef.current.getElement();
    
    if (canvasElement) {
      canvasElement.addEventListener('pointerdown', handlePointerDown);
      canvasElement.addEventListener('pointermove', handlePointerMove);
      
      return () => {
        canvasElement.removeEventListener('pointerdown', handlePointerDown);
        canvasElement.removeEventListener('pointermove', handlePointerMove);
      };
    }
  }, [fabricCanvasRef, handlePointerEvent]);
  
  return {
    pencilState,
    isPencilMode,
    isApplePencil,
    adjustedLineThickness
  };
};
