
import * as z from 'zod';

// Extended Zod utility functions 
export const extendedZod = {
  object: z.object,
  string: z.string,
  number: z.number,
  boolean: z.boolean,
  infer: z.infer
};

export default extendedZod;
