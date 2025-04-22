
/**
 * Zod mock utilities
 * Provides mock functions to support components that use Zod
 * without requiring the actual Zod library
 */

// Mock Zod implementation
const z = {
  object: (shape = {}) => ({
    shape,
    extend: () => z.object(),
    refine: (refineFn, options) => z.object(),
    pick: () => z.object(),
    omit: () => z.object(),
    parse: (data) => data,
    safeParse: (data) => ({ success: true, data }),
  }),
  string: () => ({
    email: (message = {}) => z.string(),
    min: (length, message = {}) => z.string(),
    max: (length, message = {}) => z.string(),
    url: (message = {}) => z.string(),
    optional: () => z.string(),
    nullable: () => z.string(),
    regex: (regex) => z.string(),
    transform: () => z.string(),
    ip: () => z.string(),
    parse: (data) => data,
    refine: (refineFn, options) => z.string(),
  }),
  boolean: () => ({
    optional: () => z.boolean(),
    nullable: () => z.boolean(),
  }),
  number: () => ({
    min: (min, message = {}) => z.number(),
    max: (max, message = {}) => z.number(),
    int: (message = {}) => z.number(),
    positive: () => z.number(),
    nonnegative: () => z.number(),
    optional: () => z.number(),
    nullable: () => z.number(),
  }),
  enum: (values) => ({
    optional: () => z.enum(values),
  }),
  nativeEnum: (enumObj) => ({
    optional: () => ({}),
  }),
  array: (schema) => ({
    min: () => z.array(schema),
    max: () => z.array(schema),
    optional: () => z.array(schema),
  }),
  record: (keySchema, valueSchema) => ({
    optional: () => ({}),
  }),
  any: () => ({
    optional: () => ({}),
  }),
  infer: (schema) => ({}),
  ZodType: class ZodType { },
  ZodSchema: class ZodSchema { },
  ZodError: class ZodError extends Error {
    errors = [];
    constructor() {
      super('Validation error');
      this.name = 'ZodError';
    }
  }
};

// Make all methods and classes available as both namespace properties and default export
export const infer = z.infer;
export const ZodType = z.ZodType;
export const ZodSchema = z.ZodSchema;
export const ZodError = z.ZodError;
export const object = z.object;
export const string = z.string;
export const boolean = z.boolean;
export const number = z.number;
export const array = z.array;
export const enum_ = z.enum;
export const nativeEnum = z.nativeEnum;
export const record = z.record;
export const any = z.any;

export default z;
