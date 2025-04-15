
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Grid, EyeOff, RefreshCw } from "lucide-react";
import { Toolbar } from "@/components/canvas/Toolbar";
import { DrawingMode } from "@/constants/drawingModes";

interface EditorHeaderProps {
  showGridDebug: boolean;
  toggleGridDebug: () => void;
  handleForceRefresh: () => void;
  activeTool: DrawingMode;
  lineThickness: number;
  lineColor: string;
  onToolChange: (tool: DrawingMode) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  onDelete: () => void;
  onLineThicknessChange: (thickness: number) => void;
  onLineColorChange: (color: string) => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  showGridDebug,
  toggleGridDebug,
  handleForceRefresh,
  activeTool,
  lineThickness,
  lineColor,
  onToolChange,
  onUndo,
  onRedo,
  onClear,
  onSave,
  onDelete,
  onLineThicknessChange,
  onLineColorChange
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col p-2 bg-muted/30 border-b">
      <div className="flex items-center mb-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/properties')}
          className="mr-2"
        >
          <Home className="h-4 w-4 mr-1" />
          Back to Properties
        </Button>
        <h1 className="text-xl font-bold">Floor Plan Editor</h1>
        
        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleGridDebug}
            className="flex items-center"
          >
            {showGridDebug ? (
              <>
                <EyeOff className="h-4 w-4 mr-1" />
                Hide Debug
              </>
            ) : (
              <>
                <Grid className="h-4 w-4 mr-1" />
                Show Debug
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleForceRefresh}
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Force Refresh
          </Button>
        </div>
      </div>
      
      {/* Place the toolbar in the top banner */}
      <Toolbar
        activeTool={activeTool}
        lineThickness={lineThickness}
        lineColor={lineColor}
        onToolChange={onToolChange}
        onUndo={onUndo}
        onRedo={onRedo}
        onClear={onClear}
        onSave={onSave}
        onDelete={onDelete}
        onLineThicknessChange={onLineThicknessChange}
        onLineColorChange={onLineColorChange}
      />
    </div>
  );
};
