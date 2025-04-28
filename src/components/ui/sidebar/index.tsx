
import * as React from "react"

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  position?: 'left' | 'right';
  children?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  open = false,
  onOpenChange,
  position = 'left',
  children,
  className,
  ...props
}) => {
  return (
    <div 
      className={`fixed top-0 ${position}-0 h-full w-64 bg-white shadow-lg transition-transform ${open ? 'translate-x-0' : position === 'left' ? '-translate-x-full' : 'translate-x-full'} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Sidebar;
