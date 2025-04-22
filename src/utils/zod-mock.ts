
/**
 * Zod mock implementation for validation
 * This prevents us from having to add the full Zod library as a dependency
 */

export class ZodError extends Error {
  errors: Array<{ message: string; path: string[] }> = [];
  
  constructor(errors: Array<{ message: string; path: string[] }>) {
    super('Validation error');
    this.name = 'ZodError';
    this.errors = errors;
  }
}

export class ZodType<T = any> {
  _type!: T;
  
  constructor(private schema: any = {}) {}
  
  parse(data: unknown): T {
    const errors: Array<{ message: string; path: string[] }> = [];
    
    // Perform validation based on schema
    const isValid = this._validate(data, errors);
    
    if (!isValid) {
      throw new ZodError(errors);
    }
    
    return data as T;
  }
  
  private _validate(data: unknown, errors: Array<{ message: string; path: string[] }>): boolean {
    // Simple validation logic - this would be more complex in the real Zod
    if (this.schema.type === 'string' && typeof data !== 'string') {
      errors.push({ message: 'Expected string', path: [] });
      return false;
    }
    
    if (this.schema.type === 'number' && typeof data !== 'number') {
      errors.push({ message: 'Expected number', path: [] });
      return false;
    }
    
    if (this.schema.type === 'email' && (typeof data !== 'string' || !data.includes('@'))) {
      errors.push({ message: 'Invalid email', path: [] });
      return false;
    }
    
    return true;
  }
  
  optional() {
    return new ZodType({ ...this.schema, optional: true });
  }
  
  nullable() {
    return new ZodType({ ...this.schema, nullable: true });
  }
}

// Create Zod mock object with common validators
const z = {
  string: () => new ZodType<string>({ type: 'string' }),
  number: () => new ZodType<number>({ type: 'number' }),
  boolean: () => new ZodType<boolean>({ type: 'boolean' }),
  email: () => new ZodType<string>({ type: 'email' }),
  array: (schema: ZodType) => new ZodType({ type: 'array', element: schema }),
  object: (schema: Record<string, ZodType>) => new ZodType({ type: 'object', shape: schema }),
  enum: <T extends readonly [string, ...string[]]>(values: T) => 
    new ZodType<T[number]>({ type: 'enum', values }),
  nativeEnum: <T extends object>(enumObj: T) => 
    new ZodType<T[keyof T]>({ type: 'enum', values: Object.values(enumObj) }),
  record: (valueType: ZodType) => new ZodType({ type: 'record', valueType }),
  void: () => new ZodType<void>({ type: 'void' }),
  null: () => new ZodType<null>({ type: 'null' }),
  undefined: () => new ZodType<undefined>({ type: 'undefined' }),
  any: () => new ZodType<any>({ type: 'any' }),
  unknown: () => new ZodType<unknown>({ type: 'unknown' }),
  never: () => new ZodType<never>({ type: 'never' }),
  union: <T extends [ZodType, ZodType, ...ZodType[]]>(schemas: T) => 
    new ZodType({ type: 'union', schemas }),
  intersection: <T extends [ZodType, ZodType, ...ZodType[]]>(schemas: T) => 
    new ZodType({ type: 'intersection', schemas }),
  literal: <T extends string | number | boolean>(value: T) => 
    new ZodType<T>({ type: 'literal', value }),
  ZodType,
  ZodError
};

// Default export for convenience
export default z;

// Named exports to match zod API
export { z };
