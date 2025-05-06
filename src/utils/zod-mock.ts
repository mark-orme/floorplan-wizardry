
/**
 * Mocked Zod API for validation
 * Provides a simplified implementation of Zod schema validation
 */

/**
 * Error thrown when validation fails
 */
export class ZodError extends Error {
  errors: Array<{ message: string }>;
  
  constructor(errors: Array<{ message: string }>) {
    super('Validation failed');
    this.errors = errors;
  }
}

/**
 * Base Schema class
 */
export class Schema {
  _checks: Array<(value: any) => { valid: boolean; error?: string }>;
  
  constructor() {
    this._checks = [];
  }
  
  /**
   * Validate a value against the schema
   * @param value Value to validate
   */
  parse(value: any) {
    for (const check of this._checks) {
      const result = check(value);
      if (!result.valid) {
        throw new ZodError([{ message: result.error || 'Validation failed' }]);
      }
    }
    
    return value;
  }
  
  /**
   * Try to validate a value against the schema
   * @param value Value to validate
   */
  safeParse(value: any) {
    try {
      this.parse(value);
      return { success: true, data: value };
    } catch (error) {
      return { success: false, error };
    }
  }
}

/**
 * String schema
 */
export class StringSchema extends Schema {
  constructor() {
    super();
    
    // Add default string check
    this._checks.push(value => {
      return {
        valid: typeof value === 'string',
        error: 'Expected a string'
      };
    });
  }
  
  /**
   * Add minimum length constraint
   * @param length Minimum length
   */
  min(length: number) {
    this._checks.push(value => {
      return {
        valid: typeof value === 'string' && value.length >= length,
        error: `String must be at least ${length} characters long`
      };
    });
    
    return this;
  }
  
  /**
   * Add maximum length constraint
   * @param length Maximum length
   */
  max(length: number) {
    this._checks.push(value => {
      return {
        valid: typeof value === 'string' && value.length <= length,
        error: `String must be at most ${length} characters long`
      };
    });
    
    return this;
  }
  
  /**
   * Add email format constraint
   */
  email() {
    this._checks.push(value => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return {
        valid: typeof value === 'string' && emailRegex.test(value),
        error: 'Invalid email format'
      };
    });
    
    return this;
  }
}

/**
 * Create a string schema
 */
export function string() {
  return new StringSchema();
}

/**
 * Number schema
 */
export class NumberSchema extends Schema {
  constructor() {
    super();
    
    // Add default number check
    this._checks.push(value => {
      return {
        valid: typeof value === 'number' && !isNaN(value),
        error: 'Expected a number'
      };
    });
  }
  
  /**
   * Add minimum value constraint
   * @param min Minimum value
   */
  min(min: number) {
    this._checks.push(value => {
      return {
        valid: typeof value === 'number' && value >= min,
        error: `Number must be at least ${min}`
      };
    });
    
    return this;
  }
  
  /**
   * Add maximum value constraint
   * @param max Maximum value
   */
  max(max: number) {
    this._checks.push(value => {
      return {
        valid: typeof value === 'number' && value <= max,
        error: `Number must be at most ${max}`
      };
    });
    
    return this;
  }
}

/**
 * Create a number schema
 */
export function number() {
  return new NumberSchema();
}

/**
 * Boolean schema
 */
export class BooleanSchema extends Schema {
  constructor() {
    super();
    
    // Add default boolean check
    this._checks.push(value => {
      return {
        valid: typeof value === 'boolean',
        error: 'Expected a boolean'
      };
    });
  }
}

/**
 * Create a boolean schema
 */
export function boolean() {
  return new BooleanSchema();
}

/**
 * Object schema
 */
export class ObjectSchema extends Schema {
  constructor(shape?: Record<string, Schema>) {
    super();
    
    // Add object type check
    this._checks.push(value => {
      return {
        valid: typeof value === 'object' && value !== null,
        error: 'Expected an object'
      };
    });
    
    // Add shape validation if provided
    if (shape) {
      this._checks.push(value => {
        for (const [key, schema] of Object.entries(shape)) {
          try {
            if (key in value) {
              schema.parse(value[key]);
            } else {
              return {
                valid: false,
                error: `Missing required field: ${key}`
              };
            }
          } catch (error) {
            return {
              valid: false,
              error: `Invalid field: ${key}`
            };
          }
        }
        
        return { valid: true };
      });
    }
  }
}

/**
 * Create an object schema
 * @param shape Shape of the object
 */
export function object(shape?: Record<string, Schema>) {
  return new ObjectSchema(shape);
}
