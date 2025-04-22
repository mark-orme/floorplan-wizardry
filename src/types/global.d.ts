
/**
 * Global type declarations for external modules
 */

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
