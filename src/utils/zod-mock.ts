
/**
 * Mock implementation of zod for component testing
 */

export default {
  object: (schema: any) => ({
    ...schema,
    refine: () => ({
      ...schema,
      parse: (data: any) => data,
    }),
    parse: (data: any) => data,
  }),
  string: () => ({
    min: (min: number, message: { message: string }) => ({
      email: (message: { message: string }) => ({
        parse: (data: string) => data,
      }),
      parse: (data: string) => data,
    }),
    email: (message: { message: string }) => ({
      parse: (data: string) => data,
    }),
    parse: (data: string) => data,
  }),
  boolean: () => ({
    parse: (data: boolean) => data,
  }),
  infer: (schema: any) => schema,
  ZodObject: class ZodObject {},
};
