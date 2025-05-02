
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import EnhancedSidebar from "./EnhancedSidebar";
import UserTools from "./UserTools";

const Layout = () => {
  const [openMobile, setOpenMobile] = useState(false);
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
    <SidebarProvider defaultCollapsed={false}>
      <div className="min-h-screen bg-gray-100 flex w-full">
        {/* Enhanced Sidebar - only show if not on landing page */}
        {showSidebar && (
          <EnhancedSidebar openMobile={openMobile} setOpenMobile={setOpenMobile} />
        )}

        {/* Main content */}
        <div className="flex-1">
          {showSidebar && (
            <header className="bg-white shadow-sm">
              <div className="flex items-center justify-between px-4 py-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setOpenMobile(true)} 
                  className="md:hidden"
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

          <main className="p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
