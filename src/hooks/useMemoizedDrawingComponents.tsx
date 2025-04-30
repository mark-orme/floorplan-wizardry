
import React, { useMemo } from 'react';
import { BrushCursorPreview } from '@/components/drawing/BrushCursorPreview';
import { MeasurementGuideModal } from '@/components/modals/MeasurementGuideModal'; 
import { DrawingControls } from '@/components/drawing/DrawingControls';
import { Point } from '@/types/fabric-unified';

interface UseMemoizedDrawingComponentsProps {
  cursorPosition: Point | null;
  lineThickness: number;
  lineColor: string;
  showMeasurementGuide: boolean;
  closeMeasurementGuide: () => void;
}

export const useMemoizedDrawingComponents = ({
  cursorPosition,
  lineThickness,
  lineColor,
  showMeasurementGuide,
  closeMeasurementGuide
}: UseMemoizedDrawingComponentsProps) => {

  // Memoize components to prevent re-renders
  const memoizedComponents = useMemo(() => ({
    brushCursorPreview: (
      <BrushCursorPreview 
        position={cursorPosition}
        thickness={lineThickness}
        color={lineColor}
      />
    ),
    measurementGuideModal: (
      <MeasurementGuideModal 
        open={showMeasurementGuide} 
        onClose={closeMeasurementGuide}
      />
    ),
    drawingControls: (
      <DrawingControls 
        lineThickness={lineThickness}
        lineColor={lineColor}
      />
    )
  }), [cursorPosition, lineThickness, lineColor, showMeasurementGuide, closeMeasurementGuide]);

  return memoizedComponents;
};
