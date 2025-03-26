
import React, { useEffect, useState, useRef } from 'react';
import { useCanvasController } from './canvas/controller/CanvasController';
import { DistanceTooltip } from './DistanceTooltip';
import { MeasurementGuide } from './MeasurementGuide';
import { DrawingTool } from '@/hooks/useCanvasState';
import { DrawingState } from '@/types/drawingTypes';

interface CanvasProps {
  'data-readonly'?: boolean;
}

/**
 * Main Canvas component
 * Handles rendering and interactions with the canvas
 * @param {CanvasProps} props - Component properties
 * @returns {JSX.Element} - Canvas component
 */
export const Canvas = ({ 'data-readonly': readonly }: CanvasProps): JSX.Element => {
  const {
    canvasRef,
    debugInfo,
    hasError,
    errorMessage,
    tool,
    gia,
    floorPlans,
    currentFloor,
    drawingState,
    lineThickness,
    lineColor,
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    clearCanvas,
    saveCanvas,
    deleteSelectedObjects,
    handleLineThicknessChange,
    handleLineColorChange,
    handleRetry,
    openMeasurementGuide
  } = useCanvasController();
  
  const [lockDrawing, setLockDrawing] = useState(false);
  
  useEffect(() => {
    if (readonly) {
      setLockDrawing(true);
    }
  }, [readonly]);
  
  // Enhanced tooltip visibility logic - show during active drawing with line tools
  // and also when hovering over existing lines in selection mode
  const isTooltipVisible = Boolean(
    // Always show during active drawing with line tools
    (drawingState?.isDrawing && (tool === "straightLine" || tool === "wall")) ||
    // Show when hovering with these tools even if not actively drawing
    (!drawingState?.isDrawing && (tool === "straightLine" || tool === "wall") && 
     drawingState?.cursorPosition != null && drawingState?.startPoint != null) ||
    // Also show when in select mode and actively manipulating objects
    (tool === "select" && drawingState?.isDrawing) ||
    // Show when objects are selected (for measurements of selected objects)
    (tool === "select" && drawingState?.selectionActive)
  );
  
  // Get relevant points for the tooltip
  const startPoint = drawingState?.startPoint || drawingState?.cursorPosition;
  const currentPoint = drawingState?.currentPoint || drawingState?.cursorPosition;
  const midPoint = drawingState?.midPoint;
  
  // Debug logging to help troubleshoot tooltip visibility
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("Drawing state updated:", drawingState);
      console.log("Tooltip visibility:", isTooltipVisible);
      console.log("Tooltip points:", { 
        startPoint,
        currentPoint,
        midPoint,
        cursorPosition: drawingState?.cursorPosition
      });
    }
  }, [drawingState, isTooltipVisible, startPoint, currentPoint, midPoint]);
  
  return (
    <div className="canvas-wrapper relative">
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-80 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h3 className="text-xl font-bold text-red-600 mb-2">Canvas Error</h3>
            <p className="text-gray-700">{errorMessage}</p>
            <p className="mt-4 text-sm text-gray-500">
              Try refreshing the page or contact support if the issue persists.
            </p>
            <button 
              onClick={handleRetry}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry Loading
            </button>
          </div>
        </div>
      )}
      
      <div className="canvas-element w-full h-full border border-gray-200 rounded-md overflow-hidden">
        <canvas ref={canvasRef} />
      </div>
      
      {/* Tooltip for distance measurement - improved for better visibility */}
      {isTooltipVisible && startPoint && currentPoint && (
        <DistanceTooltip 
          startPoint={startPoint}
          currentPoint={currentPoint}
          midPoint={midPoint}
          position={drawingState?.cursorPosition}
          isVisible={isTooltipVisible}
          currentZoom={drawingState?.currentZoom}
        />
      )}
    </div>
  );
};
