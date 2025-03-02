
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Applications from "./pages/Applications";
import Documents from "./pages/Documents";
import Analytics from "./pages/Analytics";
import MapView from "./pages/MapView";
import Notifications from "./pages/Notifications";
import Administration from "./pages/Administration";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";

// Placeholder components for routes that haven't been implemented yet
const Settings = () => <div className="p-6">Settings Page</div>;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          
          {/* Apply Layout to all routes except signin, register and 404 */}
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/applications/*" element={<Applications />} />
            <Route path="/documents/*" element={<Documents />} />
            <Route path="/analytics/*" element={<Analytics />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/notifications/*" element={<Notifications />} />
            <Route path="/admin/*" element={<Administration />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
