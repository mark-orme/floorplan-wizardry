
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
import logger from "@/utils/logger";

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
  const setupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Force initialization after render to ensure canvas has dimensions
  useEffect(() => {
    const setupCanvasDimensions = () => {
      if (canvasReference.current && containerRef.current) {
        try {
          // Get container dimensions
          const containerRect = containerRef.current.getBoundingClientRect();
          
          // Only proceed if we have valid dimensions
          if (containerRect.width > 0 && containerRect.height > 0) {
            logger.info(`Setting canvas dimensions to ${containerRect.width}x${Math.max(containerRect.height, DEFAULT_CANVAS_HEIGHT)}`);
            
            // Set canvas dimensions explicitly based on container
            canvasReference.current.width = containerRect.width;
            canvasReference.current.height = Math.max(containerRect.height, DEFAULT_CANVAS_HEIGHT);
            
            // Also set style dimensions to match
            canvasReference.current.style.width = `${containerRect.width}px`;
            canvasReference.current.style.height = `${Math.max(containerRect.height, DEFAULT_CANVAS_HEIGHT)}px`;
            
            // Force a reflow to ensure dimensions are applied
            canvasReference.current.getBoundingClientRect();
            
            // Signal that canvas is ready after dimensions are set
            setCanvasReady(true);
          } else {
            // Use fallback dimensions if container dimensions aren't available
            logger.warn("Container dimensions are zero, using fallback dimensions");
            canvasReference.current.width = DEFAULT_CANVAS_WIDTH;
            canvasReference.current.height = DEFAULT_CANVAS_HEIGHT;
            canvasReference.current.style.width = `${DEFAULT_CANVAS_WIDTH}px`;
            canvasReference.current.style.height = `${DEFAULT_CANVAS_HEIGHT}px`;
            
            // Signal that canvas is ready even with fallback dimensions
            setCanvasReady(true);
            
            // Try again later if container dimensions are zero and we haven't tried too many times
            if (dimensionsSetupAttempt < 5) {
              setupTimeoutRef.current = setTimeout(() => {
                setDimensionsSetupAttempt(prev => prev + 1);
              }, 300);
            }
          }
        } catch (error) {
          logger.error("Error setting canvas dimensions:", error);
          // Set fallback dimensions on error
          if (canvasReference.current) {
            canvasReference.current.width = DEFAULT_CANVAS_WIDTH;
            canvasReference.current.height = DEFAULT_CANVAS_HEIGHT;
            setCanvasReady(true);
          }
        }
      }
    };
    
    // Run the setup function
    setupCanvasDimensions();
    
    // Clean up timeout
    return () => {
      if (setupTimeoutRef.current) {
        clearTimeout(setupTimeoutRef.current);
      }
    };
  }, [canvasReference, dimensionsSetupAttempt, containerRef, setCanvasReady]);

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
