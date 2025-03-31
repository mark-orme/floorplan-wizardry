
import React from "react";
import { ConnectedDrawingCanvas } from "./ConnectedDrawingCanvas";

interface CanvasContainerProps {
  onCanvasRef: (ref: any) => void;
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({
  onCanvasRef
}) => {
  return (
    <div className="flex-1 overflow-hidden">
      <ConnectedDrawingCanvas 
        width={window.innerWidth - 48}
        height={window.innerHeight - 180} // Adjusted for toolbar height
        onCanvasRef={onCanvasRef}
      />
    </div>
  );
};
