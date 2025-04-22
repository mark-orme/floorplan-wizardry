
import { DialogProps, DialogTitleProps, DialogDescriptionProps } from '@radix-ui/react-dialog';

declare module '@/components/ui/dialog' {
  export interface DialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
    children?: React.ReactNode;
  }

  export interface DialogTitleProps extends React.ComponentPropsWithoutRef<typeof DialogTitle> {
    children?: React.ReactNode;
  }

  export interface DialogDescriptionProps extends React.ComponentPropsWithoutRef<typeof DialogDescription> {
    children?: React.ReactNode;
  }
}
