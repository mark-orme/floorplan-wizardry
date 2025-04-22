
// Mock implementation of the Zod library
const zodMock = {
  string: () => ({
    email: (message?: {}) => zodMock.string(),
    min: (length: number, message?: {}) => zodMock.string(),
    max: (length: number, message?: {}) => zodMock.string(),
    url: (message?: {}) => zodMock.string(),
    regex: (regex: RegExp, message?: {}) => zodMock.string(),
    optional: () => zodMock.string().nullable(),
    nullable: () => ({ ...zodMock.string(), nullable: true }),
    transform: () => zodMock.string(),
    parse: (value: any) => value,
  }),
  number: () => ({
    min: (min: number, message?: {}) => zodMock.number(),
    max: (max: number, message?: {}) => zodMock.number(),
    positive: (message?: {}) => zodMock.number(),
    nonnegative: (message?: {}) => zodMock.number(),
    optional: () => zodMock.number().nullable(),
    nullable: () => ({ ...zodMock.number(), nullable: true }),
    transform: () => zodMock.number(),
    parse: (value: any) => value,
  }),
  boolean: () => ({
    optional: () => zodMock.boolean().nullable(),
    nullable: () => ({ ...zodMock.boolean(), nullable: true }),
    parse: (value: any) => Boolean(value),
  }),
  array: (schema: any) => ({
    min: (min: number, message?: {}) => zodMock.array(schema),
    max: (max: number, message?: {}) => zodMock.array(schema),
    length: (length: number, message?: {}) => zodMock.array(schema),
    nonempty: (message?: {}) => zodMock.array(schema),
    optional: () => zodMock.array(schema).nullable(),
    nullable: () => ({ ...zodMock.array(schema), nullable: true }),
    parse: (value: any) => Array.isArray(value) ? value : [],
  }),
  object: (shape: {}) => ({
    shape,
    extend: (newShape: {}) => zodMock.object({ ...shape, ...newShape }),
    optional: () => zodMock.object(shape),
    nullable: () => zodMock.object(shape),
    parse: (value: any) => value,
    refine: (refineFn: (data: any) => boolean) => zodMock.object(shape),
  }),
  record: (keyType: any, valueType: any) => ({
    optional: () => zodMock.record(keyType, valueType),
    nullable: () => zodMock.record(keyType, valueType),
    parse: (value: any) => value,
  }),
  enum: <T extends [string, ...string[]]>(values: T) => ({
    optional: () => zodMock.enum(values).nullable(),
    nullable: () => ({ ...zodMock.enum(values), nullable: true }),
    parse: (value: any) => value,
  }),
  nativeEnum: <T extends Object>(enumObj: T) => ({
    optional: () => zodMock.nativeEnum(enumObj).nullable(),
    nullable: () => ({ ...zodMock.nativeEnum(enumObj), nullable: true }),
    parse: (value: any) => value,
  }),
  any: () => ({
    optional: () => zodMock.any(),
    nullable: () => zodMock.any(),
    parse: (value: any) => value,
  }),
  parse: (value: any) => value,
  ip: () => ({
    parse: (value: any) => value,
  }),
};

// Create mock ZodError class
class ZodError extends Error {
  errors: { message: string }[] = [];
  
  constructor(errors: { message: string }[] = []) {
    super('Validation error');
    this.errors = errors;
  }
}

// Export the Zod mock as default
export default zodMock;
export { ZodError };

// Add a type declaration to mimic the Zod type system
export type ZodType<T> = {
  parse: (value: unknown) => T;
};
