import React from 'react';

/**
 * Props for CanvasLayout component
 */
interface CanvasLayoutProps {
  children: React.ReactNode;
}

/**
 * CanvasLayout component
 * Provides a consistent layout for canvas-based views
 * @param {CanvasLayoutProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const CanvasLayout = ({ children }: CanvasLayoutProps): React.ReactElement => {
  console.info('CanvasLayout: Rendering canvas layout');
  
  return (
    <div className="flex flex-col md:flex-row h-full w-full overflow-hidden bg-muted/10">
      <div className="flex-1 relative overflow-hidden border rounded-md bg-white shadow-sm m-2">
        {children}
      </div>
    </div>
  );
};

export default CanvasLayout;
