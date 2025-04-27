
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthProvider';
import { LogoutButton } from '@/components/auth/LogoutButton';

interface HeaderProps {
  className?: string;
  logo?: ReactNode;
}

export const Header = ({ className, logo }: HeaderProps): JSX.Element => {
  const { user } = useAuth();

  return (
    <header className={cn('border-b bg-background/95 backdrop-blur', className)}>
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          {logo}
        </div>
        <div className="flex items-center gap-4">
          {user && <LogoutButton />}
        </div>
      </div>
    </header>
  );
};
