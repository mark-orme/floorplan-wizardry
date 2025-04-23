import React, { useState, useCallback } from 'react';
import { useDrawingContext } from '@/contexts/DrawingContext';
import { FloorPlanCanvas } from '@/components/canvas/FloorPlanCanvas';
import { DrawingMode } from '@/constants/drawingModes';
import { Button } from '@/components/ui/button';

export const MainFloorPlanEditor: React.FC = () => {
  const {
    tool,
    setTool,
    lineColor,
    setLineColor,
    canUndo,
    canRedo,
    setCanUndo,
    setCanRedo,
    addToUndoStack,
  } = useDrawingContext();

  const saveCurrentState = useCallback(() => {
    // Save the current state of the floor plan
    console.log('Saving current state');
  }, []);

  return (
    <div className="w-full h-full">
      <FloorPlanCanvas
        {...{
          tool,
          setTool,
          lineColor,
          setLineColor,
          canUndo,
          canRedo,
          setCanUndo,
          setCanRedo,
          addToUndoStack,
        }}
      />
      <div className="absolute bottom-4 left-4 space-x-2">
        <Button variant="outline" size="sm" onClick={saveCurrentState}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default MainFloorPlanEditor;
