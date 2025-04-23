
import React, { useState, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { SecurityInitializer } from './security/SecurityInitializer';
import { AccessibilityTester } from './testing/AccessibilityTester';
import { Canvas } from './Canvas';
import { CanvasTools } from './CanvasTools';
import { toast } from 'sonner';
import { useGeometryWorker } from '@/hooks/useGeometryWorker';
import { DrawingMode } from '@/constants/drawingModes';

export const MainFloorPlanEditor: React.FC = () => {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [securityEnabled, setSecurityEnabled] = useState(true);
  const [accessibilityTestingEnabled, setAccessibilityTestingEnabled] = useState(
    process.env.NODE_ENV === 'development'
  );
  const [tool, setTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [lineColor, setLineColor] = useState('#000000');
  const [lineThickness, setLineThickness] = useState(2);
  
  const { isReady: workerReady } = useGeometryWorker();
  
  // Handle canvas ready
  const handleCanvasReady = (canvasInstance: FabricCanvas) => {
    setCanvas(canvasInstance);
    toast.success('Floor plan editor initialized');
  };
  
  // Handle canvas error
  const handleCanvasError = (error: Error) => {
    toast.error(`Error: ${error.message}`);
    console.error('Canvas error:', error);
  };
  
  // Toggle security features
  const toggleSecurity = () => {
    setSecurityEnabled(prev => !prev);
  };
  
  // Toggle accessibility testing
  const toggleAccessibilityTesting = () => {
    setAccessibilityTestingEnabled(prev => !prev);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Initialize security features */}
      {securityEnabled && <SecurityInitializer />}
      
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Floor Plan Editor</h1>
        
        <div className="mb-4 flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${securityEnabled ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            onClick={toggleSecurity}
          >
            Security Features: {securityEnabled ? 'Enabled' : 'Disabled'}
          </button>
          
          <button
            className={`px-4 py-2 rounded ${accessibilityTestingEnabled ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={toggleAccessibilityTesting}
          >
            Accessibility Testing: {accessibilityTestingEnabled ? 'Enabled' : 'Disabled'}
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
              undo={() => console.log('undo')}
              redo={() => console.log('redo')}
            />
          )}
          
          <div className="mt-2">
            <Canvas
              width={800}
              height={600}
              onCanvasReady={handleCanvasReady}
              onError={handleCanvasError}
              showGridDebug={true}
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
  );
};

export default MainFloorPlanEditor;
