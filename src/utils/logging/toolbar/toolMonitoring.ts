
import * as Sentry from '@sentry/react';
import { captureMessage } from '@/utils/sentryUtils';

interface ToolUsageStats {
  [toolName: string]: number;
}

interface ActionStat {
  success: number;
  failure: number;
}

interface ActionStats {
  [actionName: string]: ActionStat;
}

interface MonitoringReport {
  toolUsage: ToolUsageStats;
  actionStats: ActionStats;
  timestamp: string;
}

type BreadcrumbData = {
  newTool?: string;
  action?: string;
  successful?: boolean;
};

type BreadcrumbEvent = {
  breadcrumb: {
    category: string;
    message: string;
    data?: BreadcrumbData;
  };
};

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
  const originalBreadcrumbs: BreadcrumbEvent[] = [];
  
  // Store breadcrumbs for analysis without modifying the API
  const breadcrumbListener = (breadcrumb: CustomEvent<BreadcrumbEvent>) => {
    const data = breadcrumb.detail.breadcrumb;
    // Track tool activations
    if (data.category === 'toolbar' && data.message?.includes('Tool changed')) {
      const tool = data.data?.newTool;
      if (tool) {
        toolUsageStats[tool] = (toolUsageStats[tool] || 0) + 1;
      }
    }
    
    // Track action executions
    if (data.category === 'toolbar' && data.message?.includes('Toolbar action')) {
      const action = data.data?.action;
      const successful = data.data?.successful;
      
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
    originalBreadcrumbs.push({ breadcrumb: data });
  };
  
  // Add our listener
  document.addEventListener('sentry-breadcrumb', breadcrumbListener as EventListener);
  
  // Set up interval to report statistics
  const intervalId = setInterval(() => {
    const report: MonitoringReport = {
      toolUsage: toolUsageStats,
      actionStats: actionsStats,
      timestamp: new Date().toISOString()
    };
    
    // Send report to Sentry
    captureMessage("Toolbar usage report", {
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
    document.removeEventListener('sentry-breadcrumb', breadcrumbListener as EventListener);
  };
};
