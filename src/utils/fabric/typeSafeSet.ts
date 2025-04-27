
/**
 * Type-safe utility to set properties on fabric objects
 * @param obj The fabric object to modify
 * @param props The properties to set
 */
export function setProps<T extends object>(obj: any, props: Partial<T>): void {
  if (obj && typeof obj === 'object') {
    if (typeof obj.set === 'function') {
      obj.set(props);
    } else {
      // Fallback for objects without set method
      Object.assign(obj, props);
    }
  }
}

/**
 * Type-safe utility to get a property from a fabric object
 * @param obj The fabric object
 * @param prop The property name
 * @returns The property value or undefined
 */
export function getProp<T>(obj: any, prop: string): T | undefined {
  if (obj && typeof obj === 'object') {
    if (typeof obj.get === 'function') {
      return obj.get(prop) as T;
    }
    return obj[prop] as T;
  }
  return undefined;
}
