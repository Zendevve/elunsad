
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "./Sidebar";
import UserTools from "./UserTools";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  
  // Determine if we should show the sidebar based on the current path
  const isLandingPage = location.pathname === "/";
  const showSidebar = !isLandingPage;

  // Mock user data - in a real app, this would come from an auth context
  const mockUser = {
    name: "John Smith",
    avatar: "/placeholder.svg"
  };

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
            <div className="flex items-center justify-between px-6 py-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSidebarOpen(true)} 
                className={isSidebarOpen ? 'invisible' : 'visible'}
                aria-label="Open sidebar"
              >
                <Menu className="h-6 w-6" />
              </Button>

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
            </div>
          </header>
        )}

        <main className="px-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
