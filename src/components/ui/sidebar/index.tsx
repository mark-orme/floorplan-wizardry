
// Export all sidebar components from a single entry point
export { useSidebar, SidebarProvider } from "./sidebar-provider"
export { Sidebar } from "./sidebar-main"
export { SidebarTrigger, SidebarRail, SidebarInset } from "./sidebar-controls"
export { 
  SidebarInput, 
  SidebarHeader, 
  SidebarFooter, 
  SidebarSeparator, 
  SidebarContent 
} from "./sidebar-sections"
export { 
  SidebarGroup, 
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent 
} from "./sidebar-group"
export { 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton 
} from "./sidebar-menu"

// Also export the types
export type { SidebarProviderProps } from "./sidebar-provider"
export type { SidebarProps } from "./sidebar-main"
export type { SidebarMenuButtonProps, SidebarMenuSubButtonProps } from "./sidebar-menu"
