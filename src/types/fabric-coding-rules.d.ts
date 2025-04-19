
/**
 * Fabric.js Coding Rules for TypeScript
 * 
 * This file serves as documentation for TypeScript best practices with Fabric.js
 * These rules help prevent common type errors when working with the Fabric.js canvas.
 */

// FABRIC.JS CODER RULES
// 🛑 Never pass plain {x,y} objects to Fabric.js methods expecting Point - use toFabricPoint()
// 🛑 Always include both 'e' and 'pointer' properties in brush event objects
// 🛑 Never add custom properties to Fabric.js event objects
// 🛑 Always properly type event handlers for canvas.on() methods
// 🛑 Never use any for Fabric.js objects - use proper types from fabric module
// 🛑 Always check if canvas.freeDrawingBrush exists before using it
// ✅ Always import Point as FabricPoint to avoid confusion with app Point type
// ✅ Use toFabricPoint() for all coordinate conversions
// ✅ Check canvas.isDrawingMode before using drawing brush
// ✅ Use proper cleanup in useEffect when adding canvas event listeners
// ✅ Include comprehensive error handling for all canvas operations
// ✅ Use typed event interfaces from @/types/fabric-brush-events

/**
 * Example of proper Fabric.js brush event handling
 */
// GOOD: Include both required properties and use proper Point type
// function handlePointerDown(e: PointerEvent): void {
//   if (!canvas.isDrawingMode || !canvas.freeDrawingBrush) return;
//
//   const rect = canvasElement.getBoundingClientRect();
//   const x = e.clientX - rect.left;
//   const y = e.clientY - rect.top;
//
//   const fabricPoint = toFabricPoint({ x, y });
//   canvas.freeDrawingBrush.onMouseDown(fabricPoint, {
//     e,
//     pointer: fabricPoint
//   });
// }

// BAD: Missing required 'pointer' property and using plain object
// function handlePointerDown(e: PointerEvent): void {
//   if (!canvas.isDrawingMode) return;
//
//   const rect = canvasElement.getBoundingClientRect();
//   const x = e.clientX - rect.left;
//   const y = e.clientY - rect.top;
//
//   // Error: Missing 'pointer' property and using plain {x,y} object
//   canvas.freeDrawingBrush.onMouseDown({ x, y }, { 
//     e 
//   });
// }

/**
 * Example of proper Point type conversion
 */
// GOOD: Use toFabricPoint utility
// import { Point as FabricPoint } from 'fabric';
// import { toFabricPoint } from '@/utils/fabricPointConverter';
//
// function convertCoordinates(x: number, y: number): FabricPoint {
//   return toFabricPoint({ x, y });
// }

// BAD: Creating plain objects where Point is expected
// function convertCoordinates(x: number, y: number): any {
//   return { x, y }; // Error: Not a proper fabric.Point
// }

/**
 * Example of proper event handler typing
 */
// GOOD: Use proper event types
// import { TPointerEventInfo, TPointerEvent } from '@/types/fabric-events';
//
// canvas.on('mouse:down', (opt: TPointerEventInfo<TPointerEvent>) => {
//   const { e, pointer } = opt;
//   // Handle the event with properly typed properties
// });

// BAD: Using any or incorrect types
// canvas.on('mouse:down', (opt: any) => {
//   const { e, pointer } = opt;
//   // Unsafe access to properties
// });

// Note: These examples are commented out to prevent them from being included in 
// your actual type definitions. They serve as documentation only.
