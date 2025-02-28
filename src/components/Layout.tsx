
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "./Sidebar";
import UserTools from "./UserTools";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Mock user data - in a real app, this would come from an auth context
  const mockUser = {
    name: "John Smith",
    avatar: "/placeholder.svg"
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main content */}
      <div className={`${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-margin duration-300 ease-in-out`}>
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

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
