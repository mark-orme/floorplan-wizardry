
import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

export type DropdownMenuProps = React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.Root>;
export const DropdownMenu = DropdownMenuPrimitive.Root;

export type DropdownMenuTriggerProps = React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.Trigger>;
export const DropdownMenuTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  DropdownMenuTriggerProps
>((props, ref) => <DropdownMenuPrimitive.Trigger ref={ref} {...props} />);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

export type DropdownMenuContentProps = React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.Content>;
export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>((props, ref) => <DropdownMenuPrimitive.Content ref={ref} {...props} />);
DropdownMenuContent.displayName = "DropdownMenuContent";

export type DropdownMenuItemProps = React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.Item>;
export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>((props, ref) => <DropdownMenuPrimitive.Item ref={ref} {...props} />);
DropdownMenuItem.displayName = "DropdownMenuItem";
