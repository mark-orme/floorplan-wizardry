
import React, { useMemo } from 'react';
import { DrawingMode } from '@/constants/drawingModes';
import BrushCursorPreview from '@/components/canvas/BrushCursorPreview';
import MeasurementGuideModal from '@/components/MeasurementGuideModal';

interface UseMemoizedDrawingComponentsProps {
  tool: DrawingMode;
  lineColor: string;
  lineThickness: number;
  showGuides?: boolean;
}

export const useMemoizedDrawingComponents = ({
  tool,
  lineColor,
  lineThickness,
  showGuides = false
}: UseMemoizedDrawingComponentsProps) => {
  const [showMeasurementGuide, setShowMeasurementGuide] = React.useState(false);
  
  // Create memoized brush cursor preview
  const brushCursorPreview = useMemo(() => (
    <BrushCursorPreview
      color={lineColor}
      size={lineThickness}
      visible={tool === DrawingMode.DRAW || tool === DrawingMode.PENCIL}
    />
  ), [tool, lineColor, lineThickness]);
  
  // Create memoized measurement guide modal
  const measurementGuideModal = useMemo(() => (
    <MeasurementGuideModal
      isOpen={showMeasurementGuide}
      onClose={() => setShowMeasurementGuide(false)}
    />
  ), [showMeasurementGuide]);
  
  // Function to show the measurement guide
  const openMeasurementGuide = () => {
    setShowMeasurementGuide(true);
  };
  
  return {
    brushCursorPreview,
    measurementGuideModal,
    openMeasurementGuide
  };
};
