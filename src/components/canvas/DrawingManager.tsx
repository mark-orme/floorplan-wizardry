
import React, { useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { toast } from 'sonner';

// Now import as default components
import BrushCursorPreview from '@/components/canvas/BrushCursorPreview';
import MeasurementGuideModal from '@/components/MeasurementGuideModal';

interface DrawingManagerProps {
  canvas: FabricCanvas | null;
  activeTool: DrawingMode;
  lineColor: string;
  lineThickness: number;
  showMeasurementGuide?: boolean;
  onShowMeasurementGuideChange?: (show: boolean) => void;
}

export const DrawingManager: React.FC<DrawingManagerProps> = ({
  canvas,
  activeTool,
  lineColor,
  lineThickness,
  showMeasurementGuide = false,
  onShowMeasurementGuideChange = () => {}
}) => {
  // Update canvas drawing mode when active tool changes
  useEffect(() => {
    if (!canvas) return;
    
    // Reset previous settings
    canvas.isDrawingMode = false;
    canvas.selection = true;
    
    // Apply tool-specific settings
    switch (activeTool) {
      case DrawingMode.DRAW:
      case DrawingMode.PENCIL:
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.color = lineColor;
        canvas.freeDrawingBrush.width = lineThickness;
        break;
        
      case DrawingMode.SELECT:
        canvas.selection = true;
        break;
        
      case DrawingMode.MEASURE:
        onShowMeasurementGuideChange(true);
        break;
        
      default:
        toast.info(`Tool ${activeTool} not implemented yet`);
    }
    
    canvas.requestRenderAll();
  }, [canvas, activeTool, lineColor, lineThickness, onShowMeasurementGuideChange]);
  
  // Set up canvas events
  useEffect(() => {
    if (!canvas) return;
    
    const handleMouseDown = () => {};
    const handleMouseMove = () => {};
    const handleMouseUp = () => {};
    const handleSelectionCreated = () => {};
    
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    canvas.on('selection:created', handleSelectionCreated);
    
    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
      canvas.off('selection:created', handleSelectionCreated);
    };
  }, [canvas, activeTool]);
  
  // Skip rendering if no canvas
  if (!canvas) return null;
  
  return (
    <>
      {canvas && activeTool === DrawingMode.DRAW && (
        <BrushCursorPreview 
          canvas={canvas} 
          size={lineThickness} 
          color={lineColor} 
        />
      )}
      
      <MeasurementGuideModal 
        open={showMeasurementGuide} 
        onOpenChange={onShowMeasurementGuideChange} 
      />
    </>
  );
};
