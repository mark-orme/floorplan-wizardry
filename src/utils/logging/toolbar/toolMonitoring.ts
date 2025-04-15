
import * as Sentry from '@sentry/react';
import { captureMessage } from '@/utils/sentry';

/**
 * Types for monitoring data
 */
interface ToolUsageStats {
  [toolName: string]: number;
}

interface ActionStats {
  [actionName: string]: { 
    success: number;
    failure: number;
  };
}

interface MonitoringReport {
  toolUsage: ToolUsageStats;
  actionStats: ActionStats;
  timestamp: string;
}

/**
 * Monitors toolbar operations over time
 * @param interval How often to check (in ms)
 * @param callback Function to call with results
 */
export const startToolbarMonitoring = (
  interval: number = 30000,
  callback?: (report: MonitoringReport) => void
): () => void => {
  const toolUsageStats: ToolUsageStats = {};
  const actionsStats: ActionStats = {};
  let originalBreadcrumbs: { breadcrumb: any }[] = [];
  
  // Store breadcrumbs for analysis without modifying the API
  const breadcrumbListener = (breadcrumb: any) => {
    // Track tool activations
    if (breadcrumb.category === 'toolbar' && breadcrumb.message?.includes('Tool changed')) {
      const tool = breadcrumb.data?.newTool;
      if (tool) {
        toolUsageStats[tool] = (toolUsageStats[tool] || 0) + 1;
      }
    }
    
    // Track action executions
    if (breadcrumb.category === 'toolbar' && breadcrumb.message?.includes('Toolbar action')) {
      const action = breadcrumb.data?.action;
      const successful = breadcrumb.data?.successful;
      
      if (action) {
        if (!actionsStats[action]) {
          actionsStats[action] = { success: 0, failure: 0 };
        }
        
        if (successful) {
          actionsStats[action].success++;
        } else {
          actionsStats[action].failure++;
        }
      }
    }
    
    // Store the breadcrumb
    originalBreadcrumbs.push({ breadcrumb });
  };
  
  // Add our listener
  document.addEventListener('sentry-breadcrumb', breadcrumbListener);
  
  // Set up interval to report statistics
  const intervalId = setInterval(() => {
    const report: MonitoringReport = {
      toolUsage: toolUsageStats,
      actionStats: actionsStats,
      timestamp: new Date().toISOString()
    };
    
    // Send report to Sentry
    captureMessage("Toolbar usage report", "toolbar-monitoring", {
      tags: { component: "ToolbarMonitor" },
      extra: report
    });
    
    // Call callback if provided
    if (callback) {
      callback(report);
    }
  }, interval);
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
    document.removeEventListener('sentry-breadcrumb', breadcrumbListener);
  };
};
