
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Applications from "./pages/Applications";
import Documents from "./pages/Documents";
import Analytics from "./pages/Analytics";
import MapView from "./pages/MapView";

// Placeholder components for routes that haven't been implemented yet
const Notifications = () => <div className="p-6">Notifications Page</div>;
const Administration = () => <div className="p-6">Administration Page</div>;
const Profile = () => <div className="p-6">Profile Page</div>;
const Settings = () => <div className="p-6">Settings Page</div>;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Index />} />
          <Route path="/applications/*" element={<Applications />} />
          <Route path="/documents/*" element={<Documents />} />
          <Route path="/analytics/*" element={<Analytics />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/notifications/*" element={<Notifications />} />
          <Route path="/admin/*" element={<Administration />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
