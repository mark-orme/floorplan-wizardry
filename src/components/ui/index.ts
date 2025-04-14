
/**
 * UI components barrel file
 * @module components/ui
 */

// Button
export { Button, buttonVariants } from "./button";

// Form components
export { Input } from "./input";
export { Label } from "./label";
export { Textarea } from "./textarea";
export { Checkbox } from "./checkbox";
export { RadioGroup, RadioGroupItem } from "./radio-group";
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
export { Switch } from "./switch";
export { Slider } from "./slider";

// Layout components
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
export { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";
export { AspectRatio } from "./aspect-ratio";
export { Separator } from "./separator";
export { ScrollArea } from "./scroll-area";
export { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./table";

// Navigation components
export { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "./navigation-menu";
export { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "./breadcrumb";
export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu";

// Feedback components
export { Alert, AlertDescription, AlertTitle } from "./alert";
export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./alert-dialog";
export { Progress } from "./progress";
export { Badge, badgeVariants } from "./badge";
export { Skeleton } from "./skeleton";
export { ToastProvider, ToastViewport } from "./toast";
export { Toaster } from "./toaster";
export { useToast } from "./use-toast";

// Overlay components
export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
export { Popover, PopoverContent, PopoverTrigger } from "./popover";
export { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";
export { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./sheet";
export { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut } from "./command";
export { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./context-menu";

// Sidebar components from sidebar/index.tsx
export {
  useSidebar,
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
  SidebarInput,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "./sidebar";

// Types
export type { SidebarProviderProps, SidebarProps, SidebarMenuButtonProps, SidebarMenuSubButtonProps } from "./sidebar";
