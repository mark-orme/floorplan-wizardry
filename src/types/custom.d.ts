
/**
 * Custom type declarations for modules without TypeScript definitions
 */

// Add any missing module declarations here
declare module 'shadcn-ui' {
  import { ComponentProps } from 'react';
  
  export interface BadgeProps extends ComponentProps<'span'> {
    children?: React.ReactNode;
  }
}

// Add declarations for modules that don't have proper type definitions
declare module '@testing-library/react-hooks' {
  export function renderHook<TProps, TResult>(
    callback: (props: TProps) => TResult,
    options?: any
  ): {
    result: { current: TResult };
    waitForNextUpdate: () => Promise<void>;
    rerender: (props?: TProps) => void;
    unmount: () => void;
  };

  export function act(callback: () => void | Promise<void>): void | Promise<void>;
}

// Type definitions for packages with built-in types but not via @types/*
declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';
  export const Icons: Record<string, ComponentType<SVGProps<SVGSVGElement>>>;
  
  // Export all lucide icons as named exports
  export const AlertCircle: ComponentType<SVGProps<SVGSVGElement>>;
  export const Check: ComponentType<SVGProps<SVGSVGElement>>;
  export const ChevronDown: ComponentType<SVGProps<SVGSVGElement>>;
  export const ChevronUp: ComponentType<SVGProps<SVGSVGElement>>;
  export const ChevronLeft: ComponentType<SVGProps<SVGSVGElement>>;
  export const ChevronRight: ComponentType<SVGProps<SVGSVGElement>>;
  export const Circle: ComponentType<SVGProps<SVGSVGElement>>;
  export const X: ComponentType<SVGProps<SVGSVGElement>>;
  // Add others as needed
}

// For vitest global types
declare module 'vitest' {
  export const describe: (name: string, fn: () => void) => void;
  export const it: (name: string, fn: () => void | Promise<void>) => void;
  export const expect: any;
  export const beforeEach: (fn: () => void | Promise<void>) => void;
  export const afterEach: (fn: () => void | Promise<void>) => void;
  export const beforeAll: (fn: () => void | Promise<void>) => void;
  export const afterAll: (fn: () => void | Promise<void>) => void;
  export const vi: {
    fn: <T extends (...args: any[]) => any>(impl?: T) => jest.Mock<ReturnType<T>, Parameters<T>>;
    mock: (moduleName: string, factory?: any) => void;
    resetAllMocks: () => void;
    clearAllMocks: () => void;
    spyOn: any;
    mockImplementation: any;
  };
  export type Mock<T extends (...args: any[]) => any> = {
    (...args: Parameters<T>): ReturnType<T>;
    mock: {
      calls: Parameters<T>[];
      results: Array<{ type: 'return' | 'throw'; value: ReturnType<T> }>;
      instances: any[];
      contexts: any[];
      lastCall: Parameters<T>;
    };
    mockImplementation: (fn: T) => Mock<T>;
    mockReturnValue: (val: ReturnType<T>) => Mock<T>;
    mockResolvedValue: (val: Awaited<ReturnType<T>>) => Mock<T>;
    mockRejectedValue: (val: any) => Mock<T>;
    mockReturnValueOnce: (val: ReturnType<T>) => Mock<T>;
    mockResolvedValueOnce: (val: Awaited<ReturnType<T>>) => Mock<T>;
    mockRejectedValueOnce: (val: any) => Mock<T>;
    mockReset: () => Mock<T>;
    mockRestore: () => Mock<T>;
    mockClear: () => Mock<T>;
    getMockName: () => string;
    mockName: (name: string) => Mock<T>;
  };
}

// If react-i18next is causing type issues
declare module 'react-i18next' {
  import React from 'react';
  export function useTranslation(namespace?: string | string[]): {
    t: (key: string, options?: any) => string;
    i18n: any;
    ready: boolean;
  };
  export const Trans: React.FC<{
    i18nKey?: string;
    values?: Record<string, any>;
    components?: Record<string, React.ReactNode> | React.ReactNode[];
    [key: string]: any;
  }>;
  // Add other exports as needed
}
