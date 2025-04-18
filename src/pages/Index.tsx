
import React, { useState, useEffect } from "react";
import { CanvasControllerProvider } from "@/components/canvas/controller/CanvasController";
import { CanvasProvider } from "@/contexts/CanvasContext";
import { DrawingProvider } from "@/contexts/DrawingContext";
import { EditorHeader } from "@/components/canvas/EditorHeader";
import { EditorContent } from "@/components/canvas/EditorContent";
import { AuthSection } from "@/components/auth/AuthSection";
import { CollaborationToggle } from "@/components/collaboration/CollaborationToggle";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import { trackComponentLoad, markPerformance } from "@/utils/healthMonitoring";
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from "@/constants/drawingModes";

export const Index = () => {
  const [enableSync, setEnableSync] = useState(true);
  const { isMobile, isTablet } = useWindowDimensions();
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [showGridDebug, setShowGridDebug] = useState(false);
  const [forceRefreshKey, setForceRefreshKey] = useState(0);
  const [activeTool, setActiveTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [lineThickness, setLineThickness] = useState(2);
  const [lineColor, setLineColor] = useState("#000000");

  // Track page load in health monitoring
  useEffect(() => {
    trackComponentLoad('IndexPage');
    markPerformance('index-page-mounted');
    
    return () => {
      markPerformance('index-page-unmounted');
    };
  }, []);

  // Handle force refresh
  const handleForceRefresh = () => {
    setForceRefreshKey(prev => prev + 1);
  };

  // Toggle grid debug
  const toggleGridDebug = () => {
    setShowGridDebug(prev => !prev);
  };

  // Handlers for toolbar actions
  const handleUndo = () => {
    console.log("Undo action");
  };

  const handleRedo = () => {
    console.log("Redo action");
  };

  const handleClear = () => {
    console.log("Clear action");
  };

  const handleSave = () => {
    console.log("Save action");
  };

  const handleDelete = () => {
    console.log("Delete action");
  };

  return (
    <main className="flex flex-col w-full min-h-screen bg-background">
      <DrawingProvider>
        <CanvasProvider>
          <CanvasControllerProvider>
            <AuthSection />
            
            <div className={`px-4 py-2 flex ${isMobile ? 'flex-col space-y-2' : 'items-center justify-end'}`}>
              <CollaborationToggle 
                enabled={enableSync}
                onToggle={setEnableSync}
                isMobile={isMobile}
              />
            </div>

            <EditorHeader 
              showGridDebug={showGridDebug}
              toggleGridDebug={toggleGridDebug}
              handleForceRefresh={handleForceRefresh}
              activeTool={activeTool}
              lineThickness={lineThickness}
              lineColor={lineColor}
              onToolChange={setActiveTool}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onClear={handleClear}
              onSave={handleSave}
              onDelete={handleDelete}
              onLineThicknessChange={setLineThickness}
              onLineColorChange={setLineColor}
              isMobile={isMobile}
              isTablet={isTablet}
            />
            
            <EditorContent 
              forceRefreshKey={forceRefreshKey}
              setCanvas={setFabricCanvas}
              showGridDebug={showGridDebug}
              tool={activeTool}
              lineThickness={lineThickness}
              lineColor={lineColor}
              enableSync={enableSync}
              onToolChange={setActiveTool}
              onLineThicknessChange={setLineThickness}
              onLineColorChange={setLineColor}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onClear={handleClear}
              onSave={handleSave}
            />
          </CanvasControllerProvider>
        </CanvasProvider>
      </DrawingProvider>
    </main>
  );
};

export default Index;
