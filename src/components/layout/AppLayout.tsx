
import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

interface AppLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  showFooter?: boolean;
}

export const AppLayout = ({
  children,
  showSidebar = true,
  showFooter = true
}: AppLayoutProps): JSX.Element => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        {showSidebar && <Sidebar />}
        <main className="flex-1 p-4">{children}</main>
      </div>
      {showFooter && <Footer />}
    </div>
  );
};
