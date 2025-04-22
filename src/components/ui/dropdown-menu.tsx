
import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ComponentPropsWithRef, ElementRef, forwardRef } from "react";

export type DropdownMenuProps = ComponentPropsWithRef<typeof DropdownMenuPrimitive.Root>;
export const DropdownMenu = DropdownMenuPrimitive.Root;

export type DropdownMenuTriggerProps = ComponentPropsWithRef<typeof DropdownMenuPrimitive.Trigger>;
export const DropdownMenuTrigger = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  DropdownMenuTriggerProps
>((props, ref) => <DropdownMenuPrimitive.Trigger ref={ref} {...props} />);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

export type DropdownMenuContentProps = ComponentPropsWithRef<typeof DropdownMenuPrimitive.Content>;
export const DropdownMenuContent = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>((props, ref) => <DropdownMenuPrimitive.Content ref={ref} {...props} />);
DropdownMenuContent.displayName = "DropdownMenuContent";

export type DropdownMenuItemProps = ComponentPropsWithRef<typeof DropdownMenuPrimitive.Item>;
export const DropdownMenuItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>((props, ref) => <DropdownMenuPrimitive.Item ref={ref} {...props} />);
DropdownMenuItem.displayName = "DropdownMenuItem";
