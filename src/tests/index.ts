
/**
 * Tests utilities barrel file
 * Re-exports all test helpers, fixtures, and mocks
 * @module tests
 */

// Re-export mocks
export * from './mocks/mockStraightLineTool';

// We need to fix these imports as they don't exist
// Create minimal versions of these test utilities:

// Basic test utils implementation
export const renderWithProviders = (ui: React.ReactElement, options = {}) => {
  return {
    ...render(ui, options),
    // Add more helper methods as needed
  };
};

// Basic canvas test utils implementation
export const createTestFabricCanvas = () => {
  // Simple mock implementation
  return {
    add: jest.fn(),
    remove: jest.fn(),
    renderAll: jest.fn(),
    getObjects: jest.fn().mockReturnValue([]),
    clear: jest.fn(),
  };
};

// Mock imports that need to be available for the above functions
import { render } from '@testing-library/react';
