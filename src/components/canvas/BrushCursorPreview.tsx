
import React, { useEffect, useState, memo } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { usePointerPosition } from '@/hooks/usePointerPosition';
import { DrawingMode } from '@/constants/drawingModes';

interface BrushCursorPreviewProps {
  fabricCanvas: FabricCanvas | null;
  tool: DrawingMode;
  lineColor: string;
  lineThickness: number;
}

export const BrushCursorPreview: React.FC<BrushCursorPreviewProps> = memo(({
  fabricCanvas,
  tool,
  lineColor,
  lineThickness
}) => {
  const { position } = usePointerPosition(fabricCanvas);
  const [showPreview, setShowPreview] = useState(false);
  
  // Only show preview for drawing tools
  useEffect(() => {
    setShowPreview(
      tool === DrawingMode.DRAW || 
      tool === DrawingMode.STRAIGHT_LINE
    );
  }, [tool]);
  
  if (!showPreview || !position) return null;
  
  return (
    <div
      className="pointer-events-none fixed z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div
        style={{
          width: `${lineThickness}px`,
          height: `${lineThickness}px`,
          backgroundColor: lineColor,
          borderRadius: '50%',
          opacity: tool === DrawingMode.DRAW ? 0.8 : 0.8
        }}
      />
    </div>
  );
});

BrushCursorPreview.displayName = 'BrushCursorPreview';
