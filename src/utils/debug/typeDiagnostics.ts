
/**
 * Type diagnostics utilities
 * Provides functions to check and log type information
 * @module utils/debug/typeDiagnostics
 */

/**
 * Log detailed type information for debugging
 * @param obj Object to inspect
 * @param label Optional label for the log
 */
export function logTypeInfo(obj: any, label = 'Type info'): void {
  console.group(label);
  
  console.log('Type:', typeof obj);
  console.log('Value:', obj);
  
  // Check if it's an object
  if (typeof obj === 'object' && obj !== null) {
    console.log('Properties:', Object.keys(obj));
    console.log('Has constructor:', Boolean(obj.constructor));
    if (obj.constructor) {
      console.log('Constructor name:', obj.constructor.name);
    }
  }
  
  // Check for common properties
  if (obj && typeof obj === 'object') {
    const commonProps = ['id', 'name', 'type', 'metadata', 'points', 'length'];
    commonProps.forEach(prop => {
      if (prop in obj) {
        console.log(`Has '${prop}':`, true);
        console.log(`${prop} value:`, obj[prop]);
        console.log(`${prop} type:`, typeof obj[prop]);
      }
    });
  }
  
  console.groupEnd();
}

/**
 * Check if an object has all required properties of a given type
 * @param obj Object to check
 * @param requiredProps Array of required property names
 * @returns Whether the object has all required properties
 */
export function hasRequiredProps(obj: any, requiredProps: string[]): boolean {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  
  for (const prop of requiredProps) {
    if (!(prop in obj)) {
      console.warn(`Missing required property: ${prop}`);
      return false;
    }
  }
  
  return true;
}

/**
 * Type guard for FloorPlanMetadata
 * @param obj Object to check
 * @returns Whether the object is a valid FloorPlanMetadata
 */
export function isValidFloorPlanMetadata(obj: any): boolean {
  const requiredProps = [
    'createdAt', 'updatedAt', 'paperSize', 'level',
    'version', 'author', 'dateCreated', 'lastModified', 'notes'
  ];
  
  return hasRequiredProps(obj, requiredProps);
}

/**
 * Type guard for Wall
 * @param obj Object to check
 * @returns Whether the object is a valid Wall
 */
export function isValidWall(obj: any): boolean {
  const requiredProps = [
    'id', 'start', 'end', 'thickness', 'color', 'length', 'roomIds'
  ];
  
  return hasRequiredProps(obj, requiredProps);
}

/**
 * Type guard for Room
 * @param obj Object to check
 * @returns Whether the object is a valid Room
 */
export function isValidRoom(obj: any): boolean {
  const requiredProps = [
    'id', 'name', 'type', 'points', 'color'
  ];
  
  return hasRequiredProps(obj, requiredProps);
}

/**
 * Type guard for Stroke
 * @param obj Object to check
 * @returns Whether the object is a valid Stroke
 */
export function isValidStroke(obj: any): boolean {
  const requiredProps = [
    'id', 'points', 'type', 'color', 'thickness'
  ];
  
  return hasRequiredProps(obj, requiredProps);
}

/**
 * Type guard for FloorPlan
 * @param obj Object to check
 * @returns Whether the object is a valid FloorPlan
 */
export function isValidFloorPlan(obj: any): boolean {
  const requiredProps = [
    'id', 'name', 'label', 'walls', 'rooms', 'strokes', 
    'canvasData', 'canvasJson', 'createdAt', 'updatedAt',
    'gia', 'level', 'index', 'metadata', 'data', 'userId'
  ];
  
  const isValid = hasRequiredProps(obj, requiredProps);
  
  if (isValid && obj.metadata) {
    return isValidFloorPlanMetadata(obj.metadata);
  }
  
  return false;
}
