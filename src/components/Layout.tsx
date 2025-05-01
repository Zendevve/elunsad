import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserTools from "./UserTools";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";

const Layout = () => {
  const location = useLocation();
  
  // Determine if we should show the sidebar based on the current path
  const isLandingPage = location.pathname === "/";
  const showSidebar = !isLandingPage;

  // Mock user data - in a real app, this would come from an auth context
  const mockUser = {
    name: "John Smith",
    avatar: "/placeholder.svg"
  };

  // If we're on the landing page, render without sidebar
  if (isLandingPage) {
    return (
      <main>
        <Outlet />
      </main>
    );
  }

  // Otherwise render the app with sidebar
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        <AppSidebar />
        
        <SidebarInset>
          <header className="bg-white shadow-sm">
            <div className="flex items-center justify-between px-4 py-4">
              <SidebarTrigger />
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
          
          <div className="flex-grow">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
