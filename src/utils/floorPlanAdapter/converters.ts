
import { Point } from "@/types/core/Point";
import { createPoint } from "../pointHelpers";
import { validatePoint, validateColor, validateTimestamp, validateRoomType } from "./types";

// Function to convert data types for floor plan exports
export const convertPoints = (points: { x: number; y: number }[]): Point[] => {
  return points.map(point => createPoint(point.x, point.y));
};

// App to Core floor plan conversion functions
export const appToCoreFloorPlan = (appFloorPlan: any): any => {
  // Convert app floor plan to core floor plan format
  return {
    id: appFloorPlan.id,
    name: appFloorPlan.name,
    label: appFloorPlan.label || appFloorPlan.name,
    walls: appFloorPlan.walls.map((wall: any) => ({
      id: wall.id,
      start: validatePoint(wall.start),
      end: validatePoint(wall.end),
      thickness: wall.thickness || 2,
      color: validateColor(wall.color),
      length: wall.length
    })),
    rooms: appFloorPlan.rooms.map((room: any) => ({
      id: room.id,
      name: room.name || "Unnamed Room",
      type: validateRoomType(room.type),
      area: room.area || 0,
      color: validateColor(room.color, "#ffffff"),
      points: room.points || []
    })),
    strokes: appFloorPlan.strokes || [],
    createdAt: validateTimestamp(appFloorPlan.createdAt),
    updatedAt: validateTimestamp(appFloorPlan.updatedAt),
    gia: appFloorPlan.gia || 0,
    level: appFloorPlan.level || 0,
    index: appFloorPlan.index || 0,
    canvasData: appFloorPlan.canvasData,
    canvasJson: appFloorPlan.canvasJson,
    metadata: appFloorPlan.metadata || {
      createdAt: validateTimestamp(null),
      updatedAt: validateTimestamp(null),
      paperSize: 'A4',
      level: appFloorPlan.level || 0
    }
  };
};

// Core to App floor plan conversion
export const coreToAppFloorPlan = (coreFloorPlan: any): any => {
  // Convert core floor plan to app floor plan format
  return {
    id: coreFloorPlan.id,
    name: coreFloorPlan.name,
    label: coreFloorPlan.label || coreFloorPlan.name,
    walls: coreFloorPlan.walls.map((wall: any) => ({
      id: wall.id,
      start: wall.start,
      end: wall.end,
      points: [wall.start, wall.end],
      thickness: wall.thickness || 2,
      color: validateColor(wall.color),
      length: wall.length
    })),
    rooms: coreFloorPlan.rooms.map((room: any) => ({
      id: room.id,
      name: room.name || "Unnamed Room",
      type: validateRoomType(room.type),
      area: room.area || 0,
      color: validateColor(room.color, "#ffffff"),
      level: coreFloorPlan.level || 0,
      points: room.points || [],
      walls: []
    })),
    strokes: coreFloorPlan.strokes || [],
    createdAt: validateTimestamp(coreFloorPlan.createdAt),
    updatedAt: validateTimestamp(coreFloorPlan.updatedAt),
    gia: coreFloorPlan.gia || 0,
    level: coreFloorPlan.level || 0,
    index: coreFloorPlan.index || coreFloorPlan.level || 0,
    canvasData: coreFloorPlan.canvasData,
    canvasJson: coreFloorPlan.canvasJson,
    metadata: coreFloorPlan.metadata || {
      createdAt: validateTimestamp(null),
      updatedAt: validateTimestamp(null),
      paperSize: 'A4',
      level: coreFloorPlan.level || 0
    }
  };
};

// Batch conversion functions
export const appToCoreFloorPlans = (appFloorPlans: any[]): any[] => {
  return appFloorPlans.map(appToCoreFloorPlan);
};

export const coreToAppFloorPlans = (coreFloorPlans: any[]): any[] => {
  return coreFloorPlans.map(coreToAppFloorPlan);
};

// Additional conversion functions can be added here as needed
