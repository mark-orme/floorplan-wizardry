
import React from 'react';
import { AppWindow } from 'lucide-react';

interface MacOSWidgetProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const MacOSWidget: React.FC<MacOSWidgetProps> = ({
  title = 'Widget',
  children,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* macOS-style title bar */}
      <div className="bg-gray-100 px-4 py-2 border-b flex items-center space-x-2">
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 text-center text-sm font-medium text-gray-600">
          <div className="flex items-center justify-center gap-1.5">
            <AppWindow className="w-4 h-4" />
            {title}
          </div>
        </div>
        <div className="w-12" /> {/* Spacing for visual balance */}
      </div>
      
      {/* Widget content */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};
