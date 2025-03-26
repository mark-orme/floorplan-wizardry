
/**
 * Container component for the canvas element
 * Wraps the canvas element and provides a reference to it
 * Also displays debug information
 * @module canvas/CanvasContainer
 */
import { useEffect, useRef, forwardRef } from "react";
import { Card } from "../ui/card";
import { useDomRef } from "@/hooks/useDomRef";
import { DebugInfoState } from "@/types/debugTypes";
import { useCanvasDimensions } from "@/hooks/canvas/useCanvasDimensions";
import { CanvasElement } from "./CanvasElement";
import { CanvasDebugWrapper } from "./CanvasDebugWrapper";

interface CanvasContainerProps {
  debugInfo: DebugInfoState;
  canvasElementRef?: React.RefObject<HTMLCanvasElement>;
}

/**
 * Container component for the canvas element
 * Provides accessible keyboard focus and proper sizing
 * @param {CanvasContainerProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export const CanvasContainer = forwardRef<HTMLDivElement, CanvasContainerProps>(
  ({ debugInfo, canvasElementRef }, ref) => {
    // Create a local ref that auto-focuses if one is not provided
    const localCanvasRef = useDomRef<HTMLCanvasElement>(true);
    const canvasReference = canvasElementRef || localCanvasRef;
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Use the extracted dimensions hook
    const {
      canvasReady,
      dimensionsSetupAttempt,
      startTimeRef,
      setDimensionsSetupAttempt
    } = useCanvasDimensions({
      canvasReference,
      containerRef
    });

    // Effect to handle ref forwarding properly
    useEffect(() => {
      if (!ref) return;
      
      // Handle the ref properly based on its type
      if (typeof ref === 'function') {
        // If it's a function ref, call it with the current div
        ref(containerRef.current);
      } else {
        // If it's an object ref, set its current property
        ref.current = containerRef.current;
      }
    }, [ref]);

    return (
      <Card className="p-0 bg-white shadow-md rounded-lg overflow-visible h-full">
        <div 
          ref={containerRef} 
          className="w-full h-full relative overflow-visible"
          data-testid="canvas-container"
          style={{ minHeight: '600px' }} // Ensure minimum height
        >
          <CanvasElement
            canvasReady={canvasReady}
            dimensionsSetupAttempt={dimensionsSetupAttempt}
            canvasReference={canvasReference}
          />
        </div>
        <CanvasDebugWrapper
          debugInfo={debugInfo}
          canvasReady={canvasReady}
          dimensionsSetupAttempt={dimensionsSetupAttempt}
          startTime={startTimeRef.current}
        >
          {/* Debug wrapper gets canvas as children */}
        </CanvasDebugWrapper>
      </Card>
    );
  }
);

// Add display name for debugging
CanvasContainer.displayName = "CanvasContainer";
