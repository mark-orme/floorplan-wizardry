
import React from "react";

/**
 * Props for the CanvasLayout component
 */
interface CanvasLayoutProps {
  children?: React.ReactNode;
}

/**
 * Canvas Layout component
 * Renders the main CanvasApp with proper layout structure
 * @returns {JSX.Element} Rendered component
 */
const CanvasLayout: React.FC<CanvasLayoutProps> = ({ children }) => {
  console.log("CanvasLayout: Rendering canvas layout");
  
  return (
    <div className="relative w-full h-full">
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default CanvasLayout;
