
import React, { useState, useEffect } from 'react';
import { DrawingMode } from '@/constants/drawingModes';

interface ToolHintOverlayProps {
  tool: DrawingMode;
  isDrawing: boolean;
  shiftPressed?: boolean;
  altPressed?: boolean;
  showSnapping?: boolean;
}

export const ToolHintOverlay: React.FC<ToolHintOverlayProps> = ({
  tool,
  isDrawing,
  shiftPressed = false,
  altPressed = false,
  showSnapping = false
}) => {
  const [hint, setHint] = useState<string>('');
  const [additionalHint, setAdditionalHint] = useState<string>('');
  
  // Update main hint based on tool and drawing state
  useEffect(() => {
    if (isDrawing) {
      switch (tool) {
        case DrawingMode.STRAIGHT_LINE:
          setHint('Release to complete the line');
          break;
        case DrawingMode.DRAW:
          setHint('Release to complete freehand drawing');
          break;
        case DrawingMode.RECTANGLE:
          setHint('Release to place rectangle');
          break;
        case DrawingMode.CIRCLE:
          setHint('Release to place circle');
          break;
        case DrawingMode.WALL:
          setHint('Click to place wall, double-click to complete');
          break;
        default:
          setHint('');
      }
    } else {
      switch (tool) {
        case DrawingMode.STRAIGHT_LINE:
          setHint('Click and drag to draw a line');
          break;
        case DrawingMode.DRAW:
          setHint('Click and drag to draw freehand');
          break;
        case DrawingMode.RECTANGLE:
          setHint('Click and drag to create a rectangle');
          break;
        case DrawingMode.CIRCLE:
          setHint('Click and drag to create a circle');
          break;
        case DrawingMode.SELECT:
          setHint('Click an object to select, drag to move');
          break;
        case DrawingMode.WALL:
          setHint('Click to start drawing a wall');
          break;
        case DrawingMode.ERASER:
          setHint('Click and drag over objects to erase');
          break;
        default:
          setHint('');
      }
    }
  }, [tool, isDrawing]);
  
  // Update additional hint based on keyboard modifiers
  useEffect(() => {
    let hints = [];
    
    if (shiftPressed) {
      switch (tool) {
        case DrawingMode.STRAIGHT_LINE:
          hints.push('Shift: Constrain to 45° angles');
          break;
        case DrawingMode.RECTANGLE:
          hints.push('Shift: Create perfect square');
          break;
        case DrawingMode.CIRCLE:
          hints.push('Shift: Create perfect circle');
          break;
        default:
          hints.push('Shift: Constrain proportions');
      }
    } else if (tool === DrawingMode.STRAIGHT_LINE || tool === DrawingMode.WALL) {
      hints.push('Hold Shift to constrain angle');
    }
    
    if (altPressed) {
      hints.push('Alt: Draw from center');
    } else if (tool === DrawingMode.RECTANGLE || tool === DrawingMode.CIRCLE) {
      hints.push('Hold Alt to draw from center');
    }
    
    if (showSnapping) {
      hints.push('Snapping to grid');
    }
    
    setAdditionalHint(hints.join(' • '));
  }, [tool, shiftPressed, altPressed, showSnapping]);
  
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center">
      {hint && (
        <div className="bg-black/80 text-white px-4 py-2 rounded-lg mb-2 shadow-lg text-sm font-medium">
          {hint}
        </div>
      )}
      {additionalHint && (
        <div className="bg-white/90 text-black border border-gray-200 px-3 py-1.5 rounded-md shadow-md text-xs">
          {additionalHint}
        </div>
      )}
    </div>
  );
};
