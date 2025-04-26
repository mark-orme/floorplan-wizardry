
import React, { useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface BrushCursorPreviewProps {
  canvas: FabricCanvas;
  size: number;
  color: string;
}

const BrushCursorPreview: React.FC<BrushCursorPreviewProps> = ({
  canvas,
  size,
  color
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    if (!canvas) return;
    
    const handleMouseMove = (e: any) => {
      const pointer = canvas.getPointer(e.e);
      setPosition(pointer);
    };
    
    canvas.on('mouse:move', handleMouseMove);
    
    return () => {
      canvas.off('mouse:move', handleMouseMove);
    };
  }, [canvas]);
  
  // Get canvas container element
  const canvasElement = canvas?.getElement();
  const canvasRect = canvasElement?.getBoundingClientRect();
  
  if (!canvasRect) return null;
  
  return (
    <div
      style={{
        position: 'absolute',
        left: position.x + canvasRect.left,
        top: position.y + canvasRect.top,
        width: size,
        height: size,
        borderRadius: '50%',
        border: `1px solid ${color}`,
        backgroundColor: `${color}20`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
      }}
    />
  );
};

export default BrushCursorPreview;
