
/**
 * Canvas debug wrapper component
 * Wraps canvas element with debug info when in development mode
 * @module canvas/CanvasDebugWrapper
 */
import { DebugInfo } from "../DebugInfo";
import { DebugInfoState } from "@/types/debugTypes";

interface CanvasDebugWrapperProps {
  children?: React.ReactNode;
  debugInfo: DebugInfoState;
  canvasReady: boolean;
  dimensionsSetupAttempt: number;
  startTime: number;
}

/**
 * Component for wrapping canvas with debug information
 * Only displays debug info in development mode
 * @param {CanvasDebugWrapperProps} props - Component properties
 * @returns {JSX.Element} Canvas with debug information
 */
export const CanvasDebugWrapper = ({ 
  children, 
  debugInfo, 
  canvasReady, 
  dimensionsSetupAttempt,
  startTime
}: CanvasDebugWrapperProps) => {
  // Enhanced debug info with canvas initialization data
  const enhancedDebugInfo = {
    ...debugInfo,
    canvasReady,
    dimensionAttempts: dimensionsSetupAttempt,
    lastInitTime: debugInfo.lastInitTime || Date.now() - startTime
  };

  return (
    <>
      {children}
      <DebugInfo debugInfo={enhancedDebugInfo} />
    </>
  );
};
