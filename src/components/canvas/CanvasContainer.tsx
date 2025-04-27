
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CanvasContainerProps {
  children: ReactNode;
  className?: string;
  isFullScreen?: boolean;
}

export const CanvasContainer = ({
  children,
  className,
  isFullScreen = false
}: CanvasContainerProps): JSX.Element => {
  return (
    <div className={cn(
      'relative overflow-hidden bg-background border rounded-lg',
      isFullScreen ? 'fixed inset-0 z-50' : 'w-full h-[600px]',
      className
    )}>
      {children}
    </div>
  );
};
