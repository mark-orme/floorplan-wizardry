import React from 'react';
import { 
  MousePointer, 
  Pencil, 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut, 
  Grid, 
  Trash, 
  Wifi, 
  WifiOff,
  Type
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DrawingMode } from '@/constants/drawingModes';
import { formatDistanceToNow } from 'date-fns';

interface ToolbarContainerProps {
  tool: DrawingMode;
  setTool: (tool: DrawingMode) => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoom: (direction: "in" | "out") => void;
  onClear: () => void;
  onDelete: () => void;
  gia: number;
  lineThickness: number;
  lineColor: string;
  showGrid: boolean;
  onToggleGrid: () => void;
  onLineThicknessChange: (thickness: number) => void;
  onLineColorChange: (color: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  isOffline: boolean;
  lastSaved: Date | null;
}

export const ToolbarContainer: React.FC<ToolbarContainerProps> = ({
  tool,
  setTool,
  onUndo,
  onRedo,
  onZoom,
  onClear,
  onDelete,
  gia,
  lineThickness,
  lineColor,
  showGrid,
  onToggleGrid,
  onLineThicknessChange,
  onLineColorChange,
  canUndo,
  canRedo,
  isOffline,
  lastSaved
}) => {
  const formatTime = (date: Date | null) => {
    if (!date) return 'Never';
    try {
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (err) {
      return 'Unknown';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center bg-white shadow-sm rounded-lg p-2 gap-2">
      <div className="drawing-tools flex space-x-1">
        <Button
          variant={tool === DrawingMode.SELECT ? "default" : "ghost"}
          size="sm"
          onClick={() => setTool(DrawingMode.SELECT)}
          className="flex items-center"
          title="Select (V)"
        >
          <MousePointer size={16} />
          <span className="ml-1 hidden sm:inline">Select</span>
        </Button>
        
        <Button
          variant={tool === DrawingMode.PENCIL ? "default" : "ghost"}
          size="sm"
          onClick={() => setTool(DrawingMode.PENCIL)}
          className="flex items-center"
          title="Draw (B)"
        >
          <Pencil size={16} />
          <span className="ml-1 hidden sm:inline">Draw</span>
        </Button>
        
        <Button
          variant={tool === DrawingMode.TEXT ? "default" : "ghost"}
          size="sm"
          onClick={() => setTool(DrawingMode.TEXT)}
          className="flex items-center"
          title="Text (T)"
        >
          <Type size={16} />
          <span className="ml-1 hidden sm:inline">Text</span>
        </Button>
      </div>
      
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleGrid()}
          className={`flex items-center ${!showGrid ? 'opacity-50' : ''}`}
          title="Toggle Grid (G)"
        >
          <Grid size={16} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onZoom("in")}
          className="flex items-center"
          title="Zoom In (+)"
        >
          <ZoomIn size={16} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onZoom("out")}
          className="flex items-center"
          title="Zoom Out (-)"
        >
          <ZoomOut size={16} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="flex items-center"
          title="Clear All"
        >
          <Trash size={16} />
        </Button>
      </div>
      
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          className="flex items-center"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={16} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          className="flex items-center"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={16} />
        </Button>
      </div>
      
      <div className="ml-auto flex items-center space-x-2">
        {isOffline ? (
          <div className="text-red-500 flex items-center">
            <WifiOff size={16} className="mr-1" />
            <span className="text-xs">Offline</span>
          </div>
        ) : (
          <div className="text-green-500 flex items-center">
            <Wifi size={16} className="mr-1" />
            <span className="text-xs">Connected</span>
          </div>
        )}
        
        {lastSaved && (
          <div className="text-xs text-gray-500 hidden sm:block">
            Saved: {formatTime(lastSaved)}
          </div>
        )}
        
        {gia > 0 && (
          <div className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            GIA: {gia.toFixed(2)} m²
          </div>
        )}
      </div>
    </div>
  );
};
