
import React from 'react';

interface IOSContainerProps {
  children: React.ReactNode;
  className?: string;
  safeArea?: boolean;
}

export const IOSContainer: React.FC<IOSContainerProps> = ({
  children,
  className = '',
  safeArea = true
}) => {
  return (
    <div className={`
      flex flex-col min-h-screen bg-gray-50
      ${safeArea ? 'pt-12 pb-8' : ''}
      ${className}
    `}>
      {/* iOS-style status bar */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 h-12 flex items-center px-4 shadow-sm">
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900">
            9:41
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm">
            <div className="h-3 w-4 relative">
              <div className="absolute inset-0 border-2 border-current rounded-sm"></div>
              <div className="absolute top-0 bottom-0 left-0 w-2 bg-current rounded-sm"></div>
            </div>
          </div>
          <div className="text-sm">
            <div className="h-3 w-3.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M2 22l20-20M2 2l20 20" strokeWidth="4"/>
              </svg>
            </div>
          </div>
          <div className="text-sm font-medium">
            100%
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* iOS-style home indicator */}
      {safeArea && (
        <div className="fixed bottom-0 left-0 right-0 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="w-32 h-1 bg-gray-400 rounded-full"></div>
        </div>
      )}
    </div>
  );
};
