
/**
 * Drawing toolbar component
 * Combines various toolbar sections
 * @module components/DrawingToolbar
 */
import React from 'react';
import { DrawingMode } from '@/constants/drawingModes';
import { DrawingTools } from './toolbar/DrawingTools';
import { StyleOptions } from './toolbar/StyleOptions';
import { CanvasActions } from './toolbar/CanvasActions';

export interface DrawingToolbarProps {
  /** Active drawing tool */
  activeTool: DrawingMode;
  /** Current line color */
  lineColor: string;
  /** Current line thickness */
  lineThickness: number;
  /** Tool change handler */
  onToolChange: (tool: DrawingMode) => void;
  /** Color change handler */
  onColorChange: (color: string) => void;
  /** Thickness change handler */
  onThicknessChange: (thickness: number) => void;
  /** Clear canvas handler */
  onClear?: () => void;
  /** Save canvas handler */
  onSave?: () => void;
  /** Import canvas handler */
  onImport?: () => void;
  /** Export canvas handler */
  onExport?: () => void;
  /** Undo handler */
  onUndo?: () => void;
  /** Redo handler */
  onRedo?: () => void;
  /** Zoom in handler */
  onZoomIn?: () => void;
  /** Zoom out handler */
  onZoomOut?: () => void;
  /** Reset zoom handler */
  onResetZoom?: () => void;
  /** Toggle grid handler */
  onToggleGrid?: () => void;
  /** Whether grid is visible */
  gridVisible?: boolean;
  /** Whether undo is available */
  canUndo?: boolean;
  /** Whether redo is available */
  canRedo?: boolean;
  /** Children to render */
  children?: React.ReactNode;
}

/**
 * Drawing toolbar component
 * @param props Component props
 * @returns Rendered component
 */
const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  activeTool,
  lineColor,
  lineThickness,
  onToolChange,
  onColorChange,
  onThicknessChange,
  onClear,
  onSave,
  onImport,
  onExport,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleGrid,
  gridVisible,
  canUndo,
  canRedo,
  children
}) => {
  return (
    <div className="flex items-center bg-background border-b p-1.5">
      <DrawingTools
        activeTool={activeTool}
        onToolChange={onToolChange}
      />
      
      <StyleOptions
        lineColor={lineColor}
        lineThickness={lineThickness}
        onColorChange={onColorChange}
        onThicknessChange={onThicknessChange}
      />
      
      <CanvasActions
        onClear={onClear}
        onSave={onSave}
        onImport={onImport}
        onExport={onExport}
        onUndo={onUndo}
        onRedo={onRedo}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onResetZoom={onResetZoom}
        onToggleGrid={onToggleGrid}
        gridVisible={gridVisible}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      
      {children}
    </div>
  );
};

export default DrawingToolbar;
