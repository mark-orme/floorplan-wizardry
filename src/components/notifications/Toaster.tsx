
import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

interface ToasterProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  duration?: number;
}

export const Toaster = ({
  position = 'bottom-right',
  duration = 5000
}: ToasterProps): JSX.Element => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      position={position}
      duration={duration}
      theme={theme as 'light' | 'dark' | 'system'}
      className="toaster group"
    />
  );
};
