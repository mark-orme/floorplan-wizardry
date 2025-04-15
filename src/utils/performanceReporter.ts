
/**
 * Performance reporter utility
 * Creates performance reports for bundle size and page load
 */
import { saveAs } from 'file-saver';

interface PerformanceMetrics {
  timeToFirstByte: number;
  timeToFirstPaint: number;
  timeToFirstContentfulPaint: number;
  domContentLoaded: number;
  domInteractive: number;
  loadComplete: number;
  resourceStats: {
    totalRequests: number;
    totalSize: number;
    byType: Record<string, { count: number, size: number }>;
  };
}

/**
 * Collect performance metrics from the browser
 */
export const collectPerformanceMetrics = (): PerformanceMetrics => {
  const perfEntries = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paintEntries = performance.getEntriesByType('paint');
  const resourceEntries = performance.getEntriesByType('resource');
  
  // Extract paint timing
  const firstPaint = paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0;
  const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
  
  // Process resource stats
  const resourceStats = {
    totalRequests: resourceEntries.length,
    totalSize: resourceEntries.reduce((total, entry) => total + (entry.transferSize || 0), 0),
    byType: {} as Record<string, { count: number, size: number }>
  };
  
  // Group resources by type
  resourceEntries.forEach(entry => {
    const url = entry.name;
    const extension = url.split('.').pop()?.split('?')[0] || 'unknown';
    const type = getResourceType(extension);
    
    if (!resourceStats.byType[type]) {
      resourceStats.byType[type] = { count: 0, size: 0 };
    }
    
    resourceStats.byType[type].count += 1;
    resourceStats.byType[type].size += (entry.transferSize || 0);
  });
  
  return {
    timeToFirstByte: perfEntries.responseStart,
    timeToFirstPaint: firstPaint,
    timeToFirstContentfulPaint: firstContentfulPaint,
    domContentLoaded: perfEntries.domContentLoadedEventEnd,
    domInteractive: perfEntries.domInteractive,
    loadComplete: perfEntries.loadEventEnd,
    resourceStats
  };
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

/**
 * Download the performance report
 */
export const downloadPerformanceReport = () => {
  const reportHtml = generatePerformanceReport();
  const blob = new Blob([reportHtml], { type: 'text/html;charset=utf-8' });
  saveAs(blob, `performance-report-${new Date().toISOString().slice(0, 10)}.html`);
};

/**
 * Get resource type from file extension
 */
const getResourceType = (extension: string): string => {
  const map: Record<string, string> = {
    js: 'JavaScript',
    css: 'CSS',
    png: 'Image',
    jpg: 'Image',
    jpeg: 'Image',
    gif: 'Image',
    svg: 'Image',
    woff: 'Font',
    woff2: 'Font',
    ttf: 'Font',
    eot: 'Font',
    json: 'Data',
    html: 'HTML',
    htm: 'HTML',
    mp4: 'Video',
    webm: 'Video',
    mp3: 'Audio',
    wav: 'Audio'
  };
  
  return map[extension.toLowerCase()] || 'Other';
};

/**
 * Format bytes to human-readable string
 */
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get badge HTML based on metric value
 */
const getBadgeHTML = (value: number, goodThreshold: number, badThreshold: number, reversedScale = false): string => {
  let badgeClass;
  
  if (reversedScale) {
    // For metrics where lower is better (like request count)
    badgeClass = value < goodThreshold 
      ? 'badge-good' 
      : (value < badThreshold ? 'badge-warning' : 'badge-bad');
  } else {
    // For metrics where higher is better
    badgeClass = value < goodThreshold 
      ? 'badge-good' 
      : (value < badThreshold ? 'badge-warning' : 'badge-bad');
  }
  
  return `<span class="badge ${badgeClass}">${
    badgeClass === 'badge-good' 
      ? 'Good' 
      : (badgeClass === 'badge-warning' ? 'Needs Improvement' : 'Poor')
  }</span>`;
};
