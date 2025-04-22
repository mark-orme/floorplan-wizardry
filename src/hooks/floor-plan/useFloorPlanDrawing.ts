import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { v4 as uuidv4 } from 'uuid';
import { FloorPlan, Wall, Room, Stroke, Point } from '@/types/floorPlan';
import { DrawingMode } from '@/constants/drawingModes';
import { useFabricHelpers } from '@/hooks/useFabricHelpers';
import { useObjectActions } from '@/hooks/useObjectActions';
import { useWallDrawing } from '@/hooks/drawing/useWallDrawing';
import { useRoomDrawing } from '@/hooks/drawing/useRoomDrawing';
import { useStrokeDrawing } from '@/hooks/drawing/useStrokeDrawing';
import { useObjectSelection } from '@/hooks/useObjectSelection';
import { useObjectSnapping } from '@/hooks/useObjectSnapping';
import { useHistory } from '@/hooks/useHistory';
import { useBatchDrawing } from '@/hooks/useBatchDrawing';

interface UseFloorPlanDrawingProps {
  floorPlan: FloorPlan;
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingMode;
  onFloorPlanUpdate: (floorPlan: FloorPlan) => void;
}

export const useFloorPlanDrawing = ({
  floorPlan,
  fabricCanvasRef,
  tool,
  onFloorPlanUpdate
}: UseFloorPlanDrawingProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Helpers and Actions
  const { addWall, addRoom, addStroke, updateObject, deleteObject } = useObjectActions({
    fabricCanvasRef,
    onFloorPlanUpdate
  });
  
  const { zoomToExtents } = useFabricHelpers({ fabricCanvasRef });
  
  // Drawing Hooks
  const wallDrawing = useWallDrawing({ fabricCanvasRef, isDrawing, setIsDrawing, addWall });
  const roomDrawing = useRoomDrawing({ fabricCanvasRef, isDrawing, setIsDrawing, addRoom });
  const strokeDrawing = useStrokeDrawing({ fabricCanvasRef, isDrawing, setIsDrawing, addStroke });
  
  // Selection and Snapping
  const { handleObjectSelect } = useObjectSelection({ fabricCanvasRef, updateObject });
  const { snapPoint } = useObjectSnapping({ fabricCanvasRef });
  
  // History
  const { saveState, restoreState } = useHistory({ fabricCanvasRef, floorPlan, onFloorPlanUpdate });
  
  // Batch Drawing
  const { drawBatchedFloorPlan } = useBatchDrawing({ fabricCanvasRef });
  
  // Drawing mode switch
  const handleDrawingEvent = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');
    canvas.off('object:moving');
    canvas.off('object:modified');
    canvas.off('selection:created');
    canvas.off('selection:updated');
    
    switch (tool) {
      case DrawingMode.WALL:
        wallDrawing.enableWallDrawing();
        break;
      case DrawingMode.ROOM:
        roomDrawing.enableRoomDrawing();
        break;
      case DrawingMode.STROKE:
        strokeDrawing.enableStrokeDrawing();
        break;
      case DrawingMode.SELECT:
        handleObjectSelect();
        break;
      default:
        break;
    }
  }, [fabricCanvasRef, tool, wallDrawing, roomDrawing, strokeDrawing, handleObjectSelect]);
  
  // Initial drawing setup
  const drawFloorPlan = useCallback((canvas: FabricCanvas, floorPlan: FloorPlan) => {
    if (!canvas) return;
    
    // Clear existing objects
    canvas.clear();
    
    // Set background color
    canvas.backgroundColor = '#f0f0f0';
    
    // Disable group selection
    canvas.selection = false;
    
    // Render optimized floor plan
    drawBatchedFloorPlan(canvas, floorPlan);
    
    // Re-enable events and selection
    canvas.selection = true;
    canvas.renderAll();
    
    // Zoom to extents
    zoomToExtents();
  }, [drawBatchedFloorPlan, zoomToExtents]);
  
  return {
    isDrawing,
    setIsDrawing,
    handleDrawingEvent,
    drawFloorPlan,
    saveState,
    restoreState,
    snapPoint,
    addWall,
    addRoom,
    addStroke,
    updateObject,
    deleteObject
  };
};
