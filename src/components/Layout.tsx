import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "./Sidebar";
import UserTools from "./UserTools";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import useRoleAuth from "@/hooks/useRoleAuth";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, isBusinessOwner } = useRoleAuth();
  
  // Determine if we should show the sidebar based on the current path
  const isLandingPage = location.pathname === "/";
  const isAuthPage = location.pathname === "/signin" || location.pathname === "/register";
  const showSidebar = !isLandingPage && !isAuthPage;

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
      
      toast('Successfully signed out', {
        description: "You have been logged out of your account"
      });
      
      // Navigate to home page after sign out
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast('Sign out failed', {
        description: "There was a problem signing you out"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar - only show if not on landing page or auth pages */}
      {showSidebar && (
        <Sidebar 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
          isAdmin={isAdmin}
          isBusinessOwner={isBusinessOwner}
        />
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
                {userData && (
                  <UserTools 
                    user={userData} 
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
                )}
                
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
