
import React from "react";
import { AppSidebar } from "./AppSidebar";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

// This component is kept for backward compatibility with the old sidebar system
// It wraps our new AppSidebar component
const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen }) => {
  // Only render if sidebar is open to maintain backward compatibility
  if (!isSidebarOpen) {
    return null;
  }
  
  return <AppSidebar />;
};

export default Sidebar;
