
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "./Sidebar";
import UserTools from "./UserTools";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { toast } = useToast();
  
  // Determine if we should show the sidebar based on the current path
  const isLandingPage = location.pathname === "/";
  const isAuthPage = location.pathname === "/signin" || location.pathname === "/register";
  const showSidebar = !isLandingPage && !isAuthPage;

  // Mock user data - in a real app, this would come from an auth context
  const mockUser = {
    name: "John Doe",
    avatar: "/placeholder.svg"
  };
  
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Successfully signed out",
        description: "You have been logged out of your account"
      });
      
      // Navigate to home page after sign out
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Sign out failed",
        description: "There was a problem signing you out",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar - only show if not on landing page or auth pages */}
      {showSidebar && (
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      )}

      {/* Main content */}
      <div className={`${showSidebar && isSidebarOpen ? 'ml-64' : 'ml-0'} transition-margin duration-300 ease-in-out`}>
        {showSidebar && (
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
              <div className="flex items-center space-x-2">
                {/* Add the UserTools component */}
                <UserTools 
                  user={mockUser} 
                  settings={{
                    title: "Preferences",
                    options: [
                      {
                        label: "Dark Mode",
                        action: () => console.log("Toggle dark mode")
                      },
                      {
                        label: "Notifications",
                        action: () => console.log("Open notification settings")
                      }
                    ]
                  }}
                />
                
                {/* Sign out button */}
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-600 hover:text-gray-900">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </header>
        )}

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
