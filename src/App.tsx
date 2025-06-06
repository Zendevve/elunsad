
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import Applications from "./pages/Applications";
import Documents from "./pages/Documents";
import Analytics from "./pages/Analytics";
import MapView from "./pages/MapView";
import Notifications from "./pages/Notifications";
import Administration from "./pages/Administration";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Status from "./pages/Status";
import Reports from "./pages/Reports";
import ApplicationDetail from "./pages/ApplicationDetail";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import AuthRoute from "./components/AuthRoute";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import DirectAdminAccess from "./pages/DirectAdminAccess";
import AdminApplicationDetail from "./pages/AdminApplicationDetail";
import { ApplicationProvider } from "./contexts/ApplicationContext";

// Placeholder components for routes that haven't been implemented yet
const Settings = () => <div className="p-6">Settings Page</div>;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <ApplicationProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            
            {/* Add explicit auth callback routes to handle all variations */}
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/callback/*" element={<AuthCallback />} />
            
            {/* Public route for landing page */}
            <Route path="/" element={<Index />} />
            
            {/* Add the direct admin access helper */}
            <Route path="/admin-helper" element={<DirectAdminAccess />} />
            
            {/* Protected routes for authenticated users */}
            <Route element={<AuthRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/application/:id" element={<ApplicationDetail />} />
                <Route path="/documents/*" element={<Documents />} />
                <Route path="/map" element={<MapView />} />
                <Route path="/notifications/*" element={<Notifications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/status" element={<Status />} />
              </Route>
            </Route>
            
            {/* Admin routes protected by AdminRoute */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin" element={<Administration />} />
                <Route path="/admin/users" element={<Navigate to="/admin" replace />} />
                <Route path="/admin/reports" element={<Reports />} />
                <Route path="/admin/applications/:id" element={<AdminApplicationDetail />} />
                <Route path="/analytics/*" element={<Analytics />} />
              </Route>
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ApplicationProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
