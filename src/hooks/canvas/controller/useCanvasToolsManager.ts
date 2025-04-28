
import {
  AiOutlineAppstore as Square,
  AiOutlineFileText as Type,
  AiOutlineMore as MousePointer,
  AiOutlineEdit as Pencil,
  AiOutlineHdd as Hand,
  AiOutlineDelete as Eraser
} from 'react-icons/ai';
import { DrawingMode } from '@/constants/drawingModes';
import { useDrawingContext } from '@/hooks/useDrawingContext';

export const useCanvasToolsManager = () => {
  const { setActiveTool } = useDrawingContext();

  const toolIcons = {
    [DrawingMode.SELECT]: MousePointer,
    [DrawingMode.DRAW]: Pencil,
    [DrawingMode.ERASE]: Eraser,
    [DrawingMode.HAND]: Hand,
    [DrawingMode.WALL]: Square,
    [DrawingMode.PENCIL]: Pencil,
    [DrawingMode.ROOM]: Square,
    [DrawingMode.TEXT]: Type,
    [DrawingMode.SHAPE]: Square,
    [DrawingMode.LINE]: Pencil,
    [DrawingMode.RECTANGLE]: Square,
    [DrawingMode.CIRCLE]: Square,
    [DrawingMode.DOOR]: Square,
    [DrawingMode.WINDOW]: Square,
    [DrawingMode.STRAIGHT_LINE]: Pencil,
    [DrawingMode.PAN]: Hand,
    [DrawingMode.ERASER]: Eraser,
    [DrawingMode.MEASURE]: Square
  };

  const handleToolChange = (tool: DrawingMode) => {
    setActiveTool(tool);
  };

  return { toolIcons, handleToolChange };
};
