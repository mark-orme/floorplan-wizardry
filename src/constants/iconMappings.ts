
import { 
  AiOutlineArrowRight as ArrowRight,
  AiOutlineEye as Eye,
  AiOutlinePicture as Square,
  AiOutlineEdit as Pencil,
  AiOutlineHdd as Hand,
  AiOutlineDelete as Eraser,
  AiOutlineTable as LayoutGrid,
  AiOutlinePlus as Plus,
  AiOutlineMinus as Minus,
  AiOutlineUndo as Undo2,
  AiOutlineRedo as Redo2,
  AiOutlineSwap as MoveHorizontal,
  AiOutlineDash as PenLine,
  AiOutlineBgColors as Palette,
  AiOutlineSearch as Search,
  AiOutlineMenu as Menu,
  AiOutlineReload as Reload,
  AiOutlineZoomIn as ZoomIn,
  AiOutlineZoomOut as ZoomOut,
  AiOutlineDownload as Download,
  AiOutlineUpload as Upload,
  AiOutlineSave as Save,
  AiOutlineDelete as Delete
} from 'react-icons/ai';

export const toolToIconMap = {
  SELECT: Eye,
  DRAW: Pencil,
  RECTANGLE: Square,
  LINE: PenLine,
  STRAIGHT_LINE: PenLine,
  ERASER: Eraser,
  HAND: Hand,
  GRID: LayoutGrid,
  PAN: MoveHorizontal
};

export const stylingIconMap = {
  increase: Plus,
  decrease: Minus,
  undo: Undo2,
  redo: Redo2
};

// Export as default for components that import Icons
const Icons = {
  ...toolToIconMap,
  ...stylingIconMap,
  grid: LayoutGrid,
  zoomIn: ZoomIn,
  zoomOut: ZoomOut,
  reload: Reload,
  delete: Delete,
  save: Save,
  upload: Upload,
  download: Download,
  search: Search,
  menu: Menu
};

export default Icons;
