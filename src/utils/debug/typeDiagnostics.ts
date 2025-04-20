
/**
 * Type Diagnostics Utility
 * Provides debugging functions for type checking
 * @module utils/debug/typeDiagnostics
 */
import { FloorPlan, Stroke, Room, Wall, StrokeTypeLiteral, RoomTypeLiteral } from '@/types/floor-plan/unifiedTypes';

/**
 * Validates a StrokeType value against the allowed types
 * @param type Type to validate
 * @returns Type validation result
 */
export function validateStrokeType(type: string): { valid: boolean; value?: StrokeTypeLiteral } {
  const validTypes: StrokeTypeLiteral[] = ['freehand', 'straight', 'wall', 'room'];
  
  if (validTypes.includes(type as StrokeTypeLiteral)) {
    return { valid: true, value: type as StrokeTypeLiteral };
  }
  
  console.error(`Invalid stroke type: ${type}. Valid types are: ${validTypes.join(', ')}`);
  return { valid: false };
}

/**
 * Validates a RoomType value against the allowed types
 * @param type Type to validate
 * @returns Type validation result
 */
export function validateRoomType(type: string): { valid: boolean; value?: RoomTypeLiteral } {
  const validTypes: RoomTypeLiteral[] = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'];
  
  if (validTypes.includes(type as RoomTypeLiteral)) {
    return { valid: true, value: type as RoomTypeLiteral };
  }
  
  console.error(`Invalid room type: ${type}. Valid types are: ${validTypes.join(', ')}`);
  return { valid: false };
}

/**
 * Validates a floor plan structure to ensure type correctness
 * @param floorPlan Floor plan to validate
 * @returns Validation result with errors if any
 */
export function validateFloorPlanWithReporting(floorPlan: any): { 
  valid: boolean; 
  errors: string[]; 
  fixedFloorPlan?: FloorPlan 
} {
  const errors: string[] = [];
  const fixedFloorPlan = { ...floorPlan };
  
  // Check required properties
  if (!floorPlan) {
    errors.push('Floor plan is null or undefined');
    return { valid: false, errors };
  }
  
  // Check ID and name
  if (!floorPlan.id) {
    errors.push('Floor plan has no ID');
  }
  
  if (!floorPlan.name) {
    errors.push('Floor plan has no name');
    fixedFloorPlan.name = 'Untitled Floor Plan';
  }
  
  // Check arrays
  if (!Array.isArray(floorPlan.walls)) {
    errors.push('Floor plan walls is not an array');
    fixedFloorPlan.walls = [];
  }
  
  if (!Array.isArray(floorPlan.rooms)) {
    errors.push('Floor plan rooms is not an array');
    fixedFloorPlan.rooms = [];
  }
  
  if (!Array.isArray(floorPlan.strokes)) {
    errors.push('Floor plan strokes is not an array');
    fixedFloorPlan.strokes = [];
  }
  
  // Check metadata
  if (!floorPlan.metadata) {
    errors.push('Floor plan has no metadata');
    fixedFloorPlan.metadata = {
      version: '1.0',
      author: '',
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paperSize: 'A4',
      level: 0
    };
  } else if (floorPlan.metadata) {
    // Check required metadata properties
    const requiredFields = ['version', 'author', 'dateCreated', 'lastModified', 'notes'];
    const missingFields = requiredFields.filter(field => !floorPlan.metadata[field]);
    
    if (missingFields.length > 0) {
      errors.push(`Floor plan metadata missing required fields: ${missingFields.join(', ')}`);
      
      // Add missing fields with default values
      missingFields.forEach(field => {
        if (field === 'version') fixedFloorPlan.metadata.version = '1.0';
        if (field === 'author') fixedFloorPlan.metadata.author = '';
        if (field === 'dateCreated') fixedFloorPlan.metadata.dateCreated = new Date().toISOString();
        if (field === 'lastModified') fixedFloorPlan.metadata.lastModified = new Date().toISOString();
        if (field === 'notes') fixedFloorPlan.metadata.notes = '';
      });
    }
  }
  
  // Check required properties for unified API
  if (!floorPlan.data) {
    errors.push('Floor plan has no data property (required by unified API)');
    fixedFloorPlan.data = {};
  }
  
  if (!floorPlan.userId) {
    errors.push('Floor plan has no userId property (required by unified API)');
    fixedFloorPlan.userId = 'system';
  }
  
  return { 
    valid: errors.length === 0, 
    errors,
    fixedFloorPlan: errors.length > 0 ? fixedFloorPlan : undefined
  };
}

/**
 * Logs type information for debugging purposes
 * @param object Object to log type information for
 * @param objectName Name of the object
 */
export function logTypeInfo(object: any, objectName: string = 'Object'): void {
  console.log(`Type information for ${objectName}:`);
  console.log(`- Type: ${typeof object}`);
  console.log(`- Is null: ${object === null}`);
  console.log(`- Is array: ${Array.isArray(object)}`);
  
  if (object && typeof object === 'object' && !Array.isArray(object)) {
    console.log(`- Keys: ${Object.keys(object).join(', ')}`);
    
    // Log first-level property types
    Object.entries(object).forEach(([key, value]) => {
      console.log(`  - ${key}: ${typeof value} ${value === null ? '[null]' : ''} ${Array.isArray(value) ? `[Array(${(value as any[]).length})]` : ''}`);
    });
  }
}
