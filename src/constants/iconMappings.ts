import { 
  AiOutlineMouse as MousePointer,
  AiOutlinePencil as Pencil,
  AiOutlineSquare as Square,
  AiOutlineLine as Line,
  AiOutlineDelete as Eraser,
  AiOutlineHand as Hand,
  AiOutlineTable as LayoutGrid,
  AiOutlinePlus as Plus,
  AiOutlineMinus as Minus,
  AiOutlineUndo as Undo2,
  AiOutlineRedo as Redo2,
  AiOutlineSwap as MoveHorizontal,
  AiOutlineDash as PenLine
} from 'react-icons/ai';

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
