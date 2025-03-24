
import { useCallback, useEffect } from "react";
import { Canvas as FabricCanvas, PencilBrush, Path, Polyline } from "fabric";
import { toast } from "sonner";
import { 
  PIXELS_PER_METER,
  fabricPathToPoints, 
  snapToGrid, 
  straightenStroke,
  calculateGIA, 
  type FloorPlan,
  type Stroke 
} from "@/utils/drawing";
import { snapToAngle } from "@/utils/fabricHelpers";

interface UseCanvasDrawingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<any[]>;
  historyRef: React.MutableRefObject<{past: any[][], future: any[][]}>;
  tool: "draw" | "room" | "straightLine";
  currentFloor: number;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  setGia: React.Dispatch<React.SetStateAction<number>>;
}

export const useCanvasDrawing = ({
  fabricCanvasRef,
  gridLayerRef,
  historyRef,
  tool,
  currentFloor,
  setFloorPlans,
  setGia
}: UseCanvasDrawingProps) => {
  
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const fabricCanvas = fabricCanvasRef.current;
    
    const handlePathCreated = (e: { path: Path }) => {
      console.log("Path created event triggered");
      const path = e.path;
      
      if (!path.path) {
        console.error("Invalid path object:", path);
        return;
      }
      
      try {
        const points = fabricPathToPoints(path.path);
        console.log("Points extracted from path:", points.length);
        
        if (points.length < 2) {
          console.error("Not enough points to create a path");
          return;
        }
        
        const snappedPoints = snapToGrid(points);
        console.log("Points snapped to grid");

        let finalPoints = snappedPoints;
        
        if (tool === 'straightLine') {
          finalPoints = straightenStroke(snappedPoints);
          console.log("Straightened stroke:", finalPoints);
        } else if (tool === 'room' && snappedPoints.length >= 2) {
          // For room tool, use angle snapping for 45-degree angles
          finalPoints = [snappedPoints[0]];
          
          for (let i = 1; i < snappedPoints.length; i++) {
            const snappedEnd = snapToAngle(snappedPoints[i-1], snappedPoints[i]);
            finalPoints.push(snappedEnd);
          }
          console.log("Room points with angle snapping:", finalPoints);
        }

        const polyline = new Polyline(
          finalPoints.map(p => ({ x: p.x * PIXELS_PER_METER, y: p.y * PIXELS_PER_METER })),
          {
            stroke: '#000000',
            strokeWidth: 2,
            fill: tool === 'room' ? 'rgba(0, 0, 255, 0.1)' : 'transparent',
            objectType: tool === 'room' ? 'room' : 'line'
          }
        );

        fabricCanvas.remove(path);
        fabricCanvas.add(polyline);
        
        gridLayerRef.current.forEach(gridObj => {
          fabricCanvas.sendObjectToBack(gridObj);
        });
        
        fabricCanvas.renderAll();
        
        setFloorPlans(prev => {
          const newFloorPlans = [...prev];
          if (newFloorPlans[currentFloor]) {
            newFloorPlans[currentFloor] = {
              ...newFloorPlans[currentFloor],
              strokes: [...newFloorPlans[currentFloor].strokes, finalPoints]
            };
            
            if (tool === 'room' && finalPoints.length > 2) {
              const area = calculateGIA(finalPoints);
              setGia(prev => prev + area);
              toast.success(`Room added: ${area.toFixed(2)} m²`);
            }
          }
          return newFloorPlans;
        });

        const currentState = fabricCanvas.getObjects().filter(obj => 
          obj.type === 'polyline' || obj.type === 'path'
        );
        historyRef.current.past.push([...currentState]);
        historyRef.current.future = [];
      } catch (error) {
        console.error("Error processing drawing:", error);
        toast.error("Failed to process drawing");
      }
    };
    
    fabricCanvas.on('path:created', handlePathCreated);
    
    return () => {
      fabricCanvas.off('path:created', handlePathCreated);
    };
  }, [fabricCanvasRef, gridLayerRef, historyRef, tool, currentFloor, setFloorPlans, setGia]);
};
