
import React from "react";
import { CanvasControllerProvider } from "@/components/canvas/controller/CanvasController";
import { CanvasProvider } from "@/contexts/CanvasContext";
import { DrawingProvider } from "@/contexts/DrawingContext";
import { EditorHeader } from "@/components/canvas/EditorHeader";
import { EditorContent } from "@/components/canvas/EditorContent";
import { useCanvasState } from "@/hooks/useCanvasState";
import { useGridManagement } from "@/hooks/useGridManagement";
import { useToolbarActions } from "@/hooks/useToolbarActions";

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
            />
          </CanvasControllerProvider>
        </CanvasProvider>
      </DrawingProvider>
    </main>
  );
};

export default Index;
