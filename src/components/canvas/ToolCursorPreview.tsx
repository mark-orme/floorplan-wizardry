import React, { useState, useEffect } from 'react';
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from '@/types/core/Point';

interface ToolCursorPreviewProps {
  tool: DrawingMode;
  position: Point | null;
  isActive: boolean;
  isSnapped?: boolean;
  showAngleGuide?: boolean;
  angle?: number;
  size?: number;
}

export const ToolCursorPreview: React.FC<ToolCursorPreviewProps> = ({
  tool,
  position,
  isActive,
  isSnapped = false,
  showAngleGuide = false,
  angle = 0,
  size = 12
}) => {
  const [cursorType, setCursorType] = useState<'dot' | 'crosshair' | 'snap'>('dot');
  
  useEffect(() => {
    // Determine cursor type based on tool
    switch (tool) {
      case DrawingMode.DRAW:
        setCursorType('dot');
        break;
      case DrawingMode.STRAIGHT_LINE:
      case DrawingMode.WALL:
        setCursorType('crosshair');
        break;
      default:
        setCursorType('dot');
    }
  }, [tool]);
  
  if (!position || !isActive) return null;
  
  const renderCursor = () => {
    // Override with snap cursor if position is snapped
    if (isSnapped) {
      return (
        <div 
          className="absolute pointer-events-none"
          style={{
            left: position.x - size/2,
            top: position.y - size/2,
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: 'rgba(59, 130, 246, 0.3)',
            border: '2px solid #3b82f6',
            boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)',
            transition: 'transform 0.1s ease-out',
            transform: 'scale(1.2)',
            zIndex: 5000
          }}
        />
      );
    }
    
    // Otherwise, use the appropriate cursor based on tool
    switch (cursorType) {
      case 'dot':
        return (
          <div 
            className="absolute pointer-events-none"
            style={{
              left: position.x - size/3,
              top: position.y - size/3,
              width: size/1.5,
              height: size/1.5,
              borderRadius: '50%',
              backgroundColor: '#000',
              opacity: 0.6,
              zIndex: 5000
            }}
          />
        );
      case 'crosshair':
        return (
          <div className="absolute pointer-events-none" style={{ left: position.x, top: position.y, zIndex: 5000 }}>
            <div style={{
              position: 'absolute',
              left: -10,
              top: -1,
              width: 20,
              height: 2,
              backgroundColor: '#000',
              opacity: 0.6
            }} />
            <div style={{
              position: 'absolute',
              left: -1,
              top: -10,
              width: 2,
              height: 20,
              backgroundColor: '#000',
              opacity: 0.6
            }} />
          </div>
        );
      default:
        return null;
    }
  };
  
  // Render angle guide if needed (for shift-constrained angles)
  const renderAngleGuide = () => {
    if (!showAngleGuide || angle === undefined) return null;
    
    const guideLength = 40;
    const angleRad = angle * Math.PI / 180;
    const endX = position.x + Math.cos(angleRad) * guideLength;
    const endY = position.y + Math.sin(angleRad) * guideLength;
    
    return (
      <div 
        className="absolute pointer-events-none"
        style={{
          left: position.x,
          top: position.y,
          width: 1,
          height: 1,
          zIndex: 4999
        }}
      >
        <svg width={guideLength * 2} height={guideLength * 2} style={{ position: 'absolute', left: -guideLength, top: -guideLength }}>
          <line 
            x1={guideLength} 
            y1={guideLength} 
            x2={endX - position.x + guideLength} 
            y2={endY - position.y + guideLength} 
            stroke="#f97316"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
        </svg>
      </div>
    );
  };
  
  return (
    <>
      {renderCursor()}
      {renderAngleGuide()}
    </>
  );
};
