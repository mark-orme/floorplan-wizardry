
# Components Directory

This directory contains shared UI components that are used across multiple features.

## Structure

Components in this directory should be generic and reusable, not tied to specific business logic:

- `ui/` - UI primitives and base components (buttons, inputs, cards, etc.)
- `layout/` - Layout components (containers, grids, etc.)
- `form/` - Form-related components
- `feedback/` - Feedback components (alerts, toasts, etc.)
- `data/` - Data display components (tables, charts, etc.)

## Usage Guidelines

1. Components here should be purely presentational or compositional
2. Business logic should be provided via props
3. Use Tailwind CSS for styling
4. For conditional styling, use `clsx` or `class-variance-authority`
5. Document props using TypeScript interfaces
6. Export components through barrel files (index.ts)

## Example

```tsx
// Good example
export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

const Button = ({ variant = 'primary', size = 'md', children, onClick }: ButtonProps) => {
  // ...
};
```
