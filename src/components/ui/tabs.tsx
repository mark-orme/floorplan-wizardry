
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

// Use broader prop signatures
export type TabsProps = React.ComponentPropsWithRef<typeof TabsPrimitive.Root>;
export const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>((props, ref) => <TabsPrimitive.Root ref={ref} {...props} />);
Tabs.displayName = "Tabs";

export type TabsListProps = React.ComponentPropsWithRef<typeof TabsPrimitive.List>;
export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>((props, ref) => <TabsPrimitive.List ref={ref} {...props} />);
TabsList.displayName = "TabsList";

export type TabsTriggerProps = React.ComponentPropsWithRef<typeof TabsPrimitive.Trigger>;
export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>((props, ref) => <TabsPrimitive.Trigger ref={ref} {...props} />);
TabsTrigger.displayName = "TabsTrigger";

export type TabsContentProps = React.ComponentPropsWithRef<typeof TabsPrimitive.Content>;
export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>((props, ref) => <TabsPrimitive.Content ref={ref} {...props} />);
TabsContent.displayName = "TabsContent";
