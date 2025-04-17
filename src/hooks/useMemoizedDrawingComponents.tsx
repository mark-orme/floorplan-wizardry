
import React, { useMemo } from 'react';
import { BrushCursorPreview } from '@/components/canvas/BrushCursorPreview';
import { MeasurementGuideModal } from '@/components/MeasurementGuideModal';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

// Memoized components
export const MemoizedBrushCursorPreview = React.memo(BrushCursorPreview);
export const MemoizedMeasurementGuideModal = React.memo(MeasurementGuideModal);

// Hook to optimize drawing components rendering
export const useMemoizedDrawingComponents = ({
  fabricCanvas,
  tool,
  lineColor,
  lineThickness,
  showGuide,
  handleCloseGuide,
  handleOpenGuideChange
}: {
  fabricCanvas: FabricCanvas | null;
  tool: DrawingMode;
  lineColor: string;
  lineThickness: number;
  showGuide: boolean;
  handleCloseGuide: () => void;
  handleOpenGuideChange: (open: boolean) => void;
}) => {
  
  // Memoized brush cursor preview
  const brushPreview = useMemo(() => {
    return (
      <MemoizedBrushCursorPreview 
        fabricCanvas={fabricCanvas} 
        tool={tool}
        lineColor={lineColor}
        lineThickness={lineThickness}
      />
    );
  }, [fabricCanvas, tool, lineColor, lineThickness]);
  
  // Memoized measurement guide
  const measurementGuide = useMemo(() => {
    return (
      <MemoizedMeasurementGuideModal 
        open={showGuide} 
        onClose={handleCloseGuide}
        onOpenChange={handleOpenGuideChange}
      />
    );
  }, [showGuide, handleCloseGuide, handleOpenGuideChange]);
  
  return {
    brushPreview,
    measurementGuide
  };
};
