import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import SecurityInitializer from '@/components/security/SecurityInitializer';
import SecurityCheck from '@/pages/SecurityCheck';
import Login from '@/pages/Login';
import Auth from '@/pages/Auth';
import Properties from '@/pages/Properties';
import PropertyForm from '@/components/PropertyForm';
import Floorplans from '@/pages/Floorplans';
import FloorplanDetails from '@/pages/FloorplanDetails';
import Register from '@/pages/Register';
import RoleGuard from '@/components/RoleGuard';
import { UserRole } from '@/lib/supabase';
import AdminPanel from '@/pages/AdminPanel';
import PropertyDetails from '@/pages/PropertyDetails';
import EditPropertyForm from '@/components/EditPropertyForm';
import { initializeSecurity } from '@/utils/security';

function App() {
  return (
    <AuthProvider>
      <SecurityInitializer />
      <Toaster position="top-center" />
      <Router>
        <Routes>
          <Route path="/" element={<Properties />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/new" element={
            <RoleGuard allowedRoles={[UserRole.MANAGER, UserRole.PHOTOGRAPHER, UserRole.PROCESSING_MANAGER]}>
              <PropertyForm />
            </RoleGuard>
          } />
          <Route path="/properties/:id" element={<PropertyDetails />} />
           <Route path="/properties/:id/edit" element={
            <RoleGuard allowedRoles={[UserRole.MANAGER, UserRole.PHOTOGRAPHER, UserRole.PROCESSING_MANAGER]}>
              <EditPropertyForm />
            </RoleGuard>
          } />
          <Route path="/floorplans" element={<Floorplans />} />
          <Route path="/floorplans/:id" element={<FloorplanDetails />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
              <AdminPanel />
            </RoleGuard>
          } />
          <Route path="/security" element={<SecurityCheck />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
