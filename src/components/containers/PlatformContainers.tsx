
import React from 'react';
import { MacOSWidget } from './MacOSWidget';
import { IOSContainer } from './IOSContainer';

export const PlatformContainers: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Platform Containers Demo</h2>
      
      {/* macOS Widget Demo */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">macOS Widget Style</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MacOSWidget title="Analytics">
            <div className="text-center py-8">
              Widget Content
            </div>
          </MacOSWidget>
          
          <MacOSWidget title="Settings">
            <div className="text-center py-8">
              Another Widget
            </div>
          </MacOSWidget>
        </div>
      </div>
      
      {/* iOS Container Demo */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">iOS Native Style</h3>
        <div className="border rounded-xl overflow-hidden max-w-md mx-auto h-[600px]">
          <IOSContainer>
            <div className="p-4">
              <h4 className="text-xl font-semibold">iOS App Demo</h4>
              <p className="mt-2 text-gray-600">
                This container includes iOS-style status bar and home indicator
              </p>
            </div>
          </IOSContainer>
        </div>
      </div>
    </div>
  );
};
