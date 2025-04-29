
import React, { useEffect, useState } from 'react';

interface BrushCursorPreviewProps {
  color: string;
  size: number;
  visible: boolean;
  position?: { x: number; y: number };
}

const BrushCursorPreview: React.FC<BrushCursorPreviewProps> = ({
  color = '#000000',
  size = 5,
  visible = false,
  position = { x: 0, y: 0 }
}) => {
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>(position);
  
  useEffect(() => {
    if (!visible) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [visible]);
  
  if (!visible) return null;
  
  return (
    <div
      className="pointer-events-none fixed z-50"
      style={{
        left: cursorPos.x - size / 2,
        top: cursorPos.y - size / 2,
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        opacity: 0.6,
        transform: 'translate(-50%, -50%)',
        transition: 'width 0.1s, height 0.1s'
      }}
    />
  );
};

export default BrushCursorPreview;
