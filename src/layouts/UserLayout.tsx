
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { 
  Menu, LogOut, LayoutDashboard, FileText, 
  Bell, User, ClipboardList, Settings 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const UserLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, signOut } = useAuth();
  
  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Applications', href: '/applications', icon: FileText },
    { name: 'Notifications', href: '/notifications', icon: Bell, badge: 3 },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Status Tracker', href: '/status', icon: ClipboardList },
    { name: 'Settings', href: '/settings', icon: Settings }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSwitchToAdminView = () => {
    if (isAdmin) {
      navigate('/admin-dashboard');
      toast({
        title: "Switched to Admin View",
        description: "You are now viewing the application as an administrator"
      });
    } else {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin area",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
        
        <div className="p-4 border-b">
          <div className="text-sm text-gray-500 font-medium">Business Licensing Office</div>
          <div className="text-xs text-gray-400">City of Lucena</div>
        </div>
        
        <nav className="mt-2 px-2 space-y-1">
          {navigationItems.map(item => (
            <Button 
              key={item.name} 
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate(item.href)}
            >
              <item.icon className="mr-3 h-5 w-5" />
              <span>{item.name}</span>
              
              {item.badge && (
                <span className="ml-auto bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Button>
          ))}
          
          {isAdmin && (
            <Button 
              variant="outline" 
              className="w-full justify-start mt-4"
              onClick={handleSwitchToAdminView}
            >
              <User className="mr-3 h-5 w-5" />
              <span>Switch to Admin View</span>
            </Button>
          )}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                {isAdmin ? "A" : "U"}
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium">
                  {isAdmin ? "Office Staff" : "Business Owner"}
                </div>
                <div className="text-xs text-gray-500">
                  {isAdmin ? "Administrator" : "User"}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-500 hover:text-gray-900">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-margin duration-300 ease-in-out`}>
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(true)} 
              className={isSidebarOpen ? 'invisible' : 'visible'}
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Header actions */}
            <div className="flex items-center space-x-2">
              {isAdmin && (
                <span className="text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                  Admin Account
                </span>
              )}
              
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
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

export default UserLayout;
