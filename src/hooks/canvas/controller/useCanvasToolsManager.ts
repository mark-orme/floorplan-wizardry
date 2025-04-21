import { useState, useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { 
  Square, 
  Circle, 
  Type, 
  MousePointer, 
  Pencil, 
  Hand, 
  Eraser,
  Home
} from 'lucide-react';
import { Line } from '@/components/icons/Line';

// Define the tool interface
export interface Tool {
  id: string;
  name: string;
  icon: any;
  mode: DrawingMode;
  shortcut?: string;
}

// Updated interface with fabricCanvasRef
interface CanvasToolsManagerProps {
  canvas: any;
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef?: React.MutableRefObject<any[]>;
  defaultTool?: DrawingMode;
  onToolChange?: (tool: DrawingMode) => void;
  zoomLevel?: number;
  tool?: string | DrawingMode;
}

export const useCanvasToolsManager = ({
  canvas,
  fabricCanvasRef,
  defaultTool = DrawingMode.SELECT,
  onToolChange,
  zoomLevel,
  tool
}: CanvasToolsManagerProps) => {
  const [activeTool, setActiveTool] = useState<DrawingMode>(defaultTool);

  // Define available tools
  const tools: Tool[] = [
    {
      id: 'select',
      name: 'Select',
      icon: MousePointer,
      mode: DrawingMode.SELECT,
      shortcut: 'V'
    },
    {
      id: 'pencil',
      name: 'Pencil',
      icon: Pencil,
      mode: DrawingMode.DRAW,
      shortcut: 'P'
    },
    {
      id: 'line',
      name: 'Line',
      icon: Line,
      mode: DrawingMode.LINE,
      shortcut: 'L'
    },
    {
      id: 'rectangle',
      name: 'Rectangle',
      icon: Square,
      mode: DrawingMode.RECTANGLE,
      shortcut: 'R'
    },
    {
      id: 'circle',
      name: 'Circle',
      icon: Circle,
      mode: DrawingMode.CIRCLE,
      shortcut: 'C'
    },
    {
      id: 'text',
      name: 'Text',
      icon: Type,
      mode: DrawingMode.TEXT,
      shortcut: 'T'
    },
    {
      id: 'wall',
      name: 'Wall',
      icon: Line,
      mode: DrawingMode.WALL,
      shortcut: 'W'
    },
    {
      id: 'eraser',
      name: 'Eraser',
      icon: Eraser,
      mode: DrawingMode.ERASER,
      shortcut: 'E'
    },
    {
      id: 'hand',
      name: 'Pan',
      icon: Hand,
      mode: DrawingMode.PAN,
      shortcut: 'H'
    }
  ];

  // Set up canvas for the active tool
  const setupCanvasForTool = useCallback((tool: DrawingMode) => {
    if (!canvas) return;

    // Reset canvas state
    canvas.isDrawingMode = false;
    canvas.selection = true;

    // Configure canvas based on the active tool
    switch (tool) {
      case DrawingMode.SELECT:
        canvas.selection = true;
        canvas.defaultCursor = 'default';
        break;
      case DrawingMode.DRAW:
      case DrawingMode.PENCIL:
        canvas.isDrawingMode = true;
        canvas.defaultCursor = 'crosshair';
        break;
      case DrawingMode.LINE:
      case DrawingMode.RECTANGLE:
      case DrawingMode.CIRCLE:
      case DrawingMode.WALL:
        canvas.selection = false;
        canvas.defaultCursor = 'crosshair';
        break;
      case DrawingMode.TEXT:
        canvas.selection = false;
        canvas.defaultCursor = 'text';
        break;
      case DrawingMode.ERASER:
        canvas.selection = false;
        canvas.defaultCursor = 'cell';
        break;
      case DrawingMode.HAND:
      case DrawingMode.PAN:
        canvas.selection = false;
        canvas.defaultCursor = 'grab';
        break;
      default:
        canvas.selection = true;
        canvas.defaultCursor = 'default';
    }

    // Refresh canvas
    canvas.requestRenderAll();
  }, [canvas]);

  // Change the active tool
  const changeTool = useCallback((tool: DrawingMode) => {
    setActiveTool(tool);
    setupCanvasForTool(tool);
    if (onToolChange) {
      onToolChange(tool);
    }
  }, [setupCanvasForTool, onToolChange]);

  // Set up keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Find tool with matching shortcut
      const tool = tools.find(t => t.shortcut?.toLowerCase() === e.key.toLowerCase());
      if (tool) {
        changeTool(tool.mode);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [tools, changeTool]);

  // Initialize canvas with default tool
  useEffect(() => {
    if (canvas) {
      setupCanvasForTool(activeTool);
    }
  }, [canvas, activeTool, setupCanvasForTool]);

  return {
    tools,
    activeTool,
    changeTool
  };
};

export default useCanvasToolsManager;
