
/**
 * Build reporting utilities
 * Handles build statistics and performance badges
 */

/**
 * Formats a build size for display
 * @param bytes Size in bytes
 * @returns Formatted size string
 */
export const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
};

/**
 * Generates a Markdown badge for bundle size
 * @param size Size in bytes
 * @returns Markdown string for badge
 */
export const generateBundleSizeBadge = (size: number): string => {
  const formattedSize = formatSize(size);
  const color = size < 500 * 1024 ? 'green' : size < 1024 * 1024 ? 'yellow' : 'red';
  return `![Bundle Size: ${formattedSize}](https://img.shields.io/badge/bundle%20size-${encodeURIComponent(formattedSize)}-${color})`;
};

/**
 * Generates a Lighthouse score badge
 * @param score Lighthouse score (0-100)
 * @param metric Metric name
 * @returns Markdown string for badge
 */
export const generateLighthouseBadge = (score: number, metric: string): string => {
  const color = score >= 90 ? 'brightgreen' : score >= 70 ? 'yellow' : 'red';
  return `![Lighthouse ${metric}: ${score}](https://img.shields.io/badge/lighthouse%20${metric.toLowerCase()}-${score}-${color})`;
};

/**
 * Creates a bundle report summary
 * @param stats Bundle stats object
 * @returns Markdown summary
 */
export const createBundleReport = (stats: any): string => {
  const totalSize = stats.bundleSize || 0;
  const jsSize = stats.jsBundleSize || 0;
  const cssSize = stats.cssBundleSize || 0;
  const assets = stats.assets || [];
  
  let markdown = `# Bundle Report\n\n`;
  
  // Add badges
  markdown += `${generateBundleSizeBadge(totalSize)}\n`;
  
  // Add summary
  markdown += `\n## Summary\n\n`;
  markdown += `- Total bundle size: ${formatSize(totalSize)}\n`;
  markdown += `- JavaScript size: ${formatSize(jsSize)}\n`;
  markdown += `- CSS size: ${formatSize(cssSize)}\n`;
  markdown += `- Chunk count: ${stats.chunks?.length || assets.length || 0}\n`;
  
  // Add assets table if available
  if (assets.length > 0) {
    markdown += `\n## Assets\n\n`;
    markdown += `| Name | Size | Type |\n`;
    markdown += `|------|------|------|\n`;
    
    assets
      .sort((a: any, b: any) => (b.size || 0) - (a.size || 0))
      .forEach((asset: any) => {
        markdown += `| ${asset.name} | ${formatSize(asset.size || 0)} | ${asset.type || 'unknown'} |\n`;
      });
  }
  
  return markdown;
};

/**
 * Creates a badge SVG for performance metrics
 * @param label Badge label
 * @param value Badge value
 * @param color Badge color
 * @returns SVG string
 */
export const createPerformanceBadgeSvg = (
  label: string,
  value: string, 
  color: string
): string => {
  // Calculate width based on text length
  const labelWidth = label.length * 6.5;
  const valueWidth = value.length * 6.5;
  const totalWidth = labelWidth + valueWidth;
  
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20">
      <linearGradient id="b" x2="0" y2="100%">
        <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
        <stop offset="1" stop-opacity=".1"/>
      </linearGradient>
      <mask id="a"><rect width="${totalWidth}" height="20" rx="3" fill="#fff"/></mask>
      <g mask="url(#a)">
        <path fill="#555" d="M0 0h${labelWidth}v20H0z"/>
        <path fill="${color}" d="M${labelWidth} 0h${valueWidth}v20H${labelWidth}z"/>
        <path fill="url(#b)" d="M0 0h${totalWidth}v20H0z"/>
      </g>
      <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
        <text x="${labelWidth/2}" y="15" fill="#010101" fill-opacity=".3">${label}</text>
        <text x="${labelWidth/2}" y="14">${label}</text>
        <text x="${labelWidth + valueWidth/2}" y="15" fill="#010101" fill-opacity=".3">${value}</text>
        <text x="${labelWidth + valueWidth/2}" y="14">${value}</text>
      </g>
    </svg>
  `;
};
