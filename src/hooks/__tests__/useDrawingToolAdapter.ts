
import { DrawingMode } from '@/constants/drawingModes';

export const useDrawingToolAdapter = () => {
  const doSomething = (tool: DrawingMode) => {
    console.log(`Using tool: ${tool}`);
  };

  return { doSomething };
};
