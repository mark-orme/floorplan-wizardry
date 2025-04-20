
/**
 * Floor plan format converters
 * @module utils/floorPlanAdapter/converters
 */
import { 
  FloorPlan as AppFloorPlan, 
  Room as AppRoom,
  Wall as AppWall,
  Stroke as AppStroke,
  Point,
  FloorPlanMetadata
} from '@/types/floor-plan/unifiedTypes';

import {
  FloorPlan as CoreFloorPlan,
  Room as CoreRoom,
  Wall as CoreWall,
  Stroke as CoreStroke
} from '@/types/FloorPlan';

import { v4 as uuidv4 } from 'uuid';
import { calculateWallLength } from '@/utils/debug/typeDiagnostics';

/**
 * Adapts a floor plan between different formats
 * @param floorPlan Source floor plan
 * @param targetFormat Target format name
 * @returns Adapted floor plan
 */
export const adaptFloorPlan = (floorPlan: any, targetFormat: 'core' | 'app'): any => {
  if (targetFormat === 'core') {
    return appToCoreFloorPlan(floorPlan);
  } else {
    return coreToAppFloorPlan(floorPlan);
  }
};

/**
 * Convert app floor plans to core format
 * @param appFloorPlans App format floor plans
 * @returns Core format floor plans
 */
export const appToCoreFloorPlans = (appFloorPlans: AppFloorPlan[]): CoreFloorPlan[] => {
  return appFloorPlans.map(appToCoreFloorPlan);
};

/**
 * Convert a single app floor plan to core format
 * @param appFloorPlan App format floor plan
 * @returns Core format floor plan
 */
export const appToCoreFloorPlan = (appFloorPlan: AppFloorPlan): CoreFloorPlan => {
  // Ensure all required properties exist
  if (!appFloorPlan.metadata) {
    appFloorPlan.metadata = {
      version: "1.0",
      author: "System",
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paperSize: "A4",
      level: 0
    };
  }
  
  // Create core floor plan with required properties
  return {
    id: appFloorPlan.id,
    name: appFloorPlan.name,
    label: appFloorPlan.label || appFloorPlan.name,
    floorPlanId: appFloorPlan.id,
    walls: appFloorPlan.walls.map(appWallToCoreWall),
    rooms: appFloorPlan.rooms.map(appRoomToCoreRoom),
    strokes: appFloorPlan.strokes.map(appStrokeToCoreStroke),
    canvasData: appFloorPlan.canvasData,
    canvasJson: appFloorPlan.canvasJson,
    index: appFloorPlan.index || 0,
    level: appFloorPlan.level || 0,
    gia: appFloorPlan.gia || 0,
    createdAt: appFloorPlan.createdAt || new Date().toISOString(),
    updatedAt: appFloorPlan.updatedAt || new Date().toISOString(),
    metadata: {
      version: appFloorPlan.metadata.version || "1.0",
      author: appFloorPlan.metadata.author || "System",
      dateCreated: appFloorPlan.metadata.dateCreated || appFloorPlan.metadata.createdAt || appFloorPlan.createdAt || new Date().toISOString(),
      lastModified: appFloorPlan.metadata.lastModified || appFloorPlan.metadata.updatedAt || appFloorPlan.updatedAt || new Date().toISOString(),
      notes: appFloorPlan.metadata.notes || ""
    }
  };
};

/**
 * Convert core floor plans to app format
 * @param coreFloorPlans Core format floor plans
 * @returns App format floor plans
 */
export const coreToAppFloorPlans = (coreFloorPlans: CoreFloorPlan[]): AppFloorPlan[] => {
  return coreFloorPlans.map(coreToAppFloorPlan);
};

/**
 * Convert a single core floor plan to app format
 * @param coreFloorPlan Core format floor plan
 * @returns App format floor plan
 */
