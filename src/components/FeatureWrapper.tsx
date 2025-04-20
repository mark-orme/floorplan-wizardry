
import React, { ReactNode } from 'react';
import { isFeatureEnabled } from '@/utils/dynamicImport';
import { toast } from 'sonner';

interface FeatureWrapperProps {
  featureName: 'enableCollaboration' | 'enableOfflineMode' | 'enableAutoSave' | 'enableGridOptimization' | 'enableExperimentalTools';
  children: ReactNode;
  fallback?: ReactNode;
  showToast?: boolean;
}

/**
 * Component that conditionally renders children based on feature flag
 */
export const FeatureWrapper: React.FC<FeatureWrapperProps> = ({
  featureName,
  children,
  fallback = null,
  showToast = false
}) => {
  const isEnabled = isFeatureEnabled(featureName);
  
  React.useEffect(() => {
    if (!isEnabled && showToast) {
      toast.info(`The ${featureName.replace('enable', '')} feature is currently disabled.`);
    }
  }, [featureName, isEnabled, showToast]);
  
  if (isEnabled) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

export default FeatureWrapper;
