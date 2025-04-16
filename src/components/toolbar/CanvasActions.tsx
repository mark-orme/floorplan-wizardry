
/**
 * Canvas actions component for the drawing toolbar
 * @module components/toolbar/CanvasActions
 */
import React from 'react';
import {
  Trash2,
  Save,
  UploadCloud,
  Download,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  RefreshCw,
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
    <ToolbarSection title="Canvas Actions">
      {/* Undo */}
      {onUndo && (
        <ToolbarButton
          icon={<Undo2 size={20} />}
          label="Undo"
          tooltip="Undo last action"
          onClick={onUndo}
          disabled={!canUndo}
        />
      )}
      
      {/* Redo */}
      {onRedo && (
        <ToolbarButton
          icon={<Redo2 size={20} />}
          label="Redo"
          tooltip="Redo last action"
          onClick={onRedo}
          disabled={!canRedo}
        />
      )}
      
      {/* Clear */}
      {onClear && (
        <ToolbarButton
          icon={<Trash2 size={20} />}
          label="Clear"
          tooltip="Clear canvas"
          onClick={onClear}
        />
      )}
      
      {/* Save */}
      {onSave && (
        <ToolbarButton
          icon={<Save size={20} />}
          label="Save"
          tooltip="Save canvas"
          onClick={onSave}
        />
      )}
      
      {/* Import */}
      {onImport && (
        <ToolbarButton
          icon={<UploadCloud size={20} />}
          label="Import"
          tooltip="Import canvas"
          onClick={onImport}
        />
      )}
      
      {/* Export */}
      {onExport && (
        <ToolbarButton
          icon={<Download size={20} />}
          label="Export"
          tooltip="Export canvas"
          onClick={onExport}
        />
      )}
      
      {/* Zoom in */}
      {onZoomIn && (
        <ToolbarButton
          icon={<ZoomIn size={20} />}
          label="Zoom In"
          tooltip="Zoom in"
          onClick={onZoomIn}
        />
      )}
      
      {/* Zoom out */}
      {onZoomOut && (
        <ToolbarButton
          icon={<ZoomOut size={20} />}
          label="Zoom Out"
          tooltip="Zoom out"
          onClick={onZoomOut}
        />
      )}
      
      {/* Reset zoom */}
      {onResetZoom && (
        <ToolbarButton
          icon={<RefreshCw size={20} />}
          label="Reset Zoom"
          tooltip="Reset zoom"
          onClick={onResetZoom}
        />
      )}
      
      {/* Toggle grid */}
      {onToggleGrid && (
        <ToolbarButton
          icon={<Grid size={20} />}
          label="Toggle Grid"
          tooltip={gridVisible ? 'Hide grid' : 'Show grid'}
          onClick={onToggleGrid}
          active={gridVisible}
        />
      )}
    </ToolbarSection>
  );
};
