
import React, { useState } from 'react';
import { DrawingProvider } from '@/contexts/DrawingContext';
import { Canvas } from '@/components/Canvas';
import { CanvasTools } from '@/components/CanvasTools';
import { Canvas as FabricCanvas } from 'fabric';
import { useCanvasContext } from '@/contexts/CanvasContext';

export default function Index() {
  const { canvas, setCanvas } = useCanvasContext();
  const [debugEnabled, setDebugEnabled] = useState(false);
  
  const handleCanvasReady = (fabricCanvas: FabricCanvas) => {
    setCanvas(fabricCanvas);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Floor Plan Editor</h1>
      
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <DrawingProvider canvas={canvas}>
            <div className="border rounded-lg overflow-hidden shadow-lg bg-white">
              <Canvas 
                width={800} 
                height={600} 
                onCanvasReady={handleCanvasReady}
                showGridDebug={debugEnabled}
              />
            </div>
            
            {canvas && (
              <div className="mt-4">
                <CanvasTools />
              </div>
            )}
          </DrawingProvider>
        </div>
        
        <div className="lg:w-1/4">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Settings</h2>
            
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="debug-toggle"
                checked={debugEnabled}
                onChange={() => setDebugEnabled(!debugEnabled)}
                className="mr-2"
              />
              <label htmlFor="debug-toggle">Show Debug Info</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
