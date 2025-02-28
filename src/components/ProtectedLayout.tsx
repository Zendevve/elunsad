
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

// Sample user data - In a real app, this would come from an auth context
const mockUser = {
  name: "John Smith",
  avatar: "/placeholder.svg",
};

// Navigation links for the navbar
const navLinks = [
  { text: "Dashboard", href: "/" },
  { text: "Applications", href: "/applications" },
  { text: "Documents", href: "/documents" },
  { text: "Analytics", href: "/analytics" },
  { text: "Map", href: "/map" },
  { text: "Notifications", href: "/notifications" },
  { text: "Admin", href: "/admin" },
];

// This would be a real auth check in a production app
const isAuthenticated = () => {
  // For demo purposes, always return true
  return true; 
};

const ProtectedLayout = () => {
  const location = useLocation();
  
  // Check if the user is authenticated
  if (!isAuthenticated()) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar links={navLinks} user={mockUser} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;
