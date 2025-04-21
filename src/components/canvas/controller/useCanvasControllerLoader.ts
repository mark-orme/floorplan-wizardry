import { useState, useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject, Group } from 'fabric';
import { useCanvasEvents } from '@/hooks/useCanvasEvents';
import { useCanvasZoom } from '@/hooks/useCanvasZoom';
import { useCanvasGrid } from '@/hooks/useCanvasGrid';
import { useCanvasSnapping } from '@/hooks/useCanvasSnapping';
import { useCanvasHistory } from '@/hooks/useCanvasHistory';
import { useCanvasExport } from '@/hooks/useCanvasExport';
import { useCanvasSelect } from '@/hooks/useCanvasSelect';
import { useCanvasObjectLocking } from '@/hooks/useCanvasObjectLocking';
import { useCanvasMeasurement } from '@/hooks/useCanvasMeasurement';
import { useCanvasLayers } from '@/hooks/useCanvasLayers';
import { useCanvasGuides } from '@/hooks/useCanvasGuides';
import { useCanvasPerformance } from '@/hooks/useCanvasPerformance';
import { useCanvasDiagnostics } from '@/hooks/useCanvasDiagnostics';
import { useCanvasAccessibility } from '@/hooks/useCanvasAccessibility';
import { useCanvasDataManagement } from '@/hooks/useCanvasDataManagement';
import { useCanvasObjectInteraction } from '@/hooks/useCanvasObjectInteraction';
import { useCanvasTextEditing } from '@/hooks/useCanvasTextEditing';
import { useCanvasBackgroundImage } from '@/hooks/useCanvasBackgroundImage';
import { useCanvasFilters } from '@/hooks/useCanvasFilters';
import { useCanvasAnimations } from '@/hooks/useCanvasAnimations';
import { useCanvas3D } from '@/hooks/useCanvas3D';
import { useCanvasAR } from '@/hooks/useCanvasAR';
import { useCanvasCollaboration } from '@/hooks/useCanvasCollaboration';
import { useCanvasAI } from '@/hooks/useCanvasAI';
import { useCanvasAutomation } from '@/hooks/useCanvasAutomation';
import { useCanvasTesting } from '@/hooks/useCanvasTesting';
import { useCanvasOptimization } from '@/hooks/useCanvasOptimization';
import { useCanvasSecurity } from '@/hooks/useCanvasSecurity';
import { useCanvasTheming } from '@/hooks/useCanvasTheming';
import { useCanvasLocalization } from '@/hooks/useCanvasLocalization';
import { useCanvasUndoRedo } from '@/hooks/useCanvasUndoRedo';
import { useCanvasTutorial } from '@/hooks/useCanvasTutorial';
import { useCanvasFeedback } from '@/hooks/useCanvasFeedback';
import { useCanvasSupport } from '@/hooks/useCanvasSupport';
import { useCanvasLicensing } from '@/hooks/useCanvasLicensing';
import { useCanvasMonetization } from '@/hooks/useCanvasMonetization';
import { useCanvasCommunity } from '@/hooks/useCanvasCommunity';
import { useCanvasEcosystem } from '@/hooks/useCanvasEcosystem';
import { useCanvasMetaverse } from '@/hooks/useCanvasMetaverse';
import { useCanvasFuture } from '@/hooks/useCanvasFuture';
import { createCompleteMetadata } from '@/utils/debug/typeDiagnostics';

interface UseCanvasControllerLoaderProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  historyRef: React.MutableRefObject<{ past: any[][], future: any[][] }>;
}

