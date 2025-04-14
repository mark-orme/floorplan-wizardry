
import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CanvasProvider } from '@/contexts/CanvasContext';
import { DrawingProvider } from '@/contexts/DrawingContext';
import { vi } from 'vitest';

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
  return {
    add: vi.fn(),
    remove: vi.fn(),
    renderAll: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    clear: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    setWidth: vi.fn(),
    setHeight: vi.fn(),
    getWidth: vi.fn().mockReturnValue(800),
    getHeight: vi.fn().mockReturnValue(600),
    getElement: vi.fn().mockReturnValue(document.createElement('canvas')),
    dispose: vi.fn(),
    setBackgroundColor: vi.fn(),
    isDrawingMode: false,
    selection: true,
    defaultCursor: 'default',
    hoverCursor: 'move',
    freeDrawingBrush: {
      width: 1,
      color: '#000000'
    }
  };
};
