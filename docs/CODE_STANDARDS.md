
# Code Standards

This document outlines the code standards and best practices used in this project to ensure consistency and prevent common errors.

## TypeScript

### Type Safety

- **Always use proper typing**: Avoid `any` types whenever possible
- **Use interfaces** for object shapes that will be implemented or extended
- **Use type aliases** for unions, intersections, and more complex types
- **Use generics** for reusable components and functions

```typescript
// Good
interface UserData {
  id: string;
  name: string;
  age: number;
}

// Avoid
const user: any = { id: '123', name: 'John' };
```

### Explicit Return Types

Always specify return types for functions, especially for exported functions and React components:

```typescript
// Good
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Good - React component
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return <div>{product.name}</div>;
};

// Also good - functional component with explicit return type
function ProductCard({ product }: ProductCardProps): JSX.Element {
  return <div>{product.name}</div>;
}
```

## React Standards

### Component Structure

- **One component per file**: Each component should be in its own file
- **Match component name to filename**: Component name should match the filename in PascalCase
- **Keep components small and focused**: Split large components into smaller ones
- **Use functional components** with hooks instead of class components

### Props

- **Destructure props** in function parameters:
  ```typescript
  function Button({ onClick, children }: ButtonProps) {
    return <button onClick={onClick}>{children}</button>;
  }
  ```

- **Default props**: Set default values directly in the destructuring:
  ```typescript
  function Button({ variant = 'primary', children }: ButtonProps) {
    return <button className={`btn-${variant}`}>{children}</button>;
  }
  ```

### State Management

- **Use appropriate state management**:
  - Local state: `useState` for component-specific state
  - Context API: For shared state across multiple components
  - React Query: For server state
  - Redux/Zustand: For complex global state (if needed)

## Common Error Prevention

### Import/Export Errors

- **Check import paths**: Ensure import paths match the actual filesystem
- **Consistent exports**: Use named exports for most functions/components
- **Default exports**: Only use default exports for main component of a file

### Type Errors

- **Run type checking regularly**: Use `npm run type-check` before commits
- **Address all TypeScript warnings**: Don't ignore TypeScript warnings
- **Use non-null assertion operators sparingly**: Avoid `!` when possible
- **Validate user inputs**: Always validate and sanitize user inputs

## Code Organization

- **Group related functionality**: Keep related components and utilities together
- **Avoid large files**: Split large files into smaller, more focused ones
- **Import sorting**: Sort imports in a consistent order (built-in, external, internal)

## Performance Considerations

- **Memoize expensive calculations**: Use `useMemo` for expensive computations
- **Optimize renders**: Use `React.memo` for components that render often but rarely change
- **Avoid inline functions** in render methods when possible
- **Lazy load components** that aren't immediately needed

## Documentation

- **Comment complex logic**: Add comments to explain complex logic
- **JSDoc for public APIs**: Use JSDoc comments for public functions and components
- **README for directories**: Include a README.md in each directory explaining its purpose
