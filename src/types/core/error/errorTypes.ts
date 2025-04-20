import { SeverityLevel } from '@sentry/react';

export type ErrorSeverity = 'critical' | 'error' | 'warning' | 'info';

export interface ErrorContext {
  component?: string;
  operation?: string;
  context?: Record<string, any>;
}

export interface ErrorReportingOptions {
  level?: SeverityLevel;
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  context?: ErrorContext;
  user?: {
    id?: string;
    email?: string;
    role?: string;
  };
}

export interface LogData {
  timestamp?: string;
  context?: string;
  details?: Record<string, any>;
}

export interface CanvasError extends Error {
  canvas?: any;
  operation?: string;
  timestamp?: string;
}

export interface FloorPlan {
  id: string;
  name: string;
  data: Record<string, any>;
  userId: string;
  strokes: Stroke[];
  walls: Wall[];
  rooms: Room[];
  createdAt: string;
  updatedAt: string;
  metadata: FloorPlanMetadata;
}

export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  points: Point[];
  color: string;
  length: number;
  roomIds: string[];
}

export interface Point {
  x: number;
  y: number;
}

export interface Room {
  id: string;
  name: string;
  type: RoomTypeLiteral;
  points: Point[];
  walls: Wall[];
}

export interface Stroke {
  id: string;
  points: Point[];
  type: StrokeTypeLiteral;
  width: number;
}

export type StrokeTypeLiteral = 'line' | 'freehand' | 'straight' | 'wall';
export type RoomTypeLiteral = 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'other';

export interface FloorPlanMetadata {
  createdAt: string;
  updatedAt: string;
  paperSize: string;
  level: number;
  version: string;
  author: string;
  dateCreated: string;
  lastModified: string;
  notes: string;
}