export const coreToAppFloorPlan = (coreFloorPlan: CoreFloorPlan): AppFloorPlan => {
  // Get current timestamp for any missing dates
  const now = new Date().toISOString();
  
  // Create app floor plan with required properties
  return {
    id: coreFloorPlan.id,
    name: coreFloorPlan.name,
    label: coreFloorPlan.label || coreFloorPlan.name,
    walls: coreFloorPlan.walls.map(coreWallToAppWall),
    rooms: coreFloorPlan.rooms.map(coreRoomToAppRoom),
    strokes: coreFloorPlan.strokes.map(coreStrokeToAppStroke),
    canvasData: coreFloorPlan.canvasData,
    canvasJson: coreFloorPlan.canvasJson,
    createdAt: coreFloorPlan.createdAt || now,
    updatedAt: coreFloorPlan.updatedAt || now,
    gia: coreFloorPlan.gia || 0,
    level: coreFloorPlan.level || 0,
    index: coreFloorPlan.index || coreFloorPlan.level || 0,
    metadata: {
      version: coreFloorPlan.metadata?.version || "1.0",
      author: coreFloorPlan.metadata?.author || "System",
      dateCreated: coreFloorPlan.metadata?.dateCreated || now,
      lastModified: coreFloorPlan.metadata?.lastModified || now,
      notes: coreFloorPlan.metadata?.notes || "",
      createdAt: coreFloorPlan.createdAt || now,
      updatedAt: coreFloorPlan.updatedAt || now,
      paperSize: "A4",
      level: coreFloorPlan.level || 0
    },
    // Add required properties for app format
    data: {},
    userId: "default-user"
  };
};

// Helper conversion functions
function appWallToCoreWall(wall: AppWall): CoreWall {
  return {
    id: wall.id,
    floorPlanId: '',
    start: wall.start,
    end: wall.end,
    thickness: wall.thickness,
    length: wall.length || calculateWallLength(wall.start, wall.end),
    angle: 0, // Default angle
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      type: 'wall',
      material: '',
      height: wall.height || 0,
      notes: ''
    }
  };
}

function coreWallToAppWall(wall: CoreWall): AppWall {
  return {
    id: wall.id,
    start: wall.start,
    end: wall.end,
    thickness: wall.thickness,
    length: wall.length,
    color: '#000000', // Default color
    roomIds: [], // Default empty room IDs
    height: wall.metadata?.height
  };
}

function appRoomToCoreRoom(room: AppRoom): CoreRoom {
  return {
    id: room.id,
    floorPlanId: '',
    name: room.name,
    area: room.area,
    perimeter: 0, // Default perimeter
    center: room.center || { x: 0, y: 0 },
    vertices: room.vertices,
    labelPosition: room.labelPosition || { x: 0, y: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      type: room.type,
      material: '',
      notes: ''
    }
  };
}

function coreRoomToAppRoom(room: CoreRoom): AppRoom {
  return {
    id: room.id,
    name: room.name,
    type: room.metadata?.type as any || 'other',
    area: room.area,
    vertices: room.vertices,
    perimeter: room.perimeter,
    labelPosition: room.labelPosition,
    center: room.center,
    color: '#ffffff' // Default color
  };
}

function appStrokeToCoreStroke(stroke: AppStroke): CoreStroke {
  return {
    id: stroke.id,
    floorPlanId: '',
    points: stroke.points,
    color: stroke.color || '#000000',
    thickness: stroke.thickness,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      type: stroke.type,
      notes: ''
    }
  };
}

function coreStrokeToAppStroke(stroke: CoreStroke): AppStroke {
  return {
    id: stroke.id,
    points: stroke.points,
    type: stroke.metadata?.type as any || 'line',
    thickness: stroke.thickness,
    width: stroke.thickness,
    color: stroke.color
  };
}

// Validator functions
export const validatePoint = (point: any): Point => {
  if (!point || typeof point !== 'object') {
    return { x: 0, y: 0 };
  }
  return {
    x: typeof point.x === 'number' ? point.x : 0,
    y: typeof point.y === 'number' ? point.y : 0
  };
};

export const validateColor = (color: any): string => {
  if (typeof color !== 'string' || !color.match(/^#[0-9A-Fa-f]{6}$/)) {
    return '#000000';
  }
  return color;
};

export const validateTimestamp = (timestamp: any): string => {
  if (typeof timestamp !== 'string') {
    return new Date().toISOString();
  }
  try {
    // Basic validation that it's an ISO string
    new Date(timestamp).toISOString();
    return timestamp;
  } catch (e) {
    return new Date().toISOString();
  }
};

export const validateStrokeType = (type: any): string => {
  const validTypes = ['freehand', 'line', 'wall', 'room', 'door', 'window', 'furniture', 'annotation', 'polyline'];
  return validTypes.includes(type) ? type : 'line';
};

export const mapRoomType = (type: any): string => {
  const validTypes = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other', 'dining', 'hallway'];
  return validTypes.includes(type) ? type : 'other';
};

export const normalizeDrawingMode = (mode: string): string => {
  const validModes = ['select', 'draw', 'line', 'wall', 'room', 'eraser', 'pan', 'hand', 'rectangle', 'circle'];
  return validModes.includes(mode) ? mode : 'select';
};
