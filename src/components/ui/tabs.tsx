
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { ComponentPropsWithRef, ElementRef, forwardRef } from "react";

export type TabsProps = ComponentPropsWithRef<typeof TabsPrimitive.Root>;
export const Tabs = forwardRef<ElementRef<typeof TabsPrimitive.Root>, TabsProps>(
  (props, ref) => <TabsPrimitive.Root ref={ref} {...props} />
);

export type TabsListProps = ComponentPropsWithRef<typeof TabsPrimitive.List>;
export const TabsList = forwardRef<ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  (props, ref) => <TabsPrimitive.List ref={ref} {...props} />
);

export type TabsTriggerProps = ComponentPropsWithRef<typeof TabsPrimitive.Trigger>;
export const TabsTrigger = forwardRef<ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  (props, ref) => <TabsPrimitive.Trigger ref={ref} {...props} />
);

export type TabsContentProps = ComponentPropsWithRef<typeof TabsPrimitive.Content>;
export const TabsContent = forwardRef<ElementRef<typeof TabsPrimitive.Content>, TabsContentProps>(
  (props, ref) => <TabsPrimitive.Content ref={ref} {...props} />
);
