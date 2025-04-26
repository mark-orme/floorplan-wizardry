
import React, { useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface BrushCursorPreviewProps {
  canvas: FabricCanvas;
  size: number;
  color: string;
}

export const BrushCursorPreview: React.FC<BrushCursorPreviewProps> = ({
  canvas,
  size,
  color
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const pointer = canvas.getPointer(e);
      setPosition({ x: pointer.x, y: pointer.y });
      setIsVisible(true);
    };

    const handleMouseOut = () => {
      setIsVisible(false);
    };

    const canvasEl = canvas.getElement();
    canvasEl.addEventListener('mousemove', handleMouseMove);
    canvasEl.addEventListener('mouseout', handleMouseOut);

    return () => {
      canvasEl.removeEventListener('mousemove', handleMouseMove);
      canvasEl.removeEventListener('mouseout', handleMouseOut);
    };
  }, [canvas]);

  if (!isVisible) return null;

  return (
    <div
      className="pointer-events-none absolute rounded-full border border-white"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: `${color}33`,
        borderColor: color,
        transform: `translate(${position.x}px, ${position.y}px)`,
        marginLeft: `-${size / 2}px`,
        marginTop: `-${size / 2}px`,
      }}
    />
  );
};

export default BrushCursorPreview;
