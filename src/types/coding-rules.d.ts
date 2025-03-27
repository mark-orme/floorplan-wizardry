
/**
 * Coding Rules for TypeScript
 * 
 * This file serves as documentation for TypeScript best practices enforced by ESLint
 * in our project. These rules help prevent common issues and ensure consistent type safety.
 */

// AI CODER RULES
// 🛑 Never use `Event` alone — always use PointerEvent, MouseEvent, or TouchEvent.
// 🛑 Avoid `any` — strongly type every function.
// ✅ Extend only known types with clearly defined custom additions.
// ✅ Use `import type` to avoid circular dependency errors.
// ✅ Prefer interfaces over type aliases for object types
// ✅ Always specify return types for functions
// ✅ Use accessibility modifiers for class members
// ✅ Avoid non-null assertions (!) - handle nullability explicitly
// ✅ Use consistent array type syntax (T[] rather than Array<T>)
// ✅ Use import type to prevent runtime dependencies on types

/**
 * Example of proper type imports to avoid circular dependencies
 */
// GOOD: Import only the types you need
// import type { User, Post } from './models';

// BAD: Importing both values and types together
// import { User, Post, createUser } from './models';

/**
 * Example of properly extending known types
 */
// GOOD: Extend with specific properties
// interface ExtendedPointerEvent extends PointerEvent {
//   customProperty: string;
// }

// BAD: Using any
// interface UntypedEvent {
//   target: any;
//   type: any;
// }

/**
 * Example of proper event handling
 */
// GOOD: Use specific event types
// function handlePointer(event: PointerEvent): void {
//   const x = event.clientX;
// }

// BAD: Using generic Event
// function handleEvent(event: Event): void {
//   const x = (event as any).clientX; // Error: clientX doesn't exist on Event
// }

// Note: These examples are commented out to prevent them from being included in 
// your actual type definitions. They serve as documentation only.
