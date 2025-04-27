import React from 'react';
import { Button } from '@/components/ui/button';
import {
  FiMousePointer,
  FiEdit2,
  FiType,
  FiHand,
  FiEraser,
  FiUndo2,
  FiRedo2,
  FiRuler,
  FiTrash2,
  FiZoomIn,
  FiZoomOut,
  FiMenu
} from 'react-icons/fi';

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
          {isDrawingMode ? <FiMousePointer size={20} /> : <FiEdit2 size={20} />}
        </Button>
        <Button onClick={onZoomIn}>
          <FiZoomIn size={20} />
        </Button>
        <Button onClick={onZoomOut}>
          <FiZoomOut size={20} />
        </Button>
      </div>
      <div className="actions flex items-center space-x-2">
        <Button onClick={onUndo} disabled={!canUndo}>
          <FiUndo2 size={20} />
        </Button>
        <Button onClick={onRedo} disabled={!canRedo}>
          <FiRedo2 size={20} />
        </Button>
        <Button onClick={onClear}>
          <FiTrash2 size={20} />
        </Button>
      </div>
    </div>
  );
};
