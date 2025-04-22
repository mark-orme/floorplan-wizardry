
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { 
  Pencil, 
  Pointer, 
  Square, 
  Circle, 
  Hand, 
  Eraser, 
  Download, 
  RefreshCw,
  Trash
} from 'lucide-react';
import { DrawingMode } from '@/constants/drawingModes';
import { LineThicknessSlider } from './LineThicknessSlider';
import { ColorPicker } from './ColorPicker';
import { captureMessage } from '@/utils/sentryUtils';

interface ToolbarProps {
  activeTool: DrawingMode;
  lineThickness: number;
  lineColor: string;
  onToolChange: (tool: DrawingMode) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  onDelete: () => void;
  onLineThicknessChange: (thickness: number) => void;
  onLineColorChange: (color: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  lineThickness,
  lineColor,
  onToolChange,
  onUndo,
  onRedo,
  onClear,
  onSave,
  onDelete,
  onLineThicknessChange,
  onLineColorChange
}) => {
  const handleExport = () => {
    captureMessage("Canvas export requested", {
      level: 'info',
      tags: { component: 'Toolbar' },
      extra: { tool: activeTool }
    });
    // Export functionality to be implemented
  };
  
  const handleUndo = () => {
    captureMessage("Undo requested", {
      level: 'info',
      tags: { component: 'Toolbar' }
    });
    onUndo();
  };
  
  const handleSave = () => {
    captureMessage("Canvas save requested", {
      level: 'info',
      tags: { component: 'Toolbar' },
      extra: { format: 'json' }
    });
    onSave();
  };
  
  return (
    <div className="flex flex-wrap gap-2 p-2 bg-background/60 backdrop-blur-sm border rounded-lg shadow-sm">
      <Tooltip content="Select Tool">
        <Button
          variant={activeTool === DrawingMode.SELECT ? 'default' : 'outline'}
          size="icon"
          onClick={() => onToolChange(DrawingMode.SELECT)}
          aria-label="Select Tool"
        >
          <Pointer className="h-4 w-4" />
        </Button>
      </Tooltip>
      
      <Tooltip content="Draw Tool">
        <Button
          variant={activeTool === DrawingMode.DRAW ? 'default' : 'outline'}
          size="icon"
          onClick={() => onToolChange(DrawingMode.DRAW)}
          aria-label="Draw Tool"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </Tooltip>
      
      <Tooltip content="Rectangle Tool">
        <Button
          variant={activeTool === DrawingMode.RECTANGLE ? 'default' : 'outline'}
          size="icon"
          onClick={() => onToolChange(DrawingMode.RECTANGLE)}
          aria-label="Rectangle Tool"
        >
          <Square className="h-4 w-4" />
        </Button>
      </Tooltip>
      
      <Tooltip content="Circle Tool">
        <Button
          variant={activeTool === DrawingMode.CIRCLE ? 'default' : 'outline'}
          size="icon"
          onClick={() => onToolChange(DrawingMode.CIRCLE)}
          aria-label="Circle Tool"
        >
          <Circle className="h-4 w-4" />
        </Button>
      </Tooltip>
      
      <Tooltip content="Hand Tool">
        <Button
          variant={activeTool === DrawingMode.HAND ? 'default' : 'outline'}
          size="icon"
          onClick={() => onToolChange(DrawingMode.HAND)}
          aria-label="Hand Tool"
        >
          <Hand className="h-4 w-4" />
        </Button>
      </Tooltip>
      
      <Tooltip content="Eraser Tool">
        <Button
          variant={activeTool === DrawingMode.ERASER ? 'default' : 'outline'}
          size="icon"
          onClick={() => onToolChange(DrawingMode.ERASER)}
          aria-label="Eraser Tool"
        >
          <Eraser className="h-4 w-4" />
        </Button>
      </Tooltip>
      
      <div className="border-l mx-1 h-8" />
      
      <LineThicknessSlider 
        currentValue={lineThickness}
        onValueChange={onLineThicknessChange}
      />
      
      <ColorPicker
        color={lineColor}
        onChange={onLineColorChange}
      />
      
      <div className="border-l mx-1 h-8" />
      
      <Tooltip content="Undo">
        <Button
          variant="outline"
          size="icon"
          onClick={handleUndo}
          aria-label="Undo"
        >
          <RefreshCw className="h-4 w-4 rotate-[-45deg]" />
        </Button>
      </Tooltip>
      
      <Tooltip content="Save">
        <Button
          variant="outline"
          size="icon"
          onClick={handleSave}
          aria-label="Save"
        >
          <Download className="h-4 w-4" />
        </Button>
      </Tooltip>
      
      <Tooltip content="Clear">
        <Button
          variant="outline"
          size="icon"
          onClick={onClear}
          aria-label="Clear Canvas"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </Tooltip>
    </div>
  );
};

export default Toolbar;
