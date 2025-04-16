
/**
 * Canvas actions component
 * @module components/toolbar/CanvasActions
 */
import React from 'react';
import { 
  Trash2, 
  Save, 
  Upload, 
  Download,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize,
  Grid
} from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';
import { ToolbarSection } from './ToolbarSection';

export interface CanvasActionsProps {
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
}

/**
 * Canvas actions component
 * @param props Component props
 * @returns Rendered component
 */
export const CanvasActions: React.FC<CanvasActionsProps> = ({
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
  gridVisible = false,
  canUndo = false,
  canRedo = false
}) => {
  return (
    <ToolbarSection title="Actions">
      {/* History actions */}
      {onUndo && (
        <ToolbarButton
          icon={<Undo size={20} />}
          label="Undo"
          tooltip="Undo last action"
          onClick={onUndo}
          disabled={!canUndo}
        />
      )}
      
      {onRedo && (
        <ToolbarButton
          icon={<Redo size={20} />}
          label="Redo"
          tooltip="Redo last undone action"
          onClick={onRedo}
          disabled={!canRedo}
        />
      )}
      
      {(onUndo || onRedo) && <div className="w-px h-6 bg-border mx-1" />}
      
      {/* Zoom actions */}
      {onZoomIn && (
        <ToolbarButton
          icon={<ZoomIn size={20} />}
          label="Zoom In"
          tooltip="Zoom in"
          onClick={onZoomIn}
        />
      )}
      
      {onZoomOut && (
        <ToolbarButton
          icon={<ZoomOut size={20} />}
          label="Zoom Out"
          tooltip="Zoom out"
          onClick={onZoomOut}
        />
      )}
      
      {onResetZoom && (
        <ToolbarButton
          icon={<Maximize size={20} />}
          label="Reset Zoom"
          tooltip="Reset zoom"
          onClick={onResetZoom}
        />
      )}
      
      {(onZoomIn || onZoomOut || onResetZoom) && <div className="w-px h-6 bg-border mx-1" />}
      
      {/* Grid toggle */}
      {onToggleGrid && (
        <ToolbarButton
          icon={<Grid size={20} />}
          label="Toggle Grid"
          tooltip="Toggle grid visibility"
          onClick={onToggleGrid}
          active={gridVisible}
        />
      )}
      
      {onToggleGrid && <div className="w-px h-6 bg-border mx-1" />}
      
      {/* Canvas operations */}
      {onClear && (
        <ToolbarButton
          icon={<Trash2 size={20} />}
          label="Clear"
          tooltip="Clear canvas"
          onClick={onClear}
        />
      )}
      
      {onSave && (
        <ToolbarButton
          icon={<Save size={20} />}
          label="Save"
          tooltip="Save canvas"
          onClick={onSave}
        />
      )}
      
      {onImport && (
        <ToolbarButton
          icon={<Upload size={20} />}
          label="Import"
          tooltip="Import from file"
          onClick={onImport}
        />
      )}
      
      {onExport && (
        <ToolbarButton
          icon={<Download size={20} />}
          label="Export"
          tooltip="Export to file"
          onClick={onExport}
        />
      )}
    </ToolbarSection>
  );
};
