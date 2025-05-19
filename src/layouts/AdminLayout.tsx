
import React, { useState, ReactNode } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { 
  Menu, LogOut, ChevronLeft, Settings, Users, BarChart4, 
  LayoutDashboard, Bell, User, MapPin 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  
  const adminNavItems = [
    { name: 'Admin Dashboard', href: '/admin-dashboard', icon: LayoutDashboard },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: BarChart4 },
    { name: 'Map View', href: '/admin/map', icon: MapPin },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell, badge: 5 },
    { name: 'Profile', href: '/admin/profile', icon: User },
    { name: 'Settings', href: '/admin/settings', icon: Settings }
  ];

  const handleSwitchToUserView = () => {
    navigate('/dashboard');
    toast({
      title: "Switched to User View",
      description: "You are now viewing the application as a regular user"
    });
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Admin Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-indigo-900 text-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center justify-between p-4 border-b border-indigo-800">
          <div className="flex items-center space-x-3">
            <img alt="Logo" className="h-8 w-8" src="/lovable-uploads/bbd34367-e328-4dff-9103-719d6d3c2bd6.png" />
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="text-white hover:bg-indigo-800">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="p-4 border-b border-indigo-800">
          <div className="text-sm text-indigo-300 font-medium">Business Licensing Office</div>
          <div className="text-xs text-indigo-400">Administrative Portal</div>
        </div>
        
        <nav className="mt-2 px-2 space-y-1">
          {adminNavItems.map(item => (
            <Button 
              key={item.name} 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-indigo-800"
              onClick={() => navigate(item.href)}
            >
              <item.icon className="mr-3 h-5 w-5" />
              <span>{item.name}</span>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Button>
          ))}
          
          <Button 
            variant="outline" 
            className="w-full justify-start mt-4 bg-indigo-700 text-white border-indigo-600 hover:bg-indigo-800"
            onClick={handleSwitchToUserView}
          >
            <User className="mr-3 h-5 w-5" />
            <span>Switch to User View</span>
          </Button>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-indigo-700 flex items-center justify-center text-sm font-medium text-white">
                A
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium">
                  Office Staff
                </div>
                <div className="text-xs text-indigo-300">
                  Administrator
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-indigo-300 hover:text-white">
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
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Header actions */}
            <div className="flex items-center space-x-2 ml-auto">
              <span className="text-sm font-medium text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
                Admin Mode
              </span>
              
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-600 hover:text-gray-900">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        <main className="p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
