import React from 'react';
import { Icons } from '@/constants/iconMappings';
import { ToolbarButton } from './ToolbarButton';
import { ToolbarSection } from './ToolbarSection';

export interface CanvasActionsProps {
  onClear?: () => void;
  onSave?: () => void;
  onImport?: () => void;
  onExport?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  onToggleGrid?: () => void;
  gridVisible?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
}

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
      {onUndo && (
        <ToolbarButton
          icon={<Icons.undo size={20} />}
          label="Undo"
          tooltip="Undo last action"
          onClick={onUndo}
          disabled={!canUndo}
        />
      )}
      
      {onRedo && (
        <ToolbarButton
          icon={<Icons.redo size={20} />}
          label="Redo"
          tooltip="Redo last action"
          onClick={onRedo}
          disabled={!canRedo}
        />
      )}
      
      {onClear && (
        <ToolbarButton
          icon={<Icons.delete size={20} />}
          label="Clear"
          tooltip="Clear canvas"
          onClick={onClear}
        />
      )}
      
      {onSave && (
        <ToolbarButton
          icon={<Icons.save size={20} />}
          label="Save"
          tooltip="Save canvas"
          onClick={onSave}
        />
      )}
      
      {onImport && (
        <ToolbarButton
          icon={<Icons.upload size={20} />}
          label="Import"
          tooltip="Import canvas"
          onClick={onImport}
        />
      )}
      
      {onExport && (
        <ToolbarButton
          icon={<Icons.download size={20} />}
          label="Export"
          tooltip="Export canvas"
          onClick={onExport}
        />
      )}
      
      {onZoomIn && (
        <ToolbarButton
          icon={<Icons.zoomIn size={20} />}
          label="Zoom In"
          tooltip="Zoom in"
          onClick={onZoomIn}
        />
      )}
      
      {onZoomOut && (
        <ToolbarButton
          icon={<Icons.zoomOut size={20} />}
          label="Zoom Out"
          tooltip="Zoom out"
          onClick={onZoomOut}
        />
      )}
      
      {onResetZoom && (
        <ToolbarButton
          icon={<Icons.reload size={20} />}
          label="Reset Zoom"
          tooltip="Reset zoom"
          onClick={onResetZoom}
        />
      )}
      
      {onToggleGrid && (
        <ToolbarButton
          icon={<Icons.grid size={20} />}
          label="Toggle Grid"
          tooltip={gridVisible ? 'Hide grid' : 'Show grid'}
          onClick={onToggleGrid}
          active={gridVisible}
        />
      )}
    </ToolbarSection>
  );
};
