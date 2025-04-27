import React from 'react';
import { Button } from '@/components/ui/button';
import { AiOutlineUndo, AiOutlineRedo } from 'react-icons/ai';

interface UndoRedoButtonsProps {
  /** Whether undo is available */
  canUndo: boolean;
  /** Whether redo is available */
  canRedo: boolean;
  /** Undo handler */
  onUndo: () => void;
  /** Redo handler */
  onRedo: () => void;
}

/**
 * Undo and redo buttons component
 * Used for canvas history navigation
 */
export const UndoRedoButtons: React.FC<UndoRedoButtonsProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo
}) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
        aria-label="Undo"
      >
        <AiOutlineUndo className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo (Ctrl+Shift+Z)"
        aria-label="Redo"
      >
        <AiOutlineRedo className="h-4 w-4" />
      </Button>
    </div>
  );
};
