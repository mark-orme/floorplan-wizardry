
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";
import { cn } from "@/lib/utils";

export type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root>;
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ children, ...props }, ref) => (
    <TabsPrimitive.Root ref={ref} {...props}>
      {children}
    </TabsPrimitive.Root>
  )
);
Tabs.displayName = "Tabs";

export type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List>;
export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ children, className, ...props }, ref) => (
    <TabsPrimitive.List 
      ref={ref} 
      className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)}
      {...props}
    >
      {children}
    </TabsPrimitive.List>
  )
);
TabsList.displayName = "TabsList";

export type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger>;
export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ children, className, ...props }, ref) => (
    <TabsPrimitive.Trigger 
      ref={ref} 
      className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm", className)}
      {...props}
    >
      {children}
    </TabsPrimitive.Trigger>
  )
);
TabsTrigger.displayName = "TabsTrigger";

export type TabsContentProps = React.ComponentProps<typeof TabsPrimitive.Content>;
export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ children, className, ...props }, ref) => (
    <TabsPrimitive.Content 
      ref={ref} 
      className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}
      {...props}
    >
      {children}
    </TabsPrimitive.Content>
  )
);
TabsContent.displayName = "TabsContent";
