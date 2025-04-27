
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  MousePointerIcon,
  PencilIcon,
  TypeIcon,
  HandIcon,
  EraserIcon,
  Undo2Icon,
  Redo2Icon,
  RulerIcon,
  TrashIcon,
  ZoomInIcon,
  ZoomOutIcon,
  MenuIcon
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
          {isDrawingMode ? <MousePointerIcon size={20} /> : <PencilIcon size={20} />}
        </Button>
        <Button onClick={onZoomIn}>
          <ZoomInIcon size={20} />
        </Button>
        <Button onClick={onZoomOut}>
          <ZoomOutIcon size={20} />
        </Button>
      </div>
      <div className="actions flex items-center space-x-2">
        <Button onClick={onUndo} disabled={!canUndo}>
          <Undo2Icon size={20} />
        </Button>
        <Button onClick={onRedo} disabled={!canRedo}>
          <Redo2Icon size={20} />
        </Button>
        <Button onClick={onClear}>
          <TrashIcon size={20} />
        </Button>
      </div>
    </div>
  );
};
