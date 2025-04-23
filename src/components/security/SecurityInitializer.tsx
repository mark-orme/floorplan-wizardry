
import { useEffect } from 'react';

/**
 * Security initializer component that sets up basic security features
 */
export const SecurityInitializer: React.FC = () => {
  useEffect(() => {
    // Set a simple CSRF token in localStorage (only for demo purposes)
    if (!localStorage.getItem('csrfToken')) {
      const token = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('csrfToken', token);
    }
    
    // Add minimal Content-Security-Policy via meta tag
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline';";
      document.head.appendChild(meta);
    }
    
    return () => {
      // Nothing to clean up
    };
  }, []);
  
  return null; // This component doesn't render anything
};

export default SecurityInitializer;
