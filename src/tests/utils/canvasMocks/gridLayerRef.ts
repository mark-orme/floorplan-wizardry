
/**
 * Creates a mock grid layer reference
 * @returns Mock grid layer reference
 */
export function createMockGridLayerRef() {
  return { 
    current: [
      { id: 'grid1', isGrid: true },
      { id: 'grid2', isGrid: true }
    ] 
  };
}
