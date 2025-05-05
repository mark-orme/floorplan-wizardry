
/**
 * Debug utilities for runtime type checking and debugging
 */
import logger from './logger';

/**
 * Get detailed type information for debugging
 * @param value The value to check
 * @param name Optional name for the value
 */
export function logType(value: unknown, name?: string): void {
  if (process.env.NODE_ENV === 'development') {
    const prefix = name ? `${name}: ` : '';
    
    if (value === null) {
      logger.debug(`${prefix}null`);
      return;
    }
    
    if (value === undefined) {
      logger.debug(`${prefix}undefined`);
      return;
    }
    
    const type = typeof value;
    
    if (type === 'object') {
      if (Array.isArray(value)) {
        logger.debug(`${prefix}Array(${value.length})`);
        if (value.length > 0) {
          logger.debug(`${prefix}First item type: ${typeof value[0]}`);
        }
      } else {
        const constructor = (value as object).constructor?.name || 'Unknown';
        const keys = Object.keys(value as object);
        logger.debug(`${prefix}Object<${constructor}> with keys: ${keys.join(', ')}`);
      }
    } else {
      logger.debug(`${prefix}${type}${value ? `: ${String(value)}` : ''}`);
    }
  }
}

/**
 * Type assertion function for runtime type checking
 * @param condition The condition to check
 * @param message Error message if condition fails
 */
export function assertType(condition: boolean, message: string): asserts condition {
  if (!condition) {
    const error = new Error(`Type assertion failed: ${message}`);
    if (process.env.NODE_ENV === 'development') {
      logger.error(error.message);
      console.trace(error);
    }
    throw error;
  }
}

/**
 * Check if an object has a specific property
 * @param obj The object to check
 * @param prop The property name
 * @returns True if the object has the property
 */
export function hasProperty<T>(obj: T, prop: string): boolean {
  return obj !== null && obj !== undefined && typeof obj === 'object' && prop in obj;
}

/**
 * Get a safe property value with a fallback
 * @param obj The object to check
 * @param prop The property name
 * @param fallback Fallback value if property doesn't exist
 * @returns The property value or fallback
 */
export function getPropertySafe<T, K extends keyof T>(obj: T | null | undefined, prop: K, fallback: T[K]): T[K] {
  if (obj === null || obj === undefined) {
    return fallback;
  }
  return obj[prop] !== undefined ? obj[prop] : fallback;
}

/**
 * Adapter for legacy to new property names
 * @param obj The object to adapt
 * @param mapping Property mapping from legacy to new names
 * @returns Adapted object with both property sets
 */
export function adaptProperties<T extends object>(
  obj: T, 
  mapping: Record<string, string>
): T {
  const result = { ...obj };
  
  for (const [oldProp, newProp] of Object.entries(mapping)) {
    if (hasProperty(obj, oldProp) && !hasProperty(obj, newProp)) {
      (result as any)[newProp] = (obj as any)[oldProp];
    } else if (hasProperty(obj, newProp) && !hasProperty(obj, oldProp)) {
      (result as any)[oldProp] = (obj as any)[newProp];
    }
  }
  
  return result;
}

/**
 * Safely convert between interface types with compatible properties
 */
export function safeCast<T, U>(obj: T, propertyList: string[] = []): U {
  if (!obj) return {} as U;
  
  if (propertyList.length > 0) {
    const missing = propertyList.filter(prop => !hasProperty(obj, prop));
    if (missing.length > 0) {
      logger.warn(`Missing properties in type cast: ${missing.join(', ')}`);
    }
  }
  
  return obj as unknown as U;
}
