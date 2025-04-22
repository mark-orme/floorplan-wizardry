
import { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps } from '@radix-ui/react-tabs';

declare module '@/components/ui/tabs' {
  export interface TabsProps extends React.ComponentPropsWithoutRef<typeof Tabs> {
    children?: React.ReactNode;
    value: string;
    onValueChange: (value: string) => void;
  }

  export interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsList> {
    children?: React.ReactNode;
    className?: string;
  }

  export interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsTrigger> {
    children?: React.ReactNode;
    value: string;
  }

  export interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof TabsContent> {
    children?: React.ReactNode;
    value: string;
  }
}
