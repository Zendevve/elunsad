
import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample user data - In a real app, this would come from an auth context
const mockUser = {
  name: "John Smith",
  avatar: "/placeholder.svg",
};

// This would be a real auth check in a production app
const isAuthenticated = () => {
  // For demo purposes, always return true
  return true; 
};

const ProtectedLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Check if the user is authenticated
  if (!isAuthenticated()) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Navigation links for the sidebar
  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
    { name: 'Applications', href: '/applications', icon: 'FileText' },
    { name: 'Documents', href: '/documents', icon: 'Files' },
    { name: 'Analytics', href: '/analytics', icon: 'PieChart' },
    { name: 'Map View', href: '/map', icon: 'Map' },
    { name: 'Notifications', href: '/notifications', icon: 'Bell' },
    { name: 'Administration', href: '/admin', icon: 'Settings' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <img alt="Logo" className="h-8 w-8" src="/lovable-uploads/bbd34367-e328-4dff-9103-719d6d3c2bd6.png" />
            <h1 className="text-xl font-bold">eLUNSAD</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <nav className="mt-5 px-2 space-y-1">
          {navigation.map(item => {
            // Dynamically import the icon component
            const IconComponent = getIconComponent(item.icon);
            return (
              <a 
                key={item.name} 
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 ${
                  location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                    ? 'bg-gray-100 text-primary'
                    : 'text-gray-600'
                }`}
              >
                {IconComponent && <IconComponent className="mr-3 h-5 w-5" />}
                {item.name}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className={`${isSidebarOpen ? 'ml-64' : 'ml-0'} flex-1 transition-margin duration-300 ease-in-out`}>
        <header className="bg-white shadow-sm">
          <div className="flex items-center px-4 py-4">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className={isSidebarOpen ? 'invisible' : 'visible'}>
              <Menu className="h-6 w-6" />
            </Button>
            <div className="ml-auto flex items-center space-x-4">
              {/* User info can go here if needed */}
            </div>
          </div>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Helper function to get icon component by name
const getIconComponent = (iconName: string) => {
  // Import all icons from lucide-react
  const icons = require('lucide-react');
  // Return the icon component if it exists
  return icons[iconName] || null;
};

export default ProtectedLayout;
