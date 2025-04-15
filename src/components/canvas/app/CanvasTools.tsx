
import React from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { CanvasEventManager } from '../CanvasEventManager';
import { TouchGestureHandler } from '../TouchGestureHandler';
import { ToolVisualizer } from '../ToolVisualizer';
import { DrawingMode } from '@/constants/drawingModes';

interface CanvasToolsProps {
  canvas: FabricCanvas;
  tool: DrawingMode;
  lineColor: string;
  lineThickness: number;
  gridLayerRef: React.MutableRefObject<any[]>;
  saveCurrentState: () => void;
  undo: () => void;
  redo: () => void;
  deleteSelectedObjects: () => void;
  isApplePencil: boolean;
  enableSync?: boolean;
  onDrawingComplete?: () => void;
}

export const CanvasTools: React.FC<CanvasToolsProps> = ({
  canvas,
  tool,
  lineColor,
  lineThickness,
  gridLayerRef,
  saveCurrentState,
  undo,
  redo,
  deleteSelectedObjects,
  isApplePencil,
  enableSync = true,
  onDrawingComplete
}) => {
  return (
    <>
      <CanvasEventManager
        canvas={canvas}
        tool={tool}
        lineColor={lineColor}
        lineThickness={lineThickness}
        gridLayerRef={gridLayerRef}
        saveCurrentState={saveCurrentState}
        undo={undo}
        redo={redo}
        deleteSelectedObjects={deleteSelectedObjects}
        enableSync={enableSync}
        onDrawingComplete={onDrawingComplete}
      />
      
      <TouchGestureHandler 
        canvas={canvas} 
        lineThickness={lineThickness}
        tool={tool}
      />
      
      <ToolVisualizer 
        tool={tool}
        isApplePencil={isApplePencil}
      />
    </>
  );
};
