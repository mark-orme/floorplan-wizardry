
/**
 * Input Validation Utilities
 * Provides comprehensive utilities for validating user input
 * @module utils/validation/inputValidation
 */

import { z } from 'zod';
import { captureError } from '../sentry';
import { InputValidationResult } from '../sentry/types';

// Email regex pattern (RFC 5322 compliant)
const EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Common validation schemas
export const validationSchemas = {
  email: z.string().email().min(5).max(255),
  password: z.string().min(8).max(100),
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/),
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/),
  url: z.string().url(),
  uuid: z.string().uuid(),
  date: z.string().refine((value) => !isNaN(Date.parse(value)), { message: "Invalid date format" }),
  postalCode: z.string().regex(/^[0-9]{5}(-[0-9]{4})?$/),
  numeric: z.string().regex(/^[0-9]+$/),
  alphanumeric: z.string().regex(/^[a-zA-Z0-9]+$/),
};

/**
 * Validate an email address
 * @param email Email to validate
 * @returns Validation result
 */
export function validateEmail(email: string): InputValidationResult {
  if (!email || typeof email !== 'string') {
    return { valid: false, message: "Email is required", fields: { email: ["Email is required"] } };
  }
  
  if (!EMAIL_PATTERN.test(email)) {
    return { valid: false, message: "Invalid email format", fields: { email: ["Invalid email format"] } };
  }
  
  if (email.length > 255) {
    return { valid: false, message: "Email is too long", fields: { email: ["Email is too long"] } };
  }
  
  return { valid: true };
}

/**
 * Validate a password
 * @param password Password to validate
 * @param options Validation options
 * @returns Validation result
 */
