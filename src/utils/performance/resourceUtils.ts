
/**
 * Resource utilities for performance monitoring
 * @module utils/performance/resourceUtils
 */

/**
 * Get resource type from file extension
 */
export const getResourceType = (extension: string): string => {
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
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
