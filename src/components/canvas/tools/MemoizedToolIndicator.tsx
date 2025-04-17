
import React from 'react';
import { DrawingMode } from '@/constants/drawingModes';

interface ToolIndicatorProps {
  activeTool: DrawingMode;
}

/**
 * Memoized component to display the active drawing tool
 */
export const MemoizedToolIndicator = React.memo<ToolIndicatorProps>(({ activeTool }) => {
  const getToolName = () => {
    switch(activeTool) {
      case DrawingMode.SELECT: return 'Select';
      case DrawingMode.DRAW: return 'Draw';
      case DrawingMode.STRAIGHT_LINE: return 'Line';
      case DrawingMode.WALL: return 'Wall';
      case DrawingMode.ROOM: return 'Room';
      case DrawingMode.ERASER: return 'Eraser';
      case DrawingMode.HAND: return 'Pan';
      default: return 'Unknown';
    }
  };

  const getToolIcon = () => {
    switch(activeTool) {
      case DrawingMode.SELECT: return '👆';
      case DrawingMode.DRAW: return '✏️';
      case DrawingMode.STRAIGHT_LINE: return '📏';
      case DrawingMode.WALL: return '🧱';
      case DrawingMode.ROOM: return '🏠';
      case DrawingMode.ERASER: return '🧽';
      case DrawingMode.HAND: return '✋';
      default: return '❓';
    }
  };

  return (
    <div className="absolute top-4 left-4 bg-white/80 px-3 py-2 rounded-md shadow-md z-10">
      <div className="flex items-center gap-2">
        <span className="text-lg">{getToolIcon()}</span>
        <span className="font-medium">{getToolName()}</span>
      </div>
    </div>
  );
}, (prevProps, nextProps) => prevProps.activeTool === nextProps.activeTool);

MemoizedToolIndicator.displayName = 'MemoizedToolIndicator';

export default MemoizedToolIndicator;
