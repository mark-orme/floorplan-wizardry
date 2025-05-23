
import React, { useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useStraightLineTool } from '@/hooks/straightLineTool/useStraightLineTool';
import { cn } from '@/lib/utils';
import { LineToolMeasurementOverlay } from './LineToolMeasurementOverlay';

interface StylusAwareLineDrawerProps {
  canvas: FabricCanvas | null;
  enabled: boolean;
  lineColor: string;
  lineThickness: number;
  saveCurrentState?: () => void;
}

/**
 * Component that renders a line drawing tool with enhanced stylus support
 */
export const StylusAwareLineDrawer: React.FC<StylusAwareLineDrawerProps> = ({
  canvas,
  enabled,
  lineColor,
  lineThickness,
  saveCurrentState = () => {}
}) => {
  const [showMeasurement, setShowMeasurement] = useState(true);
  
  const straightLineTool = useStraightLineTool({
    enabled: enabled,
    canvas: canvas,
    lineColor: lineColor,
    lineThickness: lineThickness,
    saveCurrentState
  });
  
  const {
    snapEnabled,
    anglesEnabled,
    measurementData,
    toggleGridSnapping,
    toggleAngles,
    isDrawing,
    renderTooltip
  } = straightLineTool;
  
  useEffect(() => {
    if (isDrawing) {
      setShowMeasurement(true);
    } else if (measurementData && measurementData.distance !== undefined) {
      const timer = setTimeout(() => {
        setShowMeasurement(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isDrawing, measurementData]);
  
  // Convert null to undefined to match expected types
  const distance = measurementData?.distance === null ? undefined : measurementData?.distance;
  const angle = measurementData?.angle === null ? undefined : measurementData?.angle;
  const isSnapped = measurementData?.snapped === true;
  const unitValue = measurementData?.unit || 'px';
  
  return (
    <>
      {/* Render the dynamic tooltip through portal */}
      {enabled && renderTooltip && renderTooltip()}
      
      {/* Enhanced measurement overlay */}
      <LineToolMeasurementOverlay
        visible={showMeasurement && !enabled}
        distance={distance}
        angle={angle}
        isSnapped={isSnapped}
        unit={unitValue}
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
