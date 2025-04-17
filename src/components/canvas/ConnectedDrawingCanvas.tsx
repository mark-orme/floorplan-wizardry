
import React, { useRef, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";

interface ConnectedDrawingCanvasProps {
  width: number;
  height: number;
  onCanvasRef: (canvasOperations: any) => void;
}

export const ConnectedDrawingCanvas: React.FC<ConnectedDrawingCanvasProps> = ({
  width,
  height,
  onCanvasRef
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);

  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;

    try {
      // Initialize fabric canvas
      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        selection: true,
        backgroundColor: "#ffffff"  // Set background color during initialization
      });

      fabricCanvasRef.current = canvas;

      // Setup canvas operations
      const canvasOperations = {
        canvas,
        undo: () => {
          if (historyIndexRef.current > 0) {
            historyIndexRef.current--;
            const prevState = historyRef.current[historyIndexRef.current];
            canvas.loadFromJSON(JSON.parse(prevState), canvas.renderAll.bind(canvas));
            return true;
          }
          return false;
        },
        redo: () => {
          if (historyIndexRef.current < historyRef.current.length - 1) {
            historyIndexRef.current++;
            const nextState = historyRef.current[historyIndexRef.current];
            canvas.loadFromJSON(JSON.parse(nextState), canvas.renderAll.bind(canvas));
            return true;
          }
          return false;
        },
        clearCanvas: () => {
          canvas.clear();
          canvas.backgroundColor = "#ffffff";  // Directly set backgroundColor
          canvas.renderAll();
          saveCanvasState();
        },
        saveCanvas: () => {
          saveCanvasState();
          return true;
        },
        canUndo: historyIndexRef.current > 0,
        canRedo: historyIndexRef.current < historyRef.current.length - 1
      };

      // Setup canvas event listeners
      const saveCanvasState = () => {
        const json = JSON.stringify(canvas.toJSON());
        
        // If we're not at the end of the history, remove future states
        if (historyIndexRef.current < historyRef.current.length - 1) {
          historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
        }
        
        historyRef.current.push(json);
        historyIndexRef.current = historyRef.current.length - 1;
        
        // Update undo/redo availability
        canvasOperations.canUndo = historyIndexRef.current > 0;
        canvasOperations.canRedo = historyIndexRef.current < historyRef.current.length - 1;
      };

      // Setup object added/modified event listeners
      canvas.on('object:added', saveCanvasState);
      canvas.on('object:modified', saveCanvasState);
      canvas.on('object:removed', saveCanvasState);

      // Initial canvas state
      saveCanvasState();

      // Pass canvas operations to parent
      onCanvasRef(canvasOperations);

      // Cleanup on unmount
      return () => {
        canvas.off('object:added', saveCanvasState);
        canvas.off('object:modified', saveCanvasState);
        canvas.off('object:removed', saveCanvasState);
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    } catch (error) {
      console.error("Error initializing canvas:", error);
    }
  }, [width, height, onCanvasRef]);

  return (
    <canvas
      ref={canvasRef}
      className="border border-gray-200 rounded"
      data-testid="floor-plan-canvas"
    />
  );
};
