
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

interface BrushCursorPreviewProps {
  fabricCanvas: FabricCanvas | null;
  tool: DrawingMode;
  lineColor: string;
  lineThickness: number;
  visible?: boolean;
}

export const BrushCursorPreview: React.FC<BrushCursorPreviewProps> = ({
  fabricCanvas,
  tool,
  lineColor,
  lineThickness,
  visible = true
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  // Show cursor only for drawing tools
  const shouldShowCursor = visible && (
    tool === DrawingMode.DRAW ||
    tool === DrawingMode.PENCIL ||
    tool === DrawingMode.BRUSH
  );
  
  // Set cursor size based on line thickness
  const cursorSize = Math.max(lineThickness, 4);
  
  // Track mouse position and update cursor
  useEffect(() => {
    if (!fabricCanvas || !cursorRef.current) return;
    
    const cursor = cursorRef.current;
    
    const updateCursorPosition = (e: MouseEvent) => {
      const rect = fabricCanvas.getElement().getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
    };
    
    const canvasEl = fabricCanvas.getElement();
    
    if (shouldShowCursor) {
      cursor.style.display = 'block';
      canvasEl.addEventListener('mousemove', updateCursorPosition);
    } else {
      cursor.style.display = 'none';
    }
    
    return () => {
      canvasEl.removeEventListener('mousemove', updateCursorPosition);
    };
  }, [fabricCanvas, shouldShowCursor]);
  
  if (!shouldShowCursor) return null;
  
  return (
    <div
      ref={cursorRef}
      className="pointer-events-none absolute z-50 transform -translate-x-1/2 -translate-y-1/2"
      style={{
        width: `${cursorSize}px`,
        height: `${cursorSize}px`,
        backgroundColor: lineColor,
        opacity: 0.6,
        borderRadius: '50%',
        border: '1px solid white',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.2)'
      }}
    />
  );
};
