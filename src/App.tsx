
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import PropertyForm from "./components/PropertyForm";
import RoleGuard from "./components/RoleGuard";
import { UserRole } from "./lib/supabase";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Default route redirects to properties */}
            <Route path="/" element={<Navigate to="/properties" replace />} />
            
            {/* Auth route - accessible to all */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Properties routes */}
            <Route 
              path="/properties" 
              element={
                <RoleGuard 
                  allowedRoles={[UserRole.PHOTOGRAPHER, UserRole.PROCESSING_MANAGER, UserRole.MANAGER]}
                  fallbackElement={<Properties />} // Show properties to all, but with limited functionality
                >
                  <Properties />
                </RoleGuard>
              } 
            />
            <Route 
              path="/properties/new" 
              element={
                <RoleGuard 
                  allowedRoles={[UserRole.PHOTOGRAPHER, UserRole.MANAGER]}
                  redirectTo="/properties"
                >
                  <PropertyForm />
                </RoleGuard>
              } 
            />
            <Route 
              path="/properties/:id" 
              element={
                <RoleGuard 
                  allowedRoles={[UserRole.PHOTOGRAPHER, UserRole.PROCESSING_MANAGER, UserRole.MANAGER]}
                  redirectTo="/properties"
                >
                  <PropertyDetail />
                </RoleGuard>
              } 
            />
            
            {/* Floor plan editor - accessible to all authenticated users */}
            <Route 
              path="/floorplans" 
              element={<Index />} 
            />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
