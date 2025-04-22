
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Properties from './pages/Properties';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';

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
          {/* Add other routes as needed */}
        </Routes>
        <Toaster />
      </div>
    </AuthProvider>
  );
};

export default App;
