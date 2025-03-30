
import React from "react";
import { CanvasApp } from "@/components/canvas/CanvasApp";
import { createFloorPlanGrid } from "@/utils/gridCreationUtils";

/**
 * Canvas Layout component
 * Renders the main CanvasApp with proper grid creation
 * @returns {JSX.Element} Rendered component
 */
const CanvasLayout: React.FC = () => {
  return <CanvasApp createGrid={createFloorPlanGrid} />;
};

export default CanvasLayout;
