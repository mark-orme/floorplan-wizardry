
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  MousePointer, 
  Pencil, 
  Square, 
  Circle, 
  Type, 
  Eraser,
  Hand,
  Undo2, 
  Redo2, 
  Save,
  Trash,
  Ruler,
  LineIcon,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { DrawingMode } from '@/constants/drawingModes';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

interface MobileDrawingToolbarProps {
  activeTool: DrawingMode;
  onToolChange: (tool: DrawingMode) => void;
  lineColor: string;
  lineThickness: number;
  onLineColorChange: (color: string) => void;
  onLineThicknessChange: (thickness: number) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onClear?: () => void;
  onSave?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const MobileDrawingToolbar: React.FC<MobileDrawingToolbarProps> = ({
  activeTool,
  onToolChange,
  lineColor,
  lineThickness,
  onLineColorChange,
  onLineThicknessChange,
  onUndo,
  onRedo,
  onClear,
  onSave,
  onZoomIn,
  onZoomOut,
  canUndo = false,
  canRedo = false
}) => {
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;
  
  // Primary tools that are shown directly in the toolbar
  const primaryTools = [
    { id: DrawingMode.SELECT, icon: <MousePointer size={18} />, label: 'Select' },
    { id: DrawingMode.DRAW, icon: <Pencil size={18} />, label: 'Draw' },
    { id: DrawingMode.STRAIGHT_LINE, icon: <LineIcon size={18} />, label: 'Line' },
    { id: DrawingMode.ERASER, icon: <Eraser size={18} />, label: 'Eraser' }
  ];
  
  // All tools shown in the expanded panel
  const allTools = [
    ...primaryTools,
    { id: DrawingMode.RECTANGLE, icon: <Square size={18} />, label: 'Rectangle' },
    { id: DrawingMode.CIRCLE, icon: <Circle size={18} />, label: 'Circle' },
    { id: DrawingMode.TEXT, icon: <Type size={18} />, label: 'Text' },
    { id: DrawingMode.PAN, icon: <Hand size={18} />, label: 'Pan' },
    { id: DrawingMode.MEASURE, icon: <Ruler size={18} />, label: 'Measure' }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-10 p-2 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Primary tool buttons */}
        <div className="flex space-x-1">
          {primaryTools.map((tool) => (
            <Button
              key={tool.id}
              size="sm"
              variant={activeTool === tool.id ? 'default' : 'outline'}
              onClick={() => onToolChange(tool.id)}
              className="p-2"
              title={tool.label}
            >
              {tool.icon}
            </Button>
          ))}
        </div>
        
        {/* Style controls */}
        <div className="flex items-center space-x-1">
          <input
            type="color"
            value={lineColor}
            onChange={(e) => onLineColorChange(e.target.value)}
            className="w-8 h-8 p-0 border-0 rounded"
          />
          <input
            type="range"
            min="1"
            max="10"
            value={lineThickness}
            onChange={(e) => onLineThicknessChange(Number(e.target.value))}
            className="w-20"
          />
        </div>
        
        {/* Operations buttons */}
        <div className="flex space-x-1">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2"
            title="Undo"
          >
            <Undo2 size={18} />
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2"
            title="Redo"
          >
            <Redo2 size={18} />
          </Button>
          
          {/* Expanded menu for more tools */}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                size="sm" 
                variant="outline"
                className="p-2"
                title="More Tools"
              >
                <Menu size={18} />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[60vh]">
              <div className="grid grid-cols-3 gap-2 p-4">
                <h3 className="col-span-3 text-lg font-medium mb-2">Drawing Tools</h3>
                
                {allTools.map((tool) => (
                  <Button
                    key={tool.id}
                    size="sm"
                    variant={activeTool === tool.id ? 'default' : 'outline'}
                    onClick={() => onToolChange(tool.id)}
                    className="flex flex-col p-3 h-auto"
                  >
                    {tool.icon}
                    <span className="mt-1 text-xs">{tool.label}</span>
                  </Button>
                ))}
                
                <h3 className="col-span-3 text-lg font-medium mt-4 mb-2">Actions</h3>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={onZoomIn}
                  className="flex flex-col p-3 h-auto"
                >
                  <ZoomIn size={18} />
                  <span className="mt-1 text-xs">Zoom In</span>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={onZoomOut}
                  className="flex flex-col p-3 h-auto"
                >
                  <ZoomOut size={18} />
                  <span className="mt-1 text-xs">Zoom Out</span>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={onClear}
                  className="flex flex-col p-3 h-auto"
                >
                  <Trash size={18} />
                  <span className="mt-1 text-xs">Clear</span>
                </Button>
                <Button 
                  size="sm" 
                  variant="default"
                  onClick={onSave}
                  className="flex flex-col p-3 h-auto"
                >
                  <Save size={18} />
                  <span className="mt-1 text-xs">Save</span>
                </Button>
                
                <h3 className="col-span-3 text-lg font-medium mt-4 mb-2">Style</h3>
                
                <div className="col-span-3 flex flex-col space-y-2">
                  <label className="text-sm flex items-center justify-between">
                    <span>Color:</span>
                    <input
                      type="color"
                      value={lineColor}
                      onChange={(e) => onLineColorChange(e.target.value)}
                      className="w-10 h-10 p-0 border-0 rounded"
                    />
                  </label>
                  
                  <label className="text-sm flex items-center justify-between">
                    <span>Thickness: {lineThickness}px</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={lineThickness}
                      onChange={(e) => onLineThicknessChange(Number(e.target.value))}
                      className="w-40"
                    />
                  </label>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawingToolbar;
