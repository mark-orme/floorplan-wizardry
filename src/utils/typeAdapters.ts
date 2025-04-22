
/**
 * Type Adapters
 * Utilities for adapting between different type systems and ensuring type safety
 */

// Room Type Literals
export type RoomTypeLiteral = 'living' | 'kitchen' | 'bedroom' | 'bathroom' | 'hallway' | 'unknown';

// Stroke Type Literals
export type StrokeTypeLiteral = 'wall' | 'door' | 'window' | 'annotation' | 'measurement' | 'unknown';

/**
 * Safely cast a string to a RoomTypeLiteral
 * @param type Type string to convert
 * @returns A valid RoomTypeLiteral
 */
export function asRoomType(type: string | RoomTypeLiteral): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = ['living', 'kitchen', 'bedroom', 'bathroom', 'hallway', 'unknown'];
  return validTypes.includes(type as RoomTypeLiteral) ? (type as RoomTypeLiteral) : 'unknown';
}

/**
 * Safely cast a string to a StrokeTypeLiteral
 * @param type Type string to convert
 * @returns A valid StrokeTypeLiteral
 */
export function asStrokeType(type: string | StrokeTypeLiteral): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = ['wall', 'door', 'window', 'annotation', 'measurement', 'unknown'];
  return validTypes.includes(type as StrokeTypeLiteral) ? (type as StrokeTypeLiteral) : 'unknown';
}

/**
 * Adapt a floor plan to the unified interface
 * @param plan Floor plan data
 * @returns Adapted floor plan
 */
export function adaptFloorPlan(plan: any) {
  // Ensure the basic required structure is present
  return {
    id: plan.id || `floor-${Date.now()}`,
    name: plan.name || 'Untitled Floor Plan',
    label: plan.label || plan.name || 'Untitled',
    walls: plan.walls || [],
    rooms: plan.rooms || [],
    strokes: plan.strokes || [],
    canvasData: plan.canvasData || null,
    canvasJson: plan.canvasJson || null,
    createdAt: plan.createdAt || new Date().toISOString(),
    updatedAt: plan.updatedAt || new Date().toISOString(),
    gia: plan.gia || 0,
    level: plan.level || 0,
    index: plan.index || plan.level || 0,
    metadata: plan.metadata || {
      version: '1.0',
      author: 'User',
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      notes: '',
      paperSize: 'A4',
      level: plan.level || 0,
      createdAt: plan.createdAt || new Date().toISOString(),
      updatedAt: plan.updatedAt || new Date().toISOString()
    },
    data: plan.data || {},
    userId: plan.userId || plan.propertyId || 'default-user'
  };
}

/**
 * Create a consistent room type from any input
 * @param room Room data
 * @returns Adapted room
 */
export function asRoomType(room: any) {
  // Ensure all required room properties are present
  return {
    id: room.id || `room-${Date.now()}`,
    name: room.name || 'Untitled Room',
    type: asRoomType(room.type),
    area: room.area || 0,
    perimeter: room.perimeter || 0,
    center: room.center || { x: 0, y: 0 },
    vertices: room.vertices || [],
    labelPosition: room.labelPosition || { x: 0, y: 0 },
    floorPlanId: room.floorPlanId || room.id?.split('-')[0] || `floor-${Date.now()}`
  };
}

/**
 * Create a consistent stroke type from any input
 * @param stroke Stroke data
 * @returns Adapted stroke
 */
export function asStrokeType(stroke: any) {
  // Ensure all required stroke properties are present
  return {
    id: stroke.id || `stroke-${Date.now()}`,
    type: asStrokeType(stroke.type),
    points: stroke.points || [],
    color: stroke.color || '#000000',
    thickness: stroke.thickness || 1,
    floorPlanId: stroke.floorPlanId || stroke.id?.split('-')[0] || `floor-${Date.now()}`
  };
}

/**
 * Core to App type adapter
 * @param corePlan Core floor plan data
 * @returns App-compatible floor plan
 */
export function coreToAppFloorPlan(corePlan: any) {
  // This function adapts core floor plan types to app-compatible types
  return {
    ...adaptFloorPlan(corePlan),
    propertyId: corePlan.userId || corePlan.propertyId || 'default-property'
  };
}
