
/**
 * Test utility functions
 * Provides helper functions for testing React components
 */

import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CanvasProvider } from '@/contexts/CanvasContext';
import { DrawingProvider } from '@/contexts/DrawingContext';

/**
 * Wrapper providers for rendering components in tests
 */
const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CanvasProvider>
          <DrawingProvider>
            {children}
          </DrawingProvider>
        </CanvasProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

/**
 * Custom render function that wraps components with necessary providers
 */
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, { wrapper: AllProviders, ...options });
};

/**
 * Create a test fabric canvas for testing
 */
export const createTestFabricCanvas = () => {
  // Simple mock implementation
  return {
    add: jest.fn(),
    remove: jest.fn(),
    renderAll: jest.fn(),
    getObjects: jest.fn().mockReturnValue([]),
    clear: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    setWidth: jest.fn(),
    setHeight: jest.fn(),
    getWidth: jest.fn().mockReturnValue(800),
    getHeight: jest.fn().mockReturnValue(600),
  };
};
