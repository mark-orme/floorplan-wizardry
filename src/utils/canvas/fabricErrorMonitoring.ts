
/**
 * Fabric.js Error Monitoring Utilities
 * Provides specialized error tracking for Fabric.js operations
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { captureError } from '@/utils/sentryUtils';

// Error types for Fabric.js
export enum FabricErrorType {
  METHOD_NOT_FOUND = 'method_not_found',
  OBJECT_NOT_ON_CANVAS = 'object_not_on_canvas',
  RENDERING_ERROR = 'rendering_error',
  EVENT_ERROR = 'event_error',
  INITIALIZATION_ERROR = 'initialization_error',
  GRID_ERROR = 'grid_error'
}

/**
 * Safely call a method on a Fabric object with error tracking
 * @param object The Fabric object
 * @param methodName Name of the method to call
 * @param fallbackMethod Fallback method if the primary method doesn't exist
 * @param args Arguments to pass to the method
 * @returns Result of the method call or undefined if it failed
 */
export function safeCallFabricMethod<T>(
  object: any,
  methodName: string,
  fallbackMethod?: (obj: any) => T,
  ...args: any[]
): T | undefined {
  try {
    // Check if method exists on the object
    if (typeof object[methodName] === 'function') {
      return object[methodName](...args);
    } 
    
    // Log that the method wasn't found
    console.warn(`Method ${methodName} not found on Fabric object`);
    
    // Report to Sentry
    captureError(`Method ${methodName} not found on Fabric object`, {
      tags: { type: FabricErrorType.METHOD_NOT_FOUND },
      context: { 
        objectType: object?.type || 'unknown',
        methodName,
        hasMethod: typeof object[methodName] === 'function'
      },
      level: 'warning'
    });
    
    // Try fallback method if provided
    if (fallbackMethod && typeof fallbackMethod === 'function') {
      return fallbackMethod(object);
    }
    
    return undefined;
  } catch (error) {
    captureError(error instanceof Error ? error : new Error(`Error calling ${methodName}`), {
      tags: { type: FabricErrorType.METHOD_NOT_FOUND },
      context: { 
        objectType: object?.type || 'unknown',
        methodName,
        error: String(error)
      },
      level: 'error'
    });
    return undefined;
  }
}

/**
 * Safely send an object to the back of the canvas
 * @param object Fabric object to send to back
 * @param canvas Canvas containing the object
 */
export function safeSendToBack(object: FabricObject, canvas?: FabricCanvas): void {
  try {
    // Try multiple approaches with proper error handling
    if (typeof object.sendToBack === 'function') {
      object.sendToBack();
    } else if (canvas && typeof canvas.sendObjectToBack === 'function') {
      canvas.sendObjectToBack(object);
    } else if (canvas && typeof canvas.sendToBack === 'function') {
      canvas.sendToBack(object);
    } else if (object && typeof object.moveTo === 'function') {
      // Alternative approach using moveTo
      object.moveTo(0);
    } else if (canvas && typeof canvas.bringToBack === 'function') {
      canvas.bringToBack(object);
    } else {
      console.warn('No supported method found to send object to back');
      captureError('No supported method found to send object to back', {
        tags: { type: FabricErrorType.METHOD_NOT_FOUND },
        context: { 
          objectType: object?.type || 'unknown',
          hasCanvas: Boolean(canvas)
        },
        level: 'warning'
      });
    }
  } catch (error) {
    captureError(error instanceof Error ? error : new Error('Error sending object to back'), {
      tags: { type: FabricErrorType.EVENT_ERROR },
      context: { 
        objectType: object?.type || 'unknown',
        hasCanvas: Boolean(canvas)
      },
      level: 'error'
    });
  }
}

/**
 * Log and capture rendering issues with detailed diagnostics
 * @param canvas Canvas instance
 * @param action Action being performed when error occurred
 * @param error Error object
 */
export function captureRenderingError(canvas: FabricCanvas | null, action: string, error: any): void {
  try {
    const diagnostics = {
      canvasWidth: canvas?.width ?? 'unknown',
      canvasHeight: canvas?.height ?? 'unknown',
      objectCount: canvas?.getObjects()?.length ?? 'unknown',
      action
    };
    
    captureError(error instanceof Error ? error : new Error(`Rendering error: ${action}`), {
      tags: { type: FabricErrorType.RENDERING_ERROR },
      context: diagnostics,
      level: 'error'
    });
    
    console.error(`Canvas rendering error during ${action}:`, error, diagnostics);
  } catch (captureError) {
    console.error('Failed to report rendering error:', captureError);
  }
}

export default {
  safeCallFabricMethod,
  safeSendToBack,
  captureRenderingError,
  FabricErrorType
};
