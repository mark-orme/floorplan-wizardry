
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { ExtendedFabricCanvas } from '@/types/ExtendedFabricCanvas';

/**
 * Safely cast any Fabric Canvas to ExtendedFabricCanvas type
 * @param canvas The canvas to cast
 * @returns The canvas as ExtendedFabricCanvas
 */
export function asExtendedCanvas(canvas: FabricCanvas | null): ExtendedFabricCanvas | null {
  if (!canvas) return null;
  
  const extendedCanvas = canvas as ExtendedFabricCanvas;
  
  // Ensure required properties exist
  if (!extendedCanvas.getActiveObject && extendedCanvas.getActiveObjects) {
    extendedCanvas.getActiveObject = () => {
      const activeObjects = extendedCanvas.getActiveObjects();
      return activeObjects && activeObjects.length > 0 ? activeObjects[0] : null;
    };
  }
  
  return extendedCanvas;
}

/**
 * Cast a Fabric Object to extended type with additional properties
 * @param obj The object to cast
 * @returns The object with extended properties
 */
export function asExtendedObject<T extends FabricObject>(obj: FabricObject): T & { 
  visible?: boolean; 
  forEachObject?: (callback: (obj: FabricObject) => void) => void;
} {
  return obj as T & { 
    visible?: boolean;
    forEachObject?: (callback: (obj: FabricObject) => void) => void;
  };
}
