
import { Button } from '@/components/ui/button';
import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface LogoutButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  isLoading?: boolean;
  onLogout?: () => Promise<void>;
}

export const LogoutButton = ({
  className,
  variant = 'outline',
  size = 'default',
  isLoading = false,
  onLogout,
  ...props
}: LogoutButtonProps): JSX.Element => {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn('min-w-[100px]', className)}
      onClick={onLogout}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? 'Signing out...' : 'Sign Out'}
    </Button>
  );
};
