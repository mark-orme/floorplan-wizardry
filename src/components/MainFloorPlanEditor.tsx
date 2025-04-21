
import React, { useState, useEffect } from 'react';
import { FloorPlanCanvasEnhancedMain } from './property/FloorPlanCanvasEnhancedMain';
import { SecurityInitializer } from './security/SecurityInitializer';
import { AccessibilityTester } from './testing/AccessibilityTester';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import { useGeometryWorker } from '@/hooks/useGeometryWorker';

export const MainFloorPlanEditor: React.FC = () => {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [securityEnabled, setSecurityEnabled] = useState(true);
  const [accessibilityTestingEnabled, setAccessibilityTestingEnabled] = useState(
    process.env.NODE_ENV === 'development'
  );
  
  const { isReady: workerReady } = useGeometryWorker();
  
  // Handle canvas ready
  const handleCanvasReady = (canvasInstance: FabricCanvas) => {
    setCanvas(canvasInstance);
    toast.success('Floor plan editor initialized');
    
    // Log worker status
    if (workerReady) {
      console.log('Geometry worker ready for high-performance calculations');
    }
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
          <FloorPlanCanvasEnhancedMain
            width={800}
            height={600}
            onCanvasReady={handleCanvasReady}
            onCanvasError={handleCanvasError}
            showPerformanceMetrics={true}
            showSecurityInfo={securityEnabled}
          />
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>
            This component includes virtualization for improved performance with large floor plans,
            web workers for offloading geometry calculations, CSRF protection, and CSP headers for security.
          </p>
          
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div className="bg-gray-100 p-3 rounded">
              <h3 className="font-semibold">Performance Features:</h3>
              <ul className="list-disc list-inside text-xs">
                <li>Canvas virtualization (only renders visible objects)</li>
                <li>Web Workers for geometry calculations</li>
                <li>FPS monitoring and optimization</li>
                <li>Selective rendering</li>
              </ul>
            </div>
            
            <div className="bg-gray-100 p-3 rounded">
              <h3 className="font-semibold">Security Features:</h3>
              <ul className="list-disc list-inside text-xs">
                <li>CSRF token protection</li>
                <li>Content Security Policy headers</li>
                <li>Input sanitization</li>
                <li>Secure event handling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Accessibility testing component */}
      {accessibilityTestingEnabled && <AccessibilityTester autoRun={false} showResults={true} />}
    </div>
  );
};

export default MainFloorPlanEditor;
