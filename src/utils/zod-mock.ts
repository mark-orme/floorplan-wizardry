
// Create a mock version of Zod for components that need it
const z = {
  string: () => ({
    min: () => ({ message: () => ({}) }),
    email: () => ({ message: () => ({}) }),
  }),
  object: (schema: any) => ({
    ...schema,
    refine: () => ({})
  }),
  infer: (schema: any) => ({})
};

// Export as default and named export for flexibility
export default z;
export { z };
