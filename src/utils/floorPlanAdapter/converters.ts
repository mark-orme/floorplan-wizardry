
/**
 * Floor plan converters
 * Provides utilities for converting between different floor plan formats
 * @module utils/floorPlanAdapter/converters
 */
import { FloorPlan as AppFloorPlan, Room as AppRoom, Wall as AppWall, Stroke as AppStroke } from '@/types/floor-plan/unifiedTypes';
import { FloorPlan as CoreFloorPlan, Room as CoreRoom, Wall as CoreWall, Stroke as CoreStroke } from '@/types/core/floor-plan/FloorPlan';
import { adaptFloorPlan, adaptWall, adaptRoom, adaptMetadata } from '@/utils/typeAdapters';

/**
 * Convert app floor plans to core floor plans
 * @param appFloorPlans App floor plans
 * @returns Core floor plans
 */
export function appToCoreFloorPlans(appFloorPlans: AppFloorPlan[]): CoreFloorPlan[] {
  return appFloorPlans.map(appToCoreFloorPlan);
}

/**
 * Convert app floor plan to core floor plan
 * @param appFloorPlan App floor plan
 * @returns Core floor plan
 */
export function appToCoreFloorPlan(appFloorPlan: AppFloorPlan): CoreFloorPlan {
  // Use type adaptation to ensure all required properties exist
  const completeAppFloorPlan = adaptFloorPlan(appFloorPlan);
  
  return {
    id: completeAppFloorPlan.id,
    name: completeAppFloorPlan.name,
    label: completeAppFloorPlan.label,
    walls: completeAppFloorPlan.walls.map(convertWall),
    rooms: completeAppFloorPlan.rooms.map(convertRoom),
    strokes: completeAppFloorPlan.strokes.map(convertStroke),
    canvasData: completeAppFloorPlan.canvasData,
    canvasJson: completeAppFloorPlan.canvasJson,
    createdAt: completeAppFloorPlan.createdAt,
    updatedAt: completeAppFloorPlan.updatedAt,
    gia: completeAppFloorPlan.gia,
    level: completeAppFloorPlan.level,
    index: completeAppFloorPlan.index,
    paperSize: completeAppFloorPlan.metadata.paperSize,
    metadata: convertMetadata(completeAppFloorPlan.metadata)
  } as unknown as CoreFloorPlan;
}

/**
 * Convert core floor plans to app floor plans
 * @param coreFloorPlans Core floor plans
 * @returns App floor plans
 */
export function coreToAppFloorPlans(coreFloorPlans: CoreFloorPlan[]): AppFloorPlan[] {
  return coreFloorPlans.map(coreToAppFloorPlan);
}

/**
 * Convert core floor plan to app floor plan
 * @param coreFloorPlan Core floor plan
 * @returns App floor plan
 */
export function coreToAppFloorPlan(coreFloorPlan: CoreFloorPlan): AppFloorPlan {
  const result: AppFloorPlan = {
    id: coreFloorPlan.id,
    name: coreFloorPlan.name,
    label: coreFloorPlan.label,
    walls: coreFloorPlan.walls.map(wall => convertWall(wall as unknown as AppWall)),
    rooms: coreFloorPlan.rooms.map(room => convertRoom(room as unknown as AppRoom)),
    strokes: coreFloorPlan.strokes.map(stroke => convertStroke(stroke as unknown as AppStroke)),
    canvasData: coreFloorPlan.canvasData,
    canvasJson: coreFloorPlan.canvasJson,
    createdAt: coreFloorPlan.createdAt,
    updatedAt: coreFloorPlan.updatedAt,
    gia: coreFloorPlan.gia,
    level: coreFloorPlan.level,
    index: coreFloorPlan.index ?? coreFloorPlan.level,
    metadata: {
      version: '1.0',
      author: '',
      dateCreated: coreFloorPlan.createdAt,
      lastModified: coreFloorPlan.updatedAt,
      notes: '',
      createdAt: coreFloorPlan.createdAt,
      updatedAt: coreFloorPlan.updatedAt,
      paperSize: coreFloorPlan.paperSize || 'A4',
      level: coreFloorPlan.level
    },
    data: {},
    userId: 'core-conversion'
  };
  
  return adaptFloorPlan(result);
}

/**
 * Convert a wall between formats
 * @param wall The wall to convert
 * @returns Converted wall
 */
export function convertWall(wall: AppWall | CoreWall): AppWall | CoreWall {
  const wallWithLength = adaptWall(wall as any);
  return wallWithLength;
}

/**
 * Convert a room between formats
 * @param room The room to convert
 * @returns Converted room
 */
export function convertRoom(room: AppRoom | CoreRoom): AppRoom | CoreRoom {
  return adaptRoom(room as any);
}

/**
 * Convert a stroke between formats
 * @param stroke The stroke to convert
 * @returns Converted stroke
 */
export function convertStroke(stroke: AppStroke | CoreStroke): AppStroke | CoreStroke {
  return stroke;
}

/**
 * Convert metadata between formats
 * @param metadata The metadata to convert
 * @returns Converted metadata
 */
export function convertMetadata(metadata: any): any {
  return adaptMetadata(metadata);
}
