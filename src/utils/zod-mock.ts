
import { z } from 'zod';

export type ZodType<T = any> = z.ZodType<T>;

const zodMock = {
  object: z.object,
  string: z.string,
  number: z.number,
  boolean: z.boolean,
  array: z.array,
  optional: z.optional,
  nullable: z.nullable
};

export default zodMock;
export { z };
