
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Guards
import AuthGuard from "@/components/guards/AuthGuard";
import AdminGuard from "@/components/guards/AdminGuard";

// Layouts
import UserLayout from "@/layouts/UserLayout";
import AdminLayout from "@/layouts/AdminLayout";

// Public Pages
import Index from "./pages/Index";
import SignIn from "./pages/Auth/SignIn";
import Register from "./pages/Register";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";

// User Pages
import Applications from "./pages/Applications";
import Documents from "./pages/Documents";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Status from "./pages/Status";
import MapView from "./pages/MapView";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import Administration from "./pages/Administration";
import Analytics from "./pages/Analytics";
import AdminApplicationDetail from "./pages/AdminApplicationDetail";
import DirectAdminAccess from "./pages/DirectAdminAccess";

// Application Context
import { ApplicationProvider } from "./contexts/ApplicationContext";

// Placeholder components
const Settings = () => <div className="p-6">Settings Page</div>;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <ApplicationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes that don't require authentication */}
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/auth/callback/*" element={<AuthCallback />} />
              <Route path="/admin-helper" element={<DirectAdminAccess />} />
              
              {/* Protected user routes */}
              <Route element={<AuthGuard />}>
                <Route element={<UserLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/applications" element={<Applications />} />
                  <Route path="/documents/*" element={<Documents />} />
                  <Route path="/map" element={<MapView />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/status" element={<Status />} />
                </Route>
              </Route>
              
              {/* Protected admin routes */}
              <Route element={<AdminGuard />}>
                <Route element={<AdminLayout />}>
                  {/* Admin Dashboard */}
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  
                  {/* Admin-specific routes */}
                  <Route path="/admin" element={<Administration />} />
                  <Route path="/admin/applications/:id" element={<AdminApplicationDetail />} />
                  <Route path="/admin/users" element={<Administration />} />
                  <Route path="/admin/map" element={<MapView />} />
                  <Route path="/admin/notifications" element={<Notifications />} />
                  <Route path="/admin/profile" element={<Profile />} />
                  <Route path="/admin/settings" element={<Settings />} />
                  
                  {/* Analytics */}
                  <Route path="/analytics/*" element={<Analytics />} />
                </Route>
              </Route>
              
              {/* Redirect /admin to /admin-dashboard */}
              <Route path="/admin" element={<Navigate to="/admin-dashboard" replace />} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ApplicationProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
