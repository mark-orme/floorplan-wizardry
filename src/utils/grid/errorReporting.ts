
/**
 * Grid error reporting utilities
 * @module utils/grid/errorReporting
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { captureMessage, captureError } from '@/utils/sentryUtils';
import logger from '@/utils/logger';

/**
 * Analyze grid issues
 * @param canvas - Fabric canvas
 * @param gridObjects - Grid objects
 * @returns Analysis result
 */
export const analyzeGridIssues = (canvas: FabricCanvas, gridObjects: FabricObject[]): {
  hasIssues: boolean;
  issues: string[];
  diagnostics: Record<string, any>;
} => {
  const issues: string[] = [];
  const diagnostics: Record<string, any> = {};
  
  try {
    // Check for canvas issues
    if (!canvas) {
      issues.push('Canvas is null or undefined');
      return { hasIssues: true, issues, diagnostics };
    }
    
    // Check canvas dimensions
    if (!canvas.width || !canvas.height || canvas.width === 0 || canvas.height === 0) {
      issues.push('Canvas has invalid dimensions');
      diagnostics.dimensions = { width: canvas.width, height: canvas.height };
    }
    
    // Check for missing grid objects
    if (!gridObjects || gridObjects.length === 0) {
      issues.push('No grid objects found');
    } else {
      // Check for invisible grid objects
      const invisibleGridObjects = gridObjects.filter(obj => !obj.visible);
      if (invisibleGridObjects.length > 0) {
        issues.push(`${invisibleGridObjects.length} grid objects are invisible`);
      }
      
      // Check if grid objects are on canvas
      const canvasObjects = canvas.getObjects();
      const missingFromCanvas = gridObjects.filter(obj => !canvasObjects.includes(obj));
      
      if (missingFromCanvas.length > 0) {
        issues.push(`${missingFromCanvas.length} grid objects are missing from canvas`);
      }
    }
    
    // Collect diagnostics
    diagnostics.canvas = {
      objectCount: canvas.getObjects().length,
      dimensions: { width: canvas.width, height: canvas.height },
      zoom: canvas.getZoom(),
      readyState: document.readyState
    };
    
    diagnostics.grid = {
      gridObjectCount: gridObjects.length,
      visibleGridCount: gridObjects.filter(obj => obj.visible).length
    };
    
    // Report issues to monitoring service if problems found
    if (issues.length > 0) {
      captureMessage(`Grid issues detected: ${issues.join(', ')}`, 'grid-issues', {
        level: 'warning',
        tags: {
          component: 'grid-analysis'
        },
        extra: {
          issues,
          diagnostics
        }
      });
    }
    
    return {
      hasIssues: issues.length > 0,
      issues,
      diagnostics
    };
  } catch (error) {
    // Handle errors in the analysis itself
    captureError(error, 'grid-analysis-error', {
      level: 'error',
      tags: {
        component: 'grid-analysis'
      }
    });
    
    return {
      hasIssues: true,
      issues: ['Error analyzing grid issues'],
      diagnostics: { error: String(error) }
    };
  }
};

/**
 * Report grid creation
 * @param success - Whether grid creation was successful
 * @param gridCount - Number of grid objects created
 * @param details - Additional details
 */
export const reportGridCreation = (
  success: boolean,
  gridCount: number,
  details?: Record<string, any>
): void => {
  if (success) {
    logger.info(`Grid created successfully: ${gridCount} objects`);
    captureMessage(`Grid created successfully with ${gridCount} objects`, 'grid-creation', {
      level: 'info',
      tags: {
        component: 'grid'
      },
      extra: details
    });
  } else {
    logger.error(`Grid creation failed, objects created: ${gridCount}`);
    captureMessage(`Grid creation failed or incomplete, objects created: ${gridCount}`, 'grid-creation', {
      level: 'warning',
      tags: {
        component: 'grid'
      },
      extra: details
    });
  }
};
