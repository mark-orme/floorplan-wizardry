/**
 * Utilities for handling touch gestures on Fabric.js canvas
 * Provides multi-touch support for mobile devices
 * @module fabric/gestures
 */
import { Canvas } from 'fabric';
import { CustomTouchEvent, CustomFabricTouchEvent } from '@/types/fabric';

/**
 * Initialize touch gestures for the canvas
 * @param {Canvas} canvas - The Fabric.js canvas instance
 */
export const initializeCanvasGestures = (canvas: Canvas): void => {
  let ongoingTouches: CustomFabricTouchEvent[] = [];

  const getTouchPosition = (touch: Touch): { x: number; y: number } => {
    const rect = canvas.getElement().getBoundingClientRect();
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  };

  const handleTouchStart = (e: CustomTouchEvent) => {
    e.preventDefault();
    const touches = Array.from(e.touches);

    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const touchPosition = getTouchPosition(touch);

      ongoingTouches.push({
        touches: [touchPosition],
        e: touch
      } as CustomFabricTouchEvent);
    }
  };

  const handleTouchMove = (e: CustomTouchEvent) => {
    e.preventDefault();
    const touches = Array.from(e.touches);

    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const touchPosition = getTouchPosition(touch);

      const ongoingTouchIndex = ongoingTouches.findIndex(t => t.e.identifier === touch.identifier);

      if (ongoingTouchIndex !== -1) {
        ongoingTouches[ongoingTouchIndex] = {
          touches: [touchPosition],
          e: touch
        } as CustomFabricTouchEvent;
      }
    }
  };

  const handleTouchEnd = (e: CustomTouchEvent) => {
    e.preventDefault();
    const touches = Array.from(e.changedTouches);

    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      ongoingTouches = ongoingTouches.filter(t => t.e.identifier !== touch.identifier);
    }
  };

  const handleTouchCancel = (e: CustomTouchEvent) => {
    e.preventDefault();
    const touches = Array.from(e.changedTouches);

    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      ongoingTouches = ongoingTouches.filter(t => t.e.identifier !== touch.identifier);
    }
  };

  canvas.getElement().addEventListener('touchstart', handleTouchStart as any, false);
  canvas.getElement().addEventListener('touchmove', handleTouchMove as any, false);
  canvas.getElement().addEventListener('touchend', handleTouchEnd as any, false);
  canvas.getElement().addEventListener('touchcancel', handleTouchCancel as any, false);
};
