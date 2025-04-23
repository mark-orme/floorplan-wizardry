
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { SecurityInitializer } from './security/SecurityInitializer';
import { AccessibilityTester } from './testing/AccessibilityTester';
import { Canvas } from './Canvas';
import { CanvasTools } from './CanvasTools';
import { toast } from 'sonner';
import { useGeometryWorker } from '@/hooks/useGeometryWorker';
import { DrawingMode } from '@/constants/drawingModes';
import { DrawingContext } from '@/contexts/DrawingContext';

export const MainFloorPlanEditor: React.FC = () => {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [securityEnabled, setSecurityEnabled] = useState(true);
  const [accessibilityTestingEnabled, setAccessibilityTestingEnabled] = useState(
    process.env.NODE_ENV === 'development'
  );
  const [tool, setTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [lineColor, setLineColor] = useState('#000000');
  const [lineThickness, setLineThickness] = useState(2);
  const [showGrid, setShowGrid] = useState(true);
  const undoHistory = useRef<any[]>([]);
  const redoHistory = useRef<any[]>([]);
  
  const { isReady: workerReady } = useGeometryWorker();
  
  // Handle canvas ready
  const handleCanvasReady = useCallback((canvasInstance: FabricCanvas) => {
    setCanvas(canvasInstance);
    toast.success('Floor plan editor initialized');
  }, []);
  
  // Handle canvas error
  const handleCanvasError = useCallback((error: Error) => {
    toast.error(`Error: ${error.message}`);
    console.error('Canvas error:', error);
  }, []);
  
  // Toggle security features
  const toggleSecurity = useCallback(() => {
    setSecurityEnabled(prev => !prev);
  }, []);
  
  // Toggle accessibility testing
  const toggleAccessibilityTesting = useCallback(() => {
    setAccessibilityTestingEnabled(prev => !prev);
  }, []);
  
  // Toggle grid
  const toggleGrid = useCallback(() => {
    setShowGrid(prev => !prev);
  }, []);
  
  // Undo handler
  const handleUndo = useCallback(() => {
    if (!canvas || undoHistory.current.length === 0) return;
    
    // Implementation would restore previous state
    console.log('Undo operation');
  }, [canvas]);
  
  // Redo handler
  const handleRedo = useCallback(() => {
    if (!canvas || redoHistory.current.length === 0) return;
    
    // Implementation would restore next state
    console.log('Redo operation');
  }, [canvas]);
  
  // Memoize drawing context value
  const drawingContextValue = React.useMemo(() => ({
    tool,
    setTool,
    lineColor,
    setLineColor,
    lineThickness,
    setLineThickness,
    showGrid,
    setShowGrid,
    canUndo: undoHistory.current.length > 0,
    canRedo: redoHistory.current.length > 0
  }), [
    tool, lineColor, lineThickness, showGrid
  ]);
  
  return (
    <DrawingContext.Provider value={drawingContextValue}>
      <div className="min-h-screen bg-gray-50">
        {/* Initialize security features */}
        {securityEnabled && <SecurityInitializer />}
        
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Floor Plan Editor</h1>
          
          <div className="mb-4 flex flex-wrap space-x-2 space-y-2 sm:space-y-0">
            <button
              className={`px-4 py-2 rounded ${securityEnabled ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
              onClick={toggleSecurity}
            >
              Security: {securityEnabled ? 'On' : 'Off'}
            </button>
            
            <button
              className={`px-4 py-2 rounded ${accessibilityTestingEnabled ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={toggleAccessibilityTesting}
            >
              A11y: {accessibilityTestingEnabled ? 'On' : 'Off'}
            </button>
            
            <button
              className={`px-4 py-2 rounded ${showGrid ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
              onClick={toggleGrid}
            >
              Grid: {showGrid ? 'Visible' : 'Hidden'}
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-4">
            {/* Canvas Tools */}
            {canvas && (
              <CanvasTools
                tool={tool}
                setTool={setTool}
                lineColor={lineColor}
                setLineColor={setLineColor}
                lineThickness={lineThickness}
                setLineThickness={setLineThickness}
                canvas={canvas}
                undo={handleUndo}
                redo={handleRedo}
              />
            )}
            
            <div className="mt-2">
              <Canvas
                width={800}
                height={600}
                onCanvasReady={handleCanvasReady}
                onError={handleCanvasError}
                showGridDebug={showGrid}
              />
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>
              Floor plan editor with drawing tools and grid. Select different tools to draw shapes or lines on the canvas.
            </p>
          </div>
        </div>
        
        {/* Accessibility testing component */}
        {accessibilityTestingEnabled && <AccessibilityTester showResults={true} />}
      </div>
    </DrawingContext.Provider>
  );
};

export default MainFloorPlanEditor;
