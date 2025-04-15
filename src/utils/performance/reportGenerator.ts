
/**
 * Performance report generator
 * @module utils/performance/reportGenerator
 */
import { formatBytes } from './resourceUtils';
import { collectPerformanceMetrics } from './collector';
import { BadgeType } from './types';

/**
 * Get badge HTML based on metric value
 */
export const getBadgeHTML = (
  value: number, 
  goodThreshold: number, 
  badThreshold: number, 
  reversedScale = false
): string => {
  let badgeType: BadgeType;
  
  if (reversedScale) {
    // For metrics where lower is better (like request count)
    badgeType = value < goodThreshold 
      ? 'good' 
      : (value < badThreshold ? 'warning' : 'bad');
  } else {
    // For metrics where higher is better
    badgeType = value < goodThreshold 
      ? 'good' 
      : (value < badThreshold ? 'warning' : 'bad');
  }
  
  const badgeClass = `badge-${badgeType}`;
  const badgeText = badgeType === 'good' 
    ? 'Good' 
    : (badgeType === 'warning' ? 'Needs Improvement' : 'Poor');
  
  return `<span class="badge ${badgeClass}">${badgeText}</span>`;
};

/**
 * Generate a performance report
 */
export const generatePerformanceReport = (): string => {
  const metrics = collectPerformanceMetrics();
  
  // Create report HTML
  return `
    <html>
      <head>
        <title>Performance Report</title>
        <style>
          body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #2563eb; }
          .metric { margin-bottom: 8px; }
          .metric-label { font-weight: bold; }
          .metric-value { color: #1f2937; }
          .card { background: #f3f4f6; border-radius: 8px; padding: 16px; margin-bottom: 24px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; }
          th { background-color: #e5e7eb; }
          .resource-type { font-weight: bold; }
          .badge { display: inline-block; padding: 4px 8px; border-radius: 9999px; font-size: 12px; font-weight: 500; }
          .badge-good { background-color: #d1fae5; color: #065f46; }
          .badge-warning { background-color: #fef3c7; color: #92400e; }
          .badge-bad { background-color: #fee2e2; color: #b91c1c; }
        </style>
      </head>
      <body>
        <h1>Performance Report</h1>
        <p>Generated on ${new Date().toLocaleString()}</p>
        
        <div class="card">
          <h2>Page Load Metrics</h2>
          <div class="metric">
            <span class="metric-label">Time to First Byte:</span> 
            <span class="metric-value">${Math.round(metrics.timeToFirstByte)}ms</span>
            ${getBadgeHTML(metrics.timeToFirstByte, 100, 300)}
          </div>
          <div class="metric">
            <span class="metric-label">First Paint:</span> 
            <span class="metric-value">${Math.round(metrics.timeToFirstPaint)}ms</span>
            ${getBadgeHTML(metrics.timeToFirstPaint, 1000, 2500)}
          </div>
          <div class="metric">
            <span class="metric-label">First Contentful Paint:</span> 
            <span class="metric-value">${Math.round(metrics.timeToFirstContentfulPaint)}ms</span>
            ${getBadgeHTML(metrics.timeToFirstContentfulPaint, 1800, 3000)}
          </div>
          <div class="metric">
            <span class="metric-label">DOM Content Loaded:</span> 
            <span class="metric-value">${Math.round(metrics.domContentLoaded)}ms</span>
            ${getBadgeHTML(metrics.domContentLoaded, 2000, 4000)}
          </div>
          <div class="metric">
            <span class="metric-label">Load Complete:</span> 
            <span class="metric-value">${Math.round(metrics.loadComplete)}ms</span>
            ${getBadgeHTML(metrics.loadComplete, 3000, 6000)}
          </div>
        </div>
        
        <div class="card">
          <h2>Resource Statistics</h2>
          <div class="metric">
            <span class="metric-label">Total Requests:</span> 
            <span class="metric-value">${metrics.resourceStats.totalRequests}</span>
            ${getBadgeHTML(metrics.resourceStats.totalRequests, 30, 50, true)}
          </div>
          <div class="metric">
            <span class="metric-label">Total Size:</span> 
            <span class="metric-value">${formatBytes(metrics.resourceStats.totalSize)}</span>
            ${getBadgeHTML(metrics.resourceStats.totalSize / 1024, 1000, 2000, true)}
          </div>
          
          <h3>Resources by Type</h3>
          <table>
            <tr>
              <th>Type</th>
              <th>Count</th>
              <th>Size</th>
            </tr>
            ${Object.entries(metrics.resourceStats.byType)
              .sort((a, b) => b[1].size - a[1].size)
              .map(([type, { count, size }]) => `
                <tr>
                  <td class="resource-type">${type}</td>
                  <td>${count}</td>
                  <td>${formatBytes(size)}</td>
                </tr>
              `).join('')
            }
          </table>
        </div>
      </body>
    </html>
  `;
};
