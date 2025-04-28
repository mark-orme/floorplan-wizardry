
import { Canvas } from 'fabric';

export interface ExtendedFabricCanvas extends Canvas {
  wrapperEl: HTMLDivElement;
  // Add any other missing properties if needed in the future
}

export const asExtendedCanvas = (canvas: Canvas): ExtendedFabricCanvas => {
  return canvas as ExtendedFabricCanvas;
};