export const useCanvasControllerLoader = ({
  fabricCanvasRef,
  gridLayerRef,
  historyRef
}: UseCanvasControllerLoaderProps) => {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  
  // Initialize all canvas hooks
  const { setupEvents, clearEvents } = useCanvasEvents({ fabricCanvasRef });
  const { zoomIn, zoomOut, resetZoom } = useCanvasZoom({ fabricCanvasRef });
  const { createGrid, toggleGridVisibility } = useCanvasGrid({ fabricCanvasRef, gridLayerRef });
  const { enableSnapping, disableSnapping } = useCanvasSnapping({ fabricCanvasRef });
  const { saveState, restoreState, clearHistory } = useCanvasHistory({ fabricCanvasRef, historyRef });
  const { exportToJSON, exportToImage } = useCanvasExport({ fabricCanvasRef });
  const { selectAll, deselectAll } = useCanvasSelect({ fabricCanvasRef });
  const { lockObject, unlockObject } = useCanvasObjectLocking({ fabricCanvasRef });
  const { measureDistance, clearMeasurements } = useCanvasMeasurement({ fabricCanvasRef });
  const { addLayer, removeLayer, moveLayerUp, moveLayerDown } = useCanvasLayers({ fabricCanvasRef });
  const { showGuides, hideGuides } = useCanvasGuides({ fabricCanvasRef });
  const { startProfiling, stopProfiling } = useCanvasPerformance({ fabricCanvasRef });
  const { runDiagnostics, clearDiagnostics } = useCanvasDiagnostics({ fabricCanvasRef });
  const { checkAccessibility, fixAccessibility } = useCanvasAccessibility({ fabricCanvasRef });
  const { saveData, loadData, clearData } = useCanvasDataManagement({ fabricCanvasRef });
  const { enableInteractions, disableInteractions } = useCanvasObjectInteraction({ fabricCanvasRef });
  const { enableTextEditing, disableTextEditing } = useCanvasTextEditing({ fabricCanvasRef });
  const { setBackgroundImage, removeBackgroundImage } = useCanvasBackgroundImage({ fabricCanvasRef });
  const { applyFilter, removeFilter } = useCanvasFilters({ fabricCanvasRef });
  const { playAnimation, stopAnimation } = useCanvasAnimations({ fabricCanvasRef });
  const { enable3D, disable3D } = useCanvas3D({ fabricCanvasRef });
  const { enableAR, disableAR } = useCanvasAR({ fabricCanvasRef });
  const { startCollaboration, stopCollaboration } = useCanvasCollaboration({ fabricCanvasRef });
  const { generateAI, clearAI } = useCanvasAI({ fabricCanvasRef });
  const { runAutomation, clearAutomation } = useCanvasAutomation({ fabricCanvasRef });
  const { runTests, clearTests } = useCanvasTesting({ fabricCanvasRef });
  const { optimizeCanvas, clearOptimization } = useCanvasOptimization({ fabricCanvasRef });
  const { enableSecurity, disableSecurity } = useCanvasSecurity({ fabricCanvasRef });
  const { applyTheme, clearTheme } = useCanvasTheming({ fabricCanvasRef });
  const { setLocale, clearLocale } = useCanvasLocalization({ fabricCanvasRef });
  const { undo, redo } = useCanvasUndoRedo({ fabricCanvasRef, historyRef });
  const { startTutorial, stopTutorial } = useCanvasTutorial({ fabricCanvasRef });
  const { submitFeedback, clearFeedback } = useCanvasFeedback({ fabricCanvasRef });
  const { getSupport, clearSupport } = useCanvasSupport({ fabricCanvasRef });
  const { applyLicense, clearLicense } = useCanvasLicensing({ fabricCanvasRef });
  const { enableMonetization, disableMonetization } = useCanvasMonetization({ fabricCanvasRef });
  const { joinCommunity, leaveCommunity } = useCanvasCommunity({ fabricCanvasRef });
  const { exploreEcosystem, clearEcosystem } = useCanvasEcosystem({ fabricCanvasRef });
  const { enterMetaverse, leaveMetaverse } = useCanvasMetaverse({ fabricCanvasRef });
  const { exploreFuture, clearFuture } = useCanvasFuture({ fabricCanvasRef });
  
  // Load initial canvas state
  const initializeCanvas = useCallback((canvasElement: HTMLCanvasElement) => {
    const fabricCanvas = new FabricCanvas(canvasElement, {
      backgroundColor: '#fff',
      selection: true,
      width: canvasElement.width,
      height: canvasElement.height
    });
    
    setCanvas(fabricCanvas);
    fabricCanvasRef.current = fabricCanvas;
    
    // Example of adding a floor plan
    const now = new Date().toISOString();
    const floorPlan = {
      id: 'floor-1',
      name: 'Initial Floor Plan',
      label: 'Ground Floor',
      index: 0,
      strokes: [],
      walls: [],
      rooms: [],
      canvasData: null,
      canvasJson: null,
      gia: 0,
      level: 0,
      createdAt: now,
      updatedAt: now,
      metadata: createCompleteMetadata(),
      data: {}, // Added required property
      userId: 'default-user' // Added required property
    };
    
    const addFloorPlan = () => {
      const rect = new FabricObject.Rect({
        left: 100,
        top: 100,
        fill: 'red',
        width: 20,
        height: 20
      });
      
      fabricCanvas.add(rect);
      fabricCanvas.renderAll();
    };
    
    const addWall = () => {
      const now = new Date().toISOString();
      const metadata = {
        createdAt: now,
        updatedAt: now,
        paperSize: 'A4',
        level: 0,
        version: '1.0',
        author: 'User',
        dateCreated: now, // Ensure this is included
        lastModified: now, // Ensure this is included
        notes: '' // Ensure this is included
      };
      
      const wall = {
        id: 'wall-1',
        start: { x: 0, y: 0 },
        end: { x: 100, y: 0 },
        thickness: 5,
        color: '#000000',
        length: 100, // Calculate or provide a value
        roomIds: [] // Include required properties
        // floorPlanId removed as it's not in Wall type
      };
      
      console.log('Adding wall to canvas', wall);
    };
    
    // Example of grouping objects
    const groupObjects = () => {
      const rect1 = new FabricObject.Rect({
        left: 10,
        top: 10,
        width: 20,
        height: 20,
        fill: 'blue'
      });
      
      const rect2 = new FabricObject.Rect({
        left: 50,
        top: 50,
        width: 20,
        height: 20,
        fill: 'green'
      });
      
      const group = new Group([rect1, rect2]);
      fabricCanvas.add(group);
      fabricCanvas.renderAll();
    };
    
    // Add examples to the canvas
    addFloorPlan();
    addWall();
    groupObjects();
    
    // Set up canvas event listeners
    setupEvents(fabricCanvas);
    
    // Create initial grid
    const gridObjects = createGrid(fabricCanvas);
    gridLayerRef.current = gridObjects;
    
    // Save initial canvas state
    saveState();
    
    console.log('Canvas initialized successfully');
  }, [createGrid, saveState, setupEvents, fabricCanvasRef, gridLayerRef]);
  
  // Clear canvas state
  const clearCanvas = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    fabricCanvasRef.current.clear();
    clearEvents(fabricCanvasRef.current);
    clearHistory();
    console.log('Canvas cleared');
  }, [clearEvents, clearHistory, fabricCanvasRef]);
  
  useEffect(() => {
    return () => {
      if (fabricCanvasRef.current) {
        clearCanvas();
      }
    };
  }, [clearCanvas, fabricCanvasRef]);
  
  return {
    canvas,
    initializeCanvas,
    clearCanvas,
    setupEvents,
    clearEvents,
    zoomIn,
    zoomOut,
    resetZoom,
    createGrid,
    toggleGridVisibility,
    enableSnapping,
    disableSnapping,
    saveState,
    restoreState,
    clearHistory,
    exportToJSON,
    exportToImage,
    selectAll,
    deselectAll,
    lockObject,
    unlockObject,
    measureDistance,
    clearMeasurements,
    addLayer,
    removeLayer,
    moveLayerUp,
    moveLayerDown,
    showGuides,
    hideGuides,
    startProfiling,
    stopProfiling,
    runDiagnostics,
    clearDiagnostics,
    checkAccessibility,
    fixAccessibility,
    saveData,
    loadData,
    clearData,
    enableInteractions,
    disableInteractions,
    enableTextEditing,
    disableTextEditing,
    setBackgroundImage,
    removeBackgroundImage,
    applyFilter,
    removeFilter,
    playAnimation,
    stopAnimation,
    enable3D,
    disable3D,
    enableAR,
    disableAR,
    startCollaboration,
    stopCollaboration,
    generateAI,
    clearAI,
    runAutomation,
    clearAutomation,
    runTests,
    clearTests,
    optimizeCanvas,
    clearOptimization,
    enableSecurity,
    disableSecurity,
    applyTheme,
    clearTheme,
    setLocale,
    clearLocale,
    undo,
    redo,
    startTutorial,
    stopTutorial,
    submitFeedback,
    clearFeedback,
    getSupport,
    clearSupport,
    applyLicense,
    clearLicense,
    enableMonetization,
    disableMonetization,
    joinCommunity,
    leaveCommunity,
    exploreEcosystem,
    clearEcosystem,
    enterMetaverse,
    leaveMetaverse,
    exploreFuture,
    clearFuture
  };
};
