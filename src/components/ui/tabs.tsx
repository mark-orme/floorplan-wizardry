
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { ComponentPropsWithRef, ElementRef, forwardRef } from "react";

export type TabsProps = ComponentPropsWithRef<typeof TabsPrimitive.Root>;
export const Tabs = forwardRef<ElementRef<typeof TabsPrimitive.Root>, TabsProps>(
  (props, ref) => <TabsPrimitive.Root ref={ref} {...props} />
);
Tabs.displayName = TabsPrimitive.Root.displayName;

export type TabsListProps = ComponentPropsWithRef<typeof TabsPrimitive.List>;
export const TabsList = forwardRef<ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  (props, ref) => <TabsPrimitive.List ref={ref} {...props} />
);
TabsList.displayName = TabsPrimitive.List.displayName;

export type TabsTriggerProps = ComponentPropsWithRef<typeof TabsPrimitive.Trigger>;
export const TabsTrigger = forwardRef<ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  (props, ref) => <TabsPrimitive.Trigger ref={ref} {...props} />
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export type TabsContentProps = ComponentPropsWithRef<typeof TabsPrimitive.Content>;
export const TabsContent = forwardRef<ElementRef<typeof TabsPrimitive.Content>, TabsContentProps>(
  (props, ref) => <TabsPrimitive.Content ref={ref} {...props} />
);
TabsContent.displayName = TabsPrimitive.Content.displayName;
