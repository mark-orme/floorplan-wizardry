
import * as React from "react";
import { ComponentPropsWithRef, forwardRef } from "react";
import { Root as LabelPrimitive } from "@radix-ui/react-label";

export type LabelProps = ComponentPropsWithRef<typeof LabelPrimitive>;

export const Label = forwardRef<
  React.ElementRef<typeof LabelPrimitive>,
  LabelProps
>(({ ...props }, ref) => <LabelPrimitive ref={ref} {...props} />);
Label.displayName = "Label";
