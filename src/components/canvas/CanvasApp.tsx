
/**
 * Canvas application component
 * Main component that wraps the canvas with necessary UI elements
 * @module CanvasApp
 */
import { Canvas } from "@/components/Canvas";
import CanvasLayout from "@/components/CanvasLayout"; 
import { DrawingToolbarModals } from "@/components/DrawingToolbarModals";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";

/**
 * Props for the CanvasApp component
 */
export interface CanvasAppProps {
  /** Function to set the canvas instance */
  setCanvas?: (canvas: FabricCanvas | null) => void;
  /** Optional function to create grid on canvas */
  createGrid?: (canvas: FabricCanvas, existingGrid?: FabricObject[]) => FabricObject[];
}

/**
 * Canvas application component
 * Wraps the canvas with necessary controllers and UI
 * @returns {JSX.Element} Rendered component
 */
export const CanvasApp = ({ setCanvas, createGrid }: CanvasAppProps): JSX.Element => {
  return (
    <CanvasLayout>
      <Canvas 
        onCanvasReady={canvas => {
          if (setCanvas) {
            setCanvas(canvas);
          }
          
          // Create grid if function provided
          if (createGrid && canvas) {
            createGrid(canvas);
          }
        }} 
      />
      <DrawingToolbarModals />
    </CanvasLayout>
  );
};
