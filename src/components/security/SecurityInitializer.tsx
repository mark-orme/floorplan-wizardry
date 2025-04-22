
import React, { useEffect } from 'react';

export const SecurityInitializer: React.FC = () => {
  useEffect(() => {
    console.log('Initializing security features...');
    
    // Set Content Security Policy header in meta tag
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';";
    document.head.appendChild(cspMeta);
    
    // Generate CSRF token
    const csrfToken = Math.random().toString(36).substring(2);
    sessionStorage.setItem('csrfToken', csrfToken);
    
    // Clean up
    return () => {
      document.head.removeChild(cspMeta);
      sessionStorage.removeItem('csrfToken');
    };
  }, []);
  
  return null;
};
