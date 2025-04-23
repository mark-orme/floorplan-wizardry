
/**
 * Custom type declarations for modules without TypeScript definitions
 */

// Add any missing module declarations here
declare module 'shadcn-ui' {
  import { ComponentProps } from 'react';
  
  export interface BadgeProps extends ComponentProps<'span'> {
    children?: React.ReactNode;
  }
}
