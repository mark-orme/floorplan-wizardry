import React, { useEffect, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { runToolbarDiagnostics, setupToolbarMonitoring } from "@/utils/diagnostics/toolbar";
import { captureMessage } from "@/utils/sentryUtils";
import * as Sentry from '@sentry/react';
import logger from "@/utils/logger";

interface CanvasDiagnosticsProps {
  canvas: FabricCanvas | null;
  currentTool: DrawingMode;
  runOnMount?: boolean;
  monitoringInterval?: number;
}

/**
 * Component for monitoring canvas health and tool functionality
 * Invisible component that runs diagnostics and reports issues to Sentry
 */
export const CanvasDiagnostics: React.FC<CanvasDiagnosticsProps> = ({
  canvas,
  currentTool,
  runOnMount = true,
  monitoringInterval = 60000
}) => {
  const [diagnosticsState, setDiagnosticsState] = useState<{
    lastRunTime: number;
    issues: string[];
    success: boolean;
  }>({
    lastRunTime: 0,
    issues: [],
    success: false
  });
  
  useEffect(() => {
    if (runOnMount && canvas) {
      const result = runToolbarDiagnostics(canvas, currentTool);
      
      setDiagnosticsState({
        lastRunTime: Date.now(),
        issues: result.issues,
        success: result.success
      });
      
      Sentry.setTag("component", "CanvasDiagnostics");
      Sentry.setContext("canvasDiagnostics", {
        initialRun: {
          timestamp: new Date().toISOString(),
          success: result.success,
          issueCount: result.issues.length
        },
        canvasInfo: {
          available: !!canvas,
          currentTool
        }
      });
      
      captureMessage(
        result.success ? "Canvas diagnostics passed" : "Canvas diagnostics found issues",
        {
          tags: { 
            component: "CanvasDiagnostics", 
            status: result.success ? "success" : "warning" 
          },
          extra: { 
            issues: result.issues,
            currentTool
          }
        }
      );
    }
    
    const getCanvas = () => canvas;
    const getTool = () => currentTool;
    
    const cleanup = setupToolbarMonitoring(getCanvas, getTool, monitoringInterval);
    
    captureMessage("Canvas diagnostics monitoring started", {
      tags: { component: "CanvasDiagnostics" },
      extra: { monitoringInterval }
    });
    
    logger.info("Canvas diagnostics monitoring started", { monitoringInterval });
    
    return () => {
      cleanup();
      Sentry.setTag("component", null);
    };
  }, [canvas, currentTool, runOnMount, monitoringInterval]);
  
  useEffect(() => {
    if (canvas) {
      const result = runToolbarDiagnostics(canvas, currentTool);
      
      setDiagnosticsState({
        lastRunTime: Date.now(),
        issues: result.issues,
        success: result.success
      });
      
      Sentry.setContext("canvasDiagnostics", {
        toolChange: {
          timestamp: new Date().toISOString(),
          tool: currentTool,
          success: result.success,
          issueCount: result.issues.length
        }
      });
      
      if (!result.success) {
        captureMessage("Tool change diagnostics found issues", {
          tags: { 
            component: "CanvasDiagnostics", 
            status: "warning",
            tool: currentTool
          },
          extra: { issues: result.issues }
        });
      }
    }
  }, [canvas, currentTool]);
  
  return null;
};
