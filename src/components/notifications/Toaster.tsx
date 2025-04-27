
import { Toaster as Sonner } from 'sonner';
import { useTheme } from 'next-themes';

interface ToasterProps {
  position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';
  closeButton?: boolean;
  richColors?: boolean;
}

export function Toaster({
  position = 'top-right',
  closeButton = true,
  richColors = true,
}: ToasterProps = {}) {
  const { theme } = useTheme();

  return (
    <Sonner
      position={position}
      theme={theme as 'light' | 'dark' | 'system'}
      closeButton={closeButton}
      richColors={richColors}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
    />
  );
}

export default Toaster;
