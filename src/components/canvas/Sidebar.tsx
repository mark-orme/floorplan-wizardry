import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { FiPlus } from 'react-icons/fi';
import { MdOutlineApartment } from 'react-icons/md';

interface SidebarProps {
  children?: ReactNode;
  className?: string;
  collapsed?: boolean;
}

export const Sidebar = ({
  children,
  className,
  collapsed = false
}: SidebarProps): JSX.Element => {
  return (
    <aside
      className={cn(
        'border-r bg-background/95 backdrop-blur',
        collapsed ? 'w-[80px]' : 'w-[240px]',
        className
      )}
    >
      {children}
    </aside>
  );
};
