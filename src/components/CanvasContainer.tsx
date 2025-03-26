
/**
 * Container component for the canvas element
 * Wraps the canvas element and provides a reference to it
 * Also displays debug information
 * @module CanvasContainer
 */
import { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";
import { DebugInfo } from "./DebugInfo";
import { DebugInfoState } from "@/types/drawingTypes";
import { useDomRef } from "@/hooks/useDomRef";
import { 
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_CANVAS_WIDTH
} from "@/constants/numerics";

interface CanvasContainerProps {
  debugInfo: DebugInfoState;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

/**
 * Container component for the canvas element
 * Provides accessible keyboard focus and proper sizing
 * @param {CanvasContainerProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export const CanvasContainer = ({ debugInfo, canvasRef }: CanvasContainerProps): JSX.Element => {
  // Create a local ref that auto-focuses if one is not provided
  const localCanvasRef = useDomRef<HTMLCanvasElement>(true);
  const canvasReference = canvasRef || localCanvasRef;
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [dimensionsSetupAttempt, setDimensionsSetupAttempt] = useState(0);
  
  // Force initialization after render to ensure canvas has dimensions
  useEffect(() => {
    const setupCanvasDimensions = () => {
      if (canvasReference.current && containerRef.current) {
        // Get container dimensions
        const containerRect = containerRef.current.getBoundingClientRect();
        
        // Set canvas dimensions explicitly based on container
        if (containerRect.width > 0 && containerRect.height > 0) {
          canvasReference.current.width = containerRect.width;
          canvasReference.current.height = Math.max(containerRect.height, DEFAULT_CANVAS_HEIGHT);
          
          // Also set style dimensions to match
          canvasReference.current.style.width = `${containerRect.width}px`;
          canvasReference.current.style.height = `${Math.max(containerRect.height, DEFAULT_CANVAS_HEIGHT)}px`;
          
          // Force a reflow to ensure dimensions are applied
          canvasReference.current.getBoundingClientRect();
          
          // Signal that canvas is ready after dimensions are set
          setCanvasReady(true);
          
          console.log("Canvas sized to dimensions:", 
            containerRect.width, "x", Math.max(containerRect.height, DEFAULT_CANVAS_HEIGHT));
        } else {
          // Fallback sizes if container dimensions are not available
          canvasReference.current.width = DEFAULT_CANVAS_WIDTH;
          canvasReference.current.height = DEFAULT_CANVAS_HEIGHT;
          canvasReference.current.style.width = `${DEFAULT_CANVAS_WIDTH}px`;
          canvasReference.current.style.height = `${DEFAULT_CANVAS_HEIGHT}px`;
          console.log(`Using fallback canvas dimensions: ${DEFAULT_CANVAS_WIDTH}x${DEFAULT_CANVAS_HEIGHT}`);
          
          // Signal that canvas is ready even with fallback dimensions
          setCanvasReady(true);
          
          // Try again later if container dimensions are zero
          if (dimensionsSetupAttempt < 3) {
            setTimeout(() => {
              setDimensionsSetupAttempt(prev => prev + 1);
            }, 300);
          }
        }
      }
    };
    
    // Run the setup function
    setupCanvasDimensions();
    
    // Rerun setup if the container or canvas change, or on retry attempts
  }, [canvasReference, dimensionsSetupAttempt, containerRef.current]);

  return (
    <Card className="p-0 bg-white shadow-md rounded-lg overflow-visible h-full">
      <div 
        ref={containerRef} 
        className="w-full h-full relative overflow-visible"
        data-testid="canvas-container"
        style={{ minHeight: '600px' }} // Ensure minimum height
      >
        <canvas 
          ref={canvasReference} 
          className="w-full h-full border border-gray-100 focus:outline-blue-500 focus:border-blue-500 rounded-md" 
          tabIndex={0}
          aria-label="Floor plan drawing canvas"
          role="application"
          style={{ display: "block" }}
          data-testid="canvas-element"
          id="fabric-canvas"
          data-canvas-ready={canvasReady ? "true" : "false"}
        />
      </div>
      <DebugInfo debugInfo={{...debugInfo, canvasReady}} />
    </Card>
  );
};
