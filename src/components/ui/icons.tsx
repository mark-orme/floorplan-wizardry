
import { createIcon } from "lucide-react";

// X icon
export const X = createIcon('X', [
  ['line', { x1: '18', y1: '6', x2: '6', y2: '18' }],
  ['line', { x1: '6', y1: '6', x2: '18', y2: '18' }]
]);

// RulerSquare
export const RulerSquare = createIcon('RulerSquare', [
  ['rect', { width: '18', height: '18', x: '3', y: '3', rx: '2' }],
  ['path', { d: 'M3 9h6' }],
  ['path', { d: 'M3 15h6' }],
  ['path', { d: 'M9 3v6' }],
  ['path', { d: 'M15 3v6' }]
]);

// Globe
export const Globe = createIcon('Globe', [
  ['circle', { cx: '12', cy: '12', r: '10' }],
  ['line', { x1: '2', y1: '12', x2: '22', y2: '12' }],
  ['path', { d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' }]
]);

// RotateCw
export const RotateCw = createIcon('RotateCw', [
  ['path', { d: 'M21 12a9 9 0 1 1-9-9c4.97 0 9 4.03 9 9z' }],
  ['path', { d: 'm21 3-6 6' }],
  ['path', { d: 'M21 9V3h-6' }]
]);

// Eye
export const Eye = createIcon('Eye', [
  ['path', { d: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' }],
  ['circle', { cx: '12', cy: '12', r: '3' }]
]);

// EyeOff
export const EyeOff = createIcon('EyeOff', [
  ['path', { d: 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24' }],
  ['line', { x1: '1', y1: '1', x2: '23', y2: '23' }]
]);

// Lock
export const Lock = createIcon('Lock', [
  ['rect', { x: '3', y: '11', width: '18', height: '11', rx: '2', ry: '2' }],
  ['path', { d: 'M7 11V7a5 5 0 0 1 10 0v4' }]
]);

// Unlock
export const Unlock = createIcon('Unlock', [
  ['rect', { x: '3', y: '11', width: '18', height: '11', rx: '2', ry: '2' }],
  ['path', { d: 'M7 11V7a5 5 0 0 1 9.9-1' }]
]);

// Trash
export const Trash = createIcon('Trash', [
  ['path', { d: 'M3 6h18' }],
  ['path', { d: 'M8 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' }],
  ['path', { d: 'M19 6v14c0 1-1 2-2 2h-4c-1 0-2-1-2-2V6' }],
  ['line', { x1: '10', y1: '11', x2: '10', y2: '17' }],
  ['line', { x1: '14', y1: '11', x2: '14', y2: '17' }]
]);

// Export any others as needed (add above as needed)

