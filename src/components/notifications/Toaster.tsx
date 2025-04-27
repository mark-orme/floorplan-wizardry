
import { Toaster as SonnerToaster } from 'sonner';
import { useTheme } from 'next-themes';

interface ToasterProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  theme?: 'light' | 'dark' | 'system';
  richColors?: boolean;
  className?: string;
  toastOptions?: {
    duration?: number;
    className?: string;
    style?: React.CSSProperties;
  };
}

export function Toaster({
  position = 'bottom-right',
  theme: themeOverride,
  richColors = false,
  className,
  toastOptions = {},
}: ToasterProps) {
  const { theme = themeOverride } = useTheme();

  return (
    <SonnerToaster
      position={position}
      theme={theme as 'light' | 'dark' | 'system'}
      richColors={richColors}
      className={className}
      toastOptions={toastOptions}
    />
  );
}
