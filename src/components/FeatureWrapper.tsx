
import { ReactNode } from 'react';

interface FeatureWrapperProps {
  children?: ReactNode;
}

export const FeatureWrapper = ({ children }: FeatureWrapperProps): JSX.Element => {
  return <div>FeatureWrapper unavailable: dependencies missing.</div>;
};

export default FeatureWrapper;
