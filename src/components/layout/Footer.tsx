
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
  children?: ReactNode;
}

export const Footer = ({ className, children }: FooterProps): JSX.Element => {
  return (
    <footer className={cn('border-t bg-background/95 backdrop-blur', className)}>
      <div className="container flex h-14 items-center">
        {children || (
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        )}
      </div>
    </footer>
  );
};
