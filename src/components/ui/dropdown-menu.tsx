
import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

export type DropdownMenuProps = React.ComponentProps<typeof DropdownMenuPrimitive.Root>;
export const DropdownMenu = DropdownMenuPrimitive.Root;

export type DropdownMenuTriggerProps = React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>;
export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  (props, ref) => (
    <DropdownMenuPrimitive.Trigger ref={ref} {...props}>
      {props.children}
    </DropdownMenuPrimitive.Trigger>
  )
);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

export type DropdownMenuContentProps = React.ComponentProps<typeof DropdownMenuPrimitive.Content>;
export const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  (props, ref) => (
    <DropdownMenuPrimitive.Content ref={ref} {...props}>
      {props.children}
    </DropdownMenuPrimitive.Content>
  )
);
DropdownMenuContent.displayName = "DropdownMenuContent";

export type DropdownMenuItemProps = React.ComponentProps<typeof DropdownMenuPrimitive.Item>;
export const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  (props, ref) => (
    <DropdownMenuPrimitive.Item ref={ref} {...props}>
      {props.children}
    </DropdownMenuPrimitive.Item>
  )
);
DropdownMenuItem.displayName = "DropdownMenuItem";
