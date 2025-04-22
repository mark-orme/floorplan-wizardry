
import * as React from "react";
import { Label as RadixLabel } from "@radix-ui/react-label";

export type LabelProps = React.ComponentProps<typeof RadixLabel>;

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, ...props }, ref) => (
    <RadixLabel ref={ref} {...props}>
      {children}
    </RadixLabel>
  )
);
Label.displayName = "Label";
