
// Export the entire zod library
export * from 'zod';

// Add any extensions or custom utilities needed
export const object = (shape: any) => {
  return { shape };
};

export const ZodError = class ZodError extends Error {
  errors: Array<{ message: string }> = [];
  constructor(message: string, errors: Array<{ message: string }> = []) {
    super(message);
    this.errors = errors;
  }
};

export const string = () => {
  return {
    min: () => ({
      max: () => ({
        email: () => ({
          regex: () => ({
            parse: (val: string) => val
          })
        }),
        parse: (val: string) => val
      }),
      email: () => ({
        regex: () => ({
          parse: (val: string) => val
        }),
        parse: (val: string) => val
      }),
      parse: (val: string) => val
    })
  };
};

export const ZodString = class {
  static create() {
    return {
      min: () => this,
      max: () => this,
      email: () => this,
      regex: () => this,
      parse: (val: string) => val,
    };
  }
};

export const ZodNumber = class {
  static create() {
    return {
      min: () => this,
      max: () => this,
      positive: () => this,
      parse: (val: number) => val,
    };
  }
};
