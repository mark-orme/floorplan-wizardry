
import { useEffect, useRef } from 'react';
import { FabricPointerEvent } from '@/types/fabricEvents';
import { Canvas as FabricCanvas } from 'fabric';

export interface UsePointerEventsProps {
  onPointerDown?: (e: FabricPointerEvent) => void;
  onPointerMove?: (e: FabricPointerEvent) => void;
  onPointerUp?: (e: FabricPointerEvent) => void;
  onDragStart?: (e: FabricPointerEvent) => void;
  onDragMove?: (e: FabricPointerEvent) => void;
  onDragEnd?: (e: FabricPointerEvent) => void;
  enabled?: boolean;
}

export function usePointerEvents({
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onDragStart,
  onDragMove,
  onDragEnd,
  enabled = true
}: UsePointerEventsProps) {
  const canvasRef = useRef<FabricCanvas | null>(null);
  const isDraggingRef = useRef(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  
  // Set up event listeners when the component mounts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;

    const handlePointerMove = (e: FabricPointerEvent) => {
      if (onPointerMove) {
        onPointerMove(e);
      }
      
      if (isDraggingRef.current && onDragMove) {
        const { x, y } = lastPositionRef.current;
        const dx = e.pointer?.x ?? 0 - x;
        const dy = e.pointer?.y ?? 0 - y;
        onDragMove({ ...e, movementX: dx, movementY: dy });
      }
      
      if (e.pointer) {
        lastPositionRef.current = { 
          x: e.pointer.x ?? 0, 
          y: e.pointer.y ?? 0 
        };
      }
    };
    
    const handlePointerDown = (e: FabricPointerEvent) => {
      if (onPointerDown) {
        onPointerDown(e);
      }
      
      if (e.pointer) {
        lastPositionRef.current = { 
          x: e.pointer.x ?? 0, 
          y: e.pointer.y ?? 0 
        };
      }
      
      isDraggingRef.current = true;
      
      if (onDragStart) {
        onDragStart(e);
      }
    };
    
    const handlePointerUp = (e: FabricPointerEvent) => {
      if (onPointerUp) {
        onPointerUp(e);
      }
      
      if (isDraggingRef.current && onDragEnd) {
        onDragEnd(e);
      }
      
      isDraggingRef.current = false;
    };

    // Using the proper canvas event binding
    canvas.on('mouse:move', handlePointerMove);
    canvas.on('mouse:down', handlePointerDown);
    canvas.on('mouse:up', handlePointerUp);
    
    // Clean up event listeners when the component unmounts
    return () => {
      if (canvas) {
        canvas.off('mouse:move', handlePointerMove);
        canvas.off('mouse:down', handlePointerDown);
        canvas.off('mouse:up', handlePointerUp);
      }
    };
  }, [
    enabled,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onDragStart,
    onDragMove,
    onDragEnd
  ]);
  
  return { canvasRef };
}
