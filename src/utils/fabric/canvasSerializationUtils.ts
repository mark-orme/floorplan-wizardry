
/**
 * Canvas Serialization Utilities
 * Functions for serializing and deserializing canvas state
 * @module utils/fabric/canvasSerializationUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import logger from '@/utils/logger';

/**
 * Options for toDataURL
 */
interface TDataUrlOptions {
  format?: 'jpeg' | 'png';
  quality?: number;
  multiplier: number; // Required property
  enableRetinaScaling?: boolean;
}

/**
 * Serialize canvas to JSON string
 * @param canvas Fabric canvas instance
 * @returns JSON string of canvas state
 */
export function serializeCanvas(canvas: FabricCanvas): string {
  if (!canvas) {
    logger.warn('Cannot serialize null canvas');
    return '';
  }
  
  try {
    return JSON.stringify(canvas.toJSON());
  } catch (error) {
    logger.error('Error serializing canvas:', error);
    return '';
  }
}

/**
 * Deserialize canvas from JSON string
 * @param canvas Fabric canvas instance
 * @param json JSON string of canvas state
 * @returns Success status
 */
export function deserializeCanvas(canvas: FabricCanvas, json: string): boolean {
  if (!canvas) {
    logger.warn('Cannot deserialize to null canvas');
    return false;
  }
  
  try {
    canvas.loadFromJSON(json, canvas.renderAll.bind(canvas));
    return true;
  } catch (error) {
    logger.error('Error deserializing canvas:', error);
    return false;
  }
}

/**
 * Export canvas as image
 * @param canvas Fabric canvas instance
 * @param format Image format (png or jpeg)
 * @param quality Image quality (0-1)
 * @returns Data URL of image
 */
export function exportCanvasAsImage(
  canvas: FabricCanvas,
  format: 'png' | 'jpeg' = 'png',
  quality: number = 1
): string {
  if (!canvas) {
    logger.warn('Cannot export null canvas as image');
    return '';
  }
  
  try {
    // Include required multiplier property
    const options: TDataUrlOptions = {
      format,
      quality,
      multiplier: 1
    };
    
    return canvas.toDataURL(options);
  } catch (error) {
    logger.error('Error exporting canvas as image:', error);
    return '';
  }
}

/**
 * Get canvas dimensions
 * @param canvas Fabric canvas instance
 * @returns Object with width and height
 */
export function getCanvasDimensions(canvas: FabricCanvas): { width: number; height: number } {
  if (!canvas) {
    return { width: 0, height: 0 };
  }
  
  return {
    width: canvas.getWidth(),
    height: canvas.getHeight()
  };
}
