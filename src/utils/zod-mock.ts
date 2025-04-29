
// Mock implementation of Zod for testing

export class ZodError extends Error {
  errors: Array<{ message: string }> = [];
  
  constructor(errors: Array<{ message: string }>) {
    super('Validation error');
    this.errors = errors;
  }
}

export class ZodType<T> {
  parse(value: unknown): T {
    // Simple validation - override in subclasses
    if (value === undefined || value === null) {
      throw new ZodError([{ message: 'Required' }]);
    }
    return value as T;
  }
  
  safeParse(value: unknown) {
    try {
      const result = this.parse(value);
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof ZodError) {
        return { success: false, error };
      }
      throw error;
    }
  }
}

// Create a mock z object
const z = {
  string: () => new ZodType<string>(),
  number: () => new ZodType<number>(),
  boolean: () => new ZodType<boolean>(),
  object: (schema: Record<string, ZodType<any>>) => new ZodType<any>(),
  array: (type: ZodType<any>) => new ZodType<any[]>(),
  infer: <T>(schema: ZodType<T>) => ({} as T)
};

export { z };
export default z;
