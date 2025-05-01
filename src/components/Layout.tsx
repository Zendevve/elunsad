
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "./Sidebar";
import UserTools from "./UserTools";
import { supabase } from "@/integrations/supabase/client";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const [user, setUser] = useState<{ name: string; avatar: string } | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Determine if we should show the sidebar based on the current path
  const isLandingPage = location.pathname === "/";
  const showSidebar = !isLandingPage;

  // Fetch authenticated user data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // Get the current user session
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session?.user) {
          // Get user profile data from the profiles table
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('firstname, lastname')
            .eq('id', sessionData.session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile:', error);
            return;
          }
          
          // Set user data with actual name from profile
          setUser({
            name: profileData ? `${profileData.firstname} ${profileData.lastname}` : 'User',
            avatar: '/placeholder.svg'
          });
        } else {
          // No authenticated user
          setUser(null);
        }
      } catch (error) {
        console.error('Error in user fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchUserProfile();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    // Initial fetch
    fetchUserProfile();

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar - only show if not on landing page */}
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

              {/* Add the UserTools component with actual user data */}
              <UserTools 
                user={user}
                loading={loading}
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
