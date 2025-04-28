
import { 
  MousePointer, 
  Pencil, 
  Square, 
  Line, 
  Eraser, 
  Hand, 
  LayoutGrid, 
  Plus, 
  Minus, 
  Undo2, 
  Redo2,
  MoveHorizontal,
  PenLine
} from 'lucide-react';

// Map drawing modes to their respective icons
export const toolToIconMap = {
  SELECT: MousePointer,
  DRAW: Pencil,
  RECTANGLE: Square,
  LINE: Line,
  STRAIGHT_LINE: PenLine,
  ERASER: Eraser,
  HAND: Hand,
  GRID: LayoutGrid,
  PAN: MoveHorizontal
};

// Export styling icon mappings
export const stylingIconMap = {
  increase: Plus,
  decrease: Minus,
  undo: Undo2,
  redo: Redo2
};

export default {
  ...toolToIconMap,
  ...stylingIconMap
};
