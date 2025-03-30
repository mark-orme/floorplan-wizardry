
import React from "react";
import { CanvasApp } from "@/components/canvas/CanvasApp";
import { createFloorPlanGrid } from "@/utils/gridCreationUtils";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";

/**
 * Props for the CanvasLayout component
 */
interface CanvasLayoutProps {
  createGrid?: (canvas: FabricCanvas, existingGrid?: FabricObject[]) => FabricObject[];
  children?: React.ReactNode;
}

/**
 * Canvas Layout component
 * Renders the main CanvasApp with proper grid creation
 * @returns {JSX.Element} Rendered component
 */
const CanvasLayout: React.FC<CanvasLayoutProps> = ({ 
  createGrid = createFloorPlanGrid,
  children 
}) => {
  return (
    <>
      <CanvasApp createGrid={createGrid} />
      {children}
    </>
  );
};

export default CanvasLayout;
