
import * as React from "react";
import { Label as RadixLabel } from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

const Label = React.forwardRef<HTMLLabelElement, React.ComponentPropsWithRef<typeof RadixLabel>>(
  ({ children, className, ...props }, ref) => (
    <RadixLabel 
      ref={ref} 
      className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
      {...props}
    >
      {children}
    </RadixLabel>
  )
);
Label.displayName = "Label";
export { Label };
