
// Create a mock version of Zod for components that need it
export const z = {
  string: () => ({
    min: (length: number, message?: { message: string }) => ({ 
      message: (msg: string) => ({}) 
    }),
    email: (message?: { message: string }) => ({ 
      message: (msg: string) => ({}) 
    }),
    optional: () => ({}),
    regex: (regex: RegExp, message?: { message: string }) => ({
      message: (msg: string) => ({})
    }),
    url: () => ({
      message: (msg: string) => ({})
    }),
  }),
  object: (schema: any) => ({
    ...schema,
    refine: (refineFn: any, message?: any) => ({})
  }),
  infer: function<T>(schema: any): T { return {} as T },
  boolean: () => ({
    optional: () => ({})
  }),
  number: () => ({
    min: (val: number, message?: any) => ({
      max: (val: number, message?: any) => ({}),
      positive: () => ({}),
      nonnegative: () => ({})
    }),
    max: (val: number, message?: any) => ({}),
    positive: () => ({})
  }),
  enum: (values: any) => ({}),
  array: (schema: any) => ({}),
  any: () => ({}),
  nativeEnum: <T>(enumObj: T) => ({}),
  date: (options?: { required_error?: string }) => ({}),
  // Add missing record function
  record: (keyType: any, valueType: any) => ({})
};

// ZodError for error handling
export class ZodError extends Error {
  errors: Array<{ message: string, path: string[] }>;
  
  constructor(errors: Array<{ message: string, path: string[] }>) {
    super('Validation failed');
    this.errors = errors;
  }
}

// ZodType for type references
export interface ZodType<T> {
  _input: T;
  _output: T;
  parse: (value: unknown) => T;
  safeParse: (value: unknown) => { success: boolean; data?: T; error?: ZodError };
  optional: () => ZodType<T | undefined>;
}

// Export as default and named export for flexibility
export { z };
export default z;
