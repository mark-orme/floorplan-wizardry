
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

export type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root>;
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>((props, ref) => (
  <TabsPrimitive.Root ref={ref} {...props}>
    {props.children}
  </TabsPrimitive.Root>
));
Tabs.displayName = "Tabs";

export type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List>;
export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>((props, ref) => (
  <TabsPrimitive.List ref={ref} {...props}>
    {props.children}
  </TabsPrimitive.List>
));
TabsList.displayName = "TabsList";

export type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger>;
export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>((props, ref) => (
  <TabsPrimitive.Trigger ref={ref} {...props}>
    {props.children}
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = "TabsTrigger";

export type TabsContentProps = React.ComponentProps<typeof TabsPrimitive.Content>;
export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>((props, ref) => (
  <TabsPrimitive.Content ref={ref} {...props}>
    {props.children}
  </TabsPrimitive.Content>
));
TabsContent.displayName = "TabsContent";
