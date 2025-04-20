
import { 
  validateFloorPlan, validateRoom, validateStroke, validateWall 
} from '@/types/floor-plan/typesBarrel';
import * as Sentry from '@sentry/react';
import { captureError } from '../sentry';

/**
 * Report a type validation error to Sentry
 * @param objectType Type of object being validated
 * @param objectData Object data
 * @param errors Validation errors
 * @param source Source of the validation
 */
export function reportTypeValidationError(
  objectType: 'FloorPlan' | 'Room' | 'Wall' | 'Stroke',
  objectData: any,
  errors: string[],
  source: string
): void {
  const error = new Error(`Invalid ${objectType}: ${errors.join(', ')}`);
  
  // Set context in Sentry
  Sentry.withScope((scope) => {
    scope.setTag('error_type', 'type_validation');
    scope.setTag('object_type', objectType);
    scope.setTag('validation_source', source);
    
    scope.setContext('object_data', {
      objectType,
      validationErrors: errors,
      objectId: objectData?.id || 'unknown',
      partialData: { ...objectData }
    });
    
    scope.setLevel('warning');
    
    // Capture the error
    Sentry.captureException(error);
  });
  
  // Log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`Type validation error in ${source}:`, {
      objectType,
      errors,
      data: objectData
    });
  }
}

/**
 * Safely validate a Floor Plan object and report any errors
 * @param floorPlan Floor plan object to validate
 * @param source Source of the validation
 * @returns Whether the floor plan is valid
 */
export function validateFloorPlanWithReporting(floorPlan: any, source: string): boolean {
  const result = validateFloorPlan(floorPlan);
  
  if (!result.valid) {
    reportTypeValidationError('FloorPlan', floorPlan, result.errors, source);
    return false;
  }
  
  return true;
}

/**
 * Safely validate a Room object and report any errors
 * @param room Room object to validate
 * @param source Source of the validation
 * @returns Whether the room is valid
 */
export function validateRoomWithReporting(room: any, source: string): boolean {
  const result = validateRoom(room);
  
  if (!result.valid) {
    reportTypeValidationError('Room', room, result.errors, source);
    return false;
  }
  
  return true;
}

/**
 * Safely validate a Wall object and report any errors
 * @param wall Wall object to validate
 * @param source Source of the validation
 * @returns Whether the wall is valid
 */
export function validateWallWithReporting(wall: any, source: string): boolean {
  const result = validateWall(wall);
  
  if (!result.valid) {
    reportTypeValidationError('Wall', wall, result.errors, source);
    return false;
  }
  
  return true;
}

/**
 * Safely validate a Stroke object and report any errors
 * @param stroke Stroke object to validate
 * @param source Source of the validation
 * @returns Whether the stroke is valid
 */
export function validateStrokeWithReporting(stroke: any, source: string): boolean {
  const result = validateStroke(stroke);
  
  if (!result.valid) {
    reportTypeValidationError('Stroke', stroke, result.errors, source);
    return false;
  }
  
  return true;
}

/**
 * Type guard for checking and reporting on any Fabric.js-related typing issues
 * @param errorContext Context where the error occurred
 */
export function trackFabricTypeErrors(errorContext: string): void {
  window.addEventListener('error', (event) => {
    const errorMsg = event.message || '';
    
    // Check if error is related to Fabric.js typing
    if (
      errorMsg.includes('fabric') || 
      errorMsg.includes('canvas') || 
      errorMsg.includes('withImplementation') ||
      errorMsg.includes('toJSON')
    ) {
      captureError(event.error || new Error(errorMsg), 'fabric-type-error', {
        level: 'error',
        tags: {
          component: 'fabric-js',
          context: errorContext,
          errorType: 'runtime-type-error'
        },
        extra: {
          message: errorMsg,
          stack: event.error?.stack,
          timestamp: new Date().toISOString()
        }
      });
    }
  });
}

/**
 * Helper to validate a canvas mock object for testing
 * @param canvasMock Canvas mock object
 * @returns Whether the mock is valid
 */
export function validateCanvasMock(canvasMock: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!canvasMock) {
    return { valid: false, errors: ['Canvas mock is null or undefined'] };
  }
  
  // Check required methods
  if (!canvasMock.add || typeof canvasMock.add !== 'function') errors.push('Missing add method');
  if (!canvasMock.remove || typeof canvasMock.remove !== 'function') errors.push('Missing remove method');
  if (!canvasMock.getObjects || typeof canvasMock.getObjects !== 'function') errors.push('Missing getObjects method');
  if (!canvasMock.renderAll || typeof canvasMock.renderAll !== 'function') errors.push('Missing renderAll method');
  
  // Check withImplementation specifically since that's causing issues
  if (!canvasMock.withImplementation || typeof canvasMock.withImplementation !== 'function') {
    errors.push('Missing withImplementation method');
  } else {
    // Test that withImplementation returns a Promise<void>
    try {
      const result = canvasMock.withImplementation();
      if (!(result instanceof Promise)) {
        errors.push('withImplementation does not return a Promise');
      }
    } catch (error) {
      errors.push(`withImplementation throws an error: ${error}`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}