export function validatePassword(
  password: string, 
  options: { 
    minLength?: number; 
    requireSpecialChar?: boolean; 
    requireNumber?: boolean;
    requireUppercase?: boolean;
  } = {}
): InputValidationResult {
  const errors: string[] = [];
  const {
    minLength = 8,
    requireSpecialChar = true,
    requireNumber = true,
    requireUppercase = true
  } = options;
  
  if (!password || typeof password !== 'string') {
    return { valid: false, message: "Password is required", fields: { password: ["Password is required"] } };
  }
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters`);
  }
  
  if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must include at least one special character");
  }
  
  if (requireNumber && !/\d/.test(password)) {
    errors.push("Password must include at least one number");
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must include at least one uppercase letter");
  }
  
  if (errors.length > 0) {
    return {
      valid: false,
      message: "Password validation failed",
      fields: { password: errors },
      severity: errors.length > 2 ? 'high' : 'medium'
    };
  }
  
  return { valid: true };
}

/**
 * Validate form data against a Zod schema
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns Validation result
 */
export function validateWithSchema<T>(schema: z.ZodSchema<T>, data: unknown): InputValidationResult & { data?: T } {
  try {
    const validatedData = schema.parse(data);
    return { valid: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fields: Record<string, string[]> = {};
      
      // Format Zod errors into field-specific messages
      error.errors.forEach((err) => {
        const field = err.path.join('.') || 'unknown';
        fields[field] = fields[field] || [];
        fields[field].push(err.message);
      });
      
      return {
        valid: false,
        message: "Validation failed",
        fields,
        severity: Object.keys(fields).length > 3 ? 'high' : 'medium'
      };
    }
    
    // Capture unexpected validation errors
    captureError(error, 'schema-validation-error', {
      extra: { data, schemaName: schema.description }
    });
    
    return { valid: false, message: "An error occurred during validation" };
  }
}

/**
 * Sanitize user input to prevent XSS
 * @param input Input to sanitize
 * @returns Sanitized input
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validate and sanitize generic form data
 * @param formData Form data to validate and sanitize
 * @param schema Zod schema for validation
 * @returns Validation result with sanitized data
 */
export function validateAndSanitizeForm<T>(formData: Record<string, unknown>, schema: z.ZodSchema<T>): 
  InputValidationResult & { sanitizedData?: Partial<T> } {
  
  // Validate with schema
  const validationResult = validateWithSchema(schema, formData);
  
  // Return early if invalid
  if (!validationResult.valid) {
    return validationResult;
  }
  
  // Sanitize string fields
  const sanitizedData: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(validationResult.data as Record<string, unknown>)) {
    if (typeof value === 'string') {
      sanitizedData[key] = sanitizeInput(value);
    } else {
      sanitizedData[key] = value;
    }
  }
  
  return {
    ...validationResult,
    sanitizedData: sanitizedData as Partial<T>
  };
}

/**
 * Rate-limited validation tracking
 * Tracks failed validation attempts to detect potential attacks
 */
const validationFailureTracker: Record<string, { count: number; lastAttempt: number }> = {};

/**
 * Track a validation failure for rate limiting and security monitoring
 * @param identifier User or request identifier (e.g., IP, session ID)
 * @param validationResult Validation result
 * @param context Additional context
 */
export function trackValidationFailure(
  identifier: string, 
  validationResult: InputValidationResult,
  context: {
    component?: string;
    operation?: string;
    route?: string;
  } = {}
): void {
  const now = Date.now();
  
  // Init or update tracking
  if (!validationFailureTracker[identifier]) {
    validationFailureTracker[identifier] = { count: 1, lastAttempt: now };
  } else {
    // Reset if last attempt was more than 10 minutes ago
    if (now - validationFailureTracker[identifier].lastAttempt > 10 * 60 * 1000) {
      validationFailureTracker[identifier] = { count: 1, lastAttempt: now };
    } else {
      validationFailureTracker[identifier].count++;
      validationFailureTracker[identifier].lastAttempt = now;
    }
  }
  
  // Report to Sentry if threshold exceeded
  if (validationFailureTracker[identifier].count >= 5) {
    captureError(
      new Error(`Multiple validation failures detected: ${validationFailureTracker[identifier].count} in 10 minutes`),
      'validation-rate-limit',
      {
        level: 'warning',
        tags: {
          component: context.component || 'unknown',
          operation: context.operation || 'validation',
          validationType: 'form'
        },
        context: {
          ...context,
          inputValidation: validationResult
        },
        extra: {
          failureCount: validationFailureTracker[identifier].count,
          timeWindow: '10 minutes',
          identifier: identifier.substring(0, 8) + '...' // Only include prefix for privacy
        },
        security: {
          level: validationFailureTracker[identifier].count > 10 ? 'high' : 'medium',
          details: 'Multiple validation failures from same source',
          impact: 'Potential brute force or fuzzing attempt'
        }
      }
    );
  }
}

/**
 * Common validation schemas for the application
 */
export const appSchemas = {
  // User schemas
  user: {
    login: z.object({
      email: validationSchemas.email,
      password: validationSchemas.password
    }),
    register: z.object({
      email: validationSchemas.email,
      password: validationSchemas.password,
      name: validationSchemas.name.optional(),
      username: validationSchemas.username.optional()
    }),
    profile: z.object({
      name: validationSchemas.name.optional(),
      email: validationSchemas.email.optional(),
      phone: validationSchemas.phone.optional(),
      bio: z.string().max(500).optional()
    })
  },
  
  // Property schemas
  property: {
    create: z.object({
      address: z.string().min(5).max(200),
      client_name: z.string().min(2).max(100),
      order_id: z.string().min(1).max(50),
      branch_name: z.string().max(100).optional()
    }),
    update: z.object({
      address: z.string().min(5).max(200).optional(),
      client_name: z.string().min(2).max(100).optional(),
      order_id: z.string().min(1).max(50).optional(),
      branch_name: z.string().max(100).optional(),
      status: z.string().optional()
    })
  },
  
  // FloorPlan schemas
  floorPlan: {
    create: z.object({
      name: z.string().min(1).max(100),
      level: z.number().int().min(0).optional(),
      paperSize: z.string().min(1).max(20)
    }),
    update: z.object({
      name: z.string().min(1).max(100).optional(),
      level: z.number().int().min(0).optional(),
      canvasData: z.string().optional(),
      canvasJson: z.string().optional()
    })
  }
};
