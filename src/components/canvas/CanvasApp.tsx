
import React from 'react';
import { Canvas } from '@/components/canvas/Canvas';
import { CanvasStats } from '@/components/canvas/debug/CanvasStats';

/**
 * Canvas Application Component
 */
const CanvasApp: React.FC = () => {
  const [canvas, setCanvas] = React.useState<any>(null);
  const [zoomLevel, setZoomLevel] = React.useState(1);

  const handleCanvasReady = (fabricCanvas: any) => {
    setCanvas(fabricCanvas);
  };

  return (
    <div className="canvas-app-container p-4">
      <h2 className="text-2xl font-bold mb-4">Canvas Editor</h2>
      <div className="flex">
        <div className="canvas-wrapper flex-1">
          <Canvas 
            width={800}
            height={600}
            onCanvasReady={handleCanvasReady}
            showGridDebug={false}
          />
        </div>
        <div className="canvas-sidebar w-64 ml-4 bg-gray-50 p-4 rounded border">
          <h3 className="font-semibold mb-2">Canvas Stats</h3>
          <CanvasStats 
            canvas={canvas} 
            zoomLevel={zoomLevel} 
          />
        </div>
      </div>
    </div>
  );
};

export default CanvasApp;
