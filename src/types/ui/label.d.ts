
import { LabelProps } from '@radix-ui/react-label';

declare module '@/components/ui/label' {
  export interface LabelProps extends React.ComponentPropsWithoutRef<typeof Label> {
    children?: React.ReactNode;
    htmlFor?: string;
    className?: string;
  }
}
