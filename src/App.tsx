
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import './App.css';

// Pages
import Index from '@/pages/Index';
import PropertyForm from '@/components/PropertyForm';
import Properties from '@/pages/Properties';
import PropertyDetail from '@/pages/PropertyDetail';
import FloorPlans from '@/pages/FloorPlans';
import NotFound from '@/pages/NotFound';
import Login from '@/pages/Login';
import Auth from '@/pages/Auth';
import SecurityCheck from '@/pages/SecurityCheck';
import { initializeSecurity } from '@/utils/security';

function App() {
  // Initialize security features when the app starts
  useEffect(() => {
    initializeSecurity();
    
    // Warning for non-HTTPS connections in production
    if (process.env.NODE_ENV === 'production' && window.location.protocol !== 'https:') {
      console.warn('Warning: This application should be served over HTTPS for security');
    }
    
    // Check for dangerous browser features that might be exploited
    if (window.opener) {
      console.warn('Window was opened via window.open() - potential security risk');
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/new" element={<PropertyForm />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/floorplans" element={<FloorPlans />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/security" element={<SecurityCheck />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
