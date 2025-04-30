
import React from 'react';
import { Point } from '@/types/fabric-unified';

interface BrushCursorPreviewProps {
  position: Point | null;
  thickness: number;
  color: string;
}

export const BrushCursorPreview: React.FC<BrushCursorPreviewProps> = ({ 
  position, 
  thickness, 
  color 
}) => {
  if (!position) return null;
  
  return (
    <div 
      style={{
        position: 'absolute',
        left: position.x - thickness / 2,
        top: position.y - thickness / 2,
        width: thickness,
        height: thickness,
        borderRadius: '50%',
        backgroundColor: color,
        opacity: 0.5,
        pointerEvents: 'none'
      }}
    />
  );
};
