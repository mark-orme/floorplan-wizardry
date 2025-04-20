
import * as Sentry from '@sentry/react';
import { CaptureMessageOptions } from './types';

/**
 * Tracks type errors during development and testing
 * @param message Error message
 * @param context Context object 
 * @param options Capture options
 */
export function trackTypeError(
  message: string, 
  context: Record<string, any>,
  options: CaptureMessageOptions = {}
): void {
  console.error(`[Type Error] ${message}`, context);
  
  if (process.env.NODE_ENV !== 'test') {
    Sentry.captureMessage(`[Type Error] ${message}`, {
      level: options.level || 'error',
      tags: {
        type: 'type_error',
        component: 'testing',
        ...(options.tags || {})
      },
      extra: {
        context,
        ...(options.extra || {})
      }
    });
  }
}

/**
 * Validates that an object contains all required properties
 * @param object Object to validate
 * @param requiredProps Array of required property names
 * @param objectName Name of the object for error messages
 * @returns True if valid, false otherwise
 */
export function validateRequiredProps(
  object: any, 
  requiredProps: string[],
  objectName: string
): boolean {
  const missingProps = requiredProps.filter(prop => object[prop] === undefined);
  
  if (missingProps.length > 0) {
    trackTypeError(`${objectName} missing required properties: ${missingProps.join(', ')}`, {
      object,
      missingProps,
      objectName
    });
    return false;
  }
  
  return true;
}

/**
 * Validates a FloorPlan object has all required properties
 * @param floorPlan FloorPlan to validate
 * @returns True if valid, false otherwise
 */
export function validateFloorPlan(floorPlan: any): boolean {
  return validateRequiredProps(
    floorPlan,
    ['id', 'name', 'label', 'walls', 'rooms', 'strokes', 'data', 'userId', 'createdAt', 'updatedAt'],
    'FloorPlan'
  );
}

/**
 * Validates a Room object has all required properties
 * @param room Room to validate
 * @returns True if valid, false otherwise
 */
export function validateRoom(room: any): boolean {
  return validateRequiredProps(
    room,
    ['id', 'name', 'type', 'points', 'color', 'area', 'walls'],
    'Room'
  );
}

/**
 * Validates a Wall object has all required properties
 * @param wall Wall to validate
 * @returns True if valid, false otherwise
 */
export function validateWall(wall: any): boolean {
  return validateRequiredProps(
    wall,
    ['id', 'start', 'end', 'thickness', 'color', 'roomIds', 'length'],
    'Wall'
  );
}

/**
 * Validates a Stroke object has all required properties
 * @param stroke Stroke to validate
 * @returns True if valid, false otherwise
 */
export function validateStroke(stroke: any): boolean {
  return validateRequiredProps(
    stroke,
    ['id', 'points', 'type', 'color', 'thickness', 'width'],
    'Stroke'
  );
}
