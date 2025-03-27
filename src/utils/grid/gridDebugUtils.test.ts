
/**
 * Grid debug utilities tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Canvas, Object as FabricObject } from 'fabric';
import { forceCreateGrid, attemptGridRecovery } from './gridDebugUtils';

// Sample test for the function that expects 3 arguments
describe('attemptGridRecovery', () => {
  it('should call the custom grid creation function if provided', () => {
    // Mock canvas
    const canvas = {} as Canvas;
    
    // Mock ref
    const gridLayerRef = { current: [] } as React.MutableRefObject<FabricObject[]>;
    
    // Mock custom grid creation function
    const createGridFn = vi.fn().mockReturnValue([{} as FabricObject]);
    
    // Call function with all 3 required arguments - add the missing options argument
    const result = attemptGridRecovery(canvas, gridLayerRef, createGridFn, { forceRecreation: true });
    
    expect(createGridFn).toHaveBeenCalledWith(canvas);
    expect(result).toBe(true);
  });
});
