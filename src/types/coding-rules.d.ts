
/**
 * Coding Rules for TypeScript
 * 
 * This file serves as documentation for TypeScript best practices enforced by ESLint
 * in our project. These rules help prevent common issues and ensure consistent type safety.
 */

// AI CODER RULES
// 🛑 Never use `Event` alone — always use PointerEvent, MouseEvent, or TouchEvent.
// 🛑 Avoid `any` — strongly type every function.
// 🛑 Never leave promises unhandled - always use await or .catch().
// 🛑 Never use non-strict boolean expressions in conditions.
// ✅ Always specify explicit return types for functions.
// ✅ Extend only known types with clearly defined custom additions.
// ✅ Use `import type` to avoid circular dependency errors.
// ✅ Prefer interfaces over type aliases for object types.
// ✅ Use accessibility modifiers for class members.
// ✅ Avoid non-null assertions (!) - handle nullability explicitly.
// ✅ Use consistent array type syntax (T[] rather than Array<T>).
// ✅ Prefix interface names with 'I' (e.g., IUserData).

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

/**
 * Example of proper Promise handling
 */
// GOOD: Handle promises explicitly
// async function loadData(): Promise<void> {
//   try {
//     const data = await fetchData();
//     processData(data);
//   } catch (error) {
//     console.error('Failed to load data:', error);
//   }
// }

// BAD: Unhandled promise
// function loadData(): void {
//   fetchData().then(data => {
//     processData(data);
//   }); // Error: Missing catch handler
// }

/**
 * Example of proper boolean expressions
 */
// GOOD: Explicit checks
// function isValidUser(user: User | null): boolean {
//   return user !== null && user.isActive === true;
// }

// BAD: Implicit conversion
// function isValidUser(user: User | null): boolean {
//   return user && user.isActive; // Error: Implicitly converts to boolean
// }

/**
 * Example of proper error handling
 */
// GOOD: Explicit error handling
// async function fetchUserData(userId: string): Promise<IUser | null> {
//   try {
//     const response = await api.get(`/users/${userId}`);
//     return response.data;
//   } catch (error) {
//     console.error('Failed to fetch user data:', error);
//     return null;
//   }
// }

// BAD: No error handling
// async function fetchUserData(userId: string): Promise<IUser> {
//   const response = await api.get(`/users/${userId}`);
//   return response.data;
// }

/**
 * Example of proper file size management
 */
// GOOD: Split large components into smaller ones
// // UserProfile.tsx
// export function UserProfile({ userId }: { userId: string }): React.ReactElement {
//   return (
//     <div>
//       <UserHeader userId={userId} />
//       <UserDetails userId={userId} />
//       <UserActions userId={userId} />
//     </div>
//   );
// }
// 
// // UserHeader.tsx, UserDetails.tsx, UserActions.tsx in separate files

// BAD: Everything in one large file
// // UserProfile.tsx with 500+ lines of code containing all logic and UI

// Note: These examples are commented out to prevent them from being included in 
// your actual type definitions. They serve as documentation only.
