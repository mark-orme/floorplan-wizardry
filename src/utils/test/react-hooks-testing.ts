
/**
 * Test utilities for React hooks
 * Provides compatibility layer for testing hooks
 */
import { renderHook as rtlRenderHook, act as rtlAct } from '@testing-library/react-hooks';
import * as React from 'react';

// Re-export renderHook and act from testing library
export const renderHook = rtlRenderHook;
export const act = rtlAct;

// Create mock wrapper for context providers
export const createWrapper = (Providers: React.FC<{ children: React.ReactNode }>) => {
  return ({ children }: { children: React.ReactNode }) => <Providers>{children}</Providers>;
};

// Create test state
export const createTestState = <T extends Record<string, any>>(initialState: T) => {
  return {
    ...initialState,
    setState: jest.fn((newState: Partial<T>) => {
      Object.assign(initialState, newState);
      return initialState;
    })
  };
};

// Helper to mock hook dependencies
export const mockHookDependencies = <T extends Record<string, any>>(dependencies: T): T => {
  return Object.entries(dependencies).reduce((acc, [key, value]) => {
    acc[key] = jest.fn().mockReturnValue(value);
    return acc;
  }, {} as T);
};
