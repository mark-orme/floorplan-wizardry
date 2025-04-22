
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Properties from './pages/Properties';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Index from './pages/Index';
import { Toaster as SonnerToaster } from 'sonner';
import PropertyDetail from './pages/PropertyDetail';
import MainFloorPlanEditor from './components/MainFloorPlanEditor';

/**
 * Main App component
 * This is the root component for the application
 */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Navigate to="/properties" replace />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/floorplans" element={<MainFloorPlanEditor />} />
          <Route path="/editor" element={<Index />} />
          {/* Add other routes as needed */}
        </Routes>
        <Toaster />
        <SonnerToaster position="top-right" />
      </div>
    </AuthProvider>
  );
};

export default App;
