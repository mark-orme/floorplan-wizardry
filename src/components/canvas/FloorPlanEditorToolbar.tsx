
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
    <div className="flex items-center gap-2 p-2 bg-white/95 backdrop-blur-sm border-b shadow-sm">
      <Button
        variant="outline"
        size="sm"
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo"
        className="transition-all hover:bg-primary/10 hover:border-primary/30 disabled:opacity-40"
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
        className="transition-all hover:bg-primary/10 hover:border-primary/30 disabled:opacity-40"
      >
        <Redo2 className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Redo</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onClear}
        title="Clear Canvas"
        className="transition-all hover:bg-red-50 hover:border-red-200"
      >
        <Trash2 className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Clear</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onSave}
        title="Save Canvas"
        className="transition-all hover:bg-blue-50 hover:border-blue-200"
      >
        <Save className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Save</span>
      </Button>
    </div>
  );
};
