
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface NotificationBannerProps {
  message: string | ReactNode;
  type?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
  onClose?: () => void;
}

export const NotificationBanner = ({
  message,
  type = 'info',
  className,
  onClose
}: NotificationBannerProps): JSX.Element => {
  const bgColors = {
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200'
  };

  return (
    <div className={cn(
      'p-4 border rounded-lg',
      bgColors[type],
      className
    )}>
      <div className="flex justify-between items-center">
        <div>{message}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
