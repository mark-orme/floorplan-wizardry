
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Pointer, 
  Pencil, 
  Square, 
  Minus, 
  Undo2, 
  Redo2, 
  Trash, 
  Save, 
  Eraser,
  Ruler,
  AlertCircle
} from 'lucide-react';
import { DrawingMode } from '@/constants/drawingModes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { captureMessage } from '@/utils/sentry';
import { toast } from 'sonner';

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
  // Log when the active tool changes to help debug
  useEffect(() => {
    console.log("Active tool in Toolbar:", activeTool);
    
    // Track tool changes in Sentry
    captureMessage("Drawing tool changed", "tool-change", {
      tags: { component: "Toolbar" },
      extra: { tool: activeTool }
    });
  }, [activeTool]);

  const handleStraightLineClick = () => {
    console.log("Straight line tool clicked, current tool:", activeTool);
    
    // Track attempt to change to straight line tool
    captureMessage("Straight line tool clicked", "straight-line-button-click", {
      tags: { component: "Toolbar" },
      extra: { previousTool: activeTool }
    });
    
    onToolChange(DrawingMode.STRAIGHT_LINE);
  };
  
  // Report issues with straight line tool
  const reportStraightLineIssue = () => {
    captureMessage("User reported straight line tool issue", "user-reported-issue", {
      tags: { component: "Toolbar", critical: "true" },
      extra: { 
        activeTool,
        browserInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
          windowDimensions: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        }
      }
    });
    
    toast.success("Issue reported to developers. Thank you!");
  };

  return (
    <div className="flex flex-wrap gap-2 bg-white">
      <div className="flex items-center gap-1">
        <Button 
          size="sm" 
          variant={activeTool === DrawingMode.SELECT ? 'default' : 'outline'} 
          onClick={() => onToolChange(DrawingMode.SELECT)}
          title="Select Tool"
        >
          <Pointer className="h-4 w-4" />
          <span className="ml-1">Select</span>
        </Button>
        <Button 
          size="sm" 
          variant={activeTool === DrawingMode.DRAW ? 'default' : 'outline'} 
          onClick={() => onToolChange(DrawingMode.DRAW)}
          title="Freehand Wall Tool"
        >
          <Pencil className="h-4 w-4" />
          <span className="ml-1">Freehand Wall</span>
        </Button>
        <Button 
          size="sm" 
          variant={activeTool === DrawingMode.STRAIGHT_LINE ? 'default' : 'outline'} 
          onClick={handleStraightLineClick}
          title="Straight Line Tool"
          data-test-id="straight-line-button"
          className={activeTool === DrawingMode.STRAIGHT_LINE ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}
        >
          <Minus className="h-4 w-4" />
          <span className="ml-1">Straight Line</span>
        </Button>
        <Button 
          size="sm" 
          variant={activeTool === DrawingMode.WALL ? 'default' : 'outline'} 
          onClick={() => onToolChange(DrawingMode.WALL)}
          title="Wall Tool"
        >
          <Ruler className="h-4 w-4" />
          <span className="ml-1">Wall</span>
        </Button>
        <Button 
          size="sm" 
          variant={activeTool === DrawingMode.ERASER ? 'default' : 'outline'} 
          onClick={() => onToolChange(DrawingMode.ERASER)}
          title="Eraser Tool"
        >
          <Eraser className="h-4 w-4" />
          <span className="ml-1">Eraser</span>
        </Button>
        
        {/* Add a button to report line tool issues */}
        {activeTool === DrawingMode.STRAIGHT_LINE && (
          <Button 
            size="sm" 
            variant="outline" 
            className="ml-2 text-amber-600 border-amber-600"
            onClick={reportStraightLineIssue}
            title="Report Issue with Line Tool"
          >
            <AlertCircle className="h-4 w-4 mr-1" />
            <span className="text-xs">Report Issue</span>
          </Button>
        )}
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
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onDelete} 
          title="Delete Selected"
          className="bg-red-50 border-red-200 hover:bg-red-100"
        >
          <Trash className="h-4 w-4 text-red-500" />
          <span className="ml-1 text-red-500">Delete Selected</span>
        </Button>
        <Button size="sm" variant="outline" onClick={onSave} title="Save Canvas">
          <Save className="h-4 w-4" />
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
