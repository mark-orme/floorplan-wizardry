
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Pointer, 
  Pencil, 
  Square, 
  Circle, 
  Line, 
  Undo2, 
  Redo2, 
  Trash, 
  Save, 
  Eraser,
  Ruler
} from 'lucide-react';
import { DrawingTool } from '@/constants/drawingModes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface ToolbarProps {
  activeTool: DrawingTool;
  lineThickness: number;
  lineColor: string;
  onToolChange: (tool: DrawingTool) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  onDelete: () => void;
  onLineThicknessChange: (thickness: number) => void;
  onLineColorChange: (color: string) => void;
}

/**
 * Toolbar component for canvas drawing tools
 * @param {ToolbarProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
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
}: ToolbarProps): JSX.Element => {
  return (
    <div className="p-2 border-b flex flex-wrap gap-2 bg-white">
      <div className="flex items-center gap-1">
        <Button 
          size="sm" 
          variant={activeTool === 'select' ? 'default' : 'outline'} 
          onClick={() => onToolChange('select')}
          title="Select Tool"
        >
          <Pointer className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant={activeTool === 'draw' ? 'default' : 'outline'} 
          onClick={() => onToolChange('draw')}
          title="Draw Tool"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant={activeTool === 'line' ? 'default' : 'outline'} 
          onClick={() => onToolChange('line')}
          title="Line Tool"
        >
          <Line className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant={activeTool === 'rectangle' ? 'default' : 'outline'} 
          onClick={() => onToolChange('rectangle')}
          title="Rectangle Tool"
        >
          <Square className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant={activeTool === 'circle' ? 'default' : 'outline'} 
          onClick={() => onToolChange('circle')}
          title="Circle Tool"
        >
          <Circle className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant={activeTool === 'eraser' ? 'default' : 'outline'} 
          onClick={() => onToolChange('eraser')}
          title="Eraser Tool"
        >
          <Eraser className="h-4 w-4" />
        </Button>
      </div>
      
      <Separator orientation="vertical" className="h-8" />
      
      <div className="flex items-center gap-1">
        <Button size="sm" variant="outline" onClick={onUndo} title="Undo">
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={onRedo} title="Redo">
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>
      
      <Separator orientation="vertical" className="h-8" />
      
      <div className="flex items-center gap-1">
        <Button size="sm" variant="outline" onClick={onClear} title="Clear Canvas">
          <Trash className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={onSave} title="Save Canvas">
          <Save className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={onDelete} title="Delete Selected">
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      
      <Separator orientation="vertical" className="h-8" />
      
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor="line-thickness" className="text-xs">Thickness</Label>
          <Input
            id="line-thickness"
            type="number"
            min="1"
            max="20"
            value={lineThickness}
            onChange={(e) => onLineThicknessChange(Number(e.target.value))}
            className="w-16 h-8"
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <Label htmlFor="line-color" className="text-xs">Color</Label>
          <Input
            id="line-color"
            type="color"
            value={lineColor}
            onChange={(e) => onLineColorChange(e.target.value)}
            className="w-8 h-8 p-0"
          />
        </div>
      </div>
    </div>
  );
};
