
import { useCallback, useEffect } from 'react';
import { ExtendedCanvas } from '@/types/fabric-unified';
import { FabricPointerEvent } from '@/types/fabricEvents';
import { DrawingMode } from '@/constants/drawingModes';

interface UsePointerEventsProps {
  fabricCanvasRef: React.MutableRefObject<ExtendedCanvas | null>;
  currentTool: DrawingMode;
  onMouseDown?: (e: any) => void;
  onMouseMove?: (e: any) => void;
  onMouseUp?: (e: any) => void;
  isEnabled?: boolean;
}

export const usePointerEvents = ({ 
  fabricCanvasRef,
  currentTool,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  isEnabled = true
}: UsePointerEventsProps) => {
  // Handle mouse down event
  const handleMouseDown = useCallback((e: FabricPointerEvent) => {
    if (!isEnabled) return;
    if (onMouseDown) onMouseDown(e);
  }, [isEnabled, onMouseDown]);
  
  // Handle mouse move event
  const handleMouseMove = useCallback((e: FabricPointerEvent) => {
    if (!isEnabled) return;
    if (onMouseMove) onMouseMove(e);
  }, [isEnabled, onMouseMove]);
  
  // Handle mouse up event
  const handleMouseUp = useCallback((e: FabricPointerEvent) => {
    if (!isEnabled) return;
    if (onMouseUp) onMouseUp(e);
  }, [isEnabled, onMouseUp]);
  
  // Set up event listeners
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isEnabled) return;
    
    canvas.on('mouse:down', handleMouseDown as any);
    canvas.on('mouse:move', handleMouseMove as any);
    canvas.on('mouse:up', handleMouseUp as any);
    
    return () => {
      if (!canvas) return;
      canvas.off('mouse:down', handleMouseDown as any);
      canvas.off('mouse:move', handleMouseMove as any);
      canvas.off('mouse:up', handleMouseUp as any);
    };
  }, [fabricCanvasRef, handleMouseDown, handleMouseMove, handleMouseUp, isEnabled]);
  
  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};
