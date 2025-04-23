/**
 * Global type declarations for external modules
 */

// For testing-library/react
declare module '@testing-library/react' {
  export const render: (component: React.ReactElement) => {
    container: HTMLElement;
    getByText: (text: string) => HTMLElement;
    getByRole: (role: string) => HTMLElement;
    queryByText: (text: string) => HTMLElement | null;
    // Add other testing library exports as needed
  };
  
  export const screen: {
    getByText: (text: string) => HTMLElement;
    getByRole: (role: string) => HTMLElement;
    queryByText: (text: string) => HTMLElement | null;
  };
  
  export const fireEvent: {
    click: (element: HTMLElement) => void;
    change: (element: HTMLElement, options: { target: { value: string } }) => void;
  };
}

// For testing-library/react-hooks
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

// For lucide-react
declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';
  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    absoluteStrokeWidth?: boolean;
  }
  
  export type Icon = ComponentType<LucideProps>;
  export const Icons: Record<string, Icon>;
  
  // Common icons exports
  export const ArrowDown: Icon;
  export const ArrowLeft: Icon;
  export const ArrowRight: Icon;
  export const ArrowUp: Icon;
}

// For react-i18next
declare module 'react-i18next' {
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
}

// For vitest
declare module 'vitest' {
  export const describe: (name: string, fn: () => void) => void;
  export const it: (name: string, fn: () => void | Promise<void>) => void;
  export const test: typeof it;
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
  };
}

// For sonner
declare module 'sonner' {
  export const toast: {
    success: (message: string, options?: any) => void;
    error: (message: string, options?: any) => void;
    info: (message: string, options?: any) => void;
    warning: (message: string, options?: any) => void;
    promise: <T>(promise: Promise<T>, messages: { loading: string; success: string; error: string }, options?: any) => Promise<T>;
    custom: (content: any, options?: any) => void;
    dismiss: (id?: string) => void;
  };
  
  export interface ToasterProps {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
    duration?: number;
    theme?: 'light' | 'dark' | 'system';
    className?: string;
    expand?: boolean;
  }
  
  export const Toaster: React.FC<ToasterProps>;
}

// For recharts
declare module 'recharts' {
  export const LineChart: React.FC<any>;
  export const Line: React.FC<any>;
  export const XAxis: React.FC<any>;
  export const YAxis: React.FC<any>;
  export const CartesianGrid: React.FC<any>;
  export const Tooltip: React.FC<any>;
  export const Legend: React.FC<any>;
  export const BarChart: React.FC<any>;
  export const Bar: React.FC<any>;
  export const PieChart: React.FC<any>;
  export const Pie: React.FC<any>;
  export const Cell: React.FC<any>;
  export const ResponsiveContainer: React.FC<any>;
}

// For react-hook-form
declare module 'react-hook-form' {
  export function useForm<T = any>(options?: any): {
    register: (name: string, options?: any) => any;
    handleSubmit: (onSubmit: (data: T) => void) => (e: React.FormEvent) => void;
    watch: (name?: string) => any;
    setValue: (name: string, value: any) => void;
    getValues: () => T;
    reset: (values?: Partial<T>) => void;
    formState: {
      errors: Record<string, any>;
      isSubmitting: boolean;
      isDirty: boolean;
      isValid: boolean;
    };
    control: any;
  };
  
  export function Controller(props: any): JSX.Element;
}

// For zod
declare module 'zod' {
  export function z(): any;
  export const z: {
    string: () => any;
    number: () => any;
    boolean: () => any;
    array: (schema: any) => any;
    object: (schema: Record<string, any>) => any;
    enum: (values: readonly [string, ...string[]]) => any;
    literal: (value: any) => any;
    union: (schemas: any[]) => any;
    intersection: (schemas: any[]) => any;
    record: (keySchema: any, valueSchema: any) => any;
  };
  
  export type ZodType<T = any> = any;
  export type ZodSchema<T = any> = any;
}
