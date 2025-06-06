import React, { useState, useEffect, ReactNode } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { 
  Menu, LogOut, ChevronLeft, Settings, Users, BarChart4, 
  LayoutDashboard, Bell, MapPin, FileText 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import useRoleAuth from "@/hooks/useRoleAuth";
import UserTools from "./UserTools";

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isAdmin } = useRoleAuth();
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        setUserData({
          id: user.id,
          email: user.email,
          name: profileData ? `${profileData.firstname} ${profileData.lastname || ''}` : user.email?.split('@')[0],
          avatar: "/placeholder.svg" // Default avatar
        });
      }
    };
    
    fetchUserData();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUserData();
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Successfully signed out",
        description: "You have been logged out of your account"
      });
      
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Sign out failed",
        description: "There was a problem signing you out",
        variant: "destructive"
      });
    }
  };

  const adminNavItems = [
    { name: 'Admin Dashboard', href: '/admin-dashboard', icon: LayoutDashboard },
    { name: 'Business Owner Management', href: '/admin', icon: Users },
    { name: 'Reports', href: '/admin/reports', icon: FileText },
    { name: 'Analytics', href: '/analytics', icon: BarChart4 },
    { name: 'Map View', href: '/map', icon: MapPin },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Profile', href: '/profile', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings }
  ];

  // Function to check if a nav item is active
  const isActiveNavItem = (href: string) => {
    if (href === '/admin') {
      // For admin route, match exactly or when on /admin/users
      return location.pathname === '/admin' || location.pathname === '/admin/users';
    }
    // For other routes, check if current path starts with the href
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
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
          {adminNavItems.map(item => {
            const isActive = isActiveNavItem(item.href);
            return (
              <Link 
                key={item.name} 
                to={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive 
                    ? 'bg-indigo-700 text-white' 
                    : 'text-white hover:bg-indigo-800'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-800">
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
            <span className="ml-auto px-2 py-1 text-xs font-medium rounded-full bg-purple-800 text-purple-100">
              Admin
            </span>
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
              {userData && (
                <UserTools 
                  user={userData} 
                  settings={{
                    title: "Admin Settings",
                    options: [
                      {
                        label: "System Settings",
                        action: () => navigate('/settings')
                      },
                      {
                        label: "User Management",
                        action: () => navigate('/admin/users')
                      }
                    ]
                  }}
                />
              )}
              
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
