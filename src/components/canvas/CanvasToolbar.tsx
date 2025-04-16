
/**
 * Canvas toolbar component
 * @module components/canvas/CanvasToolbar
 */
import React from 'react';
import { 
  MousePointer, 
  Pencil,
  Square, 
  Circle, 
  Type, 
  Eraser,
  Hand,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Save,
  Download,
  Trash2,
  StraightLine,
  Ruler
} from 'lucide-react';
import { DrawingMode } from '@/constants/drawingModes';
import { ToolbarGroup } from './toolbar/ToolbarGroup';
import { ToolbarItem } from './toolbar/ToolbarItem';
import { ToolbarSeparator } from './toolbar/ToolbarSeparator';
import { ColorPicker } from './toolbar/ColorPicker';
import { ToolSettings } from './toolbar/ToolSettings';

export interface CanvasToolbarProps {
  /** Active drawing tool */
  activeTool: DrawingMode;
  /** Current color */
  color: string;
  /** Current line thickness */
  lineThickness: number;
  /** Tool change handler */
  onToolChange: (tool: DrawingMode) => void;
  /** Color change handler */
  onColorChange: (color: string) => void;
  /** Line thickness change handler */
  onLineThicknessChange: (thickness: number) => void;
  /** Undo handler */
  onUndo?: () => void;
  /** Redo handler */
  onRedo?: () => void;
  /** Save handler */
  onSave?: () => void;
  /** Export handler */
  onExport?: () => void;
  /** Clear handler */
  onClear?: () => void;
  /** Zoom in handler */
  onZoomIn?: () => void;
  /** Zoom out handler */
  onZoomOut?: () => void;
  /** Whether undo is available */
  canUndo?: boolean;
  /** Whether redo is available */
  canRedo?: boolean;
  /** Current zoom level */
  zoomLevel?: number;
}

/**
 * Canvas toolbar component
 * @param props Component props
 * @returns Rendered component
 */
const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  activeTool,
  color,
  lineThickness,
  onToolChange,
  onColorChange,
  onLineThicknessChange,
  onUndo,
  onRedo,
  onSave,
  onExport,
  onClear,
  onZoomIn,
  onZoomOut,
  canUndo = false,
  canRedo = false,
  zoomLevel = 1
}) => {
  // Tool configurations
  const tools = [
    {
      tool: DrawingMode.SELECT,
      icon: <MousePointer size={20} />,
      label: 'Select'
    },
    {
      tool: DrawingMode.DRAW,
      icon: <Pencil size={20} />,
      label: 'Draw'
    },
    {
      tool: DrawingMode.STRAIGHT_LINE,
      icon: <StraightLine size={20} />,
      label: 'Line'
    },
    {
      tool: DrawingMode.RECTANGLE,
      icon: <Square size={20} />,
      label: 'Rectangle'
    },
    {
      tool: DrawingMode.CIRCLE,
      icon: <Circle size={20} />,
      label: 'Circle'
    },
    {
      tool: DrawingMode.TEXT,
      icon: <Type size={20} />,
      label: 'Text'
    },
    {
      tool: DrawingMode.ERASER,
      icon: <Eraser size={20} />,
      label: 'Eraser'
    },
    {
      tool: DrawingMode.PAN,
      icon: <Hand size={20} />,
      label: 'Pan'
    },
    {
      tool: DrawingMode.MEASURE,
      icon: <Ruler size={20} />,
      label: 'Measure'
    }
  ];
  
  // Line thickness options
  const thicknessOptions = [1, 2, 4, 6, 8, 10];
  
  return (
    <div className="flex flex-col bg-background border-b">
      <div className="flex items-center p-2 overflow-x-auto">
        {/* Drawing tools */}
        <ToolbarGroup title="Tools">
          {tools.map(({ tool, icon, label }) => (
            <ToolbarItem
              key={tool}
              icon={icon}
              label={label}
              active={activeTool === tool}
              onClick={() => onToolChange(tool)}
            />
          ))}
        </ToolbarGroup>
        
        <ToolbarSeparator />
        
        {/* Color picker */}
        <ToolbarGroup title="Color">
          <ColorPicker
            color={color}
            onChange={onColorChange}
          />
        </ToolbarGroup>
        
        <ToolbarSeparator />
        
        {/* Line thickness */}
        <ToolbarGroup title="Thickness">
          <div className="flex gap-1">
            {thicknessOptions.map(thickness => (
              <button
                key={thickness}
                className={`w-8 h-8 rounded flex items-center justify-center ${
                  lineThickness === thickness
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
                onClick={() => onLineThicknessChange(thickness)}
                title={`${thickness}px`}
              >
                <div
                  className="bg-current rounded-full"
                  style={{
                    width: `${Math.min(24, thickness * 3)}px`,
                    height: `${Math.min(24, thickness * 3)}px`
                  }}
                />
              </button>
            ))}
          </div>
        </ToolbarGroup>
        
        <ToolbarSeparator />
        
        {/* History controls */}
        <ToolbarGroup title="History">
          <ToolbarItem
            icon={<Undo size={20} />}
            label="Undo"
            onClick={onUndo}
            disabled={!canUndo}
          />
          <ToolbarItem
            icon={<Redo size={20} />}
            label="Redo"
            onClick={onRedo}
            disabled={!canRedo}
          />
        </ToolbarGroup>
        
        <ToolbarSeparator />
        
        {/* Zoom controls */}
        <ToolbarGroup title="Zoom">
          <ToolbarItem
            icon={<ZoomOut size={20} />}
            label="Zoom Out"
            onClick={onZoomOut}
          />
          <div className="px-2 py-1 text-sm">
            {Math.round(zoomLevel * 100)}%
          </div>
          <ToolbarItem
            icon={<ZoomIn size={20} />}
            label="Zoom In"
            onClick={onZoomIn}
          />
        </ToolbarGroup>
        
        <ToolbarSeparator />
        
        {/* File operations */}
        <ToolbarGroup title="File">
          {onSave && (
            <ToolbarItem
              icon={<Save size={20} />}
              label="Save"
              onClick={onSave}
            />
          )}
          {onExport && (
            <ToolbarItem
              icon={<Download size={20} />}
              label="Export"
              onClick={onExport}
            />
          )}
          {onClear && (
            <ToolbarItem
              icon={<Trash2 size={20} />}
              label="Clear"
              onClick={onClear}
            />
          )}
        </ToolbarGroup>
      </div>
      
      {/* Tool-specific settings */}
      <ToolSettings
        activeTool={activeTool}
      />
    </div>
  );
};

export default CanvasToolbar;
