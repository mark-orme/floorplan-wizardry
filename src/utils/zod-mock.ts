
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
    optional: () => z.object()
  }),
  string: () => ({
    email: (message = {}) => ({ 
      ...z.string(),
      parse: (data) => data
    }),
    min: (length, message = {}) => ({ 
      ...z.string(),
      parse: (data) => data
    }),
    max: (length, message = {}) => ({ 
      ...z.string(),
      parse: (data) => data
    }),
    url: (message = {}) => ({ 
      ...z.string(),
      parse: (data) => data
    }),
    optional: () => ({ 
      ...z.string(),
      parse: (data) => data
    }),
    nullable: () => ({ 
      ...z.string(),
      parse: (data) => data
    }),
    regex: (regex) => ({ 
      ...z.string(),
      parse: (data) => data
    }),
    transform: () => ({ 
      ...z.string(),
      parse: (data) => data
    }),
    ip: () => ({ 
      ...z.string(),
      parse: (data) => data
    }),
    parse: (data) => data,
    refine: (refineFn, options) => z.string(),
  }),
  boolean: () => ({
    optional: () => z.boolean(),
    nullable: () => z.boolean(),
    parse: (data) => data,
  }),
  number: () => ({
    min: (min, message = {}) => ({
      ...z.number(),
      parse: (data) => data
    }),
    max: (max, message = {}) => ({
      ...z.number(),
      parse: (data) => data
    }),
    int: (message = {}) => ({
      ...z.number(),
      parse: (data) => data
    }),
    positive: () => ({
      ...z.number(),
      parse: (data) => data
    }),
    nonnegative: () => ({
      ...z.number(),
      parse: (data) => data
    }),
    optional: () => ({
      ...z.number(),
      parse: (data) => data
    }),
    nullable: () => ({
      ...z.number(),
      parse: (data) => data
    }),
    parse: (data) => data,
  }),
  enum: (values) => ({
    optional: () => ({
      ...z.enum(values),
      parse: (data) => data
    }),
    parse: (data) => data,
  }),
  nativeEnum: (enumObj) => ({
    optional: () => ({
      parse: (data) => data
    }),
    parse: (data) => data,
  }),
  array: (schema) => ({
    min: () => ({
      ...z.array(schema),
      parse: (data) => data
    }),
    max: () => ({
      ...z.array(schema),
      parse: (data) => data
    }),
    optional: () => ({
      ...z.array(schema),
      parse: (data) => data
    }),
    parse: (data) => data,
  }),
  record: (keySchema, valueSchema) => ({
    optional: () => ({
      parse: (data) => data
    }),
    parse: (data) => data,
  }),
  any: () => ({
    optional: () => ({
      parse: (data) => data
    }),
    parse: (data) => data,
  }),
  // The infer type utility - now exported directly on z
  infer: <T>(schema: any): T => ({} as T),
  
  // ZodType and ZodSchema classes
  ZodType: class ZodType { },
  ZodSchema: class ZodSchema { },
  
  // ZodError class
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
