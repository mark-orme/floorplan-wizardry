
import { createIcon } from "lucide-react";

// Pencil
export const Pencil = createIcon('Pencil', [
  ['line', { x1: '18', y1: '2', x2: '22', y2: '6' }],
  ['path', { d: 'M14 6l6 6-6-6z' }],
  ['path', { d: 'M2 22l4-4' }]
]);

// Square
export const Square = createIcon('Square', [
  ['rect', { x: '3', y: '3', width: '18', height: '18', rx: '2' }]
]);

// Circle
export const Circle = createIcon('Circle', [
  ['circle', { cx: '12', cy: '12', r: '10' }]
]);

// MousePointer
export const MousePointer = createIcon('MousePointer', [
  ['path', { d: 'M3 3l7 17a1 1 0 002 0l7-17' }]
]);

// Trash (replaces Trash2)
export const Trash = createIcon('Trash', [
  ['path', { d: 'M3 6h18' }],
  ['path', { d: 'M8 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' }],
  ['path', { d: 'M19 6v14c0 1-1 2-2 2h-4c-1 0-2-1-2-2V6' }],
  ['line', { x1: '10', y1: '11', x2: '10', y2: '17' }],
  ['line', { x1: '14', y1: '11', x2: '14', y2: '17' }]
]);
// Alias for Trash2
export { Trash as Trash2 };

// LayoutGrid
export const LayoutGrid = createIcon('LayoutGrid', [
  ['rect', { x: '3', y: '3', width: '7', height: '7', rx: '1' }],
  ['rect', { x: '14', y: '3', width: '7', height: '7', rx: '1' }],
  ['rect', { x: '14', y: '14', width: '7', height: '7', rx: '1' }],
  ['rect', { x: '3', y: '14', width: '7', height: '7', rx: '1' }]
]);

// MoveIcon
export const MoveIcon = createIcon('Move', [
  ['polyline', { points: '5 9 2 12 5 15' }],
  ['polyline', { points: '9 5 12 2 15 5' }],
  ['polyline', { points: '15 19 12 22 9 19' }],
  ['polyline', { points: '19 9 22 12 19 15' }],
  ['line', { x1: '2', y1: '12', x2: '22', y2: '12' }],
  ['line', { x1: '12', y1: '2', x2: '12', y2: '22' }]
]);

// RulerSquare
export const RulerSquare = createIcon('RulerSquare', [
  ['rect', { width: '18', height: '18', x: '3', y: '3', rx: '2' }],
  ['path', { d: 'M3 9h6' }],
  ['path', { d: 'M3 15h6' }],
  ['path', { d: 'M9 3v6' }],
  ['path', { d: 'M15 3v6' }]
]);

// Export any additional icons needed by your app
