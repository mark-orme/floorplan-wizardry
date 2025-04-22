
/**
 * Zod mock utilities
 * Provides mock functions to support components that use Zod
 * without requiring the actual Zod library
 */

const z = {
  object: () => ({
    shape: {},
    extend: () => z.object(),
    refine: () => z.object(),
    pick: () => z.object(),
    omit: () => z.object(),
    string: () => z.string(),
    boolean: () => z.boolean(),
    number: () => z.number(),
    email: () => z.string(),
    min: () => z.string(),
    max: () => z.string(),
    url: () => z.string(),
    optional: () => z.string(),
    nullable: () => z.string(),
  }),
  string: () => ({
    email: () => z.string(),
    min: () => z.string(),
    max: () => z.string(),
    url: () => z.string(),
    optional: () => z.string(),
    nullable: () => z.string(),
  }),
  boolean: () => ({
    optional: () => z.boolean(),
    nullable: () => z.boolean(),
  }),
  number: () => ({
    min: () => z.number(),
    max: () => z.number(),
    int: () => z.number(),
    optional: () => z.number(),
    nullable: () => z.number(),
  }),
};

export default z;
