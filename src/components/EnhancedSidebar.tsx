
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Bell, User, Search, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarMenuBadge,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { SidebarInput } from "@/components/ui/sidebar-input";

// Navigation items organized in sections
const mainNavigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: "View your dashboard"
  }, 
  {
    name: 'Applications',
    href: '/applications',
    icon: FileText,
    description: "Manage your permit applications"
  }, 
  {
    name: 'Notifications',
    href: '/notifications',
    icon: Bell,
    description: "Check your notifications",
    badge: "3"
  }
];

const accountNavigation = [
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
    description: "Manage your account"
  }
];

interface EnhancedSidebarProps {
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
}

const EnhancedSidebar: React.FC<EnhancedSidebarProps> = ({ openMobile, setOpenMobile }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <Sidebar
      openMobile={openMobile} 
      setOpenMobile={setOpenMobile}
      collapsible="icon"
      variant="sidebar"
    >
      <SidebarHeader className="border-b border-sidebar-border/20 pb-2">
        <div className="flex items-center px-2 py-3">
          <img 
            alt="Logo" 
            className="h-8 w-8 mr-3" 
            src="/lovable-uploads/bbd34367-e328-4dff-9103-719d6d3c2bd6.png" 
          />
          <h1 className="text-xl font-bold text-sidebar-foreground">eLUNSAD</h1>
        </div>
        <div className="px-2 pt-2">
          <SidebarInput 
            placeholder="Search..." 
            startIcon={<Search className="h-4 w-4" />}
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={currentPath === item.href || currentPath.startsWith(`${item.href}/`)}
                    tooltip={item.description}
                  >
                    <Link to={item.href}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge className="bg-primary text-primary-foreground">
                      {item.badge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator />
        
        {/* Account Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountNavigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild
                    isActive={currentPath === item.href}
                    tooltip={item.description}
                  >
                    <Link to={item.href}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border/20">
        <div className="flex items-center p-4">
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default EnhancedSidebar;
