
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  MousePointer,
  Pencil,
  Type,
  Hand,
  Eraser,
  Undo2,
  Redo2,
  Ruler,
  Trash,
  ZoomIn,
  ZoomOut,
  Menu
} from 'lucide-react';

interface MobileDrawingToolbarProps {
  onToolSelect: (tool: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  isDrawingMode: boolean;
  canUndo: boolean;
  canRedo: boolean;
}

export const MobileDrawingToolbar: React.FC<MobileDrawingToolbarProps> = ({
  onToolSelect,
  onUndo,
  onRedo,
  onClear,
  onZoomIn,
  onZoomOut,
  isDrawingMode,
  canUndo,
  canRedo
}) => {
  return (
    <div className="mobile-toolbar flex justify-between items-center bg-gray-100 p-2">
      <div className="tools flex items-center space-x-2">
        <Button
          variant={isDrawingMode ? 'default' : 'outline'}
          onClick={() => onToolSelect(isDrawingMode ? 'select' : 'draw')}
        >
          {isDrawingMode ? <MousePointer size={20} /> : <Pencil size={20} />}
        </Button>
        <Button onClick={onZoomIn}>
          <ZoomIn size={20} />
        </Button>
        <Button onClick={onZoomOut}>
          <ZoomOut size={20} />
        </Button>
      </div>
      <div className="actions flex items-center space-x-2">
        <Button onClick={onUndo} disabled={!canUndo}>
          <Undo2 size={20} />
        </Button>
        <Button onClick={onRedo} disabled={!canRedo}>
          <Redo2 size={20} />
        </Button>
        <Button onClick={onClear}>
          <Trash size={20} />
        </Button>
      </div>
    </div>
  );
};
