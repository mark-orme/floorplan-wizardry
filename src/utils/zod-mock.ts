
// Enhanced mock implementation of Zod for testing

// Create a ZodError class that matches real Zod's API
export class ZodError extends Error {
  errors: Array<{ message: string; path: string[] }> = [];
  
  constructor(errors: Array<{ message: string; path: string[] }>) {
    super('Validation error');
    this.errors = errors;
  }
}

// Create a ZodType class that can be extended
class ZodType<T> {
  _type!: T;

  constructor() {}
  
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
  
  min(length: number, message?: { message: string }): this {
    return this;
  }
  
  max(length: number, message?: { message: string }): this {
    return this;
  }
  
  email(message?: { message: string }): this {
    return this;
  }
  
  regex(regex: RegExp, message?: { message: string }): this {
    return this;
  }
  
  refine(refinementFn: (val: any) => boolean, message: { message: string }): this {
    return this;
  }
}

// String class
class ZodString extends ZodType<string> {
  min(length: number, message?: { message: string }): this {
    return this;
  }
  
  max(length: number, message?: { message: string }): this {
    return this;
  }
  
  email(message?: { message: string }): this {
    return this;
  }
  
  regex(regex: RegExp, message?: { message: string }): this {
    return this;
  }
}

// Number class
class ZodNumber extends ZodType<number> {
  min(min: number, message?: { message: string }): this {
    return this;
  }
  
  max(max: number, message?: { message: string }): this {
    return this;
  }
  
  positive(message?: { message: string }): this {
    return this;
  }
}

// Boolean class
class ZodBoolean extends ZodType<boolean> {
  refine(refinementFn: (val: boolean) => boolean, message: { message: string }): this {
    return this;
  }
}

// Create a namespace z with methods
export namespace z {
  export const string = () => new ZodString();
  export const number = () => new ZodNumber();
  export const boolean = () => new ZodBoolean();
  export const object = (schema: Record<string, ZodType<any>>) => new ZodType<any>();
  export const array = (type: ZodType<any>) => new ZodType<any[]>();
  export const enum = (values: any[]) => new ZodType<any>();
  export const nativeEnum = (enumObj: any) => new ZodType<any>();
  export const record = (keyType: any, valueType: any) => new ZodType<Record<string, any>>();
  export const infer = <T>(schema: ZodType<T>): T => ({} as T);
  export const ZodError = ZodError;
  export type ZodType<T> = ZodType<T>;
}

// Export as default and named export
export { z as default, ZodType };
