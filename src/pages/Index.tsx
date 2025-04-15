
import React, { useState } from "react";
import { CanvasControllerProvider } from "@/components/canvas/controller/CanvasController";
import { CanvasProvider } from "@/contexts/CanvasContext";
import { DrawingProvider } from "@/contexts/DrawingContext";
import { EditorHeader } from "@/components/canvas/EditorHeader";
import { EditorContent } from "@/components/canvas/EditorContent";
import { useCanvasState } from "@/hooks/useCanvasState";
import { useGridManagement } from "@/hooks/useGridManagement";
import { useToolbarActions } from "@/hooks/useToolbarActions";
import { DrawingMode } from "@/constants/drawingModes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

/**
 * Main Index page component
 * Provides the layout and navigation for the floor plan editor
 * @returns {JSX.Element} Rendered component
 */
const Index = () => {
  // Use our custom hooks for state management
  const {
    canvas,
    setCanvas,
    showGridDebug,
    setShowGridDebug,
    forceRefreshKey,
    setForceRefreshKey,
    activeTool,
    setActiveTool,
    lineThickness,
    setLineThickness,
    lineColor,
    setLineColor,
    gridInitializedRef,
    retryCountRef,
    maxRetries,
    canvasStableRef,
    mountedRef
  } = useCanvasState();
  
  // Real-time collaboration state
  const [enableSync, setEnableSync] = useState(true);
  
  // Use grid management hook
  const { toggleGridDebug, handleForceRefresh } = useGridManagement(
    canvas,
    canvasStableRef,
    gridInitializedRef,
    retryCountRef,
    mountedRef,
    maxRetries
  );
  
  // Use toolbar actions hook
  const {
    handleToolChange,
    handleUndo,
    handleRedo,
    handleClear,
    handleSave,
    handleDelete
  } = useToolbarActions(canvas);
  
  // Handler functions that combine state updates with actions
  const onToolChange = (tool: DrawingMode) => setActiveTool(handleToolChange(tool));
  const onToggleGridDebug = () => {
    toggleGridDebug(showGridDebug);
    setShowGridDebug(prev => !prev);
  };
  const onForceRefresh = () => handleForceRefresh(canvas, setForceRefreshKey);
  
  return (
    <main className="flex flex-col w-full min-h-screen bg-background">
      <EditorHeader
        showGridDebug={showGridDebug}
        toggleGridDebug={onToggleGridDebug}
        handleForceRefresh={onForceRefresh}
        activeTool={activeTool}
        lineThickness={lineThickness}
        lineColor={lineColor}
        onToolChange={onToolChange}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onSave={handleSave}
        onDelete={handleDelete}
        onLineThicknessChange={setLineThickness}
        onLineColorChange={setLineColor}
      />
      
      <div className="bg-muted/30 border-b px-4 py-2 flex items-center justify-end space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="collaboration-mode"
            checked={enableSync}
            onCheckedChange={setEnableSync}
          />
          <Label htmlFor="collaboration-mode">
            Real-time Collaboration
          </Label>
        </div>
      </div>
      
      <DrawingProvider>
        <CanvasProvider>
          <CanvasControllerProvider>
            <EditorContent
              forceRefreshKey={forceRefreshKey}
              setCanvas={setCanvas}
              showGridDebug={showGridDebug}
              tool={activeTool}
              lineThickness={lineThickness}
              lineColor={lineColor}
              enableSync={enableSync}
            />
          </CanvasControllerProvider>
        </CanvasProvider>
      </DrawingProvider>
    </main>
  );
};

export default Index;
