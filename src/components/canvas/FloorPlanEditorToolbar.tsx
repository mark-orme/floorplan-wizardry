import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DrawingToolbarModals } from '@/components/DrawingToolbarModals';
import { PencilSettingsButton } from '@/components/stylus/PencilSettingsButton';

export const FloorPlanEditorToolbar: React.FC<{
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  canUndo: boolean;
  canRedo: boolean;
  children?: React.ReactNode;
}> = ({ 
  onUndo, 
  onRedo, 
  onClear, 
  onSave, 
  canUndo, 
  canRedo, 
  children 
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between p-2 border-b bg-white">
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">File</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={onSave}>Save</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onClear}>Clear Canvas</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" onClick={onUndo} disabled={!canUndo}>
          Undo
        </Button>
        <Button variant="outline" onClick={onRedo} disabled={!canRedo}>
          Redo
        </Button>
        
        <PencilSettingsButton className="hidden md:flex" />
      </div>
      
      <div className="flex items-center space-x-2">
        {children}
      </div>
    </div>
  );
};
