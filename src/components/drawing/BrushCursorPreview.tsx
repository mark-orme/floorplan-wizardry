
import React from 'react';
import { Point } from '@/types/fabric-unified';

interface BrushCursorPreviewProps {
  position?: Point | null;
  thickness?: number;
  color?: string;
  size?: number;
  visible?: boolean;
}

export const BrushCursorPreview: React.FC<BrushCursorPreviewProps> = ({ 
  position = null, 
  thickness = 2, 
  color = '#000000',
  size,
  visible = true
}) => {
  const actualSize = size || thickness;
  
  if (!visible || !position) return null;
  
  return (
    <div 
      style={{
        position: 'absolute',
        left: position.x - actualSize / 2,
        top: position.y - actualSize / 2,
        width: actualSize,
        height: actualSize,
        borderRadius: '50%',
        backgroundColor: color,
        opacity: 0.5,
        pointerEvents: 'none'
      }}
    />
  );
};

export default BrushCursorPreview;
