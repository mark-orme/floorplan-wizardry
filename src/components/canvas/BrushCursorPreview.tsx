
import React, { useEffect, useState } from 'react';

interface BrushCursorPreviewProps {
  size: number;
  color: string;
  visible?: boolean;
}

/**
 * Component to show brush cursor preview
 */
const BrushCursorPreview: React.FC<BrushCursorPreviewProps> = ({
  size,
  color,
  visible = true
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Track mouse position
  useEffect(() => {
    if (!visible) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [visible]);
  
  if (!visible) return null;
  
  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: position.x - size / 2,
        top: position.y - size / 2,
        width: size,
        height: size,
        borderRadius: '50%',
        border: `1px solid black`,
        backgroundColor: `${color}80`
      }}
    />
  );
};

export default BrushCursorPreview;
