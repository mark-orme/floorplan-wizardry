
/**
 * Canvas serialization utilities
 * @module utils/fabric/canvasSerializationUtils
 */

import { Canvas } from 'fabric';

/**
 * Serialize canvas to JSON
 * @param canvas The canvas to serialize
 * @returns JSON string or null if failed
 */
export function serializeCanvas(canvas: Canvas | null): string | null {
  if (!canvas) return null;
  
  try {
    return JSON.stringify(canvas.toJSON());
  } catch (e) {
    console.error('Error serializing canvas:', e);
    return null;
  }
}

/**
 * Deserialize JSON to canvas
 * @param canvas The canvas to load into
 * @param json JSON string to deserialize
 * @returns True if successful
 */
export function deserializeCanvas(canvas: Canvas | null, json: string): boolean {
  if (!canvas || !json) return false;
  
  try {
    canvas.loadFromJSON(json, () => {
      canvas.renderAll();
    });
    return true;
  } catch (e) {
    console.error('Error deserializing canvas:', e);
    return false;
  }
}

/**
 * Export canvas as SVG
 * @param canvas The canvas to export
 * @returns SVG string or null if failed
 */
export function exportCanvasAsSVG(canvas: Canvas | null): string | null {
  if (!canvas) return null;
  
  try {
    return canvas.toSVG();
  } catch (e) {
    console.error('Error exporting canvas as SVG:', e);
    return null;
  }
}

/**
 * Export canvas as DataURL
 * @param canvas The canvas to export
 * @param format Image format (png, jpeg)
 * @param quality Image quality for jpeg (0-1)
 * @returns DataURL string or null if failed
 */
export function exportCanvasAsDataURL(
  canvas: Canvas | null, 
  format: 'png' | 'jpeg' = 'png',
  quality: number = 1
): string | null {
  if (!canvas) return null;
  
  try {
    return canvas.toDataURL({
      format,
      quality
    });
  } catch (e) {
    console.error('Error exporting canvas as DataURL:', e);
    return null;
  }
}
