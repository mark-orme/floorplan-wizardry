
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavigationItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

interface NavigationMenuProps {
  items: NavigationItem[];
  className?: string;
}

export const NavigationMenu = ({ items, className }: NavigationMenuProps): JSX.Element => {
  return (
    <nav className={cn('flex items-center space-x-4', className)}>
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};
