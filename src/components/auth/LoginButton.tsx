
import { Button } from '@/components/ui/button';
import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface LoginButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  isLoading?: boolean;
}

export const LoginButton = ({
  className,
  variant = 'default',
  size = 'default',
  isLoading = false,
  ...props
}: LoginButtonProps): JSX.Element => {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn('min-w-[100px]', className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? 'Loading...' : 'Sign In'}
    </Button>
  );
};
