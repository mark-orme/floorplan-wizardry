
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  AiOutlineSelect,
  AiOutlineEdit,
  AiOutlineFont,
  AiOutlineHolderOutline,
  AiOutlineHighlight,
  AiOutlineUndo,
  AiOutlineRedo,
  AiOutlineColumnWidth,
  AiOutlineDelete,
  AiOutlineZoomIn,
  AiOutlineZoomOut,
  AiOutlineMenu
} from 'react-icons/ai';

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
          {isDrawingMode ? <AiOutlineSelect size={20} /> : <AiOutlineEdit size={20} />}
        </Button>
        <Button onClick={onZoomIn}>
          <AiOutlineZoomIn size={20} />
        </Button>
        <Button onClick={onZoomOut}>
          <AiOutlineZoomOut size={20} />
        </Button>
      </div>
      <div className="actions flex items-center space-x-2">
        <Button onClick={onUndo} disabled={!canUndo}>
          <AiOutlineUndo size={20} />
        </Button>
        <Button onClick={onRedo} disabled={!canRedo}>
          <AiOutlineRedo size={20} />
        </Button>
        <Button onClick={onClear}>
          <AiOutlineDelete size={20} />
        </Button>
      </div>
    </div>
  );
};
