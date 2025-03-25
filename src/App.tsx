
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import PropertyForm from "./components/PropertyForm";
import RoleGuard from "./components/RoleGuard";
import { UserRole } from "./lib/supabase";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Properties />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Properties routes */}
            <Route 
              path="/properties" 
              element={
                <RoleGuard allowedRoles={[UserRole.PHOTOGRAPHER, UserRole.PROCESSING_MANAGER, UserRole.MANAGER]}>
                  <Properties />
                </RoleGuard>
              } 
            />
            <Route 
              path="/properties/new" 
              element={
                <RoleGuard allowedRoles={[UserRole.PHOTOGRAPHER, UserRole.MANAGER]}>
                  <PropertyForm />
                </RoleGuard>
              } 
            />
            <Route 
              path="/properties/:id" 
              element={
                <RoleGuard allowedRoles={[UserRole.PHOTOGRAPHER, UserRole.PROCESSING_MANAGER, UserRole.MANAGER]}>
                  <PropertyDetail />
                </RoleGuard>
              } 
            />
            
            {/* Original floor plan editor */}
            <Route 
              path="/floorplans" 
              element={<Index />} 
            />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
