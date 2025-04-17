
import React from "react";
import { Button } from "@/components/ui/button";
import { Undo2, Redo2, Trash2, Save } from "lucide-react";

interface FloorPlanEditorToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const FloorPlanEditorToolbar: React.FC<FloorPlanEditorToolbarProps> = ({
  onUndo,
  onRedo,
  onClear,
  onSave,
  canUndo,
  canRedo
}) => {
  return (
    <div className="flex items-center gap-2 p-2 border-b">
      <Button
        variant="outline"
        size="sm"
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo"
      >
        <Undo2 className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Undo</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo"
      >
        <Redo2 className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Redo</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onClear}
        title="Clear Canvas"
      >
        <Trash2 className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Clear</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onSave}
        title="Save Canvas"
      >
        <Save className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Save</span>
      </Button>
    </div>
  );
};
