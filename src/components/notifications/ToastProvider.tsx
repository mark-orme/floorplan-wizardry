
import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster';

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps): JSX.Element => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};
