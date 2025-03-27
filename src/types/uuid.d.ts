
/**
 * UUID type definition
 * Provides types for UUID functions and values
 * @module types/uuid
 */

declare module 'uuid' {
  /**
   * Generates a random UUID
   * @returns Random UUID string
   */
  export function v4(): string;
  
  /**
   * Generates a UUID from a name and namespace
   * @param name - Name to generate UUID from
   * @param namespace - Namespace for UUID
   * @returns UUID string
   */
  export function v5(name: string, namespace: string): string;
  
  /**
   * Validates a UUID string
   * @param uuid - UUID string to validate
   * @returns Whether the string is a valid UUID
   */
  export function validate(uuid: string): boolean;
}
