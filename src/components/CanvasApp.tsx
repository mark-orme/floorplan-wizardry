
/**
 * Canvas application component
 * Main component that wraps the canvas with necessary UI elements
 * @module CanvasApp
 */
import { Canvas } from "@/components/Canvas";
import CanvasLayout from "@/components/CanvasLayout"; 
import { DrawingToolbarModals } from "@/components/DrawingToolbarModals";

/**
 * Canvas application component
 * Wraps the canvas with necessary controllers and UI
 * @returns {JSX.Element} Rendered component
 */
export const CanvasApp = (): JSX.Element => {
  return (
    <CanvasLayout>
      <Canvas />
      <DrawingToolbarModals />
    </CanvasLayout>
  );
};
