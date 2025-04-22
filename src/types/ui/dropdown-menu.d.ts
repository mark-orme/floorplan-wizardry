
import { DropdownMenuTriggerProps, DropdownMenuItemProps } from '@radix-ui/react-dropdown-menu';

declare module '@/components/ui/dropdown-menu' {
  export interface DropdownMenuTriggerProps extends React.ComponentPropsWithoutRef<typeof DropdownMenuTrigger> {
    children?: React.ReactNode;
    asChild?: boolean;
  }

  export interface DropdownMenuItemProps extends React.ComponentPropsWithoutRef<typeof DropdownMenuItem> {
    children?: React.ReactNode;
    className?: string;
    onClick?: () => void;
  }
}
