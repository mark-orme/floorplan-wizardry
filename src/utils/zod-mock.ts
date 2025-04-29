
// Enhanced mock implementation of Zod for testing

export class ZodError extends Error {
  errors: Array<{ message: string; path: string[] }> = [];
  
  constructor(errors: Array<{ message: string; path: string[] }>) {
    super('Validation error');
    this.errors = errors;
  }
}

export class ZodType<T> {
  parse(value: unknown): T {
    // Simple validation - override in subclasses
    if (value === undefined || value === null) {
      throw new ZodError([{ message: 'Required', path: [] }]);
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
  
  // Add common Zod string methods
  min(length: number, message?: { message: string }) {
    return this;
  }
  
  max(length: number, message?: { message: string }) {
    return this;
  }
  
  email(message?: { message: string }) {
    return this;
  }
  
  regex(regex: RegExp, message?: { message: string }) {
    return this;
  }
  
  // Add common Zod boolean methods
  refine(refinementFn: (val: any) => boolean, message: { message: string }) {
    return this;
  }
}

// String class
class ZodString extends ZodType<string> {
  min(length: number, message?: { message: string }) {
    return this;
  }
  
  max(length: number, message?: { message: string }) {
    return this;
  }
  
  email(message?: { message: string }) {
    return this;
  }
  
  regex(regex: RegExp, message?: { message: string }) {
    return this;
  }
}

// Number class
class ZodNumber extends ZodType<number> {
  min(min: number, message?: { message: string }) {
    return this;
  }
  
  max(max: number, message?: { message: string }) {
    return this;
  }
  
  positive(message?: { message: string }) {
    return this;
  }
}

// Boolean class
class ZodBoolean extends ZodType<boolean> {
  refine(refinementFn: (val: boolean) => boolean, message: { message: string }) {
    return this;
  }
}

// Create a mock z object
const z = {
  string: () => new ZodString(),
  number: () => new ZodNumber(),
  boolean: () => new ZodBoolean(),
  object: (schema: Record<string, ZodType<any>>) => new ZodType<any>(),
  array: (type: ZodType<any>) => new ZodType<any[]>(),
  enum: (values: any[]) => new ZodType<any>(),
  nativeEnum: (enumObj: any) => new ZodType<any>(),
  record: (keyType: any, valueType: any) => new ZodType<Record<string, any>>(),
  infer: <T>(schema: ZodType<T>): T => ({} as T),
  ZodError: ZodError
};

export { z };
export default z;
