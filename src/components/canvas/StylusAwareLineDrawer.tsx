import React, { useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useStraightLineTool } from '@/hooks/straightLineTool';
import { cn } from '@/lib/utils';
import { LineToolMeasurementOverlay } from './LineToolMeasurementOverlay';

interface StylusAwareLineDrawerProps {
  canvas: FabricCanvas | null;
  enabled: boolean;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

/**
 * Component that renders a line drawing tool with enhanced stylus support
 */
export const StylusAwareLineDrawer: React.FC<StylusAwareLineDrawerProps> = ({
  canvas,
  enabled,
  lineColor,
  lineThickness,
  saveCurrentState
}) => {
  const [showMeasurement, setShowMeasurement] = useState(true);
  
  // Initialize the straight line tool with stylus support
  const {
    isActive,
    inputMethod,
    isPencilMode,
    snapEnabled,
    anglesEnabled,
    measurementData,
    toggleGridSnapping,
    toggleAngles,
    isDrawing,
    renderTooltip
  } = useStraightLineTool();
  
  // Hide measurement after some time of inactivity
  useEffect(() => {
    if (isDrawing) {
      setShowMeasurement(true);
    } else if (measurementData.distance !== null) {
      const timer = setTimeout(() => {
        setShowMeasurement(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isDrawing, measurementData.distance]);
  
  return (
    <>
      {/* Render the dynamic tooltip through portal */}
      {isActive && renderTooltip()}
      
      {/* Stylus indicator */}
      {isPencilMode && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md z-50">
          Pencil Mode
        </div>
      )}
      
      {/* Enhanced measurement overlay */}
      <LineToolMeasurementOverlay
        visible={showMeasurement && !isActive}
        distance={measurementData.distance}
        angle={measurementData.angle}
        isSnapped={measurementData.snapped}
        unit={measurementData.unit}
      />
      
      {/* Controls */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        <button 
          onClick={toggleGridSnapping}
          className={cn(
            "p-2 rounded-full shadow-md transition-colors",
            snapEnabled ? "bg-green-500 text-white" : "bg-white text-gray-800"
          )}
          title={snapEnabled ? "Grid snapping enabled (click to disable)" : "Grid snapping disabled (click to enable)"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3h18v18H3z"></path>
            <path d="M3 9h18"></path>
            <path d="M3 15h18"></path>
            <path d="M9 3v18"></path>
            <path d="M15 3v18"></path>
          </svg>
        </button>
        
        <button 
          onClick={toggleAngles}
          className={cn(
            "p-2 rounded-full shadow-md transition-colors",
            anglesEnabled ? "bg-blue-500 text-white" : "bg-white text-gray-800"
          )}
          title={anglesEnabled ? "Angle snapping enabled (click to disable)" : "Angle snapping disabled (click to enable)"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3v18h18"></path>
            <path d="M3 3l18 18"></path>
          </svg>
        </button>
      </div>
    </>
  );
};
