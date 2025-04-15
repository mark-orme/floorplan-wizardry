/**
 * Validation utilities for canvas data
 * Ensures proper format and sanitizes content for storage
 */

/**
 * Validates canvas data structure and content
 * @param data Canvas JSON data to validate
 * @returns True if data is valid
 */
export function validateCanvasData(data: any): boolean {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  // Check required properties
  if (!('objects' in data) || !Array.isArray(data.objects)) {
    return false;
  }
  
  // Check for malicious content in object properties
  for (const obj of data.objects) {
    // Skip grid objects as they're generated
    if (obj.objectType === 'grid') continue;
    
    // Check for suspicious keys or values that could be used for XSS
    if (hasXSSRisks(obj)) {
      console.warn('Potentially unsafe content detected in canvas data');
      return false;
    }
  }
  
  return true;
}

/**
 * Sanitizes canvas data for safe storage
 * @param data Canvas JSON data to sanitize
 * @returns Sanitized data or null if sanitization fails
 */
export function sanitizeCanvasData(data: any): any {
  if (!data) return null;
  
  try {
    // Create a deep copy
    const sanitizedData = JSON.parse(JSON.stringify(data));
    
    // Process objects array
    if (sanitizedData.objects && Array.isArray(sanitizedData.objects)) {
      sanitizedData.objects = sanitizedData.objects.map((obj: any) => {
        // Remove any potentially dangerous properties
        return sanitizeObject(obj);
      });
    }
    
    return sanitizedData;
  } catch (error) {
    console.error('Error sanitizing canvas data:', error);
    return null;
  }
}

/**
 * Sanitizes an individual canvas object
 * @param obj Object to sanitize
 * @returns Sanitized object
 */
function sanitizeObject(obj: any): any {
  // List of safe properties to keep
  const safeProps = [
    'type', 'version', 'originX', 'originY', 'left', 'top', 'width', 'height',
    'fill', 'stroke', 'strokeWidth', 'strokeDashArray', 'strokeLineCap',
    'strokeDashOffset', 'strokeLineJoin', 'strokeUniform', 'strokeMiterLimit',
    'scaleX', 'scaleY', 'angle', 'flipX', 'flipY', 'opacity', 'shadow',
    'visible', 'backgroundColor', 'fillRule', 'paintFirst', 'globalCompositeOperation',
    'skewX', 'skewY', 'cropX', 'cropY', 'radius', 'rx', 'ry', 'points', 'path',
    'objectType', 'selectable', 'evented'
  ];
  
  const sanitized: Record<string, any> = {};
  
  // Only copy safe properties
  for (const prop of safeProps) {
    if (prop in obj) {
      sanitized[prop] = obj[prop];
    }
  }
  
  return sanitized;
}

/**
 * Checks if an object has properties that could be used for XSS attacks
 * @param obj Object to check
 * @returns True if XSS risks are found
 */
function hasXSSRisks(obj: any): boolean {
  const riskyPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /onerror=/gi,
    /onload=/gi,
    /onclick=/gi
  ];
  
  // Convert object to string to check for patterns
  const objString = JSON.stringify(obj);
  
  return riskyPatterns.some(pattern => pattern.test(objString));
}
