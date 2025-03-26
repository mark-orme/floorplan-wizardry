
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { Card } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';

interface EmergencyCanvasProps {
  onRetry?: () => void;
  width?: number;
  height?: number;
}

/**
 * Simplified backup canvas component when the main canvas fails
 * This component has minimal dependencies and a simple implementation
 */
export const EmergencyCanvas: React.FC<EmergencyCanvasProps> = ({ 
  onRetry,
  width = 800,
  height = 600
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Initialize directly without complex hooks
    try {
      // Create a fresh canvas element to ensure no initialization conflicts
      const canvasElement = document.createElement('canvas');
      canvasElement.width = width;
      canvasElement.height = height;
      canvasElement.style.width = `${width}px`;
      canvasElement.style.height = `${height}px`;
      
      // Replace the existing element with our fresh one
      if (canvasRef.current.parentNode) {
        canvasRef.current.parentNode.replaceChild(canvasElement, canvasRef.current);
        canvasRef.current = canvasElement;
      }
      
      // Create a new Fabric canvas instance
      const fabricCanvas = new FabricCanvas(canvasElement, {
        width,
        height,
        backgroundColor: '#f8f9fa'
      });
      fabricRef.current = fabricCanvas;
      
      // Create basic grid lines
      for (let i = 0; i <= width; i += 100) {
        const line = new Line([i, 0, i, height], {
          stroke: '#999',
          strokeWidth: 1,
          selectable: false,
          evented: false
        });
        fabricCanvas.add(line);
      }
      
      for (let i = 0; i <= height; i += 100) {
        const line = new Line([0, i, width, i], {
          stroke: '#999',
          strokeWidth: 1,
          selectable: false,
          evented: false
        });
        fabricCanvas.add(line);
      }
      
      // Add message about emergency mode
      const text = new Text('EMERGENCY MODE', {
        left: width / 2 - 80,
        top: height / 2 - 30,
        fontSize: 20,
        fontWeight: 'bold',
        fill: 'red',
        selectable: false,
        evented: false
      });
      fabricCanvas.add(text);
      
      const subtext = new Text('Canvas initialization failed. Using simplified mode.', {
        left: width / 2 - 150,
        top: height / 2 + 10,
        fontSize: 14,
        fill: 'black',
        selectable: false,
        evented: false
      });
      fabricCanvas.add(subtext);
      
      fabricCanvas.renderAll();
      
      console.log('Emergency canvas initialized successfully');
    } catch (error) {
      console.error('Failed to initialize emergency canvas:', error);
    }
    
    return () => {
      if (fabricRef.current) {
        try {
          fabricRef.current.dispose();
          fabricRef.current = null;
        } catch (error) {
          console.error('Error disposing emergency canvas:', error);
        }
      }
    };
  }, [width, height]);
  
  return (
    <div className="relative">
      <Card className="p-0 bg-white shadow-md rounded-lg overflow-visible">
        <div className="w-full h-full relative" style={{ minHeight: '600px' }}>
          <canvas 
            ref={canvasRef} 
            className="w-full h-full border border-gray-100 rounded-md"
            style={{ display: "block" }}
            data-testid="emergency-canvas"
          />
        </div>
      </Card>
      
      <Alert variant="destructive" className="mt-4">
        <AlertTitle>Canvas Error</AlertTitle>
        <AlertDescription>
          The main canvas failed to initialize after multiple attempts. Using simplified backup mode.
          <div className="mt-4">
            <Button variant="outline" onClick={onRetry} className="flex items-center gap-2">
              <RefreshCw size={16} />
              Retry with main canvas
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};
