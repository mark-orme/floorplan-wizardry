
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
  isMobile?: boolean;  // Added optional mobile prop
  isTablet?: boolean;  // Added optional tablet prop
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
  onLineColorChange,
  isMobile = false,
  isTablet = false
}) => {
  const navigate = useNavigate();

  return (
    <div className={`flex flex-col p-2 bg-muted/30 border-b ${isMobile ? 'space-y-2' : ''}`}>
      <div className={`flex ${isMobile ? 'flex-col items-start' : 'items-center'} mb-2`}>
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"} 
          onClick={() => navigate('/properties')}
          className={isMobile ? 'mb-2 w-full' : 'mr-2'}
        >
          <Home className="h-4 w-4 mr-1" />
          Back to Properties
        </Button>
        <h1 className={`text-xl font-bold ${isMobile ? 'w-full text-center' : ''}`}>
          Floor Plan Editor
        </h1>
        
        <div className={`${isMobile ? 'w-full flex flex-col space-y-2' : 'ml-auto flex gap-2'}`}>
          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            onClick={toggleGridDebug}
            className={`flex items-center ${isMobile ? 'w-full' : ''}`}
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
            size={isMobile ? "sm" : "default"}
            onClick={handleForceRefresh}
            className={`flex items-center ${isMobile ? 'w-full' : ''}`}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Force Refresh
          </Button>
        </div>
      </div>
      
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
