
import React, { useEffect, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { runToolbarDiagnostics, setupToolbarMonitoring } from "@/utils/diagnostics/toolbar";
import { captureMessage } from "@/utils/sentry";
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
  
  // Run diagnostics once on mount if specified
  useEffect(() => {
    if (runOnMount && canvas) {
      const result = runToolbarDiagnostics(canvas, currentTool);
      
      setDiagnosticsState({
        lastRunTime: Date.now(),
        issues: result.issues,
        success: result.success
      });
      
      // Set up Sentry context
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
      
      // Report initial diagnostics
      captureMessage(
        result.success ? "Canvas diagnostics passed" : "Canvas diagnostics found issues",
        "canvas-diagnostics",
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
    
    // Set up periodic monitoring
    const getCanvas = () => canvas;
    const getTool = () => currentTool;
    
    const cleanup = setupToolbarMonitoring(getCanvas, getTool, monitoringInterval);
    
    // Report monitoring setup
    captureMessage("Canvas diagnostics monitoring started", "canvas-monitoring-start", {
      tags: { component: "CanvasDiagnostics" },
      extra: { monitoringInterval }
    });
    
    logger.info("Canvas diagnostics monitoring started", { monitoringInterval });
    
    return () => {
      cleanup();
      Sentry.setTag("component", null);
    };
  }, [canvas, currentTool, runOnMount, monitoringInterval]);
  
  // Run diagnostics when tool changes
  useEffect(() => {
    if (canvas) {
      const result = runToolbarDiagnostics(canvas, currentTool);
      
      setDiagnosticsState({
        lastRunTime: Date.now(),
        issues: result.issues,
        success: result.success
      });
      
      // Update Sentry context
      Sentry.setContext("canvasDiagnostics", {
        toolChange: {
          timestamp: new Date().toISOString(),
          tool: currentTool,
          success: result.success,
          issueCount: result.issues.length
        }
      });
      
      // Only report if there are issues
      if (!result.success) {
        captureMessage("Tool change diagnostics found issues", "tool-change-diagnostics", {
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
  
  // This component doesn't render anything visible
  return null;
};
