
// Create a mock version of Zod for components that need it
const z = {
  string: () => ({
    min: (length: number, message?: { message: string }) => ({ 
      message: (msg: string) => ({}) 
    }),
    email: (message?: { message: string }) => ({ 
      message: (msg: string) => ({}) 
    }),
    optional: () => ({}),
  }),
  object: (schema: any) => ({
    ...schema,
    refine: (refineFn: any, message?: any) => ({})
  }),
  infer: (schema: any) => ({}),
  boolean: () => ({}),
  number: () => ({
    min: (val: number, message?: any) => ({}),
    max: (val: number, message?: any) => ({}),
    positive: () => ({})
  }),
  enum: (values: any) => ({}),
  array: (schema: any) => ({})
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
}

// Export as default and named export for flexibility
export default z;
export { z };
