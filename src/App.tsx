
import React from 'react';
import { CanvasWrapper } from './components/canvas/CanvasWrapper';
import { DrawingProvider } from './contexts/DrawingContext';
import { CanvasProvider } from './contexts/CanvasContext';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <h1 className="text-2xl font-bold mb-4">Canvas Drawing Tool</h1>
      <div className="w-full h-[600px] border border-gray-200 rounded-md overflow-hidden">
        <DrawingProvider>
          <CanvasProvider>
            <CanvasWrapper />
          </CanvasProvider>
        </DrawingProvider>
      </div>
    </div>
  );
};

export default App;
