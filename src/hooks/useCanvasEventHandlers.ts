
import { useCallback, useEffect } from 'react';
import { Canvas } from 'fabric';
import { useObjectEvents } from './canvas/useObjectEvents';

interface UseCanvasEventHandlersProps {
  canvasRef: React.MutableRefObject<Canvas | null>;
}

export const useCanvasEventHandlers = ({ 
  canvasRef 
}: UseCanvasEventHandlersProps) => {
  // Use the object events hook for basic object interactions
  const objectEvents = useObjectEvents({
    canvasRef,
    onObjectSelected: (obj) => console.log('Selected:', obj),
    onObjectModified: (obj) => console.log('Modified:', obj)
  });

  // Set up basic canvas event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: any) => {
      console.log('Canvas mouse down', e.pointer);
    };

    const handleMouseMove = (e: any) => {
      // Non-verbose logging to avoid console spam
      // console.log('Canvas mouse move', e.pointer);
    };

    const handleMouseUp = (e: any) => {
      console.log('Canvas mouse up', e.pointer);
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [canvasRef]);

  return {
    ...objectEvents
  };
};

export default useCanvasEventHandlers;
