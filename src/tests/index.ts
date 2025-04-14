
/**
 * Tests utilities barrel file
 * Re-exports all test helpers, fixtures, and mocks
 * @module tests
 */

// Re-export mocks
export * from './mocks/mockStraightLineTool';

// Re-export test utils
export { renderWithProviders } from './testUtils';
export { createTestFabricCanvas } from './canvasTestUtils';
