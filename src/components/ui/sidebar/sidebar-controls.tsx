
import React from 'react';
import { cn } from "@/lib/utils";

export interface SidebarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  expanded?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active = false,
  expanded = true,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer hover:bg-accent",
        active && "bg-accent text-accent-foreground",
        className
      )}
      {...props}
    >
      {icon && <div className="flex-shrink-0">{icon}</div>}
      {expanded && <span>{label}</span>}
    </div>
  );
};

export interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn("py-2", className)} {...props}>
      {title && <h4 className="mb-1 px-3 text-xs font-medium text-muted-foreground">{title}</h4>}
      <div className="space-y-1">{children}</div>
    </div>
  );
};

export interface SidebarToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  expanded: boolean;
  onToggle: () => void;
}

export const SidebarToggle: React.FC<SidebarToggleProps> = ({
  expanded,
  onToggle,
  className,
  ...props
}) => {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent",
        className
      )}
      {...props}
    >
      {expanded ? (
        <span>←</span>
      ) : (
        <span>→</span>
      )}
    </button>
  );
};

// Add placeholders for the missing components
export const SidebarRail: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  children,
  className,
  ...props
}) => (
  <div className={cn("w-10 border-r flex-shrink-0", className)} {...props}>
    {children}
  </div>
);

export const SidebarInset: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  children,
  className,
  ...props
}) => (
  <div className={cn("p-2", className)} {...props}>
    {children}
  </div>
);
