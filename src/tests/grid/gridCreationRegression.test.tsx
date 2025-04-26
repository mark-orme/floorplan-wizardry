
/**
 * Grid creation regression tests
 * Tests to ensure grid creation works properly and doesn't regress
 * @module tests/grid/gridCreationRegression
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BasicGrid } from '@/components/BasicGrid';
import { Canvas as FabricCanvas } from 'fabric';
import { GridCreationState } from '@/types/core/GridTypes';

interface MockFabricCanvas extends FabricCanvas {
  width: number;
  height: number;
  add: jest.Mock;
  remove: jest.Mock;
  getObjects: jest.Mock;
  requestRenderAll: jest.Mock;
  on: jest.Mock;
  off: jest.Mock;
}

// Mock the fabric canvas
jest.mock('fabric', () => {
  return {
    Canvas: jest.fn().mockImplementation(() => ({
      width: 800,
      height: 600,
      add: jest.fn(),
      remove: jest.fn(),
      getObjects: jest.fn().mockReturnValue([]),
      requestRenderAll: jest.fn(),
      on: jest.fn(),
      off: jest.fn()
    } as MockFabricCanvas))
  };
});

// Define interface for grid creation result
interface GridCreationResult {
  gridObjects: Array<{ id: string }>;
  smallGridLines: Array<{ id: string }>;
  largeGridLines: Array<{ id: string }>;
  markers: Array<Record<string, unknown>>;
}

// Mock required utilities
jest.mock('@/utils/gridUtils', () => ({
  createCompleteGrid: jest.fn().mockReturnValue({
    gridObjects: [{ id: 'grid1' }, { id: 'grid2' }],
    smallGridLines: [{ id: 'small1' }],
    largeGridLines: [{ id: 'large1' }],
    markers: []
  } as GridCreationResult),
  setGridVisibility: jest.fn(),
  hasExistingGrid: jest.fn().mockReturnValue(false)
}));

// Mock logger and sentry
jest.mock('@/utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}));

jest.mock('@/utils/sentry', () => ({
  captureMessage: jest.fn()
}));

describe('BasicGrid Component Regression Tests', () => {
  let canvas: MockFabricCanvas;
  
  beforeEach(() => {
    canvas = new FabricCanvas() as MockFabricCanvas;
    jest.clearAllMocks();
  });
  
  test('creates grid successfully when canvas is valid', () => {
    const mockOnGridCreated = jest.fn();
    const { rerender } = render(
      <BasicGrid 
        canvas={canvas} 
        onGridCreated={mockOnGridCreated} 
        initialVisibility={true} 
      />
    );
    
    // Grid should have been created
    const gridUtils = require('@/utils/gridUtils');
    expect(gridUtils.createCompleteGrid).toHaveBeenCalledWith(canvas);
    expect(gridUtils.setGridVisibility).toHaveBeenCalledWith(expect.anything(), expect.anything(), true);
    expect(mockOnGridCreated).toHaveBeenCalledWith(expect.any(Array));
    
    // Re-rendering should not create grid again (already created)
    jest.clearAllMocks();
    rerender(
      <BasicGrid 
        canvas={canvas} 
        onGridCreated={mockOnGridCreated} 
        initialVisibility={true} 
      />
    );
    
    expect(gridUtils.createCompleteGrid).not.toHaveBeenCalled();
    expect(mockOnGridCreated).not.toHaveBeenCalled();
  });
  
  test('handles null canvas gracefully', () => {
    const mockOnGridCreated = jest.fn();
    render(
      <BasicGrid 
        canvas={null} 
        onGridCreated={mockOnGridCreated} 
        initialVisibility={true} 
      />
    );
    
    const logger = require('@/utils/logger');
    expect(logger.warn).toHaveBeenCalledWith('Cannot create grid: Canvas is null');
    expect(mockOnGridCreated).not.toHaveBeenCalled();
  });
  
  test('handles grid creation error', () => {
    const mockError = new Error('Grid creation failed');
    const gridUtils = require('@/utils/gridUtils');
    gridUtils.createCompleteGrid.mockImplementationOnce(() => {
      throw mockError;
    });
    
    const mockOnGridCreated = jest.fn();
    render(
      <BasicGrid 
        canvas={canvas} 
        onGridCreated={mockOnGridCreated} 
        initialVisibility={true} 
      />
    );
    
    const logger = require('@/utils/logger');
    const sentry = require('@/utils/sentry');
    expect(logger.error).toHaveBeenCalledWith('Error creating grid:', mockError);
    expect(sentry.captureMessage).toHaveBeenCalledWith(
      'Grid creation failed', 
      'grid-creation-error', 
      expect.objectContaining({
        extra: { error: 'Grid creation failed' }
      })
    );
    expect(mockOnGridCreated).not.toHaveBeenCalled();
  });
});
