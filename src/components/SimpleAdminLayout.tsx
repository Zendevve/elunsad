
import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Menu, LogOut, Settings, Users, BarChart4, 
  LayoutDashboard, Bell 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface SimpleAdminLayoutProps {
  children: ReactNode;
}

const SimpleAdminLayout: React.FC<SimpleAdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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

  const handleSwitchToUserView = () => {
    navigate('/dashboard');
    toast({
      title: "Switched to User View",
      description: "You are now viewing the application as a regular user"
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Admin Sidebar */}
      <div className="w-64 bg-indigo-900 text-white shadow-lg">
        <div className="p-4 border-b border-indigo-800">
          <div className="flex items-center space-x-3">
            <img alt="Logo" className="h-8 w-8" src="/lovable-uploads/bbd34367-e328-4dff-9103-719d6d3c2bd6.png" />
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
        </div>
        
        <div className="p-4 border-b border-indigo-800">
          <div className="text-sm text-indigo-300 font-medium">Business Licensing Office</div>
          <div className="text-xs text-indigo-400">Administrative Portal</div>
        </div>
        
        <nav className="mt-2 px-2 space-y-1">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-indigo-800"
            onClick={() => navigate('/admin-dashboard')}
          >
            <LayoutDashboard className="mr-3 h-5 w-5" />
            <span>Admin Dashboard</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-indigo-800"
            onClick={() => navigate('/admin/users')}
          >
            <Users className="mr-3 h-5 w-5" />
            <span>User Management</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-indigo-800"
            onClick={() => navigate('/analytics')}
          >
            <BarChart4 className="mr-3 h-5 w-5" />
            <span>Analytics</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-indigo-800"
            onClick={() => navigate('/notifications')}
          >
            <Bell className="mr-3 h-5 w-5" />
            <span>Notifications</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-indigo-800"
            onClick={() => navigate('/settings')}
          >
            <Settings className="mr-3 h-5 w-5" />
            <span>Settings</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start mt-4 bg-indigo-700 text-white border-indigo-600 hover:bg-indigo-800"
            onClick={handleSwitchToUserView}
          >
            <Users className="mr-3 h-5 w-5" />
            <span>Switch to User View</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start mt-2 bg-red-700 text-white border-red-600 hover:bg-red-800"
            onClick={handleSignOut}
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Sign Out</span>
          </Button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-4">
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden"
              aria-label="Menu"
            >
              <Menu className="h-6 w-6" />
            </Button>

            <div className="text-xl font-semibold ml-4">Admin Control Panel</div>
            
            <div className="flex items-center space-x-2">
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Administrator
              </span>
            </div>
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SimpleAdminLayout;
