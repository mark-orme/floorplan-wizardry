
/**
 * Zod mock utilities
 * Provides mock functions to support components that use Zod
 * without requiring the actual Zod library
 */

// Mock Zod implementation
export const z = {
  object: (shape = {}) => ({
    shape,
    extend: () => z.object(),
    refine: () => z.object(),
    pick: () => z.object(),
    omit: () => z.object(),
  }),
  string: () => ({
    email: (message = {}) => z.string(),
    min: (length: number, message = {}) => z.string(),
    max: (length: number, message = {}) => z.string(),
    url: (message = {}) => z.string(),
    optional: () => z.string(),
    nullable: () => z.string(),
    regex: () => z.string(),
    transform: () => z.string(),
  }),
  boolean: () => ({
    optional: () => z.boolean(),
    nullable: () => z.boolean(),
  }),
  number: () => ({
    min: (min: number, message = {}) => z.number(),
    max: (max: number, message = {}) => z.number(),
    int: (message = {}) => z.number(),
    positive: () => z.number(),
    nonnegative: () => z.number(),
    optional: () => z.number(),
    nullable: () => z.number(),
  }),
  enum: (values: any) => ({
    optional: () => z.enum(values),
  }),
  nativeEnum: (enumObj: any) => ({}),
  infer: (schema: any) => ({}),
  array: (schema: any) => ({
    min: () => z.array(schema),
    max: () => z.array(schema),
    optional: () => z.array(schema),
  }),
  record: (keySchema: any, valueSchema: any) => ({}),
  any: () => ({}),
  ZodError: class ZodError extends Error {
    errors: Array<{path: string[], message: string}> = [];
    constructor() {
      super('Validation error');
      this.name = 'ZodError';
    }
  }
};

export default z;
